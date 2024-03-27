import ParameterBar from "@/components/ParameterBar";
import PianoRoll from "@/components/PianoRoll";
import Toolbar from "@/components/Toolbar";
import TrackBar from "@/components/TrackBar";
import { RootState } from "@/types";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const ProducePage = () => {
  let base64Data = useSelector((state: RootState) => state.projectAudio.base64)
  console.log("Get base64: ", base64Data)
  return (
    <Fragment key={base64Data}>
      <audio controls>
        <source src={`data:audio/wav;base64,${base64Data}`} type="audio/wav" />
      </audio>
      <Toolbar />
      <TrackBar />
      <ParameterBar />
      <PianoRoll />
    </Fragment>
  );
};

export default ProducePage;
