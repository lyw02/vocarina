import { useState, useRef, useEffect } from "react";
import {
  Button,
  Slider,
  Grid,
  useTheme,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import {
  FastForwardRounded,
  FastRewindRounded,
  PauseRounded,
  PlayArrowRounded,
  VolumeDownRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import {
  CoverImage,
  timeSliderSx,
  TinyText,
  volumeSliderSx,
  Widget,
} from "./style";

interface MusicPlayerBannerProps {
  initialVolume?: number;
  initialPlaying?: boolean;
  title: string;
  artist: string;
  cover_url: string;
  audio_url: string;
}

const MusicPlayerBanner = ({
  title,
  artist,
  cover_url,
  audio_url,
}: MusicPlayerBannerProps) => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [paused, setPaused] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setPaused(false);
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPaused(true);
  };

  const handlePlayPause = () => {
    paused ? playMusic() : pauseMusic();
  };

  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleTimeSliderChange = (_: any, value: number) => {
    setIsDragging(true);
    setCurrentTime(value as number);
  };

  const handleTimeSliderChangeCommit = (_: any, value: number) => {
    setIsDragging(false);
    audioRef.current!.currentTime = value;
  };

  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";

  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.onloadedmetadata = () => {
      setTotalDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    // audio.ontimeupdate = () => {
    //   if (timeoutRef.current) {
    //     clearTimeout(timeoutRef.current);
    //   }

    //   timeoutRef.current = window.setTimeout(() => {
    //     setCurrentTime(audio.currentTime);
    //   }, 100); // 100ms 防抖动处理

    //   return () => {
    //     clearTimeout(timeoutRef.current!);
    //   };
    // };

    return () => {
      audio.pause();
    };
  }, [audio_url]);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <audio ref={audioRef} src={audio_url} />
      <Widget>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CoverImage>
            <img alt="can't win - Chilling Sunday" src={cover_url} />
          </CoverImage>
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
        <Slider
          aria-label="time-indicator"
          size="small"
          value={isDragging ? currentTime : currentTime}
          min={0}
          step={1}
          max={totalDuration}
          onChange={(_, value) => handleTimeSliderChange(_, value as number)}
          onChangeCommitted={(_, value) =>
            handleTimeSliderChangeCommit(_, value as number)
          }
          sx={timeSliderSx}
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
          <TinyText>-{formatDuration(totalDuration - currentTime)}</TinyText>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -1,
          }}
        >
          <IconButton aria-label="previous song">
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? "play" : "pause"}
            onClick={handlePlayPause}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
          <IconButton aria-label="next song">
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider aria-label="Volume" defaultValue={30} sx={volumeSliderSx} />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
    </Box>
  );
};

export default MusicPlayerBanner;
