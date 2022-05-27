import {
  ButtonProps,
  createTheme,
  Link,
  LinkBaseProps,
  LinkProps,
} from "@mui/material";
import * as Color from "@mui/material/colors";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { PushRouteAppEvent } from "./events/PushRouteAppEvent";
import { ReceiveUrlAppEvent } from "./events/ReceiveURLAppEvent";
import { findParams, matchHref } from "./route-config";
import { appStore } from "./store-config";

const LinkBehavior = React.forwardRef<any, LinkProps & ButtonProps>(
  (props, ref) => {
    const { href, ...other } = props;
    return (
      <a
        {...other}
        ref={ref}
        href={props.href}
        onClick={(e) => {
          if (
            e.ctrlKey ||
            e.shiftKey ||
            e.metaKey || // apple
            (e.button && e.button == 1) // middle click, >IE9 + everyone else
          ) {
            return;
          }
          e.preventDefault();
          if (props.href) {
            let match = matchHref(props.href);
            if (match) {
              let { router, search, params, routePath } = match;
              appStore.dispatch(
                new PushRouteAppEvent<any>(routePath, params, search)
              );
            }
          }
        }}
      />
    );
  }
);

export const appTheme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as any,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
  palette: {
    background: {
      default: Color.grey[100],
    },
  },
  shape: { borderRadius: 8 },
});

appTheme.shadows[1] =
  "0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.035),0px 1px 3px 0px rgba(0,0,0,0.03)";
