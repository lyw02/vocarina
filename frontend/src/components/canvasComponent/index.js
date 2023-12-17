import React, { useRef, useEffect } from "react";
import { useNotes } from "../../contexts/notesContext";
import { noteStyle, Note } from "../../utils/note";
import "./index.css";

function CanvasComponent() {
  const canvasRef = useRef(null);
  const { notes, updateNotes } = useNotes();
  let noteId = 0;

  function getNote(x, y) {
    // get note that clicked on
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n.isInside(x, y)) {
        return n;
      }
    }
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 3000;
    canvas.height = 2700;

    const overlap = (note) => {
      return notes.some(
        (item) =>
          note !== item && note.minX < item.maxX && note.maxX > item.minX
      );
    };

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, 2700, 2700); // Clear canvas
      notes.forEach((note) => {
        overlap(note) ? (note.isOverlap = true) : (note.isOverlap = false);
        note.drawNote(ctx);
      });
    }

    draw();
  }, []);

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
      const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
      const clickY = event.clientY - rect.top;
      const note = getNote(clickX, clickY);
      if (note) {
        // drag note
        const { startX, startY, endX, endY } = note;
        window.onmousemove = (e) => {
          const disX = e.clientX - rect.left - clickX; // how far the mouse moved in X
          const disY =
            Math.floor((e.clientY - rect.top - clickY) / noteStyle.noteHeight) *
            noteStyle.noteHeight;

          // Boundary determination
          // TODO
          if (startX + disX > canvas.width) {
            note.startX = canvas.width;
            note.endX = canvas.width - note.noteLength;
          } else if (startX < 0) {
            note.startX = 0;
            note.endX = note.noteLength;
          } else {
            note.startX = startX + disX;
          }

          if (endX + disX > canvas.width) {
            note.endX = canvas.width;
            note.startX = note.endX - note.noteLength;
          } else if (endX + disX < 0) {
            note.endX = 0;
            note.startX = note.endX + note.noteLength;
          } else {
            note.endX = endX + disX;
          }

          // note.startX = startX + disX;
          // note.endX = endX + disX;
          note.startY = startY + disY;
          note.endY = endY + disY;
        };
        updateNotes(notes);
        console.log(notes);
      } else {
        // draw new note
        const note = new Note(noteId, clickX, clickY);
        noteId = noteId + 1;
        window.onmousemove = (e) => {
          if (e.clientX - rect.left > canvas.width) {
            note.endX = canvas.width;
          } else if (e.clientX - rect.left < 0) {
            note.endX = 0;
          } else {
            note.endX = e.clientX - rect.left;
          }
        };
        notes.push(note);
        updateNotes(notes);
        console.log(notes);
      }
      window.onmouseup = () => {
        // When mouse up, cancel move event
        window.onmousemove = null;
        window.onmouseup = null;
      };
    }
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
    const mouseY = event.clientY - rect.top;
    const note = getNote(mouseX, mouseY);

    if (note) {
      canvas.style.cursor = "all-scroll";
    } else {
      canvas.style.cursor = "default";
    }
  };

  return (
    // <div className="canvas-container">
    <canvas
      className="compose-area-canvas"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
    // </div>
  );
}

export default CanvasComponent;
