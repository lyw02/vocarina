import "./index.css";

const Toolbar = () => {
  const handleEditLyrics = (isEdit: boolean) => {};
  const handleGenerate = () => {};
  return (
    <div className="toolbar-wrapper">
      <span
        className="button add-lyrics-button"
        onClick={() => handleEditLyrics(true)}
      >
        Edit lyrics
      </span>
      <span className="button generate-button" onClick={handleGenerate}>
        Generate
      </span>
    </div>
  );
};

export default Toolbar;
