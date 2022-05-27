import SearchIcon from "@mui/icons-material/Search";
import {
  alpha,
  Box,
  BoxProps,
  InputBase,
  InputBaseComponentProps,
  InputBaseProps,
  InputProps,
  styled,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import { theme } from "rich-markdown-editor";
import { Row } from "../layouts/Row";
import { appTheme } from "../theme";

export type StandardSearchFieldProps = {
  placeholder?: string;
  sx?: SxProps<Theme>;
  // inputAttributes: React.InputHTMLAttributes<HTMLInputElement>;
  inputProps?: InputBaseComponentProps;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export class StandardSearchField extends React.Component<StandardSearchFieldProps> {
  constructor(props: StandardSearchFieldProps) {
    super(props);
  }

  render() {
    return (
      <Row
        vertiCenter
        sx={{
          position: "relative",
          borderRadius: 1,
          boxShadow: appTheme.shadows[1],
          backgroundColor: "white",
          // "&:hover": {
          //   backgroundColor: alpha(theme.palette.common.white, 0.25),
          // },
          marginLeft: 0,
          width: "100%",
          ...this.props.sx,
        }}>
        <Box
          sx={{
            padding: appTheme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <SearchIcon />
        </Box>
        <InputBase
          style={{
            width: "100%",
            padding: appTheme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${appTheme.spacing(4)})`,
          }}
          placeholder={this.props.placeholder ?? "Search..."}
          onChange={this.props.onChange}
          inputProps={this.props.inputProps}
        />
      </Row>
    );
  }
}
