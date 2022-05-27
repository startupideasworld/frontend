import React from "react";
import { connect } from "react-redux";
import { FriendActivitiesRefreshAppEvent } from "../events/FriendActivitiesAppEvent";
import { FriendActivities } from "../stateless-components/StandardFriendActivities";
import { FriendActivitiesAppState } from "../states/FriendActivitiesAppState";
import { RootAppState } from "../states/RootAppState";
import { appStore } from "../store-config";

type _Props = {
  friendActivitiesAppState: FriendActivitiesAppState;
};
type _State = {};

class _FriendActivitiesWidget extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    appStore.dispatch(new FriendActivitiesRefreshAppEvent());
  }

  render(): React.ReactNode {
    return (
      <FriendActivities
        activities={this.props.friendActivitiesAppState.activities
          .toArray()
          .map((x) => x.asFriendActivityData())}
      />
    );
  }
}

export const FriendActivitiesWidget = connect((state: RootAppState) => ({
  friendActivitiesAppState: state.friendActivities,
}))(_FriendActivitiesWidget);

export default FriendActivitiesWidget;
