import React, { useState, useRef } from "react";
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

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  let audioSrc;

  const handleEditLyrics = (flag) => {
    isDialogVisible("isLyricsDialogVisible", flag);
  };

  const handleGenerate = () => {
    parsePitch(notes, updateNotes);
    parseDuration(notes, updateNotes, bpm);
    console.log(notes);
    // call api
    // processAudio("../../../public/temp/", "final_audio.wav", notes);
    audioSrc = processAudio(notes);
  };

  // const handlePlay = () => {
  //   if (hasGenerated) {
  //     setIsPlaying(true);
  //   }
  //   console.log(isPlaying);
  // };

  const handleToggle = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

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
        // onClick={handlePlay}
        onClick={handleToggle}
      >
        {isPlaying ? "Pause" : "Play"}
      </span>
      {/* <span>
        <audio ref={audioRef} className="audio" src={audioSrc} controls></audio>
      </span> */}
    </div>
  );
}

export default Toolbar;
