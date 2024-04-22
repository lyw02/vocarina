import { AddCircleOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AutoDismissAlert from "../Alert/AutoDismissAlert";
import { useAlert } from "@/utils/CustomHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { savePlaylist } from "@/api/communityApi";
import theme from "@/theme";
import { useNavigate } from "react-router";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";

interface MyPlaylistItemProps {
  id: number;
  userId: number;
  title: string;
  count?: number;
  cover: string;
  description?: string;
  showSaveButton: boolean;
}

const MyPlaylistItem = ({
  id,
  userId,
  title,
  count,
  cover,
  description,
  showSaveButton,
}: MyPlaylistItemProps) => {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );
  const { isAlertOpen, alertStatus, handleAlertClose, raiseAlert } = useAlert();
  const navigate = useNavigate();
  const handleSavePlaylist = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!currentUserId) {
      raiseAlert("error", "Please sign in first");
      return;
    }
    const res = await savePlaylist(currentUserId, id);
    // const resJson = await res.json();
    if (res.status === 201) {
      raiseAlert("success", "Success");
    } else {
      raiseAlert("error", "Failed");
    }
  };
  return (
    <>
      <AutoDismissAlert
        isAlertOpen={isAlertOpen}
        handleAlertClose={handleAlertClose}
        message={alertStatus.message}
        severity={alertStatus.severity}
      />
      <Box
        onClick={() => navigate(`/community/playlist/${id}/comments`)}
        sx={{
          width: "100%",
          "&:hover": {
            backgroundColor: theme.palette.grey[200],
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <img
            src={cover}
            loading="lazy"
            style={{ width: "60px", height: "60px" }}
          />
          <Stack direction="column" spacing={0}>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="caption">{description}</Typography>
          </Stack>
          {currentUserId !== userId && showSaveButton && (
            <Button onClick={(e) => handleSavePlaylist(e)}>
              <AddCircleOutlineRounded />
            </Button>
          )}
          {/* <Link to={`/community/music/${id}/comments`}>
            <Button>
              <CommentIcon />
            </Button>
          </Link> */}
        </Stack>
      </Box>
    </>
  );
};

export default MyPlaylistItem;
