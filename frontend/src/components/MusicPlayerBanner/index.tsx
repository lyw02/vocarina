import { Box, IconButton, Slider, Typography } from "@mui/material";
import { TinyText, Widget } from "./style";
import MusicVisualizer from "../MusicVisualizer";
import { useEffect, useRef, useState } from "react";
import {
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { setIsPlaying, setSrc } from "@/store/modules/musicPanel";

interface MusicPlayerBannerProps {
  initialVolume?: number;
  initialPlaying?: boolean;
  title: string;
  artist: string;
  // coverUrl: string;
  audioUrl: string;
}

const MusicPlayerBanner = ({
  title,
  artist,
  // coverUrl,
  audioUrl,
}: MusicPlayerBannerProps) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.musicPanel.isPlaying
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.crossOrigin = "anonymous";
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime)
    );
    audio.addEventListener("ended", () => setPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", () =>
        setDuration(audio.duration)
      );
      audio.removeEventListener("timeupdate", () =>
        setCurrentTime(audio.currentTime)
      );
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleTimeSliderChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (activeThumb !== 0) return;
    const audio = audioRef.current;
    if (!audio) return;
    let newTime = Array.isArray(newValue) ? newValue[0] : newValue;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleClickAway = () => {
    if (isOpen) {
      dispatch(setIsPlaying(false));
      dispatch(setSrc(null));
    }
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>

    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <audio ref={audioRef} style={{ display: "none" }} controls>
        <source src={audioUrl} type="audio/wav" />
      </audio>
      <Widget>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ ml: 1.5, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {artist}
              </Typography>
              <Typography noWrap>
                <b>{title}</b>
              </Typography>
            </Box>
          </Box>
          <Box>
            <MusicVisualizer audioElement={audioRef.current} />
          </Box>
        </Box>
        <Box sx={{justifyContent: "center"}}>
          <IconButton onClick={handlePlayPause}>
            {playing ? (
              <PauseRounded sx={{ fontSize: "3rem" }} htmlColor="black" />
            ) : (
              <PlayArrowRounded sx={{ fontSize: "3rem" }} htmlColor="black" />
            )}
          </IconButton>
          <Slider
            value={currentTime}
            onChange={handleTimeSliderChange}
            max={duration}
            step={0.01}
            sx={{ margin: "10px 0" }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: -2,
            }}
          >
            <TinyText>{formatDuration(currentTime)}</TinyText>
            <TinyText>-{formatDuration(duration - currentTime)}</TinyText>
          </Box>
        </Box>
      </Widget>
    </Box>
    </ClickAwayListener>
  );
};

export default MusicPlayerBanner;
