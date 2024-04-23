import { Button, Collapse, IconButton, Stack, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import theme from "@/theme";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/api/userApi";
import { getCommentLikeStatus, likeComment } from "@/api/communityApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import AutoDismissAlert from "../Alert/AutoDismissAlert";
import { useAlert } from "@/utils/CustomHooks";

interface CommentItemProps {
  id: number;
  userId: number;
  date: string;
  content: string;
  likeCount: number;
  isReply: boolean;
  replyTo?: string;
}

const CommentItem = ({
  id,
  userId,
  date,
  content,
  //   likeCount,
  isReply,
  replyTo,
}: CommentItemProps) => {
  const { id: musicId } = useParams();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );
  const { isAlertOpen, alertStatus, handleAlertClose, raiseAlert } = useAlert();
  const [username, setUsername] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (!musicId) return;
    if (!currentUserId) return;
    const fetchUsername = async (userId: number) => {
      const res = await getUserInfo(userId);
      const resJson = await res.json();
      setUsername(resJson.username);
    };
    const fetchLike = async (
      musicId: number,
      commentId: number,
      userId: number
    ) => {
      const res = await getCommentLikeStatus(musicId, commentId, userId);
      const resJson = await res.json();
      setIsLiked(resJson.is_liked);
      setLikeCount(resJson.likes_count);
    };
    fetchUsername(userId);
    fetchLike(Number(musicId), id, currentUserId);
  }, []);

  const handleLike = async () => {
    if (!musicId) return;
    if (!currentUserId) {
      raiseAlert("error", "Please sign in first");
      return;
    }
    const res = await likeComment(Number(musicId), id, currentUserId);
    if (res.status === 201) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
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
      <Stack direction="column" sx={{ maxWidth: "50%" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="body1"
            sx={{ color: theme.palette.primary.main }}
          >
            {username}
          </Typography>
          <Typography variant="caption">{date}</Typography>
        </Stack>
        <Typography>
          {isReply && "Reply to @" + { replyTo } + ": "}
          {content}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="small"
            sx={{
              mr: 0,
              color: isLiked
                ? theme.palette.primary.main
                : theme.palette.grey[400],
            }}
            onClick={handleLike}
          >
            <ThumbUpIcon />
          </IconButton>
          <Typography sx={{ ml: 0 }}>{likeCount}</Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default CommentItem;
