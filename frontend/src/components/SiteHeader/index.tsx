import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
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
import { logout } from "@/api/supabaseAuthApi";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import theme from "@/theme";
import { cleanLoginInfo } from "@/store/modules/user";

const SiteHeader = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log("localStorage.getItem('token_key')", localStorage.getItem("token_key"))
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (!res.error) {
      console.log("Logout successfully");
      dispatch(cleanLoginInfo());
    } else {
      console.error(res.error);
    }
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
              onClick={() => console.log("localStorage.getItem('token_key')", localStorage.getItem("token_key") && !currentUser)}
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
          anchorEl={anchorElUser}
          id="account-menu"
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleCloseUserMenu();
            }}
          >
            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar />
                <Typography>
                  {currentUser?.user_metadata.display_name}
                </Typography>
              </Stack>
              <Typography color={theme.palette.grey[600]}>
                {currentUser?.email}
              </Typography>
            </Stack>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleLogout();
              handleCloseUserMenu();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Stack>
    </div>
  );
};

export default SiteHeader;
