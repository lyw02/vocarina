import { getUserInfo, updateUserInfo } from "@/api/userApi";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import theme from "@/theme";
import { AlertStatus, RootState } from "@/types";
import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export type userInfo = {
  //   avatar: string;
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

  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUserId
  );

  const [userInfo, setUserInfo] = useState<userInfo>({
    // avatar: "",
    username: "",
    email: "",
    about: "",
  });

  const [editField, setEditField] = useState<keyof userInfo | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUserInfo = async () => {
      const res = await getUserInfo(currentUserId);
      const resJson = await res.json();
      console.log(resJson.username);
      setUserInfo({
        // avatar: resJson.avatar_url,
        username: resJson.username,
        email: resJson.email,
        about: resJson.about,
      });
    };
    fetchUserInfo();
  }, [currentUserId, editField]);

  const handleEdit = (field: keyof userInfo) => {
    setEditField(field);
  };

  const handleSave = async (field: keyof userInfo) => {
    if (!currentUserId) return;
    if (field === "email" && !isValidEmail(userInfo.email)) {
      raiseAlert("error", "Invalid email");
      return;
    }
    const res = await updateUserInfo(currentUserId, userInfo);
    if (res.status === 200) {
      raiseAlert("success", "Change saved");
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
          {editField === field ? (
            <span>
              <Typography
                component="span"
                sx={{ color: theme.palette.primary.main }}
              >
                {field}
                {": "}
              </Typography>
              <TextField
                size="small"
                value={userInfo[field]}
                sx={{ marginLeft: 1 }}
                onChange={(event) => handleChange(field, event)}
              />
            </span>
          ) : (
            <span>
              <Typography
                component="span"
                sx={{ color: theme.palette.primary.main }}
              >
                {field}
                {": "}
              </Typography>
              {userInfo[field as keyof userInfo]}
            </span>
          )}
          {editField === field ? (
            <span>
              <Button onClick={() => handleSave(field)}>Save</Button>
              <Button
                onClick={() => {
                  setEditField(null);
                }}
              >
                Cancel
              </Button>
            </span>
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
