import { AddCircleOutlineRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import AutoDismissAlert from "../Alert/AutoDismissAlert";
import { useAlert } from "@/utils/CustomHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { savePlaylist } from "@/api/communityApi";

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
  const handleSavePlaylist = async () => {
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
      <Box sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1}>
          <img
            src={cover}
            loading="lazy"
            style={{ width: "60px", height: "60px" }}
          />
          <Stack direction="column" spacing={0}>
            <Typography variant="body1">{title}</Typography>
            {/* <Typography variant="caption">{count}{" songs"}</Typography> */}
            <Typography variant="caption">{description}</Typography>
          </Stack>
          {(currentUserId !== userId && showSaveButton) && (
            <Button onClick={handleSavePlaylist} sx={{ p: 0 }}>
              <AddCircleOutlineRounded />
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MyPlaylistItem;
