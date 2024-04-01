import ParameterBar from "@/components/ParameterBar";
import PianoRoll from "@/components/PianoRoll";
import Toolbar from "@/components/Toolbar";
import TrackBar from "@/components/TrackBar";
import { Fragment } from "react";

const ProducePage = () => {
  return (
    <Fragment>
      <Toolbar />
      <TrackBar />
      <ParameterBar />
      <PianoRoll />
    </Fragment>
  );
};

export default ProducePage;
