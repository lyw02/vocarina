import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import theme from "@/theme";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

interface Status {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const linkStyle: SxProps = {
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
};

const LoginPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<Status>({
    severity: "error",
    message: "Login failed!",
  });
  const [promptMessage, setPromptMessage] = useState<string | null>();

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handleLogin = () => {
    try {
      if (!(username && password)) {
        setPromptMessage("Please fill in all fields.");
      } else {
        // Send login request
        setPromptMessage(null);
        setStatus({
          severity: "success",
          message: "Login successed!",
        });
        setIsAlertOpen(true);
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
      <Card sx={{ maxWidth: 345, margin: "auto" }}>
        {/* <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> */}
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
