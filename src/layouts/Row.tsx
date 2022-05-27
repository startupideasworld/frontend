import { StackProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import React from "react";

type Props = {
  children: React.ReactNode;
  vertiCenter?: boolean;
  alignRight?: boolean;
  alignLeft?: boolean;
  alignTop?: boolean;
} & StackProps;

export class Row extends React.Component<Props> {
  render() {
    const extraSX: any = {
      alignItems: this.props.vertiCenter
        ? "center"
        : this.props.alignTop
        ? "start"
        : undefined,
      justifyContent: this.props.alignRight
        ? "right"
        : this.props.alignLeft
        ? "start"
        : undefined,
    };
    const stackProps = { ...this.props };
    delete stackProps.alignTop;
    delete stackProps.vertiCenter;
    delete stackProps.alignRight;
    delete stackProps.alignLeft;
    return (
      <Stack
        {...stackProps}
        direction='row'
        sx={{ width: 1 / 1, ...this.props.sx, ...extraSX }}>
        {this.props.children}
      </Stack>
    );
  }
}
