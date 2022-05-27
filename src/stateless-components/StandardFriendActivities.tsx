import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
  ListItemButton,
  Link,
  IconButton,
  Skeleton,
} from "@mui/material";
import React from "react";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { Column } from "../layouts/Column";
import {
  buildRoutePath,
  RoutePath,
  TimelineListUrlType,
} from "../route-config";
import { appStore } from "../store-config";
import { MoreVertIcon } from "./icons-collection";

export type FriendActivityData = {
  key: string;
  name: string;
  avatar: string;
  profession: string;
  userId: string;
  userSlug: string;
  activitiesCount: number;
  lastActive: string;
  isSkeleton: boolean;
};

type _Props = {
  activities: FriendActivityData[];
};
type _State = {};
export class FriendActivities extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <List>
        {this.props.activities.map((person) => (
          <ListItem
            key={person.key}
            sx={{ alignItem: "start" }}
            disablePadding
            secondaryAction={
              !person.isSkeleton && (
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
                if (person.isSkeleton) {
                  return;
                }
                appStore.dispatch(
                  new PushRouteAppEvent<TimelineListUrlType>(
                    RoutePath.timelineList,
                    { userSlug: person.userSlug },
                    {}
                  )
                );
              }}>
              <ListItemAvatar sx={{ pr: 2 }}>
                {person.isSkeleton ? (
                  <Skeleton variant='circular' height={50} width={50} />
                ) : (
                  <Badge
                    color='secondary'
                    badgeContent={person.activitiesCount}
                    max={9}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}>
                    <Avatar
                      src={person.avatar}
                      sx={{ height: 50, width: 50 }}
                    />
                  </Badge>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={person.isSkeleton ? <Skeleton /> : person.name}
                secondaryTypographyProps={{ component: "div" }}
                secondary={
                  <Column>
                    <Typography variant='caption'>
                      {person.isSkeleton ? <Skeleton /> : person.profession}
                    </Typography>
                    <Typography variant='caption'>
                      {person.isSkeleton ? (
                        <Skeleton width={100} />
                      ) : (
                        person.lastActive
                      )}
                    </Typography>
                  </Column>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }
}
