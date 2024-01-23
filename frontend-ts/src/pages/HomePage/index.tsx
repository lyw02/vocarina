import SiteHeader from "@/components/SiteHeader";
import { Outlet } from "react-router";

const HomePage = () => {
  return (
    <div>
      <SiteHeader />
      <Outlet />
    </div>
  );
};

export default HomePage;
