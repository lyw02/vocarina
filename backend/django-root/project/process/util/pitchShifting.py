import parselmouth

from parselmouth.praat import call

from pitchDetect import get_average_pitch
from duration import get_duration


def change_pitch_to_average(file_path):
    sound = parselmouth.Sound(file_path)

    manipulation = call(sound, "To Manipulation", 0.01, 75, 600)

    pitch_tier = call(manipulation, "Extract pitch tier")

    mean_pitch = get_average_pitch(file_path)
    duration = get_duration(file_path)

    call(pitch_tier, "Remove points between...", 0, duration)
    call(pitch_tier, "Add point...", duration / 2, mean_pitch)

    call([pitch_tier, manipulation], "Replace pitch tier")

    return call(manipulation, "Get resynthesis (overlap-add)")


def change_pitch(file_path, factor):
    sound = parselmouth.Sound(file_path)

    manipulation = call(sound, "To Manipulation", 0.01, 75, 600)

    pitch_tier = call(manipulation, "Extract pitch tier")

    call(pitch_tier, "Multiply frequencies", sound.xmin, sound.xmax, factor)

    call([pitch_tier, manipulation], "Replace pitch tier")
    return call(manipulation, "Get resynthesis (overlap-add)")
