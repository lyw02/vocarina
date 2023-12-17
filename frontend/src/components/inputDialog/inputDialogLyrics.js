import React, { useState } from "react";
import Draggable from "react-draggable";
import "./index.css";

export default function InputDialogLyrics({
  title,
  notes,
  updateNotes,
  isDialogVisible,
  visibleAlias,
}) {
  const prevLyrics = () => {
    let res = [];
    notes.forEach((note) => {
      res.push(note.lyrics);
    });
    return res;
  };
  const [lyricsState, setLyricsState] = useState(prevLyrics());

  const currentLyricsDisplay = () => {
    return lyricsState
      .join(" ")
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // remove control characters
      .replace(/^\s+/, ""); // remove leading spaces
  };

  const handleFieldChange = (value) => {
    setLyricsState(
      value.split(/\s+/) // space with any length
    );
  };

  const handleApply = () => {
    let length = Math.min(notes.length, lyricsState.length);
    for (let i = 0; i < length; i++) {
      notes[i].lyrics = lyricsState[i];
    }
    updateNotes(notes);
    isDialogVisible(visibleAlias, false);
  };

  const handleClose = () => {
    isDialogVisible(visibleAlias, false);
  };

  return (
    <div className="input-dialog-wrapper">
      <div className="card-overlay">
        <Draggable
          handle=".handle"
          bounds=".card-overlay"
          onDrag={(e) => e.stopPropagation()}
        >
          <div className="card-lyrics">
            <div className="handle">
              <h2 className="title">{title}</h2>
            </div>
            <div className="field-input-lyrics-container">
              <textarea
                name="lyrics"
                className="field-input-lyrics"
                value={currentLyricsDisplay()}
                onChange={(event) => handleFieldChange(event.target.value)}
              />
            </div>
            <div className="button-group">
              <span className="button apply-button" onClick={handleApply}>
                Apply
              </span>
              <span className="button cancel-button" onClick={handleClose}>
                Cancel
              </span>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
}
