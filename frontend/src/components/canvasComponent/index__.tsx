// import { setNotes } from "@/store/modules/notes";
// import { NoteProps, RootState } from "@/types";
import { Note, drawNote, noteStyle } from "@/utils/Note";
// import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const updateNote = (
//   note: Note,
//   newProps: NoteProps,
//   notes: Note[],
//   dispatch: Dispatch<UnknownAction>
// ) => {
//   let newNotes = notes.map((n) => {
//     if (n.id === note.id) {
//       let newNote = {
//         ...n,
//         ...newProps,
//       };
//       return JSON.stringify(newNote);
//     }
//     return JSON.stringify(n);
//   });
//   console.log("updated notes: ", newNotes);
//   dispatch(setNotes(newNotes));
// };

// const commitChange = (
//   type: "update" | "create",
//   note: Note,
//   newProps: NoteProps,
//   notes: Note[],
//   dispatch: Dispatch<UnknownAction>
// ) => {
//   //   const notesCopy = [...notes];
//   if (type === "update") {
//     updateNote(note, newProps, notes, dispatch);
//   } else if (type === "create") {
//     updateNote(note, newProps, notes, dispatch);
//   }
// };

// const CanvasComponent = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const dispatch = useDispatch();
//   const [isDrawing, setIsDrawing] = useState(false);
//   let noteId = 0;

//   const { notes } = useSelector((state: RootState) => state.notes);
//   const notesCopy = [...notes];
//   console.log("init notes: ", notes);

// //   const canvas = canvasRef.current;
// //   if (!canvas) return;
// //   const ctx = canvas.getContext("2d");
// //   if (!ctx) return;

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = 3000;
//     canvas.height = 2700;

//     notesCopy.push(new Note(1, 100, 1000));
//     notesCopy.push(new Note(2, 100, 1100));

//     console.log("In use effect");

//     const overlap = (note: Note) => {
//       return notesCopy.some(
//         (item) =>
//           note !== item && note.minX < item.maxX && note.maxX > item.minX
//       );
//     };

//     const draw = () => {
//       if (isDrawing) {
//         requestAnimationFrame(draw);
//       }
//       ctx.clearRect(0, 0, 2700, 2700); // Clear canvas
//       console.log("notes copy in draw: ", notesCopy);

//       notesCopy.forEach((note) => {
//         overlap(note) ? (note.isOverlap = true) : (note.isOverlap = false);
//         overlap(note)
//           ? updateNote(note, {}, notesCopy, dispatch)
//           : updateNote(note, {}, notesCopy, dispatch);
//         console.log(note);
//         note.drawNote(ctx);
//       });
//     };

//     draw();
//   }, [isDrawing]);

//   const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     if (event.button === 0) {
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");

//       const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
//       const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
//       const clickY = event.clientY - rect.top;
//       //   const note = getNote(clickX, clickY);
//       const note = null;
//       if (note) {
//         // drag note
//       } else {
//         // draw new note
//         const note = new Note(noteId, clickX, clickY);
//         noteId = noteId + 1;
//         window.onmousemove = (e) => {
//           setIsDrawing((prev) => !prev);
//           if (e.clientX - rect.left > canvas.width) {
//             note.endX = canvas.width;
//           } else if (e.clientX - rect.left < 0) {
//             note.endX = 0;
//           } else {
//             note.endX = e.clientX - rect.left;
//           }
//           setIsDrawing((prev) => !prev);
//         };
//         notesCopy.push(note);
//         updateNote(note, {}, notesCopy, dispatch);
//         // updateNote(notes);
//         // console.log(notes);
//       }
//       window.onmouseup = () => {
//         // When mouse up, cancel move event
//         window.onmousemove = null;
//         window.onmouseup = null;
//       };
//     }
//   };

//   return (
//     <canvas
//       className="compose-area-canvas"
//       ref={canvasRef}
//       //   onMouseMove={handleMouseMove}
//       onMouseDown={handleMouseDown}
//     />
//   );
// };

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [notesCopy, setNotesCopy] = useState<Note[]>([]);
  let noteId = 0;
  let isDrawing = false; // Flag to indicate whether drawing is in progress

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 3000 * window.devicePixelRatio;
    canvas.height = 2700 * window.devicePixelRatio;

    function draw() {
      requestAnimationFrame(draw);
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      notesCopy.forEach((note) => {
        note.drawNote(ctx);
      });
    }

    draw();

    return () => {
      // Cleanup function
      window.onmousemove = null;
      window.onmouseup = null;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      console.log("click");

      const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
      const clickX = e.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
      const clickY = e.clientY - rect.top;
      //   const note = getNote(clickX, clickY);
      const note = null;
      if (note) {
        // drag note
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
        setNotesCopy((prevNotes) => [...prevNotes, note]);
        // updateNote(note, {}, notesCopy, dispatch);
      }
      window.onmouseup = () => {
        // When mouse up, cancel move event
        window.onmousemove = null;
        window.onmouseup = null;
      };
    }
  };

  return (
    <canvas
      className="compose-area-canvas"
      ref={canvasRef}
      //   onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
  );
};

export default CanvasComponent;
