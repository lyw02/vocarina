import MusicPlayerBanner from "@/components/MusicPlayerBanner";
import SiteHeader from "@/components/SiteHeader";
import { Outlet } from "react-router";
import musicFile from "../../assets/igs.wav";

const HomePage = () => {
  return (
    <div>
      <SiteHeader />
      <Outlet />
      <MusicPlayerBanner
        title="Title"
        artist="Artist"
        cover_url="https://images.unsplash.com/photo-1522770179533-24471fcdba45"
        audio_url={musicFile}
      />
    </div>
  );
};

export default HomePage;
