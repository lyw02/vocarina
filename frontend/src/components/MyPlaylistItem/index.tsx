import { Box, Button, Stack, Typography } from "@mui/material";

// img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'

const MyPlaylistItem = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1}>
        <img
          src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          loading="lazy"
          style={{ width: "60px", height: "60px" }}
        />
        <Stack direction="column" spacing={0}>
          <Typography variant="body1">Playlist Name</Typography>
          <Typography variant="caption">50 songs</Typography>
          <Typography variant="caption">Updated 3 days ago</Typography>
        </Stack>
        <Button>Delete</Button>
      </Stack>
    </Box>
  );
};

export default MyPlaylistItem;
