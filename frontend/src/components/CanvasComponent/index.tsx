import React, { useRef, useEffect, useState } from "react";
import { noteStyle, Note } from "@/utils/Note";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { RootState } from "@/types";
import _ from "lodash";
import { setSheet } from "@/store/modules/tracks";
import { ComposeAreaStyle } from "@/utils/ComposeAreaStyle";
import { DragSelector } from "@/utils/DragSelector";
import { setSelectedNotes } from "@/store/modules/localStatus";
import {
  pushWavePlotElements,
  setCursorTime,
  setWavePlotElements as setWavePlotElementsInState,
} from "@/store/modules/projectAudio";
import { Cursor } from "@/utils/Cursor";
import { Box, LinearProgress, Menu, MenuItem } from "@mui/material";
import theme from "@/theme";

function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);
  const editMode = useSelector((state: RootState) => state.editMode.editMode);
  const snappingMode = useSelector(
    (state: RootState) => state.snappingMode.snappingMode
  );
  const isGenerating = useSelector(
    (state: RootState) => state.localStatus.isGenerating
  );
  const currentTrackIndex = tracks.findIndex((t) => t.trackId === currentTrack);
  const notesInState = tracks[currentTrackIndex].sheet;
  const notesInstances = notesInState.map((n) => {
    return new Note(
      n.id,
      n.startX,
      n.startY,
      n.endX,
      n.endY,
      n.isOverlap,
      n.noteLength,
      n.lyrics
    );
  });
  const notes = _.cloneDeep(notesInstances);
  let noteId: number;
  if (notes.length === 0) {
    noteId = 0;
  } else {
    noteId = Math.max(...notes.map((n) => n.id)) + 1;
  }

  const dispatch = useDispatch();

  const getNote = (x: number, y: number) => {
    // Get note that clicked on
    for (let i = notes.length - 1; i >= 0; i--) {
      const n = notes[i];
      if (n.isInside(x, y)) {
        return n;
      }
    }
    return null;
  };

  const overlap = (note: Note) => {
    return notes.some(
      (item) => note !== item && note.minX < item.maxX && note.maxX > item.minX
    );
  };

  const dragSelector = new DragSelector(0, 0);
  const selectedNotes = useSelector(
    (state: RootState) => state.localStatus.selectedNotes
  );
  const { bpm, numerator, denominator } = useSelector(
    (state: RootState) => state.params
  );
  let selected = _.cloneDeep(selectedNotes);
  let cursorPos = 0;
  // const cursorTime = useSelector(
  //   (state: RootState) => state.projectAudio.cursorTime
  // );
  // cursorPos = (cursorTime * bpm * 40) / (60 * numerator * numerator * denominator);
  const cursor = Cursor.getInstance(cursorPos, 2700);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 10000;
    canvas.height = 2700;

    function draw() {
      if (!ctx) return;
      const notesInDraw = notes;
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, 10000, 2700); // Clear canvas
      notesInDraw.forEach((note) => {
        overlap(note) ? (note.isOverlap = true) : (note.isOverlap = false);
        note.drawNote(ctx, selectedNotes);
      });
      dragSelector.drawSelector(ctx);
      // cursor.drawCursor(ctx);
    }

    draw();
  }, [
    notesInState,
    // tracks[currentTrackIndex].trackLyrics,
    dragSelector,
    cursor,
    selected,
  ]);

  const noteAudioArr = useSelector(
    (state: RootState) => state.projectAudio.base64Arr
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    dispatch(setWavePlotElementsInState([]));
    tracks
      .find((t) => t.trackId === currentTrack)!
      .sheet.forEach((note) => {
        dispatch(
          pushWavePlotElements({
            trackId: currentTrack,
            id: note.id,
            left: note.startX,
            top: note.startY + noteStyle.noteHeight,
            width: note.noteLength,
          })
        );
      });
  }, [noteAudioArr, currentTrack]);

  const [eventCoord, setEventCoord] = useState<[number, number]>();
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    setEventCoord([event.clientX, event.clientY]);
  };

  const handleMenuClose = () => {
    setContextMenu(null);
  };

  const getClickCoord = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
    const clickX = clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
    const clickY = clientY - rect.top;

    return [clickX, clickY];
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
    const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border
    const clickY = event.clientY - rect.top;
    const note = getNote(clickX, clickY);

    if (event.button === 0) {
      if (note && note.isBoundary(clickX, clickY)) {
        // Adjust length
        const { startX, endX } = note;
        const startXArr = notes.map((note) => note.startX);
        const endXArr = notes.map((note) => note.endX);
        if (note.isBoundary(clickX, clickY) === "left") {
          window.onmousemove = (e) => {
            let tempDisXLeft = e.clientX - rect.left - clickX; // how far the mouse moved in X
            let disXLeft = getDisX(tempDisXLeft, note.startX);
            if (selected.includes(note.id)) {
              selected.forEach((id) => {
                let index = notes.findIndex((note) => note.id === id);
                if (notes[index]) {
                  notes[index].startX = startXArr[index] + disXLeft;
                }
              });
            } else {
              note.startX = startX + disXLeft;
            }
          };
        } else if (note.isBoundary(clickX, clickY) === "right") {
          window.onmousemove = (e) => {
            let tempDisXRight = e.clientX - rect.left - clickX; // how far the mouse moved in X
            let disXRight = getDisX(tempDisXRight, note.endX);
            if (selected.includes(note.id)) {
              selected.forEach((id) => {
                let index = notes.findIndex((note) => note.id === id);
                if (notes[index]) {
                  notes[index].endX = endXArr[index] + disXRight;
                }
              });
            } else {
              note.endX = endX + disXRight;
            }
          };
        }
      } else if (note && !note.isBoundary(clickX, clickY)) {
        // Drag note
        const { startX, startY, endX, endY } = note;
        const startXArr = notes.map((note) => note.startX);
        const endXArr = notes.map((note) => note.endX);
        const startYArr = notes.map((note) => note.startY);
        const endYArr = notes.map((note) => note.endY);

        window.onmousemove = (e) => {
          let tempDisX = e.clientX - rect.left - clickX; // how far the mouse moved in X
          let disX = getDisX(tempDisX, note.startX);
          let disY =
            Math.floor((e.clientY - rect.top - clickY) / noteStyle.noteHeight) *
            noteStyle.noteHeight;

          // // TODO Boundary determination
          // if (startX + disX > canvas.width) {
          //   note.startX = canvas.width;
          //   note.endX = canvas.width - note.noteLength;
          // } else if (startX < 0) {
          //   note.startX = 0;
          //   note.endX = note.noteLength;
          // } else {
          // }

          // if (endX + disX > canvas.width) {
          //   note.endX = canvas.width;
          //   note.startX = note.endX - note.noteLength;
          // } else if (endX + disX < 0) {
          //   note.endX = 0;
          //   note.startX = note.endX + note.noteLength;
          // } else {
          // }

          if (selected.includes(note.id)) {
            selected.forEach((id) => {
              let index = notes.findIndex((note) => note.id === id);
              if (notes[index]) {
                notes[index].startX = startXArr[index] + disX;
                notes[index].endX = endXArr[index] + disX;
                notes[index].startY = startYArr[index] + disY;
                notes[index].endY = endYArr[index] + disY;
              }
            });
          } else {
            note.startX = startX + disX;
            note.endX = endX + disX;
            note.startY = startY + disY;
            note.endY = endY + disY;
          }
        };
      } else {
        if (editMode === "edit") {
          // Draw new note
          const note = new Note(
            noteId,
            snappingMode
              ? clickX - (clickX % ComposeAreaStyle.colLineIntervalInner)
              : clickX,
            clickY
          );
          noteId = noteId + 1;
          window.onmousemove = (e) => {
            if (e.clientX - rect.left > canvas.width) {
              note.endX = canvas.width;
            } else if (e.clientX - rect.left < 0) {
              note.endX = 0;
            } else {
              let temp = e.clientX - rect.left;
              snappingMode
                ? (note.endX =
                    temp - (temp % ComposeAreaStyle.colLineIntervalInner))
                : (note.endX = temp);
            }
          };
          notes.push(note);
        } else if (editMode === "select") {
          // Drag select
          selected = [];
          dragSelector.startX = clickX;
          dragSelector.startY = clickY;
          dragSelector.endX = clickX;
          dragSelector.endY = clickY;
          window.onmousemove = (e) => {
            dragSelector.endX = e.clientX - rect.left;
            dragSelector.endY = e.clientY - rect.top;
          };
        }
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 2) {
      event.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // Canvas region (a rect)
    const clickX = event.clientX - rect.left; // Distance of clicked point to window left border - distance of canvas rect to window left border, i.e. distance of clicked point to canvas rect left border

    if (
      event.button === 0 &&
      editMode === "select" &&
      dragSelector.startX === dragSelector.endX &&
      dragSelector.startY === dragSelector.endY // Just click, no drag
    ) {
      cursorPos = clickX;
      cursor.set(cursorPos);
      const measureDuration = (60 * numerator * denominator) / bpm;
      const measureCount = cursorPos / 40 / numerator;
      dispatch(setCursorTime(measureDuration * measureCount));
    }

    notes.forEach((note) => {
      if (
        !selected.includes(note.id) &&
        Math.abs(note.midX - dragSelector.midX) <
          (note.noteLength + dragSelector.width) / 2 &&
        Math.abs(note.midY - dragSelector.midY) <
          (noteStyle.noteHeight + dragSelector.height) / 2
      ) {
        // Note is overlapped with drag selector
        selected.push(note.id);
      }
    });
    dispatch(setSelectedNotes(selected));

    // When mouse up, cancel move event
    window.onmousemove = null;
    window.onmouseup = null;
    dispatch(
      setSheet({ trackId: currentTrack, sheet: notes.map((n) => n.toJSON()) })
    );
    // parsePitch(notes, updateNotes);
    // parseDuration(notes, updateNotes, bpm);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

  const getDisX = (tempDisX: number, startX: number) => {
    let disX;
    if (
      snappingMode &&
      (tempDisX + startX) % ComposeAreaStyle.colLineIntervalInner !== 0
    ) {
      disX =
        Math.floor(
          (tempDisX + startX) / ComposeAreaStyle.colLineIntervalInner
        ) *
          ComposeAreaStyle.colLineIntervalInner -
        startX;
    } else {
      disX = tempDisX;
    }
    return disX;
  };

  const handleDelete = () => {
    if (!eventCoord) return;
    const clickCoord = getClickCoord(eventCoord[0], eventCoord[1]);
    if (!clickCoord) return;
    const note = getNote(clickCoord[0], clickCoord[1]);
    if (!note) return;
    const index = notes.indexOf(note);
    if (index !== -1) {
      if (selected.includes(note.id)) {
        for (let i = notes.length - 1; i >= 0; i--) {
          if (selected.includes(notes[i].id)) {
            notes.splice(i, 1);
          }
        }
      } else {
        notes.splice(index, 1);
      }
    }
    dispatch(
      setSheet({ trackId: currentTrack, sheet: notes.map((n) => n.toJSON()) })
    );
    setContextMenu(null);
  };

  return (
    <>
      {isGenerating && (
        <div className="progress-wrapper">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <LinearProgress
              sx={{
                color: theme.palette.primary.main,
                position: "absolute",
                top: "50%",
                zIndex: 11,
              }}
            />
          </Box>
        </div>
      )}
      <div onContextMenu={handleContextMenu}>
        <canvas
          className="compose-area-canvas"
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <Menu
          open={contextMenu !== null}
          onClose={handleMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default CanvasComponent;
