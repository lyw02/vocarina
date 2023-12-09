import React, { useRef, useEffect } from "react";
import { useNotes } from "../../contexts/notesContext";
import "./index.css";

function CanvasComponent() {
  const canvasRef = useRef(null);
  const noteStyle = {
    color: "#ff8fab",
    overlapColor: "#ffe5ec",
    borderColor: "#fff",
    borderWidth: 3,
    lineCap: "square",
    noteHeight: 25,
    minNoteWidth: 20,
  };
  // const notes = [];
  const { notes, updateNotes } = useNotes();
  let noteId = 0;

  class Note {
    constructor(id, startX, startY) {
      this.id = id;
      this.startX = startX;
      this.startY =
        Math.floor(startY / noteStyle.noteHeight) * noteStyle.noteHeight;
      this.endX = startX + noteStyle.minNoteWidth;
      this.endY = this.startY + noteStyle.noteHeight;
      this.isOverlap = false;
      this.noteLength = Math.abs(this.startX - this.endX);
    }

    get minX() {
      let min = Math.min(this.startX, this.endX);
      if (
        Math.abs(min - this.startX) < noteStyle.minNoteWidth &&
        min < this.startX
      ) {
        return this.startX - noteStyle.minNoteWidth;
      } else {
        return min;
      }
    }
    get maxX() {
      let max = Math.max(this.startX, this.endX);
      if (
        Math.abs(max - this.startX) < noteStyle.minNoteWidth &&
        max > this.startX
      ) {
        return this.startX + noteStyle.minNoteWidth;
      } else {
        return max;
      }
    }
    get minY() {
      return this.startY;
    }
    get maxY() {
      return this.endY;
    }

    drawNote(ctx) {
      this.noteLength = Math.abs(this.minX - this.maxX);
      ctx.beginPath();
      ctx.moveTo(this.minX, this.minY);
      ctx.lineTo(this.maxX, this.minY);
      ctx.lineTo(this.maxX, this.maxY);
      ctx.lineTo(this.minX, this.maxY);
      ctx.lineTo(this.minX, this.minY);
      this.isOverlap
        ? (ctx.fillStyle = noteStyle.overlapColor)
        : (ctx.fillStyle = noteStyle.color);
      ctx.fill();
      ctx.strokeStyle = noteStyle.borderColor;
      ctx.lineWidth = noteStyle.borderWidth;
      ctx.lineCap = noteStyle.lineCap;
      ctx.stroke();
    }

    isInside(x, y) {
      // whether position (x, y) is inside a note
      return x > this.minX && x < this.maxX && y > this.minY && y < this.maxY;
    }
  }

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

    canvas.width = 1000;
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
        updateNotes(notes)
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
    <canvas
      className="compose-area-canvas"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
  );
}

export default CanvasComponent;
