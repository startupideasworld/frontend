import React from "react";
import { Center } from "../layouts/Center";
import Container from "@mui/material/Container";
import { SiteAppBar } from "./SiteAppBar";
import { appStore } from "../store-config";
import { RootAppState } from "../states/RootAppState";
import { connect } from "react-redux";
import { HomeAppState } from "../states/HomeAppState";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { RoutePath, SearchResultUrlType } from "../route-config";
import { Column } from "../layouts/Column";
import { Chip, Link, Paper, Typography } from "@mui/material";
import { Row } from "../layouts/Row";
import { StandardLikeButton } from "../stateless-components/StandardLikeButton";
import { FloatingWriteButton } from "../stateless-components/FloatingWriteButton";
import { SiteSearchField } from "./SiteSearchField";

type _State = {
  searchText: string;
};

type _Props = {
  homeAppState: HomeAppState;
};

class _Home extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      searchText: "",
    };
  }

  render() {
    return (
      <React.Fragment>
        <SiteAppBar />
        <Container maxWidth='md'>
          <Column sx={{ height: "45vh" }} alignBottom horizCenter>
            <SiteSearchField initialSearchText={this.state.searchText} />
          </Column>
        </Container>
      </React.Fragment>
    );
  }
}

export const HomePage = connect<_Props, {}, {}, RootAppState>((state) => ({
  homeAppState: state.home,
  searcResultAppState: state.searchResult,
}))(_Home);
