import { Fragment, LegacyRef, forwardRef } from "react";

interface AudioContainerProps {
  base64Data: string;
  display: "none" | "block";
}

const AudioContainer = forwardRef(
  (props: AudioContainerProps, ref: LegacyRef<HTMLAudioElement>) => {
    const { base64Data, display } = props;
    return (
      <Fragment key={base64Data}>
        <audio ref={ref} style={{ display: display }} controls>
          <source
            src={`data:audio/wav;base64,${base64Data}`}
            type="audio/wav"
          />
        </audio>
      </Fragment>
    );
  }
);

export default AudioContainer;
