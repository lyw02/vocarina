import { List, ListItem } from "@mui/material";
import MyMusicItem from "../MyMusicItem";

interface MusicItem {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

interface MyMusicProps {
  musicList: MusicItem[]
}

const MyMusic = ({musicList}: MyMusicProps) => {
  return (
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
      {musicList.map((item) => {
        return (
          <ListItem key={`item-${item.id}`}>
            <MyMusicItem
              title={item.title}
              artist={item.artist}
              cover={item.cover}
              src={item.src}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default MyMusic;
