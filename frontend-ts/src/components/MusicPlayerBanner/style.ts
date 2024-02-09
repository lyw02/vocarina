import theme from "@/theme";
import { Typography, styled } from "@mui/material";
import { SxProps } from "@mui/system";

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  border: "1px solid #ccc",
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "95%",
  marginBottom: 16,
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const CoverImage = styled("div")({
  width: 100,
  height: 100,
  objectFit: "cover",
  overflow: "hidden",
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.08)",
  "& > img": {
    width: "100%",
  },
});

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const timeSliderSx: SxProps = {
  color: theme.palette.primary.main,
  height: 4,
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&::before": {
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px ${
        theme.palette.mode === "dark"
          ? "rgb(255 255 255 / 16%)"
          : "rgb(0 0 0 / 16%)"
      }`,
    },
    "&.Mui-active": {
      width: 20,
      height: 20,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.28,
  },
} as const;

const volumeSliderSx: SxProps = {
  color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    "&::before": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible, &.Mui-active": {
      boxShadow: "none",
    },
  },
} as const;

export { timeSliderSx, volumeSliderSx, Widget, CoverImage, TinyText };
