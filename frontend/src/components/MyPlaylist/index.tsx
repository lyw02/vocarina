import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
} from "@mui/material";
import MyPlaylistItem from "../MyPlaylistItem";
import { ExpandLess, ExpandMore, AddCircleOutline } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import theme from "@/theme";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { createPlaylist, getCreatedPlaylist, getSavedPlaylist } from "@/api/communityApi";
import { useAlert } from "@/utils/CustomHooks";
import AutoDismissAlert from "../Alert/AutoDismissAlert";
import { v4 as uuidv4 } from "uuid"

interface SubList {
  id: number;
  text: string;
  listItems: {
    id: number;
    user_id: number;
    title: string;
    count: number;
    cover: string;
  }[];
  flag: boolean;
  flagSetter: Dispatch<SetStateAction<boolean>>;
}

// const createdListItems: SubList["listItems"] = [];
// const savedListItems: SubList["listItems"] = [];

const MyPlaylist = () => {
  const [isCreatedListOpen, setIsCreatedListOpen] = useState<boolean>(true);
  const [isSavedListOpen, setIsSavedListOpen] = useState<boolean>(true);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdListItems, setCreatedListItems] = useState<
    SubList["listItems"]
  >([]);
  const [savedListItems, setSavedListItems] = useState<SubList["listItems"]>(
    []
  );

  const navigate = useNavigate();
  const { isAlertOpen, alertStatus, handleAlertClose, raiseAlert } = useAlert();
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) return;
      const createdRes = await getCreatedPlaylist(currentUserId);
      const savedRes = await getSavedPlaylist(currentUserId);
      const createdResJson = await createdRes.json();
      const savedResJson = await savedRes.json();
      console.log(savedResJson)
      setCreatedListItems(createdResJson);
      setSavedListItems(savedResJson);
    };
    fetchData();
  }, [isCreatedListOpen, isSavedListOpen, playlistTitle]);

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

  const handleCreatePlaylist = async () => {
    setIsNewDialogOpen(true);
  };

  const handleDialogSubmit = async () => {
    if (!currentUserId) return;
    const res = await createPlaylist(currentUserId, playlistTitle, description);
    if (res.status === 200) {
      raiseAlert("success", "Playlist created");
    } else {
      raiseAlert("error", "Failed");
    }
    setIsNewDialogOpen(false);
  };

  return (
    <>
      <AutoDismissAlert
        isAlertOpen={isAlertOpen}
        handleAlertClose={handleAlertClose}
        message={alertStatus.message}
        severity={alertStatus.severity}
      />
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
                    <ListItem key={uuidv4()}>
                      <MyPlaylistItem
                        id={i.id}
                        userId={i.user_id}
                        title={i.title}
                        count={i.count}
                        cover={i.cover}
                        showSaveButton={false}
                      />
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
      <Dialog open={isNewDialogOpen}>
        <DialogTitle>{"New Playlist"}</DialogTitle>
        <DialogContent>
          <Stack direction="column">
            <TextField
              id="title"
              label="Title"
              placeholder="Title"
              variant="standard"
              required
              onChange={(e) => setPlaylistTitle(e.target.value)}
            />
            <TextField
              id="description"
              label="Description"
              placeholder="Description"
              variant="standard"
              multiline
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus>Cancel</Button>
          <Button onClick={handleDialogSubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPlaylist;
