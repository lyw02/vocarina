import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Typography,
} from "@mui/material";
import { TinyText, Widget } from "./style";
import MusicVisualizer from "../MusicVisualizer";
import { useEffect, useRef, useState } from "react";
import {
  AddCircleOutlineRounded,
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { setIsPanelOpen, setSrc } from "@/store/modules/musicPanel";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import { addMusicToPlaylist, getAllPlaylistsOfUser } from "@/api/communityApi";
import { useAlert } from "@/utils/CustomHooks";
import AutoDismissAlert from "../Alert/AutoDismissAlert";
import { v4 as uuidv4 } from "uuid";

interface PlaylistMenuItem {
  id: number;
  title: string;
}
interface MusicPlayerBannerProps {
  initialVolume?: number;
  initialPlaying?: boolean;
  id: number;
  title: string;
  artist: string;
  // coverUrl: string;
  audioUrl: string;
}

const MusicPlayerBanner = ({
  id,
  title,
  artist,
  // coverUrl,
  audioUrl,
}: MusicPlayerBannerProps) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const dispatch = useDispatch();
  const { isAlertOpen, alertStatus, handleAlertClose, raiseAlert } = useAlert();
  const isOpen = useSelector(
    (state: RootState) => state.musicPanel.isPanelOpen
  );
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
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
      dispatch(setIsPanelOpen(false));
      dispatch(setSrc(null));
    }
  };

  // Playlist menu
  const [playlistMenuItems, setPlaylistMenuItems] = useState<
    PlaylistMenuItem[]
  >([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  console.log("menuOpen: ", menuOpen);

  const fetchPlaylists = async (userId: number) => {
    const res = await getAllPlaylistsOfUser(userId);
    const resJson = await res.json();
    const menuItems = resJson.map(
      (item: { id: number; title: string; [key: string]: any }) => {
        return {
          id: item.id,
          title: item.title,
        };
      }
    );
    setPlaylistMenuItems(menuItems);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!currentUserId) {
      raiseAlert("error", "Please sign in first");
      return;
    }
    fetchPlaylists(currentUserId);
    setAnchorEl(event.currentTarget);
  };

  const handleItemClick = async (playlistId: number) => {
    const res = await addMusicToPlaylist(playlistId, id);
    if (res.ok) {
      raiseAlert("success", "Success")
    }
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AutoDismissAlert
        isAlertOpen={isAlertOpen}
        handleAlertClose={handleAlertClose}
        message={alertStatus.message}
        severity={alertStatus.severity}
      />
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
            <Box sx={{ justifyContent: "center" }}>
              <IconButton onClick={handlePlayPause}>
                {playing ? (
                  <PauseRounded sx={{ fontSize: "3rem" }} htmlColor="black" />
                ) : (
                  <PlayArrowRounded
                    sx={{ fontSize: "3rem" }}
                    htmlColor="black"
                  />
                )}
              </IconButton>
              <IconButton onClick={handleMenuOpen}>
                <AddCircleOutlineRounded />
              </IconButton>
              <Link to={`/community/music/${id}/comments`}>
                <IconButton>
                  <CommentIcon />
                </IconButton>
              </Link>
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
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            {playlistMenuItems.map((item) => (
              <MenuItem key={uuidv4()} onClick={() => handleItemClick(item.id)}>{item.title}</MenuItem>
            ))}
          </Menu>
        </Box>
      </ClickAwayListener>
    </>
  );
};

export default MusicPlayerBanner;
