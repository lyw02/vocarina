import React, { useRef, useEffect } from "react";
import { setNotes } from "@/store/modules/notes";
import { noteStyle, Note } from "@/utils/Note";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { RootState } from "@/types";

function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const notesInState = useSelector((state: RootState) => state.notes.notes);
  const notes = [...notesInState];
  let noteId = 0;
  const dispatch = useDispatch();

  function getNote(x: number, y: number) {
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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 3000;
    canvas.height = 2700;

    const overlap = (note: Note) => {
      return notes.some(
        (item) =>
          note !== item && note.minX < item.maxX && note.maxX > item.minX
      );
    };

    function draw() {
      if (!ctx) return;
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, 2700, 2700); // Clear canvas
      notes.forEach((note) => {
        overlap(note) ? (note.isOverlap = true) : (note.isOverlap = false);
        note.drawNote(ctx);
      });
    }

    draw();
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
    const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
    const clickY = event.clientY - rect.top;
    const note = getNote(clickX, clickY);

    if (event.button === 2) {
      // delete note
      event.preventDefault();
      if (note) {
        const index = notes.indexOf(note);
        if (index !== -1) {
          notes.splice(index, 1);
          event.preventDefault();
        }
      }
    }

    if (event.button === 0) {
      console.log("clickX: ", clickX);
      console.log("clickY: ", clickY);

      if (note) {
        console.log(
          "note.isBoundary(clickX, clickY): ",
          note.isBoundary(clickX, clickY)
        );
      }

      if (note && note.isBoundary(clickX, clickY)) {
        // adjust length
        console.log("boundary: ");
        const { startX, endX } = note;
        if (note.isBoundary(clickX, clickY) === "left") {
          window.onmousemove = (e) => {
            const disXLeft = e.clientX - rect.left - clickX; // how far the mouse moved in X
            note.startX = startX + disXLeft;
          };
        } else if (note.isBoundary(clickX, clickY) === "right") {
          window.onmousemove = (e) => {
            const disXRight = e.clientX - rect.left - clickX; // how far the mouse moved in X
            note.endX = endX + disXRight;
          };
        }
        dispatch(setNotes(notes));
        console.log(notes);
      } else if (note && !note.isBoundary(clickX, clickY)) {
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
        // updateNotes(notes);
        dispatch(setNotes(notes));
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
        // updateNotes(notes);
        dispatch(setNotes(notes));
        console.log(notes);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 2) {
      event.preventDefault();
    }
    // When mouse up, cancel move event
    window.onmousemove = null;
    window.onmouseup = null;
    // parsePitch(notes, updateNotes);
    // parseDuration(notes, updateNotes, bpm);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
    const mouseY = event.clientY - rect.top;
    const note = getNote(mouseX, mouseY);

    if (note && note.isBoundary(mouseX, mouseY)) {
      canvas.style.cursor = "col-resize";
    } else if (note) {
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
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    />
    // </div>
  );
}

export default CanvasComponent;
