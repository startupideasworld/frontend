import React from "react";
import { connect } from "react-redux";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";

type _Props = {};
type _State = {};

class _FriendListWidget extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return <React.Fragment></React.Fragment>;
  }
}

export const FriendListWidget = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {};
  }
)(_FriendListWidget);

export default FriendListWidget;
