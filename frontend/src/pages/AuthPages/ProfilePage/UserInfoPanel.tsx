import { updateUserInfo } from "@/api/supabaseAuthApi";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import { setCurrentUser } from "@/store/modules/user";
import theme from "@/theme";
import { AlertStatus, RootState } from "@/types";
import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export type userInfo = {
  //  avatar: string;
  username: string;
  email: string;
  about: string;
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const UserInfoPanel = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    severity: "error",
    message: "",
  });
  const dispatch = useDispatch();
  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };
  const raiseAlert = (severity: AlertStatus["severity"], message: string) => {
    setAlertStatus({
      severity: severity,
      message: message,
    });
    setIsAlertOpen(true);
  };

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [userInfo, setUserInfo] = useState<userInfo>({
    // avatar: "",
    username: "",
    email: "",
    about: "",
  });

  const [editField, setEditField] = useState<keyof userInfo | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setUserInfo({
      // avatar: resJson.avatar_url,
      username: currentUser.user_metadata.display_name,
      email: currentUser?.email || "",
      about: currentUser.user_metadata?.about,
    });
  }, [currentUser, editField]);

  const handleEdit = (field: keyof userInfo) => {
    setEditField(field);
  };

  const handleSave = async (field: keyof userInfo) => {
    if (!currentUser) return;
    if (field === "email" && !isValidEmail(userInfo.email)) {
      raiseAlert("error", "Invalid email");
      return;
    }
    const res = await updateUserInfo({
      email: userInfo.email,
      data: {
        display_name: userInfo.username,
        about: userInfo.about,
      },
    });
    if (!res.error) {
      raiseAlert("success", "Change saved");
      dispatch(setCurrentUser(res));
    } else {
      raiseAlert("error", "Failed");
    }
    setEditField(null);
  };

  const handleChange = (
    field: keyof userInfo,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserInfo({
      ...userInfo,
      [field]: event.target.value,
    });
  };

  return (
    <div>
      <AutoDismissAlert
        isAlertOpen={isAlertOpen}
        handleAlertClose={handleAlertClose}
        message={alertStatus.message}
        severity={alertStatus.severity}
      />
      {Object.keys(userInfo).map((field) => (
        <span
          key={field}
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="label"
            htmlFor={`${field}-field`}
            sx={{ color: theme.palette.primary.main }}
          >
            {field}
            {": "}
          </Typography>
          {editField === field ? (
            <TextField
              id={`${field}-field`}
              size="small"
              value={userInfo[field]}
              sx={{ marginLeft: 1 }}
              onChange={(event) => handleChange(field, event)}
            />
          ) : (
            <Typography id={`${field}-field`}>
              {userInfo[field as keyof userInfo]}
            </Typography>
          )}
          {editField === field ? (
            <>
              <Button onClick={() => handleSave(field)}>Save</Button>
              <Button
                onClick={() => {
                  setEditField(null);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => handleEdit(field as keyof userInfo)}>
              Edit
            </Button>
          )}
        </span>
      ))}
    </div>
  );
};

export default UserInfoPanel;
