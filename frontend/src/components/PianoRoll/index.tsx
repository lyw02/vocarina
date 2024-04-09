import { useEffect, useRef } from "react";
import Piano from "@/components/Piano";
import ComposeArea from "@/components/ComposeArea";
import CanvasComponent from "@/components/CanvasComponent";
import "./index.css";
import { RootState } from "@/types";
import { useSelector } from "react-redux";
import { base64ToUrl } from "@/utils/AudioProcess";
import { noteStyle } from "@/utils/Note";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";
import { Box, LinearProgress } from "@mui/material";
import theme from "@/theme";

const PianoRoll = () => {
  const pianoRef = useRef<HTMLDivElement | null>(null);
  const composeAreaRef = useRef<HTMLDivElement | null>(null);
  const pianoRollRef = useRef<HTMLDivElement | null>(null);

  const isGenerating = useSelector(
    (state: RootState) => state.localStatus.isGenerating
  );

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const wavePlotElements = useSelector(
    (state: RootState) => state.projectAudio.wavePlotElements
  );
  const base64Arr = useSelector(
    (state: RootState) => state.projectAudio.base64Arr
  ).find((track) => track.id === currentTrack);
  const parsedLyricsArr = useSelector(
    (state: RootState) => state.projectAudio.parsedLyricsArr
  ).find((track) => track.id === currentTrack);

  const silentIndexArr = parsedLyricsArr?.data.map((content, i) => {
    if (content === "") {
      return i;
    }
  });

  let base64ArrCopy = _.cloneDeep(base64Arr);
  const filteredBased64DataArr = base64Arr?.data.filter(
    (_c, i) => !silentIndexArr?.includes(i)
  );
  if (base64ArrCopy && filteredBased64DataArr) {
    base64ArrCopy.data = filteredBased64DataArr;
  }

  const audioUrls = base64ArrCopy?.data.map((data) => base64ToUrl(data)) || [];

  const refs = useRef<any>(null);

  const getMap = () => {
    if (!refs.current) {
      refs.current = new Map();
    }
    return refs.current;
  };

  useEffect(() => {
    const pianoRoll = pianoRollRef.current;
    if (pianoRoll) {
      const middleScroll =
        (pianoRoll.scrollHeight - pianoRoll.clientHeight) / 2;
      pianoRoll.scrollTop = middleScroll;
    }

    const map = getMap();
    const minLength = Math.min(refs.current.size, audioUrls.length);

    refs.current.keys().forEach((i: number) => {
      if (i < minLength) {
        WaveSurfer.create({
          container: map.get(i),
          height: noteStyle.noteHeight * 4,
          barHeight: 2,
          waveColor: "rgba(255, 255, 255, 0.8)",
          cursorColor: "rgba(255, 255, 255, 0)",
          interact: false,
          url: audioUrls[i],
        });
      }
    });
  }, [wavePlotElements, currentTrack]);

  return (
    <>
      {isGenerating && (
        <Box sx={{ width: "100%", height: "100%", zIndex: 11 }}>
          <LinearProgress
            sx={{
              color: theme.palette.primary.main,
              zIndex: 11,
            }}
          />
        </Box>
      )}
      <div className="piano-roll-wrapper" ref={pianoRollRef}>
        <div className="piano-wrapper" ref={pianoRef}>
          <Piano />
        </div>
        <div
          className="compose-area-and-canvas-component-wrapper"
          ref={composeAreaRef}
        >
          <div className="compose-area-wrapper">
            <ComposeArea />
          </div>
          <div className="canvas-component-wrapper">
            <CanvasComponent />
            {wavePlotElements.map(
              (element) =>
                element.trackId === currentTrack && (
                  <div
                    key={element.id.toString()}
                    id={element.id.toString()}
                    ref={(node) => {
                      const map = getMap();
                      if (node) {
                        map.set(element.id, node);
                      } else {
                        map.delete(element.id);
                      }
                    }}
                    style={{
                      left: element.left,
                      top: element.top,
                      width: element.width,
                      height: noteStyle.noteHeight,
                      position: "absolute",
                      zIndex: 1,
                    }}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PianoRoll;
