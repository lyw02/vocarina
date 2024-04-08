import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { NoteProps, RootState } from "@/types";
import { Sentence } from "@/types/project";
import { setLyrics, setSheet } from "@/store/modules/tracks";
import _ from "lodash";

interface SentenceListProps {
  sentences: Sentence[];
  setSentences: React.Dispatch<React.SetStateAction<Sentence[]>>;
}

interface LyricsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sortSentences = (sentences: Sentence[]) => {
  sentences.sort((a, b) => {
    if (a.order === null) return 1;
    if (b.order === null) return -1;
    return a.order - b.order; // Sort by order
  });
  return sentences;
};

const SentenceList = ({ sentences, setSentences }: SentenceListProps) => {
  let maxID = sentences.reduce((max, sentence) => {
    return sentence.sentenceId > max ? sentence.sentenceId : max;
  }, 0);

  const handleRemoveSentence = (sentenceId: number) => {
    let sentencesCopy = sentences.map((sentence) => ({ ...sentence }));
    if (sentencesCopy.length === 1) {
      return;
    }
    let prev = sentencesCopy.find(
      (sentence) => sentence.nextSentenceId === sentenceId
    );
    let current = sentencesCopy.find(
      (sentence) => sentence.sentenceId === sentenceId
    );
    if (prev && current) {
      prev = {
        ...prev,
        nextSentenceId: current.nextSentenceId,
      };
      let filteredSentences = sentencesCopy.filter(
        (sentence) => sentence.sentenceId !== sentenceId
      );
      let newSentences: Sentence[] = filteredSentences.map((sentence) => {
        if (prev && sentence.sentenceId === prev.sentenceId) {
          return prev;
        } else {
          return sentence;
        }
      });
      setSentences(sortSentences(newSentences));
    } else if (current) {
      let newSentences: Sentence[] = sentencesCopy.slice(
        1,
        sentencesCopy.length
      );
      setSentences(sortSentences(newSentences));
    }
  };

  const handleCreateSentence = (sentenceId: number) => {
    let sentencesCopy = sentences.map((sentence) => ({ ...sentence }));
    let current = sentencesCopy.find(
      (sentence) => sentence.sentenceId === sentenceId
    );
    let next = sentencesCopy.find(
      (sentence) => sentence.sentenceId === current?.nextSentenceId
    );
    if (current) {
      if (next) {
        for (let s of sentencesCopy) {
          if (s.order > current.order) s.order += 1;
        }
      }
      let newSentence = {
        sentenceId: maxID + 1,
        nextSentenceId: current.nextSentenceId ? current.nextSentenceId : null,
        order: current.order + 1,
        content: "",
      };
      sentencesCopy[
        sentencesCopy.findIndex((s) => s.sentenceId === sentenceId)
      ].nextSentenceId = newSentence.sentenceId; // Update current's next id
      const newSentences = sortSentences([...sentencesCopy, newSentence]);
      setSentences(newSentences);
    }
  };

  return (
    <ul>
      {sentences.map((sentence) => {
        return (
          <li key={sentence.sentenceId} style={{ listStyle: "none" }}>
            <Stack direction="row" spacing="space-between">
              <TextField
                defaultValue={sentence.content}
                margin="dense"
                id={sentence.sentenceId.toString()}
                label={`Sentence`}
                variant="standard"
                sx={{ width: "50vh" }}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  const newSentences = sentences.map((s) => {
                    if (s.sentenceId === parseInt(e.target.id)) {
                      return {
                        ...s,
                        content: e.target.value,
                      };
                    }
                    return s;
                  });
                  setSentences(newSentences);
                }}
                multiline
              />
              <Button onClick={() => handleCreateSentence(sentence.sentenceId)}>
                <AddIcon />
              </Button>
              <Button onClick={() => handleRemoveSentence(sentence.sentenceId)}>
                <DeleteForeverIcon />
              </Button>
            </Stack>
          </li>
        );
      })}
    </ul>
  );
};

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

  const [sentences, setSentences] = useState<Sentence[]>(
    currentTrack!.trackLyrics
  );

  useEffect(() => {
    setSentences(currentTrack!.trackLyrics.map((s) => s));
  }, [currentTrackId]);

  useEffect(() => {
    setSentences(sortSentences(sentences));
  }, [sentences]);

  const handleApply = () => {
    dispatch(setLyrics({ sentences: sentences, trackId: currentTrackId }));
    dispatch(setSheet({ trackId: currentTrackId, sheet: parseLyrics(notes) }));
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
    sentences.forEach((s) => {
      allLyrics.push(s.content);
    });
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

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{`Edit Lyrics for ${tracks[currentTrackIndex].trackName}`}</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <SentenceList sentences={sentences} setSentences={setSentences} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={() => handleApply()}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
