import {
  createNewTrack,
  deleteTrack,
  setCurrentTrack,
  setSheet,
  setTrackState,
} from "@/store/modules/tracks";
import { RootState } from "@/types";
import { MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  toggleButtonGroupClasses,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { trackState } from "@/types/project";
import theme from "@/theme";
import InputDialog from "../InputDialog";
import TrackBarCanvas from "../TrackBarCanvas";
import _ from "lodash";

const TrackBar = () => {
  const dispatch = useDispatch();

  const currentTrack = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const tracks = useSelector((state: RootState) => state.tracks.tracks);

  const [clickedTrack, setClickedTrack] = useState<number>(currentTrack);

  const handleTrackChange = (trackId: number) => {
    dispatch(setCurrentTrack(trackId));
    dispatch(
      setSheet({ trackId: currentTrack, sheet: tracks[currentTrack - 1].sheet })
    );
  };

  // Toggle button (muted / solo)
  const currentTrackIndex = tracks.findIndex((t) => t.trackId === currentTrack);
  const [_toggle, setToggle] = useState(tracks[currentTrackIndex].trackState);

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

  // Track options
  const [trackOptionsAnchorEl, setTrackOptionsAnchorEl] =
    useState<null | HTMLElement>(null);

  const isTrackOptionsOpen = Boolean(trackOptionsAnchorEl);

  const [optionTrackId, setOptionTrackId] = useState<null | number>(null);

  const handleTrackOptionsClick = (
    event: React.MouseEvent<HTMLElement>,
    trackId: number
  ) => {
    setTrackOptionsAnchorEl(event.currentTarget);
    setOptionTrackId(trackId);
  };

  const handleTrackOptionsClose = () => {
    setTrackOptionsAnchorEl(null);
  };

  const handleNewTruck = () => {
    const index = tracks.findIndex((t) => t.trackId === optionTrackId);
    const newPosition = index !== -1 ? index + 1 : tracks.length + 1;

    dispatch(
      createNewTrack({
        position: newPosition,
        trackName: "",
      })
    );
    handleTrackOptionsClose();
  };

  const handleEditTrackName = () => {
    setIsTrackNameDialogVisible(true);
    handleTrackOptionsClose();
  };

  const handleDeleteTruck = () => {
    if (tracks.length === 1) return;
    if (optionTrackId === currentTrack) return;
    dispatch(deleteTrack(optionTrackId));
    handleTrackOptionsClose();
  };

  const [isTrackNameDialogVisible, setIsTrackNameDialogVisible] =
    useState<boolean>(false);

  const trackStackRef = useRef<HTMLDivElement | null>(null);

  const distanceX: number[] = [];
  const distanceY: number[] = [];

  tracks.forEach((t) => {
    let sheet = t.sheet;

    if (sheet.length !== 0) {
      let minStartX = sheet.reduce((prev, current) =>
        prev.startX < current.startX ? prev : current
      ).startX;
      let maxEndX = sheet.reduce((prev, current) =>
        prev.endX > current.endX ? prev : current
      ).endX;
      let minStartY = sheet.reduce((prev, current) =>
        prev.startY < current.startY ? prev : current
      ).startY;
      let maxEndY = sheet.reduce((prev, current) =>
        prev.endY > current.endY ? prev : current
      ).endY;

      distanceX.push(maxEndX - minStartX);
      distanceY.push(maxEndY - minStartY);
    }
  });

  const maxDistanceX = _.max(distanceX) || 0;
  const maxDistanceY = _.max(distanceY) || 0;

  return (
    <div className="trackbar-wrapper">
      {tracks.map((track) => {
        return (
          <Stack
            key={track.trackId}
            ref={trackStackRef}
            direction="row"
            spacing={0}
            sx={
              track.trackId === currentTrack
                ? {
                    maxHeight: "7vh",
                    backgroundColor: theme.palette.grey[200],
                  }
                : {
                    maxHeight: "7vh",
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
                  sx={{
                    p: 0,
                    width: "50%",
                    display: "flex",
                    cursor: "pointer",
                  }}
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
                    onClick={(e) => handleTrackOptionsClick(e, track.trackId)}
                    sx={{ margin: "auto", minWidth: "80%", width: "80%" }}
                  >
                    <MoreHoriz />
                  </Button>
                </Box>
              </Stack>
            </Box>
            <TrackBarCanvas
              trackStackRef={trackStackRef}
              trackId={track.trackId}
              maxDistanceX={maxDistanceX}
              maxDistanceY={maxDistanceY}
            />
          </Stack>
        );
      })}
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={trackOptionsAnchorEl}
        open={isTrackOptionsOpen}
        onClose={handleTrackOptionsClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleNewTruck}>New track</MenuItem>
        <MenuItem onClick={handleEditTrackName}>Edit track name</MenuItem>
        <MenuItem onClick={handleDeleteTruck}>Delete track</MenuItem>
      </Menu>
      <InputDialog
        title="Edit Track Name"
        formType="EditTrackNameForm"
        isOpen={isTrackNameDialogVisible}
        setIsOpen={setIsTrackNameDialogVisible}
        trackId={optionTrackId || undefined}
      />
    </div>
  );
};

export default TrackBar;
