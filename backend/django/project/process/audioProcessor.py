import os
import re
import time
import fnmatch
import subprocess
import wave
import base64

from pydub import AudioSegment

from .util.synthesize import tts
from .util.pitchShifting import change_pitch_to_average, change_pitch
from .util.pitchDetect import get_average_pitch
from .util.duration import change_duration
from .util.trim import remove_silence_from_audio

# working_dir = "../temp"
working_dir = r"C:\Users\Jerry\Desktop\sampleMusic"

def delete_files_in_working_dir():

    if not os.path.exists(working_dir):
        os.mkdir(working_dir)

    file_list = [f for f in os.listdir(working_dir) if os.path.isfile(os.path.join(working_dir, f))]

    for file_name in file_list:
        file_path = os.path.join(working_dir, file_name)
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Unable to clean {file_path}: {e}")


def get_matching_files(directory, pattern):
    matching_files = []

    for root, dirs, files in os.walk(directory):

        for filename in fnmatch.filter(files, pattern):
            matching_files.append(os.path.join(root, filename))

    # matching_files.sort(key=lambda f: int(re.search(r'\d+', f).group()))
    matching_files.sort(key=lambda f: int(re.findall(r'\d+', f)[-1]))

    return matching_files


def generate_lyrics(lyrics, process_index):

    for i, word in enumerate(lyrics):
        tts(word, rf"{working_dir}/process-{process_index}-raw-{i}.wav")


def remove_silence(file_list, process_index):

    for i, file in enumerate(file_list):
        remove_silence_from_audio(file, rf"{working_dir}/process-{process_index}-trimmed-{i}.wav")


def set_pitch_to_average(file_list, process_index):

    for i, file in enumerate(file_list):
        change_pitch_to_average(file).save(rf"{working_dir}/process-{process_index}-edited-average-{i}.wav", "WAV")


def edit_pitch(file_list, target_pitch_list, process_index):

    for i, file in enumerate(file_list):
        change_pitch(file, target_pitch_list[i] / get_average_pitch(file))\
            .save(rf"{working_dir}/process-{process_index}-edited-pitch-{i}.wav", "WAV")


def edit_duration(file_list, target_duration_list, process_index):

    for i, file in enumerate(file_list):
        change_duration(file, rf"{working_dir}/process-{process_index}-edited-duration-{i}.wav",
                        target_duration_list[i])


def generate_audio_files_txt(file_list, save_path):

    with open(rf"{save_path}/audio_file_list.txt", "w") as f:

        for file in file_list:
            f.write(f"file '{file}'\n")


# def to_audio_stream():
#
#     with open(rf"{working_dir}\final_audio.wav", 'rb') as wav_file:
#
#         while True:
#             chunk = wav_file.read(1024)
#             if not chunk:
#                 break
#             yield chunk


class AudioProcessor:

    def __init__(self):
        self._process_index = 0
        self._file_pattern = None
        self._audio_data_base64 = None
        delete_files_in_working_dir()

    def generate(self, lyrics):
        generate_lyrics(lyrics, self._process_index)
        self._file_pattern = f"process-{self._process_index}-raw-*.wav"
        self._process_index += 1
        print("[INFO] Speech synthesize - Done.")
        return self

    def set_pitch_to_avg(self):
        files = get_matching_files(working_dir, self._file_pattern)
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
        subprocess.call(["ffmpeg", "-f", "concat", "-safe", "0", "-i", rf"{working_dir}/audio_file_list.txt", "-c",
                         "copy", rf"{working_dir}/final_audio.wav"])
        print("[INFO] Done.")
        return self

    def to_audio_stream(self):
        # with open(rf"{working_dir}\final_audio.wav", 'rb') as wav_file:
        #     while True:
        #         chunk = wav_file.read(1024)
        #         if not chunk:
        #             break
        #         yield chunk

        # # read audio from wav file
        # sound = AudioSegment.from_wav(rf"{working_dir}/final_audio.wav")
        # # audio to byte stream
        # audio_data = sound.raw_data
        # # encode byte stream into Base64
        # self._audio_data_base64 = base64.b64encode(audio_data)
        # return self

        wav_filename = f'{working_dir}/final_audio.wav'
        with open(wav_filename, 'rb') as wav_file:
            # 读取WAV文件内容
            wav_content = wav_file.read()
        # 将WAV内容转换为Base64编码
        base64_encoded = base64.b64encode(wav_content).decode('utf-8')
        # 打印或保存Base64编码后的结果
        # print(base64_encoded)
        self._audio_data_base64 = base64.b64encode(base64_encoded)
        return self

        # with open(rf"{working_dir}\final_audio.wav", 'rb') as audio_file:
        #     audio_data = audio_file.read()


'''
Sample data:
{
    "lyrics": ["should", "auld", "aquain", "tance", "be", "for", "got", "and", "nev", "ver", "brought", "to", "mind"],
    "target_pitch_list": [261.6, 349.2, 349.2, 440, 392, 349.2, 392, 440, 349.2, 349.2, 440, 523.3, 587.3],
    "target_duration_list": [2, 2, 2, 1.3, 2, 1.3, 1.3, 1.3, 2, 0.65, 1.3, 1.3, 2.6]
}
'''
