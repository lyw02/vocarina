// import { register } from "@/api/userApi";
import { register } from "@/api/supabaseAuthApi";
import { raiseAlert } from "@/components/Alert/AutoDismissAlert";
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
import { Link as RouterLink, useNavigate } from "react-router-dom";
// import ReCAPTCHA from "react-google-recaptcha";
import "../index.css";

const linkStyle: SxProps = {
  textDecoration: "none",
  cursor: "pointer",
};

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [promptMessage, setPromptMessage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const recaptchaRef = useRef<ReCAPTCHA>(null);

  const navigate = useNavigate();

  const usernameReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,20}$/;
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;

  const handleSignUp = async () => {
    // const recaptchaValue = recaptchaRef.current?.getValue();
    try {
      if (!(username && email && password && passwordConfirmation)) {
        setPromptMessage("Please fill in all fields.");
      } else if (password !== passwordConfirmation) {
        setPromptMessage("Passwords do not match.");
      } else if (!passwordReg.test(password)) {
        setPromptMessage("Password is not strong enough.");
      } else if (!usernameReg.test(username)) {
        setPromptMessage("Username is not valid.");
      } else if (!emailReg.test(email)) {
        setPromptMessage("Invalid email.");
      } else {
        setIsLoading(true);
        const res = await register(
          username,
          email,
          encryptPassword(password)
          // recaptchaValue
        );
        setPromptMessage(null);
        if (!res.error) {
          raiseAlert("success", "Register successed!");
          setIsLoading(false);
          navigate("/login");
        } else {
          raiseAlert("error", "Register failed!");
        }
      }
    } catch (error) {
      console.log(error);
      raiseAlert("error", "Register failed!");
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
          <CardContent sx={{ paddingBottom: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h5" component="div">
                Sign Up
              </Typography>
              <Button onClick={() => navigate("/")}>Back</Button>
            </Stack>
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
              <TextField
                required
                id="password-confirmation-field"
                label="Password Confirmation"
                variant="standard"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              {/* <ReCAPTCHA
                style={{ marginTop: "2vh" }}
                sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_CLIENT_KEY}
                ref={recaptchaRef}
                hl="en"
              /> */}
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
            <Button size="small" onClick={handleSignUp} disabled={isLoading}>
              {isLoading ? <CircularProgress size="2rem" /> : "Sign Up"}
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
