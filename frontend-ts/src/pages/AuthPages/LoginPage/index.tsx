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
import { Link as RouterLink } from "react-router-dom";

const linkStyle: SxProps = {
  textDecoration: "none",
  userSelect: "none",
  cursor: "pointer",
};

const LoginPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
            />
            <TextField
              required
              id="password-field"
              label="Password"
              variant="standard"
            />
            <TextField
              required
              id="password-confirmation-field"
              label="Password Confirmation"
              variant="standard"
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography gutterBottom variant="caption" component="span">
                <Link sx={linkStyle} component={RouterLink} to="/register">Sign up</Link>
              </Typography>
              <Typography gutterBottom variant="caption" component="span">
                <Link sx={linkStyle}>Forget password</Link>
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small">Login</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
