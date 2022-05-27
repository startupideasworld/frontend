import { Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { Column } from "../layouts/Column";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Center } from "../layouts/Center";
import { Overlay } from "../layouts/Overlay";
import { StandardActionButton } from "./StandardActionButton";
type _Props = {
  onSignin: React.MouseEventHandler<HTMLElement>;
  isProcessing: boolean;
};
type _State = {};

export class SignInBox extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }
  render(): React.ReactNode {
    return (
      <Column padding={5} horizCenter>
        <Typography gutterBottom variant='h5'>
          Idea starts here
        </Typography>
        <Typography variant='caption'>Welcome to startupidea.dev</Typography>
        <Center sx={{ width: 100, height: 100 }} mt={5} mb={5}>
          <img
            alt=''
            src='/icons/signin.png'
            style={{ width: "100px", height: "100px" }}
          />
        </Center>
        <StandardActionButton
          isSaving={this.props.isProcessing}
          onClick={this.props.onSignin}
          variant='contained'
          endIcon={<LinkedInIcon />}
          sx={{ textTransform: "none" }}>
          Sign-in with LinkedIn
        </StandardActionButton>
      </Column>
    );
  }
}
