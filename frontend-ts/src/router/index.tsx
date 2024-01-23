import CommunityHomePage from "@/pages/CommunityHomePage";
import HomePage from "@/pages/HomePage";
import ProducePage from "@/pages/ProducePage";
import { createBrowserRouter } from "react-router-dom";

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
      },
    ],
  },
]);

export default router;
