interface AudioContainerProps {
  audioSrc: string;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContainer = ({ audioRef, audioSrc }: AudioContainerProps) => {   
  return (
    <>
      <audio ref={audioRef} src={audioSrc} />
    </>
  );
};

export default AudioContainer;
