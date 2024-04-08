// import { Link } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { Box, Typography } from "@mui/material";

interface NavOption {
  name: string;
  path: string;
}

const navOptions: NavOption[] = [
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
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
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
        {!currentUser ? (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <div>Sign in</div>
          </Link>
        ) : (
          <Box component="div">
            <Typography
              variant="body2"
              sx={{ display: "flex", marginTop: "auto", color: "white" }}
            >
              {currentUser}
            </Typography>
          </Box>
        )}
      </span>
    </div>
  );
};

export default SiteHeader;
