import { Button, IconButton, Stack, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import theme from "@/theme";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/api/userApi";

interface CommentItemProps {
  userId: number;
  date: string;
  content: string;
  likeCount: number;
  isReply: boolean;
  replyTo?: string;
}

const CommentItem = ({
  userId,
  date,
  content,
  likeCount,
  isReply,
  replyTo,
}: CommentItemProps) => {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const fetchUsername = async (id: number) => {
      const res = await getUserInfo(id);
      const resJson = await res.json();
      setUsername(resJson.username);
    };
    fetchUsername(userId);
  }, []);
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
          {username}
        </Typography>
        <Typography variant="caption">{date}</Typography>
      </Stack>
      <Typography>
        {isReply && "Reply to @" + { replyTo } + ": "}
        {content}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton size="small" sx={{ mr: 0 }}>
          <ThumbUpIcon />
        </IconButton>
        <Typography sx={{ ml: 0 }}>{likeCount}</Typography>
        <Button sx={{ p: 0, m: 0 }}>{"Reply"}</Button>
      </Stack>
    </div>
  );
};

export default CommentItem;
