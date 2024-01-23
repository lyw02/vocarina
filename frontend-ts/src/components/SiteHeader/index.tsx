// import { Link } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import "./index.css";

interface navOption {
  name: string;
  path: string;
}

const navOptions: navOption[] = [
  {
    name: "Produce",
    path: "/",
  },
  {
    name: "Community",
    path: "/community",
  },
];

const SiteHeader = () => {
  const [currentOption, setCurrentOption] = useState<string>("/");
  return (
    <div className="site-header-wrapper">
      <span className="options">
        <ul className="optionButtons">
          {navOptions.map((item) => {
            return (
              <Link
                className="link"
                to={item.path}
                replace
                key={item.path}
                onClick={() => setCurrentOption(item.path)}
              >
                <li
                  className={classnames("optionButton", {
                    selected: currentOption === item.path,
                  })}
                >
                  {item.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </span>
      <span className="userInfo">
        {/* <Link to="/" style={{ textDecoration: "none" }}> */}
        <div>Sign in</div>
        {/* </Link> */}
      </span>
    </div>
  );
};

export default SiteHeader;
