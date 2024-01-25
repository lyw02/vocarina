import { Box, Button, Stack, Typography } from "@mui/material";

// img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45'

const MyMusicItem = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1}>
        <img
          src="https://images.unsplash.com/photo-1522770179533-24471fcdba45"
          loading="lazy"
          style={{ width: "60px", height: "60px" }}
        />
        <Stack direction="column" spacing={0}>
          <Typography variant="body1">Title</Typography>
          <Typography variant="caption">Artist</Typography>
        </Stack>
        <Button>Delete</Button>
      </Stack>
    </Box>
  );
};

export default MyMusicItem;