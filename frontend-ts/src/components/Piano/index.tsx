import { useState } from "react";
import { pianoKeys } from "@/utils/pianoKeys";
import classNames from "classnames";
import "./index.css"

const Piano = () => {
  const [keyMouseOverId, setKeyMouseOverId] = useState<number | null>(null);

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
                onMouseOver={() => setKeyMouseOverId(item.id)}
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
