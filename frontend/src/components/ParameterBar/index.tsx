import { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, editMode } from "@/types";
import InputDialog from "../InputDialog";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import "./index.css";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { setEditMode } from "@/store/modules/editMode";
import { setVoice as setVoiceInState } from "@/store/modules/params";
import { setSnappingMode } from "@/store/modules/snappingMode";
import UploadVoiceDialog from "../InputDialog/UploadVoiceDialog";
import { raiseAlert } from "../Alert/AutoDismissAlert";

const ParameterBar = () => {
  const [isTimeSigDialogVisible, setIsTimeSigDialogVisible] =
    useState<boolean>(false);
  const [isBpmDialogVisible, setIsBpmDialogVisible] = useState<boolean>(false);
  const [isUploadVoiceDialogOpen, setIsUploadVoiceDialogOpen] =
    useState<boolean>(false);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const editMode = useSelector((state: RootState) => state.editMode);
  const dispatch = useDispatch();

  const { numerator, denominator, bpm } = useSelector(
    (state: RootState) => state.params
  );

  // Volume
  const [value, setValue] = useState(30);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  // Toggle button (edit or select)
  const [toggle, setToggle] = useState<editMode>(editMode.editMode);

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newToggle: editMode
  ) => {
    if (newToggle) {
      dispatch(setEditMode(newToggle));
      setToggle(newToggle);
    }
  };

  // Voice
  const [voice, setVoice] = useState<string>(
    useSelector((state: RootState) => state.params.voice) || ""
  );

  const options: string[] = [
    "Microsoft - Jenny",
    "Reecho.ai - Otto",
    "Otto - 水母",
  ];

  const handleVoiceChange = (e: SelectChangeEvent<string>) => {
    console.log("e", e);
    if (e.target.value === "btn") return;
    setVoice(e.target.value);
    dispatch(setVoiceInState(e.target.value));
  };

  // Snapping mode
  const handleSnappingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSnappingMode(e.target.checked));
  };

  return (
    <div className="param-wrapper">
      <Stack justifyContent="space-between" direction="row" sx={{ mb: 1 }}>
        <Stack alignItems="center" spacing={2} direction="row">
          <span
            className="param-item"
            onClick={() => setIsTimeSigDialogVisible(true)}
          >
            {numerator}/{denominator}
          </span>
          <span
            className="param-item"
            onClick={() => setIsBpmDialogVisible(true)}
          >
            BPM: {bpm}
          </span>
          <Select
            value={voice}
            onChange={(e) => handleVoiceChange(e)}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Voice
            </MenuItem>
            {options.map((voice) => (
              <MenuItem key={voice} value={voice}>
                <Tooltip title={"Remark"} placement="top">
                  <Typography>{voice}</Typography>
                </Tooltip>
              </MenuItem>
            ))}
            <MenuItem value="btn" sx={{ p: 0 }}>
              <Button
                onClick={() => {
                  currentUser
                    ? setIsUploadVoiceDialogOpen(true)
                    : raiseAlert("error", "Please sign in first");
                }}
                sx={{ width: "100%" }}
              >
                Upload voice
              </Button>
            </MenuItem>
          </Select>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          sx={{ width: "30%" }}
          alignItems="center"
        >
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                onChange={(e) => handleSnappingChange(e)}
              />
            }
            label="Snapping"
          />
          <ToggleButtonGroup
            color="primary"
            value={toggle}
            exclusive
            size="small"
            onChange={handleToggleChange}
            aria-label="Edit or select"
          >
            <ToggleButton value="edit">
              <BorderColorIcon />
            </ToggleButton>
            <ToggleButton value="select">
              <SelectAllIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <VolumeDown fontSize="small" />
          <Slider
            aria-label="Volume"
            size="small"
            value={value}
            onChange={handleChange}
          />
          <VolumeUp fontSize="small" />
        </Stack>
      </Stack>
      <InputDialog
        title="Edit Time Signature"
        formType="EditTimeSignatureForm"
        isOpen={isTimeSigDialogVisible}
        setIsOpen={setIsTimeSigDialogVisible}
      />
      <InputDialog
        title="Edit BPM"
        formType="EditBpmForm"
        isOpen={isBpmDialogVisible}
        setIsOpen={setIsBpmDialogVisible}
      />
      <UploadVoiceDialog
        isOpen={isUploadVoiceDialogOpen}
        setIsOpen={setIsUploadVoiceDialogOpen}
      />
    </div>
  );
};

export default ParameterBar;
