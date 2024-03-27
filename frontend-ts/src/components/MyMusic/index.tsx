import { IconButton, List, ListItem } from "@mui/material";
import { useState } from "react";
import MyMusicItem from "../MyMusicItem";

interface MusicItem {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

const MyMusic = () => {
  const musicList: MusicItem[] = [
    {
      id: 0,
      title: "Title",
      artist: "Someone",
      cover: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    },
    {
      id: 1,
      title: "Title",
      artist: "Someone",
      cover: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    },
    {
      id: 2,
      title: "Title",
      artist: "Someone",
      cover: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    },
  ];

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
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default MyMusic;
