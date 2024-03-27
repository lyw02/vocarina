import parselmouth

from .loadSound import load_sound_parselmouth


def get_average_pitch(file_path=None, audio_content=None):
    if file_path is not None:
        sound = parselmouth.Sound(file_path)
    elif audio_content is not None:
        sound, _ = load_sound_parselmouth(audio_content)
    else:
        raise "Failed to get_average_pitch"

    pitch = sound.to_pitch()

    sum_ = 0
    count = 0
    for candidate in pitch.selected:

        if candidate.strength > 0:
            sum_ += candidate.frequency
            count += 1

    return sum_ / count
