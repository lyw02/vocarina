import { Button, Stack } from "@mui/material";
import "./index.css";

const Toolbar = () => {
  const handleEditLyrics = (isEdit: boolean) => {};
  const handleGenerate = () => {};
  return (
    <div className="toolbar-wrapper">
      {/* <span
        className="button add-lyrics-button"
        onClick={() => handleEditLyrics(true)}
      >
        Edit lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span> */}
      <Stack spacing={2} direction="row">
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEditLyrics(true)}
        >
          Edit Lyrics
        </Button>
        <Button variant="contained" size="small">
          Generate
        </Button>
      </Stack>
    </div>
  );
};

export default Toolbar;
