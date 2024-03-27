import base64
import io
import traceback
import soundfile as sf

import parselmouth
from pydub import AudioSegment

from .utils.loadSound import load_sound_pydub
from .utils.synthesize import tts, tts_legacy
from .utils.pitchShifting import change_pitch_to_average, change_pitch
from .utils.pitchDetect import get_average_pitch
from .utils.duration import change_duration
from .utils.trim import remove_silence_from_audio

from .utils.oss import *

project_name = "myprj"
# working_dir = "../temp"
working_dir = r"C:\Users\Jerry\Desktop\sampleMusic"
# working_dir = f"projects/{project_name}/"


def generate_lyrics(lyrics, process_index):
    res = []

    for i, word in enumerate(lyrics):
        # tts(word, f"{working_dir}", f"process-{process_index}-raw-{i}.wav")
        res.append(tts_legacy(word, f"{working_dir}", f"process-{process_index}-raw-{i}.wav"))

    return res


def remove_silence(file_list, process_index):
    res = []

    for i, data in enumerate(file_list):

        try:

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file_path = temp_file.name
                remove_silence_from_audio(data).export(temp_file_path, format="wav")

            with open(temp_file_path, "rb") as f:
                audio_data = f.read()

            res.append(base64.b64encode(audio_data).decode("utf-8"))
        except Exception as e:
            print(f"Exception in remove_silence {i}: {e}")
            traceback.print_exc()

    return res


def set_pitch_to_average(base64_res):
    res = []

    for i, data in enumerate(base64_res):

        try:

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file_path = temp_file.name
                change_pitch_to_average(data).save(temp_file_path, parselmouth.SoundFileFormat.WAV)

            with open(temp_file_path, "rb") as f:
                audio_data = f.read()

            res.append(base64.b64encode(audio_data).decode("utf-8"))
        except Exception as e:
            print(f"Exception in set_pitch_to_average {i}: {e}")
            traceback.print_exc()

    return res


def edit_pitch(base64_res, target_pitch_list):
    res = []

    for i, data in enumerate(base64_res):

        try:

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file_path = temp_file.name
                change_pitch(data, target_pitch_list[i] / get_average_pitch(audio_content=data))\
                    .save(temp_file_path, parselmouth.SoundFileFormat.WAV)

            with open(temp_file_path, "rb") as f:
                audio_data = f.read()

            res.append(base64.b64encode(audio_data).decode("utf-8"))
        except Exception as e:
            print(f"Exception in edit_pitch {i}: {e}")
            traceback.print_exc()

    return res


def edit_duration(base64_res, target_duration_list):
    res = []

    for i, data in enumerate(base64_res):

        try:

            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file_path = temp_file.name
                edited_duration_data, sr = change_duration(data, target_duration_list[i])
                sf.write(temp_file_path, edited_duration_data, sr, format='wav')

            with open(temp_file_path, "rb") as f:
                audio_data = f.read()

            res.append(base64.b64encode(audio_data).decode("utf-8"))
        except Exception as e:
            print(f"Exception in edit_duration {i}: {e}")
            traceback.print_exc()

    return res


def generate_audio_files_txt(file_list, save_path):

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
        self.base64_res = []
        self.base64_final = None

    def generate(self, lyrics):
        delete_dir(working_dir)
        create_dir(working_dir)
        self.base64_res = generate_lyrics(lyrics, self._process_index)
        self._file_pattern = f"process-{self._process_index}-raw-*.wav"
        self._process_index += 1
        print("[INFO] Speech synthesize - Done.")
        return self

    def set_pitch_to_avg(self):
        self.base64_res = set_pitch_to_average(self.base64_res)
        self._process_index += 1
        print("[INFO] Set pitch to average - Done.")
        return self

    def edit_pitch(self, target_pitch_list):
        self.base64_res = edit_pitch(self.base64_res, target_pitch_list)
        self._process_index += 1
        print("[INFO] Edit pitch - Done.")
        return self

    def edit_duration(self, target_duration_list):
        self.base64_res = edit_duration(self.base64_res, target_duration_list)
        self._process_index += 1
        print("[INFO] Edit duration - Done.")
        return self

    def remove_silence(self):
        self.base64_res = remove_silence(self.base64_res, self._process_index)
        self._process_index += 1
        print("[INFO] Remove silence - Done.")
        return self

    def generate_final_audio(self):
        combined_audio = AudioSegment.silent(duration=0)

        for i, base64_audio in enumerate(self.base64_res):
            audio_segment = load_sound_pydub(audio_content=base64_audio)
            combined_audio += audio_segment

        combined_audio_file = io.BytesIO()
        combined_audio.export(combined_audio_file, format="wav")
        combined_audio_data = combined_audio_file.getvalue()
        combined_audio_base64 = base64.b64encode(combined_audio_data).decode("utf-8")

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            temp_file_path = temp_file.name
            remove_silence_from_audio(combined_audio_base64).export(temp_file_path, format="wav")

        with open(temp_file_path, "rb") as f:
            self.base64_final = base64.b64encode(f.read()).decode("utf-8")

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
