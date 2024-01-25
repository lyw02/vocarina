import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from "@mui/material";
import MyPlaylistItem from "../MyPlaylistItem";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";

interface subList {
  id: number;
  text: string;
  listItems: object[] | number[];
  flag: boolean;
  flagSetter: Dispatch<SetStateAction<boolean>>;
}

const MyPlaylist = () => {
  const [isCreatedListOpen, setIsCreatedListOpen] = useState<boolean>(true);
  const [isSavedListOpen, setIsSavedListOpen] = useState<boolean>(true);

  const subLists: subList[] = [
    {
      id: 0,
      text: "Created",
      listItems: [0, 1, 2, 3, 4],
      flag: isCreatedListOpen,
      flagSetter: setIsCreatedListOpen,
    },
    {
      id: 1,
      text: "Saved",
      listItems: [0, 1, 2],
      flag: isSavedListOpen,
      flagSetter: setIsSavedListOpen,
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
                    <MyPlaylistItem />
                  </ListItem>
                );
              })}
            </Collapse>
          </div>
        );
      })}
    </List>
  );
};

export default MyPlaylist;
