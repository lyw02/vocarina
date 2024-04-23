import {
  Card,
  IconButton,
  List,
  ListItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { card } from "../style";
import CommentItem from "@/components/CommentItem";
import { createMusicComment, getMusicCommentlist } from "@/api/communityApi";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { useAlert } from "@/utils/CustomHooks";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import { v4 as uuidv4 } from "uuid";

interface CommentResProps {
  content: string;
  id: number;
  last_update: string;
  like_count: number;
  music_id: number;
  post_time: string;
  status: number;
  user_id: number;
}

interface CommentItemProps {
  userId: number;
  date: string;
  content: string;
  likeCount: number;
  isReply: boolean;
  replyTo?: string;
}

const CommentList = () => {
  const { id: musicId } = useParams();
  const [commentList, setCommentList] = useState<CommentResProps[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [textfieldContent, setTextfieldContent] = useState<string>("");
  const [_rerenderTrigger, setRerenderTrigger] = useState<boolean>(false);

  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );
  const { isAlertOpen, alertStatus, handleAlertClose, raiseAlert } = useAlert();

  const fetchCommentData = async (page: number) => {
    if (!musicId) return;
    const res = await getMusicCommentlist(Number(musicId), page);
    const resJson = await res.json();
    console.log("playlistList: ", resJson);
    setCommentList(resJson.results);
    setTotalPages(resJson.total_pages);
  };

  const handleChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    await fetchCommentData(value);
    setPage(value);
  };

  useEffect(() => {
    (async () => await fetchCommentData(1))();
  }, []);

  const commentItems: CommentItemProps[] = commentList.map(
    (c: CommentResProps) => {
      return {
        userId: c.user_id,
        date: c.post_time.slice(0, 10),
        content: c.content,
        likeCount: c.like_count,
        isReply: false,
      };
    }
  );

  const handleNewComment = async () => {
    if (!musicId) return;
    if (!currentUserId) {
      raiseAlert("error", "Please sign in first");
      return;
    }
    const res = await createMusicComment(
      Number(musicId),
      currentUserId,
      textfieldContent
    );
    if (res.status === 201) {
      raiseAlert("success", "Success");
      setRerenderTrigger((prev) => !prev);
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
      <Card sx={[card, { height: "100%" }]}>
        <List
          sx={{
            width: "100%",
            position: "relative",
            overflow: "auto",
            maxHeight: 500,
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {commentItems.reverse().map((item) => {
            return (
              <ListItem key={uuidv4()}>
                <CommentItem
                  userId={item.userId}
                  date={item.date}
                  content={item.content}
                  likeCount={item.likeCount}
                  isReply={item.isReply}
                />
              </ListItem>
            );
          })}
          {commentItems.length === 0 && <Typography>{"No Data"}</Typography>}
        </List>
        <ListItem>
          <TextField
            placeholder="Leave your comment"
            multiline
            onChange={(e) => setTextfieldContent(e.target.value)}
            sx={{ width: "50%", mr: 1 }}
          />
          <IconButton onClick={handleNewComment}>
            <SendIcon />
          </IconButton>
        </ListItem>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          variant="outlined"
          size="small"
          color="primary"
          showFirstButton
          showLastButton
        />
      </Card>
    </>
  );
};

export default CommentList;
