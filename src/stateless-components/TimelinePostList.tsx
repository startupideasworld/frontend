import { Container, List, CircularProgress } from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Column } from "../layouts/Column";
import { PostData } from "../states/TimelinePostAppState";
import { StandardPostCard } from "./StandardPostCard";

export type TimelinePostListProps = {
  posts: PostData[];
  onFetchMore: () => void;
  onRefresh: () => void;
};
type _State = {
  lastReadPostY: number | null;
  lastReadPostId: string | null;
};
export class TimelinePostList extends React.PureComponent<
  TimelinePostListProps,
  _State
> {
  constructor(props: TimelinePostListProps) {
    super(props);
    this.state = {
      lastReadPostId: null,
      lastReadPostY: null,
    };
  }

  renderPost(post: PostData) {
    return (
      <Column id={post.postId} key={post.postId} mb={5}>
        <Container
          sx={{
            backgroundColor: "white",
            py: 2,
            boxShadow: 1,
            borderRadius: 0.5,
          }}>
          <StandardPostCard elevation={0} postData={post} />
        </Container>
      </Column>
    );
  }

  _onRefresh = () => {
    let posts = this.props.posts;
    if (posts) {
      let postId = posts[0].key;
      let element = document.getElementById(postId)!;
      this.setState({
        lastReadPostId: postId,
        lastReadPostY: element.getBoundingClientRect().top,
      });
    }
    this.props.onRefresh();
  };

  componentDidUpdate() {
    if (this.state.lastReadPostY && this.state.lastReadPostId) {
      let element = document.getElementById(this.state.lastReadPostId)!;
      let y =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        this.state.lastReadPostY;
      window.scrollTo({ top: y });
    }
  }

  render() {
    return (
      <List>
        <InfiniteScroll
          style={{ overflowY: "hidden" }}
          dataLength={this.props.posts.length}
          refreshFunction={this._onRefresh}
          next={this.props.onFetchMore}
          loader={<CircularProgress />}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {this.props.posts.map(this.renderPost)}
        </InfiniteScroll>
      </List>
    );
  }
}
