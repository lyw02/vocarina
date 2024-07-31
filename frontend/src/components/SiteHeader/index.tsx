import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GitHubIcon from "@mui/icons-material/GitHub";

const SiteHeader = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  type tab = "Produce" | "Community";
  const [tab, setTab] = useState<tab>("Produce");
  const handleTabChange = (_e: React.SyntheticEvent, newValue: tab) => {
    setTab(newValue);
  };

  return (
    <div className="site-header-wrapper">
      <Toolbar disableGutters>
        <Box sx={{ width: "100%", padding: "0 2vw" }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="site header tabs"
          >
            <Tab
              value="Produce"
              label="Produce"
              onClick={() => navigate("/")}
            />
            <Tab
              value="Community"
              label="Community"
              onClick={() => navigate("/community")}
            />
          </Tabs>
        </Box>
      </Toolbar>
      <Stack direction="row">
        <Link to="https://github.com/lyw02/vocarina">
          <IconButton
            aria-label="github"
            size="medium"
            sx={{
              margin: "0 1vw 0 0",
              padding: 0,
              height: "50%",
              color: "white",
            }}
          >
            <GitHubIcon
              sx={{ width: "25px", height: "25px", padding: 0, margin: 0 }}
            />
          </IconButton>
        </Link>
        {currentUser ? (
          <IconButton
            aria-label="user"
            size="medium"
            onClick={handleOpenUserMenu}
            sx={{
              margin: "0 2vw 0 0",
              padding: 0,
              height: "50%",
              color: "white",
            }}
          >
            <AccountCircleIcon
              sx={{ width: "30px", height: "30px", padding: 0, margin: 0 }}
            />
          </IconButton>
        ) : (
          <Link to="/register">
            <IconButton
              aria-label="user"
              size="medium"
              sx={{
                margin: "0 2vw 0 0",
                padding: 0,
                height: "50%",
                color: "white",
              }}
            >
              <AccountCircleIcon
                sx={{ width: "30px", height: "30px", padding: 0, margin: 0 }}
              />
            </IconButton>
          </Link>
        )}
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem disabled>
            <Typography textAlign="center">{currentUser}</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleCloseUserMenu();
            }}
          >
            <Typography textAlign="center">{"Profile"}</Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{"Logout"}</Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </div>
  );
};

export default SiteHeader;
