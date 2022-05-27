import { Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Column } from "../layouts/Column";
import { MyProfileUrlType } from "../route-config";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { MyAccountPage } from "./MyAccountPage";

type _Props = {
  urlAppState: UrlAppState<MyProfileUrlType>;
};
type _State = {};

class _MyProfilePage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<MyProfileUrlType>();
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <MyAccountPage>
          <Column spacing={2}>
            <Typography variant='h2' gutterBottom>
              My Profile
            </Typography>
            <Paper sx={{ padding: 5 }}>
              <Column>
                <TextField label='Display name' />
              </Column>
            </Paper>
          </Column>
        </MyAccountPage>
      </React.Fragment>
    );
  }
}

export const MyProfilePage = connect((state: RootAppState) => {
  return {
    urlAppState: state.url.as<MyProfileUrlType>(),
  };
})(_MyProfilePage);
