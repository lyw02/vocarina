import { useState } from "react";
import { pianoKeys } from "@/utils/PianoKeys";
import classNames from "classnames";
import "./index.css";
import { PianoKey } from "@/types";
import * as Tone from "tone";

const Piano = () => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [keyMouseOverId, setKeyMouseOverId] = useState<number | null>(null);

  const playKey = (key: PianoKey) => {
    !isMouseDown && setIsMouseDown(true);
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(
      /\d$/.test(key.name) ? key.name : key.name + key.octave,
      "8n"
    );
  };

  return (
    <div className="piano-wrapper">
      <ul className="piano-keys">
        {pianoKeys()
          .reverse()
          .map((item) => {
            return (
              <li
                key={item.id}
                className={classNames("key", item.color, {
                  "key-mouse-over": keyMouseOverId === item.id,
                })}
                onMouseDown={() => playKey(item)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseOver={() => {
                  isMouseDown && playKey(item);
                  setKeyMouseOverId(item.id);
                }}
                onMouseLeave={() => setKeyMouseOverId(null)}
              >
                <span className="key-name">{item.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Piano;
