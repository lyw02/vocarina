import {
  setArtist,
  setIsPanelOpen,
  setMusicId,
  setSrc,
  setTitle,
} from "@/store/modules/musicPanel";
import theme from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface MyMusicItemProps {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

const MyMusicItem = ({ id, title, artist, cover, src }: MyMusicItemProps) => {
  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(setIsPanelOpen(true));
    dispatch(setMusicId(id));
    dispatch(setTitle(title));
    dispatch(setArtist(artist));
    dispatch(setSrc(src));
  };

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
      <Box
        sx={{
          width: "100%",
          cursor: "pointer",
          backgroundColor: isHovered ? theme.palette.grey[200] : "white",
          mt: 1,
        }}
        onClick={handlePlay}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        <Stack direction="row" spacing={1}>
          <img
            src={cover}
            loading="lazy"
            style={{ width: "60px", height: "60px" }}
          />
          <Stack direction="row" spacing="space-between">
            <Stack direction="column" spacing={0}>
              <Typography variant="body1">{title}</Typography>
              <Typography variant="caption">{artist}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
  );
};

export default MyMusicItem;
