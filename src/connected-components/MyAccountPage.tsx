import {
  Container,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import {
  MyAccountUrlType,
  MyCompaniesListUrlType,
  RoutePath,
} from "../route-config";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import { SiteAppBar } from "./SiteAppBar";

type _Props = {
  urlAppState: UrlAppState<MyAccountUrlType>;
  children?: React.ReactNode;
};
type _State = {};

class _MyAccountPage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<MyAccountUrlType>();
  }

  renderPageSidebar() {
    const links: [string, string][] = [
      ["Startups / Projects", RoutePath.myCompanies],
      ["Profile", RoutePath.myProfile],
    ];
    return (
      <List sx={{ width: 300 }}>
        {links.map(([title, path], index) => (
          <ListItem key={index}>
            <ListItemButton
              selected={this.props.urlAppState.path == path}
              component={Link}
              href={path}>
              <ListItemText>{title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <SiteAppBar />
        <Container maxWidth='xl'>
          <Row mt={5}>
            {this.renderPageSidebar()}
            <Container>{this.props.children}</Container>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export const MyAccountPage = connect((state: RootAppState) => {
  return {
    urlAppState: state.url.as<MyAccountUrlType>(),
  };
})(_MyAccountPage);
