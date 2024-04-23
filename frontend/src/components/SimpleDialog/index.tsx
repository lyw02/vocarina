import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export interface SimpleDialogProps {
  title: string;
  open: boolean;
  selectedValue: number | null;
  onClose: (value: number | null) => void;
  items: any[];
}

export function SimpleDialog(props: SimpleDialogProps) {
  const { title, onClose, selectedValue, open, items } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: number) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {items.map((item) => {
          return (
            <ListItem disableGutters key={uuidv4()}>
              <ListItemButton onClick={() => handleListItemClick(item.props.item.id)}>
                {item}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}
