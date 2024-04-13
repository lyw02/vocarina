import { login } from "@/api/userApi";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import { setCurrentUser, setCurrentUserId } from "@/store/modules/user";
import theme from "@/theme";
import { AlertStatus } from "@/types";
import { encryptPassword } from "@/utils/Encrypt";
import { setToken } from "@/utils/token";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  Link,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const linkStyle: SxProps = {
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
};

const LoginPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<AlertStatus>({
    severity: "error",
    message: "Login failed!",
  });
  const [promptMessage, setPromptMessage] = useState<string | null>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handleLogin = async () => {
    try {
      if (!(username && password)) {
        setPromptMessage("Please fill in all fields.");
      } else {
        const res = await login(username, encryptPassword(password));
        const resJson = await res.json();
        console.log("resJson in login: ", resJson)
        setPromptMessage(null);
        if (res.status === 200) {
          setToken(resJson.token);
          setStatus({
            severity: "success",
            message: "Login successed!",
          });
          dispatch(setCurrentUser(resJson.username));
          dispatch(setCurrentUserId(resJson.id));
          setIsAlertOpen(true);
          navigate("/");
        } else {
          setStatus({
            severity: "error",
            message: "Login failed!",
          });
          setIsAlertOpen(true);
        }
        
      }
    } catch (error) {
      console.log(error);
      setStatus({
        severity: "error",
        message: "Login failed!",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <AutoDismissAlert
        isAlertOpen={isAlertOpen}
        handleAlertClose={handleAlertClose}
        message={status.message}
        severity={status.severity}
      />
      <Card sx={{ width: "50vh", margin: "auto" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Login
          </Typography>
          <Stack direction="column" justifyContent="space-between">
            <TextField
              required
              id="username-field"
              label="Username"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              id="password-field"
              label="Password"
              variant="standard"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography
              gutterBottom
              variant="caption"
              component="span"
              color={theme.palette.primary.main}
            >
              {promptMessage}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography gutterBottom variant="overline" component="span">
                <Link sx={linkStyle} component={RouterLink} to="/register">
                  Sign up
                </Link>
              </Typography>
              <Typography gutterBottom variant="overline" component="span">
                <Link sx={linkStyle}>Forget password</Link>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
