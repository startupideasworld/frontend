import Stack, { StackProps } from "@mui/material/Stack";
import React from "react";

type Props = {
  children: React.ReactNode;
  horizCenter?: boolean;
  alignRight?: boolean;
  alignBottom?: boolean;
  alignLeft?: boolean;
} & StackProps;

export class Column extends React.Component<Props> {
  render() {
    const stackProps = { ...this.props };
    const extraSX: any = {};
    if (this.props.horizCenter) {
      delete stackProps.horizCenter;
      extraSX.alignItems = "center";
      stackProps.width = 1 / 1;
    } else if (this.props.alignRight) {
      delete stackProps.alignRight;
      extraSX.alignItems = "end";
    } else if (this.props.alignLeft) {
      delete stackProps.alignLeft;
      extraSX.alignItems = "start";
    }
    if (this.props.alignBottom) {
      delete stackProps.alignBottom;
      extraSX.justifyContent = "end";
    }
    return (
      <Stack
        {...stackProps}
        direction='column'
        sx={{ ...this.props.sx, ...extraSX }}>
        {this.props.children}
      </Stack>
    );
  }
}
