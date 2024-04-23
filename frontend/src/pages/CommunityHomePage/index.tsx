import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
// import SwipeableViews from "react-swipeable-views";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Pagination,
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
import { Link, Outlet } from "react-router-dom";
import MusicPlayerBanner from "@/components/MusicPlayerBanner";
import { RootState } from "@/types";
import { useSelector } from "react-redux";
import { MusicResponse } from "@/types/community";
import { getAllMusicOfUser, getAllPlaylists } from "@/api/communityApi";

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
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );
  const [tabValue, setTabValue] = useState<number>(0);
  const [tabPanelIndex, setTabPanelIndex] = useState<number>(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangeTabPanelIndex = (index: number) => {
    setTabValue(index);
  };

  const isPanelOpen = useSelector(
    (state: RootState) => state.musicPanel.isPanelOpen
  );
  const panelMusicId = useSelector(
    (state: RootState) => state.musicPanel.musicId
  );
  const panelTitle = useSelector((state: RootState) => state.musicPanel.title);
  const panelArtist = useSelector(
    (state: RootState) => state.musicPanel.artist
  );
  const panelMusicSrc = useSelector((state: RootState) => state.musicPanel.src);

  // My Music List
  const [musicList, setMusicList] = useState<MusicResponse[]>([]);
  const [totalPagesMusic, setTotalPagesMusic] = useState<number>(1);
  const [pageMusic, setPageMusic] = useState<number>(1);

  const fetchMusicData = async (page: number) => {
    if (!currentUserId) return;
    const res = await getAllMusicOfUser(currentUserId, page);
    const resJson = await res.json();
    console.log(resJson);
    setMusicList(resJson.results);
    setTotalPagesMusic(resJson.total_pages);
  };

  useEffect(() => {
    (async () => await fetchMusicData(1))();
  }, []);

  const handleMyMusicPageChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    await fetchMusicData(value);
    setPageMusic(value);
  };

  const musicListRes = musicList.map((m) => {
    return {
      id: m.id,
      title: m.title,
      artist: m.username,
      src: m.url,
      cover:` https://picsum.photos/seed/${m.title}/200`,
    };
  });

  return (
    <>
      {isPanelOpen && panelMusicId && panelMusicSrc !== null && (
        <MusicPlayerBanner
          id={panelMusicId}
          title={panelTitle}
          artist={panelArtist}
          audioUrl={panelMusicSrc}
        />
      )}
      <Stack direction="row" spacing={2} sx={{ margin: "20px" }}>
        <Stack direction="column" spacing={2} sx={{ width: "25vw" }}>
          <Card sx={card}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton aria-label="home" size="small">
                <HomeIcon />
              </IconButton>
              <Box>
                <Link to="/community/music">
                  <Button>
                    <Typography>{"Music"}</Typography>
                  </Button>
                </Link>
                <Link to="/community/playlist">
                  <Button>
                    <Typography>{"Playlist"}</Typography>
                  </Button>
                </Link>
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
                {currentUserId ? (
                  <>
                    <MyMusic musicList={musicListRes} />
                    <Pagination
                      count={totalPagesMusic}
                      page={pageMusic}
                      onChange={handleMyMusicPageChange}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  </>
                ) : (
                  <Link to="/login">
                    <Button>
                      <Typography color={theme.palette.grey[500]}>
                        {"Sign in"}
                      </Typography>
                    </Button>
                  </Link>
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={1} dir={theme.direction}>
                {currentUserId ? (
                  <MyPlaylist />
                ) : (
                  <Link to="/login">
                    <Button>
                      <Typography color={theme.palette.grey[500]}>
                        {"Sign in"}
                      </Typography>
                    </Button>
                  </Link>
                )}
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
