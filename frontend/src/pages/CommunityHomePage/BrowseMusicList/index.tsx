import { getAllMusic } from "@/api/communityApi";
import { useEffect, useState } from "react";
import { card } from "../style";
import { Card } from "@mui/material";
import MyMusic from "@/components/MyMusic";

interface MusicResponse {
  arranged_by: string | null;
  audio_url: string;
  composed_by: string | null;
  credits: string | null;
  id: number;
  like_count: number;
  lyrics: any;
  lyrics_by: string | null;
  play_count: number;
  publish_time: string;
  save_count: number;
  status: number;
  title: string;
  user_id: number;
  username: string;
}

const BrowseMusicList = () => {
  const [musicList, setMusicList] = useState<MusicResponse[]>([]);
  useEffect(() => {
    const fetchMusicData = async () => {
      const res = await getAllMusic();
      const resJson = await res.json();
      console.log(resJson);
      setMusicList(resJson);
    };
    fetchMusicData();
  }, []);

  const musicListRes = musicList.map((m) => {
    return {
      id: m.id,
      title: m.title,
      artist: m.username,
      src: m.audio_url,
      cover: "https://picsum.photos/200",
    };
  });

  return (
    <Card sx={[card, { height: "100%" }]}>
      <MyMusic musicList={musicListRes} />
    </Card>
  );
};

export default BrowseMusicList;
