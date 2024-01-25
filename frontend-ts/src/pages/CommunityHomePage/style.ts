import { SxProps, SystemStyleObject } from "@mui/system";

const container: SxProps = {
  marginTop: "5px",
} as const;

const card: SystemStyleObject = {
  padding: "10px",
} as const;

export { container, card };
