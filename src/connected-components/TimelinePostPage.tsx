import { CircularProgress, Container, Dialog, Paper } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import {
  TimelinePostLoadInitialContentAppEvent,
  TimelinePostLoadMoreCommentsAppEvent,
} from "../events/TimelinePostAppEvent";
import { TimelinePostUrlType } from "../route-config";
import { TimelinePostAppState } from "../states/TimelinePostAppState";
import { RootAppState } from "../states/RootAppState";
import { UrlAppState } from "../states/UrlAppState";
import { appStore } from "../store-config";
import { StandardPostCard } from "../stateless-components/StandardPostCard";
import { SiteAppBar } from "./SiteAppBar";
import TimelinePage from "./TimelinePage";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostEditor } from "../stateless-components/PostEditor";

type _Props = {
  urlAppState: UrlAppState<TimelinePostUrlType>;
  personalPostAppState: TimelinePostAppState;
};
type _State = {};

class _TimelinePostPage extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get urlAppState() {
    return this.props.urlAppState.as<TimelinePostUrlType>();
  }

  loadPage() {
    if (
      this.props.personalPostAppState.postSlug !==
      this.props.urlAppState.params.postSlug
    ) {
      appStore.dispatch(
        new TimelinePostLoadInitialContentAppEvent({
          timelinePostSlug: this.props.urlAppState.params.postSlug,
        })
      );
    }
  }

  componentDidUpdate() {
    this.loadPage();
  }

  onFetchMore = () => {};

  render(): React.ReactNode {
    let post = this.props.personalPostAppState.asPostData();
    return (
      <TimelinePage>
        <Paper sx={{ padding: 5, borderRadius: 1 }}>
          <InfiniteScroll
            style={{ overflowY: "hidden" }}
            hasMore={true}
            dataLength={this.props.personalPostAppState.comments.length}
            next={() => {
              appStore.dispatch(new TimelinePostLoadMoreCommentsAppEvent());
            }}
            loader={false}>
            <StandardPostCard
              elevation={0}
              showFullArticleAndComments
              postData={post}
            />
          </InfiniteScroll>
        </Paper>
      </TimelinePage>
    );
  }
}

export const TimelinePostPage = connect<_Props, {}, {}, RootAppState>(
  (state) => {
    return {
      urlAppState: state.url.as<TimelinePostUrlType>(),
      personalPostAppState: state.timelinePost,
    };
  }
)(_TimelinePostPage);

export default TimelinePostPage;
