import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, editMode } from "@/types";
import InputDialog from "../InputDialog";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import "./index.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { setEditMode } from "@/store/modules/editMode";

const ParameterBar = () => {
  const [isTimeSigDialogVisible, setIsTimeSigDialogVisible] =
    useState<boolean>(false);
  const [isBpmDialogVisible, setIsBpmDialogVisible] = useState<boolean>(false);

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
          <span>
            <select>
              <option>Select Voice</option>
            </select>
          </span>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          sx={{ width: "30%" }}
          alignItems="center"
        >
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
    </div>
  );
};

export default ParameterBar;
