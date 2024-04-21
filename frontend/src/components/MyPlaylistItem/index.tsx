import { Box, Stack, Typography } from "@mui/material";

interface MyPlaylistItemProps {
  title: string;
  count?: number;
  cover: string;
  description?: string;
}

const MyPlaylistItem = ({title, count, cover, description}: MyPlaylistItemProps) => {
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
          {/* <Typography variant="caption">{count}{" songs"}</Typography> */}
          <Typography variant="caption">{description}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MyPlaylistItem;
