import os
import re
import time
import fnmatch
import subprocess

from .util.synthesize import tts
from .util.pitchShifting import change_pitch_to_average, change_pitch
from .util.pitchDetect import get_average_pitch
from .util.duration import change_duration
from .util.trim import remove_silence_from_audio

working_dir = r"C:\Users\JERRY\Desktop\sampleMusic"


def get_matching_files(directory, pattern):
    matching_files = []

    for root, dirs, files in os.walk(directory):

        for filename in fnmatch.filter(files, pattern):
            matching_files.append(os.path.join(root, filename))

    matching_files.sort(key=lambda f: int(re.search(r'\d+', f).group()))

    return matching_files


def generate_lyrics(lyrics):

    for i, word in enumerate(lyrics):
        tts(word, rf"{working_dir}\raw-{i}.wav")


def remove_silence(file_list):

    for i, file in enumerate(file_list):
        remove_silence_from_audio(file, rf"{working_dir}\trimmed-{i}.wav")


def set_pitch_to_average(file_list):

    for i, file in enumerate(file_list):
        change_pitch_to_average(file).save(rf"{working_dir}\edited-average-{i}.wav", "WAV")


def edit_pitch(file_list, target_pitch_list):

    for i, file in enumerate(file_list):
        change_pitch(file, target_pitch_list[i] / get_average_pitch(file))\
            .save(rf"{working_dir}\edited-pitch-{i}.wav", "WAV")


def edit_duration(file_list, target_duration_list):

    for i, file in enumerate(file_list):
        change_duration(file, rf"{working_dir}\edited-duration-{i}.wav", target_duration_list[i])


def generate_audio_files_txt(file_list, save_path):

    with open(rf"{save_path}\audio_file_list.txt", "w") as f:
        for file in file_list:
            f.write(f"file '{file}'\n")


class AudioProcessor:

    def __init__(self):
        self._process_index = 0
        self._file_pattern = None

    def generate(self, lyrics):
        generate_lyrics(lyrics)
        self._process_index += 1
        self._file_pattern = f"process-{self._process_index}-raw-*.wav"
        print("[INFO] Speech synthesize - Done.")
        return self

    def set_pitch_to_avg(self):
        files = get_matching_files(working_dir, self._file_pattern)
        set_pitch_to_average(files)
        self._process_index += 1
        self._file_pattern = f"process-{self._process_index}-edited-average-*.wav"
        print("[INFO] Set pitch to average - Done.")
        return self

    def edit_pitch(self, target_pitch_list):
        files = get_matching_files(working_dir, self._file_pattern)
        edit_pitch(files, target_pitch_list)
        self._process_index += 1
        self._file_pattern = f"process-{self._process_index}-edited-pitch-*.wav"
        print("[INFO] Edit pitch - Done.")
        return self

    def edit_duration(self, target_duration_list):
        files = get_matching_files(working_dir, self._file_pattern)
        edit_duration(files, target_duration_list)
        self._process_index += 1
        self._file_pattern = f"process-{self._process_index}-edited-duration-*.wav"
        print("[INFO] Edit duration - Done.")
        return self

    def remove_silence(self):
        files = get_matching_files(working_dir, self._file_pattern)
        remove_silence(files)
        self._process_index += 1
        self._file_pattern = f"process-{self._process_index}-trimmed-*.wav"
        print("[INFO] Remove silence - Done.")
        return self

    def generate_final_audio(self):
        files = get_matching_files(working_dir, self._file_pattern)
        generate_audio_files_txt(files, working_dir)
        subprocess.call(["ffmpeg", "-f", "concat", "-safe", "0", "-i", rf"{working_dir}\audio_file_list.txt", "-c", "copy",
                        rf"{working_dir}\final_audio.wav"])
        print("[INFO] Done.")
        return self


'''
Sample data:
{
    "lyrics": ["should", "auld", "aquain", "tance", "be", "for", "got", "and", "nev", "ver", "brought", "to", "mind"],
    "target_pitch_list": [261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440, 523.3, 587.3],
    "target_duration_list": [2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6]
}
'''
