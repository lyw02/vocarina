import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import "../index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState } from "react";
import UserInfoPanel from "./UserInfoPanel";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfilePage = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [tabValue, setTabValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="auth-page-wrapper">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ width: "80vw", maxHeight: "80vh", margin: "auto" }}>
          <CardContent>
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0 1%",
              }}
            >
              <Typography gutterBottom variant="h6" component="div">
                {currentUser}
              </Typography>
              <Link to="/">
                <IconButton>
                  <HomeIcon />
                </IconButton>
              </Link>
            </span>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleChange}>
                  <Tab label="User Info" />
                  <Tab label="My Projects" />
                  <Tab label="My Musics" />
                  <Tab label="My Playlists" />
                </Tabs>
              </Box>
            </Box>
            <CustomTabPanel value={tabValue} index={0}>
              <UserInfoPanel />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              My Projects
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={2}>
              My Musics
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={3}>
              My Playlists
            </CustomTabPanel>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
