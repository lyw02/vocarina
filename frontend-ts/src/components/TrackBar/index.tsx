import {
  createNewTrack,
  setCurrentTrack,
  setSheet,
  setTrackState,
} from "@/store/modules/tracks";
import { RootState } from "@/types";
import { AddCircleOutline, MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  toggleButtonGroupClasses,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { trackState } from "@/types/project";
import theme from "@/theme";

const TrackBar = () => {
  const dispatch = useDispatch();

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);

  const handleTrackChange = (trackId: number) => {
    dispatch(setCurrentTrack(trackId));
    dispatch(
      setSheet({ trackId: currentTrack, sheet: tracks[currentTrack - 1].sheet })
    );
  };

  const handleCreateTrack = () => {
    dispatch(createNewTrack({ trackName: "" }));
  };

  // Toggle button (muted / solo)
  const [toggle, setToggle] = useState(tracks[currentTrack - 1].trackState);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newToggle: trackState,
    trackId: number
  ) => {
    dispatch(setTrackState({ trackId: trackId, newState: newToggle }));
    setToggle(newToggle);
  };

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
      margin: theme.spacing(0.5),
      border: 0,
      borderRadius: theme.shape.borderRadius,
      [`&.${toggleButtonGroupClasses.disabled}`]: {
        border: 0,
      },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
      {
        marginLeft: -1,
        borderLeft: "1px solid transparent",
      },
  }));

  return (
    <div className="trackbar-wrapper">
      {tracks.map((track) => {
        return (
          <Stack
            key={track.trackId}
            direction="row"
            spacing={0}
            sx={
              track.trackId === currentTrack
                ? {
                    backgroundColor: theme.palette.grey[200],
                  }
                : {
                    backgroundColor: theme.palette.grey[100],
                  }
            }
          >
            <Box
              component="div"
              sx={{
                p: 0,
                border: "0px dashed grey",
                width: "20%",
              }}
            >
              <Stack direction="row" spacing={0}>
                <Box
                  component="div"
                  sx={
                    track.trackId === currentTrack
                      ? {
                          p: 1,
                          width: "5%",
                          minHeight: "100%",
                          backgroundColor: theme.palette.primary.light,
                        }
                      : {
                          p: 1,
                          width: "5%",
                          minHeight: "100%",
                        }
                  }
                ></Box>
                <Box
                  component="div"
                  sx={{ p: 0, width: "50%", display: "flex", cursor: "pointer" }}
                  onClick={() => handleTrackChange(track.trackId)}
                >
                  <Typography
                    variant="body2"
                    sx={{ margin: "auto", userSelect: "none" }}
                  >
                    {track.trackName}
                  </Typography>
                </Box>
                <Box component="div" sx={{ p: 0, width: "30%", height: "50%" }}>
                  <StyledToggleButtonGroup
                    color="primary"
                    value={track.trackState}
                    exclusive
                    size="small"
                    onChange={(e, v) => handleToggleChange(e, v, track.trackId)}
                    aria-label="Muted or solo"
                  >
                    <ToggleButton value="muted">M</ToggleButton>
                    <ToggleButton value="solo">S</ToggleButton>
                  </StyledToggleButtonGroup>
                </Box>
                <Box
                  component="div"
                  sx={{ p: 0, width: "20%", display: "flex" }}
                >
                  <Button
                    onClick={handleCreateTrack}
                    sx={{ margin: "auto", minWidth: "80%", width: "80%" }}
                  >
                    <MoreHoriz />
                  </Button>
                </Box>
              </Stack>
            </Box>
            <Box
              component="div"
              sx={{ p: 2, borderLeft: "1px solid lightgrey", width: "80%" }}
            ></Box>
          </Stack>
        );
      })}
    </div>
  );
};

export default TrackBar;
