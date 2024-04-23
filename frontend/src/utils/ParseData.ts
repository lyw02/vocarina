import { pitchFrequency } from "./PitchFrequency";
import { NoteProps } from "@/types";
import _ from "lodash";
import { noteStyle } from "./Note";

export const parseLyrics = (notes: NoteProps[], lyrics: string[]) => {
  let targetLyricsList: string[] = [];
  for (let i = 0; i < notes.length; i++) {
    if (i === 0 && notes[i].startX !== 0) {
      targetLyricsList.push("");
    } else if (i !== 0 && i < notes.length && notes[i].startX - notes[i - 1].endX > 1) {
      targetLyricsList.push("");
    }
    targetLyricsList.push(lyrics[i]);
  }
  return targetLyricsList;
};

export const parsePitch = (notes: NoteProps[], lyrics: string[]) => {
  let targetPitchList: number[] = [];
  let index = 0;
  lyrics.forEach((n) => {
    if (n === "") {
      targetPitchList.push(-1);
    } else {
      let noteIndex = Math.floor(
        (2700 - notes[index].endY) / noteStyle.noteHeight
      );
      let octave = Math.floor(noteIndex / 12);
      let key = octave === 0 ? noteIndex : noteIndex % 12;
      targetPitchList.push(pitchFrequency[octave][key]);
      index++;
    }
  });
  return targetPitchList;
};

export const parseStartTime = (
  notes: NoteProps[],
  bpm: number,
  numerator: number,
  denominator: number
) => {
  const measureLength = 40 * numerator;
  const measureDuration = (60 * numerator * denominator) / bpm;
  const startXArr = notes.map((note) => note.startX);
  const startPos = Math.min(...startXArr);
  return (startPos * measureDuration) / measureLength;
};

export const parseDuration = (
  notes: NoteProps[],
  bpm: number,
  numerator: number,
  lyrics: string[]
) => {
  const measureLength = 40 * numerator;
  const measureDuration = (60 * numerator) / bpm;
  let targetDurationList: number[] = [];
  let index = 0;
  lyrics.forEach((n, i) => {
    if (n === "") {
      i === 0
        ? targetDurationList.push(
            (notes[i].startX * measureDuration) / measureLength
          )
        : targetDurationList.push(
            ((notes[index].startX - notes[index - 1].endX) * measureDuration) /
              measureLength
          );
    } else {
      targetDurationList.push(
        (notes[index].noteLength * measureDuration) / measureLength
      );
      index++;
    }
  });
  return targetDurationList;
};
