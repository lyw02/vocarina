import React from "react";
import { useNotes } from "../../contexts/notesContext";
import { useParameters } from "../../contexts/paramsContext";
import { pitchFrequency } from "../../utils/pitchFrequency";
import { keyNameList } from "../../utils/pianoKeys";
import "./index.css";

function Toolbar({ isDialogVisible }) {
  const { notes, updateNotes } = useNotes();
  const { numerator, denominator, bpm} = useParameters();

  const handleEditLyrics = (flag) => {
    isDialogVisible("isLyricsDialogVisible", flag)
  };

  const handleGenerate = () => {
    parsePitch();
    parseDuration();
    console.log(notes);
    // call api
  };

  const parsePitch = () => {
    let updatedNotes = [];
    for (let i = 0; i < notes.length; i++) {
      notes[i].octave = 8 - Math.floor((notes[i].startY / 25) / 12);
      notes[i].keyName = keyNameList[11 - Math.floor((notes[i].startY / 25) % 12)];
      notes[i].frequency = pitchFrequency[notes[i].octave][notes[i].keyName];
      updatedNotes.push(notes[i]);
    }
    updateNotes(updatedNotes);
  };

  const parseDuration = () => {
    const beatLength = 50; // TODO change dynamically, px
    const beatDuration = 60 / bpm; // seconds
    let updatedNotes = [];
    for (let i = 0; i < notes.length; i++) {
      let noteBeat = (notes[i].endX - notes[i].startX) / beatLength;
      let noteDuration = noteBeat * beatDuration;
      notes[i].duration = noteDuration;
      updatedNotes.push(notes[i]);
    }
    updateNotes(updatedNotes);
  };

  return (
    <div className="toolbar-wrapper">
      <span className="button add-lyrics-button" onClick={handleAddLyrics}>
        Add lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span>
    </div>
  );
}

export default Toolbar;
