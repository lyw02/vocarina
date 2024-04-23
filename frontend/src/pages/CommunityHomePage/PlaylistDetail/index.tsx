import { Card, CardHeader, List, Pagination, Typography } from "@mui/material";
import { card } from "../style";
import { useEffect, useState } from "react";
import MyMusicItem from "@/components/MyMusicItem";
import { useParams } from "react-router-dom";
import { getPlaylistDetail, getPlaylistMusic } from "@/api/communityApi";
import { getUserInfo } from "@/api/userApi";
import theme from "@/theme";
import { v4 as uuidv4 } from "uuid";

interface MyMusicItemProps {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

const PlaylistDetail = () => {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [creater, setCreater] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [musicItems, setMusicItems] = useState<MyMusicItemProps[]>([]);

  const { id: playlistId } = useParams();

  const fetchCreaterName = async (id: number) => {
    const res = await getUserInfo(id);
    const resJson = await res.json();
    return resJson.username;
    // setCreater(resJson.username);
  };
  const fetchPlaylistDetail = async (id: number) => {
    const res = await getPlaylistDetail(id);
    const resJson = await res.json();
    if (res.ok) {
      setCreater(await fetchCreaterName(resJson.user_id));
      setTitle(resJson.title);
      setDescription(resJson.description);
    }
  };
  const fetchPlaylistMusic = async (id: number, page: number) => {
    const res = await getPlaylistMusic(id, page);
    const resJson = await res.json();
    console.log("getPlaylistMusic: ", resJson);
    if (res.ok) {
      setTotalPages(resJson.total_pages);
      console.log("resJson.results: ", resJson.results);
      const musicItemsList = await Promise.all(
        resJson.results.map(
          async (item: MyMusicItemProps & { [key: string]: any }) => {
            const artist = await fetchCreaterName(item.user_id);
            return {
              id: item.id,
              title: item.title,
              artist: artist,
              cover: item.cover,
              src: item.audio_url,
            };
          }
        )
      );
      setMusicItems(musicItemsList);
      console.log("musicItems: ", musicItems);
    }
  };

  useEffect(() => {
    if (!playlistId) return;
    fetchPlaylistDetail(Number(playlistId));
    fetchPlaylistMusic(Number(playlistId), 1);
  }, []);

  const handleChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (!playlistId) return;
    await fetchPlaylistMusic(Number(playlistId), value);
    setPage(value);
  };

  return (
    <>
      <Card sx={[card, { height: "100%" }]}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="caption" color={theme.palette.primary.main}>
          {creater}
        </Typography>
        <Typography>{description}</Typography>
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
          {musicItems.reverse().map((item) => (
            <MyMusicItem
              key={uuidv4()}
              id={item.id}
              title={item.title}
              artist={item.artist}
              cover={item.cover}
              src={item.src}
            />
          ))}
          {/* <MyMusicItem /> */}
          {/* {commentItems.reverse().map((item) => {
            return (
              <ListItem key={uuidv4()}>
                <CommentItem
                  id={item.id}
                  userId={item.userId}
                  date={item.date}
                  content={item.content}
                  likeCount={item.likeCount}
                  isReply={item.isReply}
                />
                <Button
                  sx={{ p: 0, m: 0 }}
                  onClick={() => {
                    setTextfieldContent(
                      `Reply to comment "${
                        item.content.length >= 10
                          ? item.content.slice(0, 10) + "..."
                          : item.content
                      }": `
                    );
                    setSendReply(true);
                  }}
                >
                  {"Reply"}
                </Button>
              </ListItem>
            );
          })} */}
          {/* {commentItems.length === 0 && <Typography>{"No Data"}</Typography>} */}
        </List>
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

export default PlaylistDetail;
