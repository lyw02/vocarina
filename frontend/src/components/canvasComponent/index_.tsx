import { setNotes } from "@/store/modules/notes";
import { NoteProps, RootState } from "@/types";
import { Note, drawNote, noteStyle } from "@/utils/Note";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const updateNote = (
  note: Note,
  newProps: NoteProps,
  notes: Note[],
  dispatch: Dispatch<UnknownAction>
) => {
  const notesCopy = [...notes];
  let newNotes = notesCopy.map((n) => {
    if (n.id === note.id) {
      let newNote = {
        ...n,
        ...newProps,
      };
      return newNote;
    }
    return n;
  });
  dispatch(setNotes(newNotes));
};

const createNote = (
  newNote: Note,
  props: NoteProps,
  notes: Note[],
  dispatch: Dispatch<UnknownAction>
) => {
  const notesCopy = [...notes];
  let newNotes = [
    ...notesCopy,
    {
      ...newNote,
      ...props,
    },
  ];
  dispatch(setNotes(newNotes));
};

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useDispatch();

  const { notes } = useSelector((state: RootState) => state.notes);
  // const { numerator, denominator, bpm } = useSelector(
  //   (state: RootState) => state.params
  // );
  let noteId: number = 0;

  const getNote = (x: number, y: number) => {
    // get note that clicked on
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n instanceof Note && n.isInside(x, y)) {
        return n;
      }
    }
    return null;
  };

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

    const draw = () => {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, 2700, 2700); // Clear canvas
      notes.forEach((note) => {
        // const newNotes = [...notes];
        if (overlap(note)) {
          updateNote(note, { isOverlap: true }, notes, dispatch);
        } else {
          updateNote(note, { isOverlap: false }, notes, dispatch);
        }
        console.log("note ");
        // note.drawNote(ctx);
        drawNote(note, ctx);
      });
    };

    draw();
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (event.button === 0) {
      // const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
      const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
      const clickY = event.clientY - rect.top;
      const note = getNote(clickX, clickY);
      if (note) {
        // drag note
        const { startX, startY, endX, endY } = note;
        window.onmousemove = (e) => {
          const disX = e.clientX - rect.left - clickX;
          const disY =
            Math.floor((e.clientY - rect.top - clickY) / noteStyle.noteHeight) *
            noteStyle.noteHeight;
          let newNotes = notes.map((n) => {
            if (n.id === note.id) {
              let newNote = {
                ...n,
                startX: startX + disX,
                endX: endX + disX,
                startY: startY + disY,
                endY: endY + disY,
              };
              return newNote;
            }
            return n;
          });
          dispatch(setNotes(newNotes));
        };
        console.log(notes);
      } else {
        // draw new note
        const newNote = new Note(noteId, clickX, clickY);
        noteId = noteId + 1;
        let newEndX;
        window.onmousemove = (e) => {
          if (e.clientX - rect.left > canvas.width) {
            // newNote.endX = canvas.width;
            newEndX = canvas.width;
          } else if (e.clientX - rect.left < 0) {
            // newNote.endX = 0;
            newEndX = 0;
          } else {
            // newNote.endX = e.clientX - rect.left;
            newEndX = e.clientX - rect.left;
          }
          createNote(newNote, {endX: newEndX}, notes, dispatch);
        };
        
        // let newNotes = [
        //   ...notes,
        //   {
        //     ...newNote,
        //     endX: newEndX,
        //   },
        // ];
        // dispatch(setNotes(newNotes));
        console.log(notes);
      }
      window.onmouseup = () => {
        // When mouse up, cancel move event
        window.onmousemove = null;
        window.onmouseup = null;
        // parsePitch(notes, updateNotes);
        // parseDuration(notes, updateNotes, bpm);
      };
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
};

export default CanvasComponent;
