import React, { forwardRef } from "react";

const AudioPlayer = forwardRef((props, ref) => {
  return (
    <div>
      <audio className="audio-player" ref={ref} controls />
    </div>
  );
})

export default AudioPlayer;
