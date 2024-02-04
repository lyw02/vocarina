import parselmouth


def pitch_detect(file_path):
    sound = parselmouth.Sound(file_path)

    pitch = sound.to_pitch()

    print(pitch)


def get_average_pitch(file_path):
    sound = parselmouth.Sound(file_path)

    pitch = sound.to_pitch()

    sum_ = 0
    count = 0
    for candidate in pitch.selected:

        if candidate.strength > 0:
            sum_ += candidate.frequency
            count += 1

    return sum_ / count
