import { NoteProps, RootState } from "@/types";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Theme,
  Tooltip,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LyricsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dividerList = ["Space", "New line", ",", ";", "/"];

export default function LyricsDialog({ isOpen, setIsOpen }: LyricsDialogProps) {
  const dispatch = useDispatch();
  const tracks = useSelector((state: RootState) => state.tracks.tracks);
  const currentTrackId = useSelector(
    (state: RootState) => state.tracks.currentTrack
  );
  const currentTrack = tracks.find((track) => track.trackId === currentTrackId);
  const currentTrackIndex = tracks.findIndex(
    (t) => t.trackId === currentTrack?.trackId
  );
  const notesInState = tracks[currentTrackIndex].sheet;
  const notes = _.cloneDeep(notesInState);

  useEffect(() => {
    // setSentences(currentTrack!.trackLyrics.map((s) => s));
  }, [currentTrackId]);

  const handleApply = () => {
    //   dispatch(setLyrics({ sentences: sentences, trackId: currentTrackId }));
    //   dispatch(setSheet({ trackId: currentTrackId, sheet: parseLyrics(notes) }));
    console.log("LYRICS:");
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const parseLyrics = (notes: NoteProps[]): NoteProps[] => {
    const notesCopy = _.cloneDeep(notes);
    const allLyrics = tracks[currentTrackIndex].trackLyrics.map(
      (s) => s.content
    );
    // sentences.forEach((s) => {
    //   allLyrics.push(s.content);
    // });
    const allLyricsStr = allLyrics
      .join(" ")
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Remove control characters
      .replace(/^\s+/, ""); // Remove leading spaces
    const allLyricsArray = allLyricsStr.split(/\s+/); // Split by any length space
    let length = Math.min(notesCopy.length, allLyricsArray.length);
    for (let i = 0; i < length; i++) {
      notesCopy[i].lyrics = allLyricsArray[i];
    }
    return notesCopy;
  };

  const theme = useTheme();
  const [dividers, setDividers] = useState<string[]>([
    dividerList[0],
    dividerList[1],
  ]);

  const handleDividersChange = (event: SelectChangeEvent<typeof dividers>) => {
    const {
      target: { value },
    } = event;
    setDividers(typeof value === "string" ? value.split(" ") : value);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{`Edit Lyrics for ${tracks[currentTrackIndex].trackName}`}</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <FormControl sx={{ mt: 1, mb: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Dividers</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={dividers}
              onChange={handleDividersChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              size="small"
            >
              {dividerList.map((divider, index) => (
                <MenuItem
                  key={divider}
                  value={divider}
                  disabled={index === 0 || index === 1}
                >
                  {divider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Dividers" placement="top">
            <HelpOutlineIcon sx={{ ml: 10 }} />
          </Tooltip>
        </Stack>
        <TextField
          id="filled-multiline-static"
          multiline
          rows={8}
          sx={{ width: "100%" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={() => handleApply()}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
