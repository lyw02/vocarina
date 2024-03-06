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
import { RootState } from "@/types";
import { Sentence } from "@/types/project";
import { setLyrics } from "@/store/modules/tracks";

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
    console.log("remove, id: ", sentenceId);
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
    console.log("create, id: ", sentenceId);
    let sentencesCopy = sentences.map((sentence) => ({ ...sentence }));
    console.log("start, sentencesCopy: ", sentencesCopy);
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
      console.log("end, sentences: ", sentences);
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
                label={`Sentence ${sentence.sentenceId}`}
                variant="standard"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  console.log("e.target.id: ", e.target.id);
                  const newSentences = sentences.map((s) => {
                    if (s.sentenceId === parseInt(e.target.id)) {
                      return {
                        ...s,
                        content: e.target.value,
                      };
                    }
                    return s;
                  });
                  console.log(JSON.stringify(newSentences));
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

  const [sentences, setSentences] = useState<Sentence[]>(
    currentTrack!.trackLyrics
  );

  useEffect(() => {
    console.log("init sentences: ", sentences);
    setSentences(sortSentences(sentences));
  }, [sentences]);

  const handleApply = () => {
    console.log("sentences in dispatch: ", sentences);
    dispatch(setLyrics({ sentences: sentences, trackId: currentTrackId }));
    // sentences.map((s) => {})
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} sx={{}}>
      <DialogTitle>Edit Lyrics</DialogTitle>
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
