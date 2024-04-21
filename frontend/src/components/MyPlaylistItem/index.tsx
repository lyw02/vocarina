import { Box, Stack, Typography } from "@mui/material";

interface MyPlaylistItemProps {
  name: string;
  count: number;
}

const MyPlaylistItem = ({name, count}: MyPlaylistItemProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1}>
        <img
          src="https://picsum.photos/seed/playlist/200"
          loading="lazy"
          style={{ width: "60px", height: "60px" }}
        />
        <Stack direction="column" spacing={0}>
          <Typography variant="body1">{name}</Typography>
          <Typography variant="caption">{count}{" songs"}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MyPlaylistItem;
