import { useState } from "react";
import "./index.css";
import classNames from "classnames";
import { pianoKeys } from "../../utils/pianoKeys.js";

function Piano() {
  const [keyMouseOverId, setKeyMouseOverId] = useState();
  const handleKeyMouseOver = (keyId) => {
    console.log(keyId);
    setKeyMouseOverId(keyId);
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
                // className={`key ${item.color} ${keyMouseOverId === item.id && 'key-mouse-over'}`}
                className={classNames("key", item.color, {
                  "key-mouse-over": keyMouseOverId === item.id,
                })}
                onMouseOver={() => handleKeyMouseOver(item.id)}
                onMouseLeave={() => handleKeyMouseOver()}
              >
                <span className="key-name">{item.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Piano;
