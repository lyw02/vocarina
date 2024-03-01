import * as React from "react";
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
import { useState } from "react";
import { Sentence } from "@/types/project";

interface LyricsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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

  const handleClose = () => {
    setIsOpen(false);
  };

  let maxID = sentences.reduce((max, sentence) => {
    return sentence.sentenceId > max ? sentence.sentenceId : max;
  }, 0);

  const handleRemoveSentence = (sentenceId: number) => {
    const sentencesCopy = [...sentences];
    if (sentencesCopy.length === 1) {
      sentencesCopy[0].content = "";
      setSentences(sentencesCopy);
      return;
    }
    const prev = sentencesCopy.find(
      (sentence) => sentence.nextSentenceId === sentenceId
    );
    if (prev && prev.nextSentenceId !== maxID) {
      prev.nextSentenceId = sentencesCopy.find(
        (sentence) => sentence.sentenceId === sentenceId
      )!.nextSentenceId;
    } else {
      prev!.nextSentenceId = null;
    }
    const filteredSentences = sentencesCopy.filter(
      (sentence) => sentence.sentenceId !== sentenceId
    );
    setSentences(filteredSentences);
  };

  const handleCreateSentence = (sentenceId: number) => {
    const newSentence: Sentence = {
      sentenceId: maxID + 1,
      nextSentenceId:
        sentences.find((sentence) => sentence.sentenceId === sentenceId)
          ?.sentenceId || null,
      content: "",
    };
    setSentences((prevSentences: Sentence[]) => [
      ...prevSentences,
      newSentence,
    ]);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit Lyrics</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            {sentences.map((sentence) => (
              <Stack direction="row" spacing="space-between">
                <TextField
                  defaultValue={sentence.content}
                  margin="dense"
                  id="name"
                  name="email"
                  label="Sentence"
                  variant="standard"
                  multiline
                />
                <Button
                  onClick={() => handleCreateSentence(sentence.sentenceId)}
                >
                  <AddIcon />
                </Button>
                <Button
                  onClick={() => handleRemoveSentence(sentence.sentenceId)}
                >
                  <DeleteForeverIcon />
                </Button>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Apply</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
