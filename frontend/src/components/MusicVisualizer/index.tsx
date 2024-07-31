import { useEffect, useRef } from "react";

interface MusicVisualizerProps {
  audioElement: HTMLAudioElement | null;
}

const MusicVisualizer = ({ audioElement }: MusicVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  const bufferLength = 256;
  let dataArray: Uint8Array;

  useEffect(() => {
    if (!audioElement) return;

    audioContext = new window.AudioContext();
    analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audioElement);

    // Connect source node to analyser
    audioSource.connect(analyser);
    // Connect analyser to destination (loudspeaker)
    analyser.connect(audioContext.destination);
    // Analyser params
    analyser.fftSize = 512;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    drawVisualizer();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioElement]);

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      const drawVisual = requestAnimationFrame(draw);
      analyser?.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        ctx.fillStyle = "rgb(" + (barHeight + 100) + ", 105, 180)";
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={100}></canvas>
    </div>
  );
};

export default MusicVisualizer;
