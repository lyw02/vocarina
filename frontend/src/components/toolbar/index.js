import React from "react";
import { useNotes } from "../../contexts/notesContext";
import { useParameters } from "../../contexts/paramsContext";
import { useGenerate } from "../../contexts/generateContext";
import { parsePitch, parseDuration } from "../../utils/parseNote";
import { processAudio } from "../../api/projectApi";
import classNames from "classnames";
import "./index.css";

function Toolbar({ isDialogVisible }) {
  const { notes, updateNotes } = useNotes();
  const { numerator, denominator, bpm } = useParameters();
  const { hasGenerated, handleSetHasGenerated } = useGenerate();

  const handleEditLyrics = (flag) => {
    isDialogVisible("isLyricsDialogVisible", flag);
  };

  const handleGenerate = () => {
    parsePitch(notes, updateNotes);
    parseDuration(notes, updateNotes, bpm);
    console.log(notes);
    // call api
    // processAudio("../../../public/temp/", "final_audio.wav", notes);
    processAudio(
      "C:\\Users\\JERRY\\Desktop\\sampleMusic",
      "final_audio.wav",
      notes
    ).then(handleSetHasGenerated(true));
  };

  const handlePlay = () => {};

  return (
    <div className="toolbar-wrapper">
      <span
        className="button add-lyrics-button"
        onClick={() => handleEditLyrics(true)}
      >
        Edit lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span>
      <span
        className={classNames("button", "play-button", {
          playable: hasGenerated,
        })}
        onClick={handlePlay}
      >
        Play
      </span>
    </div>
  );
}

export default Toolbar;
