import { getAllPlaylists } from "@/api/communityApi";
import { useEffect, useState } from "react";
import { card } from "../style";
import { Card, List, ListItem, Pagination } from "@mui/material";
import MyPlaylistItem from "@/components/MyPlaylistItem";
import { it } from "node:test";

const BrowsePlaylistList = () => {
  const [playlistList, setPlaylistList] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const fetchPlaylistData = async (page: number) => {
    const res = await getAllPlaylists(page);
    const resJson = await res.json();
    console.log("playlistList: ", resJson);
    setPlaylistList(resJson.results);
    setTotalPages(resJson.total_pages);
  };

  const handleChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    await fetchPlaylistData(value);
    setPage(value);
  };

  useEffect(() => {
    (async () => await fetchPlaylistData(1))();
  }, []);

  const playlistListRes = playlistList.map((p: any) => {
    return {
      id: p.id,
      title: p.title,
      creater: p.username,
      cover: p.cover,
      description: p.description,
    };
  });

  return (
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
        {playlistListRes.reverse().map((item: any) => {
          return (
            <ListItem key={`item-${item.id}`}>
              <MyPlaylistItem
                title={item.title}
                // count={item.count}
                cover={item.cover}
                description={item.description}
              />
            </ListItem>
          );
        })}
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
  );
};

export default BrowsePlaylistList;
