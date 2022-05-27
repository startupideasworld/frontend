import {
  Box,
  Chip,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { connect, MapStateToProps } from "react-redux";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { TimelineLoadWatchedTopicsAppEvent } from "../events/TimelineAppEvent";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import {
  buildRoutePath,
  RoutePath,
  TimelineListUrlType,
  TimelineUrlType,
} from "../route-config";
import {
  DoDisturbOutlinedIcon,
  HomeIcon,
  MoreVertIcon,
  PublicIcon,
} from "../stateless-components/icons-collection";
import { PersonalTimelinePageLayout } from "../stateless-components/PersonalTimelinePageLayout";
import { ReturnToTopButton } from "../stateless-components/ReturnToTopButton";
import { FriendActivitiesAppState } from "../states/FriendActivitiesAppState";
import { RootAppState } from "../states/RootAppState";
import { SessionAppState } from "../states/SessionAppState";
import { TimelineAppState } from "../states/TimelineAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import FriendActivitiesWidget from "./FriendActivitiesWidget";
import { SiteAppBar } from "./SiteAppBar";
import SitePostEditor from "./SitePostEditor";

type _Props = {
  urlAppState: UrlAppState<TimelineUrlType>;
  sessionAppState: SessionAppState;
  timelineAppState: TimelineAppState;
  children: React.ReactNode;
};
type _State = {
  topicMenuAnchorEl?: HTMLElement;
  peopleMenuAnchorEl?: HTMLElement;
};

class _TimelinePage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    appStore.dispatch(new TimelineLoadWatchedTopicsAppEvent());
  }

  get urlAppState() {
    return this.props.urlAppState.as<TimelineUrlType>();
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <SiteAppBar></SiteAppBar>
        <PersonalTimelinePageLayout
          leftColumn={
            <Column>
              {renderNavigation(this.props)}
              {this.renderTopics()}
              {this.renderPeople()}
            </Column>
          }>
          {this.props.children}
          <ReturnToTopButton />
          <SitePostEditor />
        </PersonalTimelinePageLayout>
      </React.Fragment>
    );
  }

  renderPeople() {
    return (
      <List dense>
        <ListItem>
          <Typography variant='h6'>People</Typography>
        </ListItem>
        <FriendActivitiesWidget />
        <Menu
          open={this.state.peopleMenuAnchorEl !== undefined}
          onClose={() => {
            this.setState({
              peopleMenuAnchorEl: undefined,
            });
          }}
          anchorEl={this.state.peopleMenuAnchorEl}>
          <MenuList dense disablePadding>
            <MenuItem>
              <ListItemIcon>
                <DoDisturbOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Not interested</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      </List>
    );
  }

  renderTopics() {
    return (
      <Column>
        <List dense>
          <ListItem>
            <Typography variant='h6'>Topics</Typography>
          </ListItem>
          {this.props.timelineAppState.watchedTopics
            .toArray()
            .map((x, index) => (
              <ListItem
                key={index}
                disablePadding
                secondaryAction={
                  !x.isSkeleton && (
                    <IconButton
                      onClick={(e) => {
                        this.setState({
                          topicMenuAnchorEl: e.target as HTMLElement,
                        });
                      }}>
                      <MoreVertIcon />
                    </IconButton>
                  )
                }>
                <ListItemButton
                  onClick={() => {
                    if (x.isSkeleton) {
                      return;
                    }
                    appStore.dispatch(
                      new PushRouteAppEvent<TimelineUrlType>(
                        RoutePath.timelineTopic,
                        { topicSlug: x.getLinkText() },
                        {}
                      )
                    );
                  }}>
                  <ListItemText
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                    {x.isSkeleton ? <Skeleton /> : x.originalText}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Menu
          open={this.state.topicMenuAnchorEl !== undefined}
          onClose={() => {
            this.setState({
              topicMenuAnchorEl: undefined,
            });
          }}
          anchorEl={this.state.topicMenuAnchorEl}>
          <MenuList dense disablePadding>
            <MenuItem>
              <ListItemIcon>
                <DoDisturbOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Not interested</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      </Column>
    );
  }
}

function renderNavigation(props: _Props) {
  return (
    <List>
      <ListItem>
        <ListItemButton
          onClick={() => {
            appStore.dispatch(
              new PushRouteAppEvent<TimelineUrlType>(
                RoutePath.timelinePublic,
                {},
                {}
              )
            );
          }}>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText>Public</ListItemText>
        </ListItemButton>
      </ListItem>
      {props.sessionAppState.user && (
        <ListItem>
          <ListItemButton
            onClick={() => {
              appStore.dispatch(
                new PushRouteAppEvent<TimelineListUrlType>(
                  RoutePath.timelineList,
                  { userSlug: props.sessionAppState.user!.slug },
                  {}
                )
              );
            }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Me</ListItemText>
          </ListItemButton>
        </ListItem>
      )}
    </List>
  );
}

export const TimelinePage = connect((state: RootAppState) => ({
  urlAppState: state.url.as<TimelineUrlType>(),
  timelineAppState: state.timeline,
  sessionAppState: state.session,
}))(_TimelinePage);

export default TimelinePage;
