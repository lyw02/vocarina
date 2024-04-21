import { getAllMusic } from "@/api/communityApi";
import { useEffect, useState } from "react";
import { card } from "../style";
import { Card, Pagination } from "@mui/material";
import MyMusic from "@/components/MyMusic";
import { MusicResponse } from "@/types/community";

const BrowseMusicList = () => {
  const [musicList, setMusicList] = useState<MusicResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const fetchMusicData = async (page: number) => {
    const res = await getAllMusic(page);
    const resJson = await res.json();
    console.log(resJson);
    setMusicList(resJson.results);
    setTotalPages(resJson.total_pages);
  };

  const handleChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    await fetchMusicData(value);
    setPage(value);
  };

  useEffect(() => {
    (async () => await fetchMusicData(1))();
  }, []);

  const musicListRes = musicList.map((m) => {
    return {
      id: m.id,
      title: m.title,
      artist: m.username,
      src: m.url,
      cover: "https://picsum.photos/200",
    };
  });

  return (
    <Card sx={[card, { height: "100%" }]}>
      <MyMusic musicList={musicListRes} />
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

export default BrowseMusicList;
