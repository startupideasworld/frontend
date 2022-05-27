import { Box } from "@mui/material";
import React from "react";
import { Center } from "../layouts/Center";
import { Overlay } from "../layouts/Overlay";
import { ImageRoundedIcon } from "./icons-collection";

type _Props = { width: number; height: number; src: string };
type _State = {};

export class SmartImage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Overlay
          center
          sx={{
            overflow: "hidden",
            height: this.props.height,
            width: this.props.width,
          }}>
          <Box
            sx={{
              zIndex: 2,
              height: "inherit",
              width: this.props.width,
              backgroundImage: `url("${this.props.src}")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}></Box>
          {/* <Box
            sx={{
              height: "inherit",
              width: "inherit",
              display: "flex",
              position: "relative",
              //   backgroundImage: `url(${this.props.src})`,
              //   backgroundSize: "cover",
              //   backgroundRepeat: "no-repeat",
              filter: "contrast(0.6) blur(30px)",
              transform: "scale(1.5)",
              zIndex: 1,
            }}>
            <img
              src={this.props.src}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box> */}
          <ImageRoundedIcon
            sx={{ zIndex: 0, height: "30%", width: "30%", color: "grey.300" }}
          />
        </Overlay>
      </React.Fragment>
    );
  }
}
