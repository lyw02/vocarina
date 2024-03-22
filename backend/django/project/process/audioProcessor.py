import os
import re
import tempfile
import fnmatch
import traceback
from io import BytesIO

import parselmouth
from ffmpeg import ffmpeg

from .utils.synthesize import tts
from .utils.pitchShifting import change_pitch_to_average, change_pitch
from .utils.pitchDetect import get_average_pitch
from .utils.duration import change_duration
from .utils.trim import remove_silence_from_audio

from .utils.oss import *

project_name = "myprj"
# working_dir = "../temp"
# working_dir = r"C:\Users\Jerry\Desktop\sampleMusic"
working_dir = f"projects/{project_name}/"


def delete_files_in_working_dir():

    try:

        if exists(working_dir):
            delete_dir(working_dir)
            create_dir(working_dir)
    except Exception as e:
        print(f"Unable to clean {working_dir}: {e}")


def get_matching_files(directory, pattern):
    matching_files = []

    file_list = list_all_files_in_dir(directory)
    filename_list = [filename.replace(directory, '') for filename in file_list]

    for filename in fnmatch.filter(filename_list, pattern):
        matching_files.append(f"{working_dir}{filename}")

    matching_files.sort(key=lambda f: int(re.findall(r'\d+', f)[-1]))

    return matching_files


def generate_lyrics(lyrics, process_index):

    for i, word in enumerate(lyrics):
        tts(word, f"{working_dir}", f"process-{process_index}-raw-{i}.wav")


def remove_silence(file_list, process_index):

    for i, file in enumerate(file_list):
        remove_silence_from_audio(file, rf"{working_dir}process-{process_index}-trimmed-{i}.wav")


def set_pitch_to_average(file_list, process_index):

    for i, file in enumerate(file_list):
        # change_pitch_to_average(file).save(rf"{working_dir}/process-{process_index}-edited-average-{i}.wav", "WAV")
        try:
            # output = BytesIO()
            # change_pitch_to_average(file).save(output, "WAV")
            # output.seek(0)
            # upload_file_directly(f"{working_dir}process-{process_index}-edited-average-{i}.wav", output)

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as temp:
                change_pitch_to_average(file).save(temp.name, parselmouth.SoundFileFormat.WAV)
                with open(temp.name, 'rb') as f:
                    upload_file_directly(f"{working_dir}process-{process_index}-edited-average-{i}.wav", f)
        except Exception as e:
            print(f"Exception in set_pitch_to_average {file}: {e}")
            traceback.print_exc()


def edit_pitch(file_list, target_pitch_list, process_index):

    for i, file in enumerate(file_list):
        # change_pitch(file, target_pitch_list[i] / get_average_pitch(file))\
        #     .save(rf"{working_dir}/process-{process_index}-edited-pitch-{i}.wav", "WAV")
        output = BytesIO()
        change_pitch(file, target_pitch_list[i] / get_average_pitch(file)).save(output, "WAV")
        output.seek(0)
        upload_file_directly(f"{working_dir}process-{process_index}-edited-pitch-{i}.wav", output)


def edit_duration(file_list, target_duration_list, process_index):

    for i, file in enumerate(file_list):
        change_duration(file, rf"{working_dir}process-{process_index}-edited-duration-{i}.wav",
                        target_duration_list[i])
        # output = BytesIO()
        # change_duration(file, rf"{working_dir}/process-{process_index}-edited-duration-{i}.wav",
        #                 target_duration_list[i]).save(output, "WAV")
        # output.seek(0)
        # upload_file_directly(f"{working_dir}/process-{process_index}-edited-pitch-{i}.wav", output)


def generate_audio_files_txt(file_list, save_path):

    # with open(rf"{save_path}/audio_file_list.txt", "w") as f:
    #
    #     for file in file_list:
    #         f.write(f"file '{file}'\n")

    with tempfile.NamedTemporaryFile(delete=False) as tmp:

        for file in file_list:
            tmp.write(f"file '{file}'\n".encode())

        upload_file_from_local(f"{save_path}audio_file_list.txt", tmp.name)

    os.remove(tmp.name)


class AudioProcessor:

    def __init__(self):
        self._process_index = 0
        self._file_pattern = None
        self._audio_data_base64 = None
        # delete_files_in_working_dir()

    def generate(self, lyrics):
        delete_dir(working_dir)
        create_dir(working_dir)
        generate_lyrics(lyrics, self._process_index)
        self._file_pattern = f"process-{self._process_index}-raw-*.wav"
        self._process_index += 1
        print("[INFO] Speech synthesize - Done.")
        return self

    def set_pitch_to_avg(self):
        files = get_matching_files(working_dir, self._file_pattern)
        print(f"files: {files}")
        set_pitch_to_average(files, self._process_index)
        self._file_pattern = f"process-{self._process_index}-edited-average-*.wav"
        self._process_index += 1
        print("[INFO] Set pitch to average - Done.")
        return self

    def edit_pitch(self, target_pitch_list):
        files = get_matching_files(working_dir, self._file_pattern)
        edit_pitch(files, target_pitch_list, self._process_index)
        self._file_pattern = f"process-{self._process_index}-edited-pitch-*.wav"
        self._process_index += 1
        print("[INFO] Edit pitch - Done.")
        return self

    def edit_duration(self, target_duration_list):
        files = get_matching_files(working_dir, self._file_pattern)
        edit_duration(files, target_duration_list, self._process_index)
        self._file_pattern = f"process-{self._process_index}-edited-duration-*.wav"
        self._process_index += 1
        print("[INFO] Edit duration - Done.")
        return self

    def remove_silence(self):
        files = get_matching_files(working_dir, self._file_pattern)
        remove_silence(files, self._process_index)
        self._file_pattern = f"process-{self._process_index}-trimmed-*.wav"
        self._process_index += 1
        print("[INFO] Remove silence - Done.")
        return self

    def generate_final_audio(self):
        files = get_matching_files(working_dir, self._file_pattern)
        generate_audio_files_txt(files, working_dir)
        # audio_file_list = BytesIO()
        audio_file_list = get_file_object(f"{working_dir}/audio_file_list.txt").read()
        # subprocess.call(["ffmpeg", "-f", "concat", "-safe", "0", "-i", rf"{working_dir}/audio_file_list.txt", "-c",
        #                  "copy", rf"{working_dir}/final_audio.wav"])
        with open("final_audio.wav", "rb") as f:
            (
                ffmpeg
                .input(audio_file_list, format="concat", safe=0)
                .output(f, c="copy")
                .run()
            )
            upload_file_directly(f"{working_dir}/final_audio.wav", f)
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

'''
New sample data:
{
    "tracks": 
    [
        {
            "lyrics": ["should", "auld", "aquain", "tance", "be", "for", "got", "and", "nev", "ver", "brought", "to", "mind"],
            "target_pitch_list": [261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440, 523.3, 587.3],
            "target_duration_list": [2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6]
        },
        {
            "lyrics": ["should", "auld", "aquain", "tance", "be", "for", "got", "and", "nev", "ver", "brought", "to", "mind"],
            "target_pitch_list": [261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440, 523.3, 587.3],
            "target_duration_list": [2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6]
        }
    ]
}
'''
