import { pianoKeys } from '@/utils/pianoKeys'
import classNames from "classnames";
import "./index.css"

const ComposeArea = () => {
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
  )
}

export default ComposeArea