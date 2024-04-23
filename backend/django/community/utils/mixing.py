import base64
import io
from pydub import AudioSegment

from .oss import upload_file_directly


def mix(username: str, filename: str, base64_arr: list[str]):
    combined = None
    sound_arr = []

    for base64_data in base64_arr:
        audio_data = base64.b64decode(base64_data)
        audio_io = io.BytesIO(audio_data)
        sound_arr.append(AudioSegment.from_file(audio_io, format="wav"))

    if len(sound_arr) == 1:
        combined = sound_arr[0]
    else:

        for i in range(len(sound_arr) - 1):
            combined = sound_arr[i].overlay(sound_arr[i+1])

    combined.export(r"C:\Users\JERRY\Desktop\combined.wav", format='wav')

    buffer = io.BytesIO()
    combined.export(buffer, format="wav")

    path_in_oss = rf"music/{username}/{filename}.wav"
    upload_file_directly(path_in_oss, buffer)
    return path_in_oss
