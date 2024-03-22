import tempfile

import parselmouth

from .oss import *


def pitch_detect(file_path):
    sound = parselmouth.Sound(file_path)

    pitch = sound.to_pitch()

    print(pitch)


def get_average_pitch(file_path):

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        audio_object = get_file_object(file_path)
        audio_object_data = audio_object.read()
        tmp.write(audio_object_data)
        tmp.flush()
        os.fsync(tmp.fileno())
        tmp.close()
        sound = parselmouth.Sound(tmp.name)

    # sound = parselmouth.Sound(file_path)

    pitch = sound.to_pitch()

    sum_ = 0
    count = 0
    for candidate in pitch.selected:

        if candidate.strength > 0:
            sum_ += candidate.frequency
            count += 1

    return sum_ / count
