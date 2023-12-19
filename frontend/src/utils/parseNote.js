import { pitchFrequency } from "../utils/pitchFrequency";
import { keyNameList } from "../utils/pianoKeys";

export const parsePitch = (notes, updateNotes) => {
  for (let i = 0; i < notes.length; i++) {
    notes[i].octave = 8 - Math.floor(notes[i].startY / 25 / 12);
    notes[i].keyName =
      keyNameList[11 - Math.floor((notes[i].startY / 25) % 12)];
    notes[i].frequency = pitchFrequency[notes[i].octave][notes[i].keyName];
  }
  updateNotes(notes);
};

export const parseDuration = (notes, updateNotes, bpm) => {
  const beatLength = 50; // TODO change dynamically, px
  const beatDuration = 60 / bpm; // seconds
  for (let i = 0; i < notes.length; i++) {
    let noteBeat = (notes[i].endX - notes[i].startX) / beatLength;
    let noteDuration = noteBeat * beatDuration;
    notes[i].duration = noteDuration;
  }
  updateNotes(notes);
};

export const parsePostData = (notes) => {
  let lyrics = [];
  let targetPitchList = [];
  let targetDuraionList = [];
  notes.forEach((note) => {
    lyrics.push(note.lyrics);
    targetPitchList.push(note.frequency);
    targetDuraionList.push(note.duration);
  });
  return {
    lyrics: lyrics,
    target_pitch_list: targetPitchList,
    target_duration_list: targetDuraionList,
  };
};
