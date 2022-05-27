import { Box, Container, Grid } from "@mui/material";
import FriendActivitiesWidget from "../connected-components/FriendActivitiesWidget";
import { Column } from "../layouts/Column";
import { FriendActivities } from "./StandardFriendActivities";

export function PersonalTimelinePageLayout(props: {
  leftColumn?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth='xl'>
      <Grid
        container
        mt={5}
        columns={{ xs: 24, md: 24, lg: 24, xl: 24 }}
        columnSpacing={1}>
        <Grid item xs={24} md={5}>
          <Column sx={{ width: 1 / 1 }}>{props.leftColumn}</Column>
        </Grid>
        <Grid item xs={24} md={19}>
          {props.children}
        </Grid>
      </Grid>
    </Container>
  );
}
