import LoginPage from "@/pages/AuthPages/LoginPage";
import ProfilePage from "@/pages/AuthPages/ProfilePage";
import RegisterPage from "@/pages/AuthPages/RegisterPage";
import CommunityHomePage from "@/pages/CommunityHomePage";
import BrowseMusicList from "@/pages/CommunityHomePage/BrowseMusicList";
import HomePage from "@/pages/HomePage";
import ProducePage from "@/pages/ProducePage";
import { Navigate, createBrowserRouter } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("token_key");
  return token !== null;
};

const ProtectedRoute = (element: JSX.Element) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" />
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: <ProducePage />,
      },
      {
        path: "community",
        element: <CommunityHomePage />,
        children: [
          {
            path: "",
            element: <BrowseMusicList />
          },
          {
            path: "music",
            element: <BrowseMusicList />
          },
          {
            path: "playlist",
            element: <div>Browse playlists</div>
          },
        ]
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/profile",
    // element: <ProfilePage />,
    element: ProtectedRoute(<ProfilePage />),
  },
]);

export default router;
