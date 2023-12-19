import React from "react";

export default function AudioPlayer() {
  return (
    <div>
      <audio className="audio-player" controls>
        <source src="C:\\Users\\JERRY\\Desktop\\sampleMusic\\final_audio.wav" type="audio/wav" />
      </audio>
    </div>
  );
}
