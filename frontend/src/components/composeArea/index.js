import "./index.css";
import { pianoKeys } from "../../utils/pianoKeys.js";
import classNames from "classnames";

function ComposeArea() {
  return (
    <div className="compose-area-wrapper">
      <ul className="compose-area-rows">
        {pianoKeys()
          .reverse()
          .map((item) => {
            return (
              <li
                key={item.id}
                className={classNames("key-row", item.color)}
              ></li>
            );
          })}
      </ul>
    </div>
  );
}

export default ComposeArea;
