import { Box, BoxProps } from "@mui/material";
import * as React from "react";

export type OverlayProps = {
  children: React.ReactNode;
  center?: boolean;
} & BoxProps;

export function Overlay(props: OverlayProps) {
  return (
    <Box
      {...props}
      component='div'
      sx={{
        ...props.sx,
        display: "inline-grid",
        justifyContent: props.center ? "center" : "start",
        alignItems: props.center ? "center" : "start",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
      }}
      className='Overlay'>
      {React.Children.map(props.children, (child, index) => (
        <Box
          key={index}
          className='CenterPositioner'
          sx={{
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 2,
            display: "flex",
            justifyContent: props.center ? "center" : "start",
            alignItems: props.center ? "center" : "start",
            height: 1,
            width: 1,
          }}>
          {child}
        </Box>
      ))}
    </Box>
  );
}
