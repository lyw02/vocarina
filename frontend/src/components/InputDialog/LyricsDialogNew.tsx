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
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSheet, setTrackRawLyrics } from "@/store/modules/tracks";

interface LyricsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dividerList = [
  "Space",
  "New line",
  ", (Half-width 半角)",
  "; (Half-width 半角)",
  ". (Half-width 半角)",
  "， (Full-width 全角)",
  "； (Full-width 全角)",
  "。 (Full-width 全角)",
  "/",
];

function isChineseCharacter(char: string) {
  const chineseRegex =
    /[\u4e00-\u9fa5\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}]/u;
  return chineseRegex.test(char);
}

export default function LyricsDialog({ isOpen, setIsOpen }: LyricsDialogProps) {
  const [dividers, setDividers] = useState<string[]>([
    dividerList[0],
    dividerList[1],
  ]);
  const [rawLyrics, setRawLyrics] = useState<string>("");
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
    setRawLyrics(currentTrack?.rawLyrics || "")
  }, [currentTrack])

  const handleApply = () => {
    dispatch(setSheet({ trackId: currentTrackId, sheet: parseLyrics(notes) }));
    dispatch(setTrackRawLyrics({trackId: currentTrack?.trackId, rawLyrics: rawLyrics}))
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  /**
   * Split `lyricsRaw`, and set into `store/tracks.track.sheet`
   * Split rules:
   * * Split after each Chinese character
   * * Split by given `dividerList`
   * @param notes 
   * @returns 
   */
  const parseLyrics = (notes: NoteProps[]): NoteProps[] => {
    const notesCopy = _.cloneDeep(notes);
    const dividerReg = new RegExp(
      `[${dividers
        .join()
        .replace("Space", " ")
        .replace("New line", "\n")
        .replace(", (Half-width 半角)", ", ")
        .replace("; (Half-width 半角)", "; ")
        .replace(". (Half-width 半角)", ". ")
        .replace("， (Full-width 全角)", "，")
        .replace("； (Full-width 全角)", "；")
        .replace("。 (Full-width 全角)", "。")
        .replace("\\", "/")}]`
    );
    const divided = [];
    let buffer = "";

    for (let i = 0; i < rawLyrics.length; i++) {
      const char = rawLyrics[i];
      if (isChineseCharacter(char)) {
        // If `char` is a Chinese character:
        // 1. Add `buffer` into array, and clear `buffer`
        if (buffer) {
          divided.push(buffer);
          buffer = "";
        }
        // 2. Add Chinese character into array
        divided.push(char);
      } else if (dividerReg.test(char)) {
        // If char is a divider, add `buffer` into array, and clear `buffer`
        if (buffer) {
          divided.push(buffer);
          buffer = "";
        }
      } else {
        // If char is neither Chinese character nor divider, add into `buffer`
        buffer += char;
      }
    }

    // Add remained `buffer` into array
    if (buffer) {
      divided.push(buffer);
    }

    let length = Math.min(notesCopy.length, divided.length);
    for (let i = 0; i < length; i++) {
      notesCopy[i].lyrics = divided[i];
    }

    return notesCopy;
  };

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
          value={rawLyrics}
          onChange={(e) => setRawLyrics(e.target.value)}
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
