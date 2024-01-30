import ParameterBar from "@/components/ParameterBar";
import PianoRoll from "@/components/PianoRoll";
import Toolbar from "@/components/Toolbar";
import { Fragment } from "react";

const ProducePage = () => {
  return (
    <Fragment>
      <Toolbar />
      <ParameterBar />
      <PianoRoll />
    </Fragment>
  );
};

export default ProducePage;
