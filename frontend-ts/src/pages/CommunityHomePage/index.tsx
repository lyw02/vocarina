import { Card, Grid } from "@mui/material";
import { container, card } from "./style";

const CommunityHomePage = () => {
  return (
    <Grid container spacing={2} sx={container}>
      <Grid item xs={3}>
        <Card sx={card}>123</Card>
      </Grid>
      <Grid item xs={9}>
        <Card sx={[card, { height: "100%" }]}>456</Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={[card]}>123</Card>
      </Grid>
    </Grid>
  );
};

export default CommunityHomePage;
