import { RootState } from "@/types";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

interface TrackBarCanvasProps {
  trackStackRef: React.MutableRefObject<HTMLDivElement | null>;
  trackId: number;
  maxDistanceX: number;
  maxDistanceY: number;
}

const TrackBarCanvas = ({
  trackStackRef,
  trackId,
  maxDistanceX,
  maxDistanceY,
}: TrackBarCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sheet = useSelector(
    (state: RootState) =>
      state.tracks.tracks[
        state.tracks.tracks.findIndex((t) => t.trackId === trackId)
      ].sheet
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const trackStack = trackStackRef.current;
    if (!trackStack) return;

    canvas.width = trackStack.clientWidth;
    canvas.height = trackStack.clientHeight / 2;

    let ratioX = canvas.width / 10000;
    let ratioY = canvas.height / 2700;

    sheet.forEach((note) => {
      let startX = Math.round(note.startX * ratioX);
      let endX = Math.round(note.endX * ratioX);
      let startY = Math.round(note.startY * ratioY);
      let endY = Math.round(note.endY * ratioY);

      if (startY === endY) {
        endY++;
      }

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX, endY);
      ctx.lineTo(startX, startY);
      ctx.fillStyle = "#ff8fab";
      ctx.fill();
    });
  }, [sheet]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        p: 0,
        borderLeft: "1px solid lightgrey",
        width: "80%",
        maxHeight: "100%",
        zIndex: 20,
      }}
    ></Box>
  );
};

export default TrackBarCanvas;
