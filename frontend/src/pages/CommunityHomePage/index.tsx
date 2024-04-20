import { ReactNode, SyntheticEvent, useState } from "react";
// import SwipeableViews from "react-swipeable-views";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { container, card } from "./style";
import MyPlaylist from "@/components/MyPlaylist";
import MyMusic from "@/components/MyMusic";
import { Outlet } from "react-router-dom";
import MusicPlayerBanner from "@/components/MusicPlayerBanner";
import { RootState } from "@/types";
import { useSelector } from "react-redux";

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const CommunityHomePage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);
  const [tabPanelIndex, setTabPanelIndex] = useState<number>(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangeTabPanelIndex = (index: number) => {
    setTabValue(index);
  };

  const isPlaying = useSelector(
    (state: RootState) => state.musicPanel.isPlaying
  );
  const title = useSelector((state: RootState) => state.musicPanel.title);
  const artist = useSelector((state: RootState) => state.musicPanel.artist);
  const mudicSrc = useSelector((state: RootState) => state.musicPanel.src);

  return (
    <>
      {isPlaying && mudicSrc !== null && (
        <MusicPlayerBanner title={title} artist={artist} audioUrl={mudicSrc} />
      )}
      <Stack direction="row" spacing={2} sx={{ margin: "20px" }}>
        <Stack direction="column" spacing={2} sx={{ width: "25vw" }}>
          <Card sx={card}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton aria-label="home" size="small">
                <HomeIcon />
              </IconButton>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField label="Search" size="small" variant="outlined" />
              </Box>
            </Stack>
          </Card>
          <Card sx={card}>
            <Box sx={{ width: "100%" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="My Music/Playlist tab"
              >
                <Tab value={0} label="My Music" />
                <Tab value={1} label="My Playlist" />
              </Tabs>
              <TabPanel value={tabValue} index={0} dir={theme.direction}>
                {/* <MyMusic /> */}
              </TabPanel>
              <TabPanel value={tabValue} index={1} dir={theme.direction}>
                <MyPlaylist />
              </TabPanel>
            </Box>
          </Card>
        </Stack>
        <Box sx={{ width: "100%" }}>
          <Outlet />
        </Box>
      </Stack>
    </>
  );
};

export default CommunityHomePage;
