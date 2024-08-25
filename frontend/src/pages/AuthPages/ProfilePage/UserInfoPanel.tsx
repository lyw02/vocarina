import { updateUserInfo } from "@/api/supabaseAuthApi";
import { raiseAlert } from "@/components/Alert/AutoDismissAlert";
import { setCurrentUser } from "@/store/modules/user";
import theme from "@/theme";
import { RootState } from "@/types";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
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
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [userInfo, setUserInfo] = useState<userInfo>({
    // avatar: "",
    username: "",
    email: "",
    about: "",
  });
  const [editField, setEditField] = useState<keyof userInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
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
      raiseAlert("error", `Error: ${res.error}`);
    }
    setEditField(null);
    setIsLoading(false);
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
    <>
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
              <Button onClick={() => handleSave(field)} disabled={isLoading}>
                {isLoading ? <CircularProgress size="2rem" /> : "Save"}
              </Button>
              <Button
                onClick={() => {
                  setEditField(null);
                }}
                disabled={isLoading}
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
    </>
  );
};

export default UserInfoPanel;
