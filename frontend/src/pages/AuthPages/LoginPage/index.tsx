// import { login } from "@/api/userApi";
import { login } from "@/api/supabaseAuthApi";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import { setCurrentUser } from "@/store/modules/user";
import theme from "@/theme";
import { AlertStatus } from "@/types";
import { encryptPassword } from "@/utils/Encrypt";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "../index.css";

const linkStyle: SxProps = {
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
};

const LoginPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
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
      if (!(email && password)) {
        setPromptMessage("Please fill in all fields.");
      } else {
        const res = await login(email, encryptPassword(password));
        setPromptMessage(null);
        if (!res.error) {
          setStatus({
            severity: "success",
            message: "Login successed!",
          });
          console.log("res", res)
          dispatch(setCurrentUser(res));
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
    <div className="auth-page-wrapper">
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h5" component="div">
                Login
              </Typography>
              <Button onClick={() => navigate("/")}>Back</Button>
            </Stack>
            <Stack direction="column" justifyContent="space-between">
              <TextField
                required
                id="email-field"
                label="Email"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
    </div>
  );
};

export default LoginPage;
