import { PlayCircleOutline, PlaylistAdd, Share } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";

// img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45'

interface MyMusicItemProps {
  title: string;
  artist: string;
  cover: string;
}

const MyMusicItem = ({ title, artist, cover }: MyMusicItemProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1}>
        <img
          src={cover}
          loading="lazy"
          style={{ width: "60px", height: "60px" }}
        />
        <Stack direction="column" spacing={0}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{artist}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton>
            <PlayCircleOutline />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MyMusicItem;
