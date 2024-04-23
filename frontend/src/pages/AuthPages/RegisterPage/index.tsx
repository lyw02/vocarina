import { register } from "@/api/userApi";
import AutoDismissAlert from "@/components/Alert/AutoDismissAlert";
import theme from "@/theme";
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
import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../index.css";

interface Status {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const linkStyle: SxProps = {
  textDecoration: "none",
  cursor: "pointer",
};

const RegisterPage = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [status, setStatus] = useState<Status>({
    severity: "error",
    message: "Register failed!",
  });
  const [promptMessage, setPromptMessage] = useState<string | null>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const navigate = useNavigate();

  const usernameReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,20}$/;
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handleSignUp = async () => {
    const recaptchaValue = recaptchaRef.current?.getValue();
    try {
      if (!(username && password && passwordConfirmation)) {
        setPromptMessage("Please fill in all fields.");
      } else if (password !== passwordConfirmation) {
        setPromptMessage("Passwords do not match.");
      } else if (!passwordReg.test(password)) {
        setPromptMessage("Password is not strong enough.");
      } else if (!usernameReg.test(username)) {
        setPromptMessage("Username is not valid.");
      } else {
        const res = await register(
          username,
          encryptPassword(password),
          recaptchaValue
        );
        const resJson = await res.json();
        setPromptMessage(null);
        if (res.status === 201) {
          setStatus({
            severity: "success",
            message: "Register successed!",
          });
          navigate("/login");
        } else {
          console.log(resJson.error);
          setStatus({
            severity: "error",
            message: "Register failed!",
          });
        }
        setIsAlertOpen(true);
      }
    } catch (error) {
      console.log(error);
      setStatus({
        severity: "error",
        message: "Register failed!",
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
          <CardContent sx={{ paddingBottom: 0 }}>
            <Typography gutterBottom variant="h5" component="div">
              Sign Up
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
              <TextField
                required
                id="password-confirmation-field"
                label="Password Confirmation"
                variant="standard"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <ReCAPTCHA
                style={{ marginTop: "2vh" }}
                sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_CLIENT_KEY}
                ref={recaptchaRef}
                hl="en"
              />
              <Typography
                gutterBottom
                variant="caption"
                color={theme.palette.primary.main}
                component="span"
              >
                {promptMessage}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  gutterBottom
                  variant="overline"
                  component="span"
                  sx={{ marginTop: "auto", paddingBottom: 0 }}
                >
                  Already have an account?{" "}
                  <Link sx={linkStyle} component={RouterLink} to="/login">
                    Login
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ paddingTop: 0 }}>
            <Button size="small" onClick={handleSignUp}>
              Sign Up
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
