import Stack, { StackProps } from "@mui/material/Stack";
import React from "react";

type Props = {
  children: React.ReactNode;
} & StackProps;

export class Center extends React.Component<Props> {
  render() {
    return (
      <Stack
        {...this.props}
        sx={{
          width: 1 / 1,
          justifyContent: "center",
          alignItems: "center",
          ...this.props.sx,
        }}
        className='Center'>
        {this.props.children}
      </Stack>
    );
  }
}
