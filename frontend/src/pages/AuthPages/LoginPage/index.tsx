// import { login } from "@/api/userApi";
import { login } from "@/api/supabaseAuthApi";
import { raiseAlert } from "@/components/Alert/AutoDismissAlert";
import { setCurrentUser } from "@/store/modules/user";
import theme from "@/theme";
import { encryptPassword } from "@/utils/Encrypt";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [promptMessage, setPromptMessage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      if (!(email && password)) {
        setPromptMessage("Please fill in all fields.");
      } else {
        setIsLoading(true);
        const res = await login(email, encryptPassword(password));
        setPromptMessage(null);
        if (!res.error) {
          raiseAlert("success", "Login successed!");
          console.log("res", res);
          dispatch(setCurrentUser(res));
          setIsLoading(false);
          navigate("/");
        } else {
          raiseAlert("error", "Login failed!");
        }
      }
    } catch (error) {
      console.log(error);
      raiseAlert("error", "Login failed!");
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
            <Button size="small" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? <CircularProgress size="2rem" /> : "Login"}
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
