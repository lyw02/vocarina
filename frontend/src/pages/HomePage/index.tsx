import MusicPlayerBanner from "@/components/MusicPlayerBanner";
import SiteHeader from "@/components/SiteHeader";
import { Outlet } from "react-router";
import musicFile from "../../assets/igs.wav";
import { useAuth } from "@/utils/CustomHooks";
import { Box, CircularProgress } from "@mui/material";

const HomePage = () => {
  const isLoading = useAuth();
  return (
    <>
      {isLoading ? (
        <Box sx={{ width: "100%", height: "100%" }}>
          <CircularProgress sx={{ display: "flex", m: "auto", mt: "30%" }} />
        </Box>
      ) : (
        <>
          <SiteHeader />
          <Outlet />
          {/* <MusicPlayerBanner
            title="Title"
            artist="Artist"
            coverUrl="https://images.unsplash.com/photo-1522770179533-24471fcdba45"
            audioUrl={musicFile}
          /> */}
        </>
      )}
    </>
  );
};

export default HomePage;
