import {
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
import MyPlaylistItem from "../MyPlaylistItem";
import { ExpandLess, ExpandMore, AddCircleOutline } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction, useState } from "react";
import theme from "@/theme";
import { useNavigate } from "react-router-dom";

interface SubList {
  id: number;
  text: string;
  listItems: { name: string; count: number }[];
  flag: boolean;
  flagSetter: Dispatch<SetStateAction<boolean>>;
}

const createdListItems: SubList["listItems"] = [];
const savedListItems: SubList["listItems"] = [];

const MyPlaylist = () => {
  const [isCreatedListOpen, setIsCreatedListOpen] = useState<boolean>(true);
  const [isSavedListOpen, setIsSavedListOpen] = useState<boolean>(true);

  const navigate = useNavigate();

  const subLists: SubList[] = [
    {
      id: 0,
      text: "Created",
      listItems: createdListItems,
      flag: isCreatedListOpen,
      flagSetter: setIsCreatedListOpen,
    },
    {
      id: 1,
      text: "Saved",
      listItems: savedListItems,
      flag: isSavedListOpen,
      flagSetter: setIsSavedListOpen,
    },
  ];

  const handleCreatePlaylist = () => {};

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
      {subLists.map((item) => {
        return (
          <div key={item.id}>
            <ListSubheader>
              <Stack direction="row">
                <ListItemText primary={item.text} />
                <IconButton onClick={() => item.flagSetter(!item.flag)}>
                  {item.flag ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>
            </ListSubheader>
            <Collapse in={item.flag} timeout="auto" unmountOnExit>
              {item.listItems.map((i) => {
                return (
                  <ListItem key={`item-${i}`}>
                    <MyPlaylistItem name={i.name} count={i.count} />
                  </ListItem>
                );
              })}
              <ListItem>
                <Button
                  variant="text"
                  sx={{ color: theme.palette.grey[500] }}
                  startIcon={
                    item.text === "Created" ? (
                      <AddCircleOutline />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  onClick={
                    item.text === "Created"
                      ? handleCreatePlaylist
                      : () => navigate("/community/playlist")
                  }
                >
                  {item.text === "Created" ? "New" : "Find more"}
                </Button>
              </ListItem>
            </Collapse>
          </div>
        );
      })}
    </List>
  );
};

export default MyPlaylist;
