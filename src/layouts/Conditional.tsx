import React from "react";

export function Conditional(props: {
  show: boolean;
  children: React.ReactNode;
}) {
  return <React.Fragment>{props.show && props.children}</React.Fragment>;
}
