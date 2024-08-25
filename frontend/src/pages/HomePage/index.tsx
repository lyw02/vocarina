import MusicPlayerBanner from "@/components/MusicPlayerBanner";
import SiteHeader from "@/components/SiteHeader";
import { Outlet } from "react-router";
import musicFile from "../../assets/igs.wav";
import { useAuth } from "@/utils/CustomHooks";

const HomePage = () => {
  useAuth()
  return (
    <div>
      <SiteHeader />
      <Outlet />
      {/* <MusicPlayerBanner
        title="Title"
        artist="Artist"
        coverUrl="https://images.unsplash.com/photo-1522770179533-24471fcdba45"
        audioUrl={musicFile}
      /> */}
    </div>
  );
};

export default HomePage;
