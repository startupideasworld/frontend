import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Box,
  Button,
  CardContent,
  Typography,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  TextField,
  MenuList,
  MenuItem,
  ListItemIcon,
  Menu,
  CardActionArea,
  CardProps,
  Grid,
  Link,
  Container,
  Paper,
  Skeleton,
} from "@mui/material";
import React from "react";
import { ReactNode } from "react";
import { Row } from "../layouts/Row";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Column } from "../layouts/Column";
import { EditCompanyPeopleRemoveUserAppEvent } from "../events/EditCompanyPeopleAppEvent";
import { appStore } from "../store-config";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  ChatOutlinedIcon,
  ChevronRightRoundedIcon,
  ExpandMoreRoundedIcon,
  FormatQuoteRoundedIcon,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  QuestionAnswerOutlinedIcon,
  RepeatOneRoundedIcon,
  ReportRoundedIcon,
  SwapCallsRoundedIcon,
} from "./icons-collection";
import {
  buildRoutePath,
  TimelinePostUrlType,
  RoutePath,
} from "../route-config";
import { CommentData, PostData } from "../states/TimelinePostAppState";
import { Conditional } from "../layouts/Conditional";
import { Center } from "../layouts/Center";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { PushRouteAppEvent } from "../events/PushRouteAppEvent";
import { BasePostData, PostShortSummaryData } from "../types/min-combinators";
import { SitePostEditorOpenDialogAppEvent } from "../events/SitePostEditorAppEvent";

type PostType = "comment" | "originalPost" | "repost";
export type StandardPostCardProps = {
  showFullArticleAndComments?: boolean;
  onReadMoreComments?: () => void;
  postData: PostData;
  smallLayout?: boolean;
} & CardProps;

// type ReplyContext = {
//   userName: string;
//   commentId: string;
//   content: string;
// };

/**
 * What is the difference between Comment (aka Discussion) and Spread (aka
 * Repost)?
 *
 * Every comment must refer to the parent post. This is stored in the ".quote"
 * field. A Spread is the same as a comment, except that a Spread can have
 * Comments, but a Comment cannot.
 */

type _State = {
  // replySaved: {
  //   [commentId: string]: ReplyContext;
  // };
  showMenu: boolean;
  showComments: boolean;
  currentEditQuote: PostShortSummaryData | null; // Whenever user clicks on Spread or Comment, the parent post is stored here temporarily.
};

export class StandardPostCard extends React.Component<
  StandardPostCardProps,
  _State
> {
  constructor(props: StandardPostCardProps) {
    super(props);
    this.state = {
      // replySaved: {},
      showMenu: false,
      showComments: false,
      currentEditQuote: null,
    };
  }

  menuAnchorEl: HTMLElement | null = null;

  onAbandonReply = (commentId: string) => {
    // const replySaved = { ...this.state.replySaved };
    // replySaved[commentId] = { ...this.state.commentQuote! };
    this.setState({
      // replySaved: replySaved,
      currentEditQuote: null,
    });
  };

  onUpdatingReplyContent = (newContent: string) => {
    const currentReplyTo = this.state.currentEditQuote!;
    this.setState({
      currentEditQuote: {
        ...currentReplyTo,
        summary: newContent,
      },
    });
  };

  // onClickReply = ({
  //   commentId,
  //   userName,
  // }: {
  //   userName: string;
  //   commentId: string;
  // }) => {
  //   // const replySaved = this.state.replySaved[commentId];
  //   this.setState({
  //     commentQuote: {
  //       postId: commentId,
  //       // userName,
  //       content: replySaved?.content ?? "",
  //     },
  //   });
  // };
  onClickLike(post: PostShortSummaryData) {}
  onClickComment(post: PostShortSummaryData) {
    this.setState({
      currentEditQuote: {
        author: post.author,
        postId: post.postId,
        postSlug: post.postSlug,
        summary: post.summary,
        timestamp: post.timestamp,
      },
    });
  }

  renderRepostContent(repost: PostShortSummaryData) {
    return (
      <React.Fragment>
        <CardContent>
          <Row vertiCenter spacing={1}>
            <SwapCallsRoundedIcon
              fontSize='small'
              sx={{ color: "secondary.light" }}
            />
            <Typography variant='caption' color='secondary.light'>
              Spread in the Community
            </Typography>
          </Row>
        </CardContent>
        <Container maxWidth='md' sx={{ my: 2 }}>
          <Card sx={{ bgcolor: "grey.50", borderRadius: 2 }} variant='outlined'>
            <CardActionArea
              onClick={() => {
                appStore.dispatch(
                  new PushRouteAppEvent<TimelinePostUrlType>(
                    RoutePath.timelinePost,
                    {
                      userSlug: repost.author.userSlug,
                      postSlug: repost.postSlug,
                    },
                    {}
                  )
                );
              }}>
              <CardHeader
                avatar={<Avatar src={repost.author.avatar} />}
                title={
                  <Row spacing={1} vertiCenter>
                    <Typography color='secondary' variant='caption'>
                      OP
                    </Typography>
                    <Typography variant='subtitle1'>
                      {repost.author.name}
                    </Typography>
                  </Row>
                }
                subheader={
                  <Column spacing={0}>
                    <Typography variant='caption'>
                      {repost.author.profession}
                    </Typography>
                    <Typography variant='caption'>
                      {formatDistanceToNow(repost.timestamp, {
                        addSuffix: true,
                      })}
                    </Typography>
                  </Column>
                }
              />
              <CardContent>
                <Typography variant='body2'>{repost.summary}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      </React.Fragment>
    );
  }

  renderMainPost(post: PostData) {
    return (
      <React.Fragment>
        <CardHeader
          avatar={
            this.props.postData.isSkeleton ? (
              <Skeleton variant='circular' width={50} height={50} />
            ) : (
              <Avatar src={post.author.avatar} sx={{ width: 50, height: 50 }} />
            )
          }
          action={
            this.props.postData.isSkeleton ? (
              false
            ) : (
              <Row spacing={2} vertiCenter>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<LinkedInIcon />}>
                  Connect
                </Button>
                <IconButton
                  aria-label='settings'
                  onClick={() => {
                    this.setState({ showMenu: true });
                  }}
                  ref={(ref) => {
                    this.menuAnchorEl = ref;
                  }}>
                  <MoreVertIcon />
                </IconButton>
              </Row>
            )
          }
          title={
            <Typography variant='subtitle1'>
              {this.props.postData.isSkeleton ? (
                <Skeleton width={150} />
              ) : (
                post.author.name
              )}
            </Typography>
          }
          subheader={
            <Column spacing={0}>
              <Typography variant='caption'>
                {this.props.postData.isSkeleton ? (
                  <Skeleton width={50} />
                ) : (
                  post.author.profession
                )}
              </Typography>
              <Typography variant='caption'>
                {this.props.postData.isSkeleton ? (
                  <Skeleton width={100} />
                ) : (
                  formatDistanceToNow(post.timestamp, {
                    addSuffix: true,
                  })
                )}
              </Typography>
            </Column>
          }
        />
        {this.props.postData.isSkeleton ? (
          <Skeleton variant='rectangular' height={300} sx={{ mb: 1 }} />
        ) : (
          <React.Fragment>
            {post.originalPost && this.renderRepostContent(post.originalPost)}
            {post.quote && (
              <CardContent>
                <Column spacing={2}>
                  <Row>
                    <Row vertiCenter spacing={1}>
                      <QuestionAnswerOutlinedIcon
                        fontSize='small'
                        sx={{ color: "secondary.light" }}
                      />
                      <Typography variant='caption' color='secondary.light'>
                        And commented on the discussion
                      </Typography>
                    </Row>
                  </Row>
                  <CardActionArea>
                    <Row>{this.renderQuote(post.quote)}</Row>
                  </CardActionArea>
                </Column>
              </CardContent>
            )}
            <CardContent>
              <Typography variant='body1'>{post.content}</Typography>
            </CardContent>
            <CardActions>
              <Row>
                {!this.props.showFullArticleAndComments && (
                  <Button
                    LinkComponent={Link}
                    variant='text'
                    size='small'
                    onClick={() => {
                      appStore.dispatch(
                        new PushRouteAppEvent<TimelinePostUrlType>(
                          RoutePath.timelinePost,
                          {
                            userSlug: post.author.userSlug,
                            postSlug: post.postSlug,
                          },
                          {}
                        )
                      );
                    }}
                    startIcon={<ChevronRightRoundedIcon />}>
                    Read this thread
                  </Button>
                )}
              </Row>
            </CardActions>
          </React.Fragment>
        )}
        {!this.props.postData.isSkeleton && (
          <CardActions>
            <Row spacing={3} vertiCenter>
              {this.renderActionButton({
                icon: <LinkedInIcon sx={{ height: 24, width: 24 }} />,
                useCount: false,
                pressed: false,
                onClick: function (): void {
                  throw new Error("Function not implemented.");
                },
                pressedColor: "primary",
              })}
              {this.renderActionButton({
                icon: <FavoriteIcon sx={{ height: 24, width: 24 }} />,
                onClick: () => {
                  this.onClickLike(post);
                },
                count: post.likesCount,
                pressed: post.userLiked,
                pressedColor: "error",
                useCount: true,
              })}
              {post.originalPost &&
                this.renderActionButton({
                  icon: <RepeatOneRoundedIcon sx={{ height: 24, width: 24 }} />,
                  onClick: () => {
                    appStore.dispatch(
                      new SitePostEditorOpenDialogAppEvent({
                        quote: post,
                        original: post.originalPost ?? undefined,
                      })
                    );
                  },
                  buttonText: this.props.smallLayout
                    ? undefined
                    : "Spread Repost",
                  count: post.repostsCount,
                  pressed: post.userReposted,
                  pressedColor: "secondary",
                  useCount: true,
                })}
              {this.renderActionButton({
                icon: <SwapCallsRoundedIcon sx={{ height: 24, width: 24 }} />,
                onClick: () => {
                  appStore.dispatch(
                    new SitePostEditorOpenDialogAppEvent({
                      original: post.originalPost ?? post,
                    })
                  );
                },
                buttonText: this.props.smallLayout
                  ? undefined
                  : post.originalPost
                  ? "Spread Original"
                  : "Spread",
                count: post.repostsCount,
                pressed: post.userReposted,
                pressedColor: "secondary",
                useCount: true,
              })}
              {this.renderActionButton({
                icon: <ChatOutlinedIcon sx={{ height: 24, width: 24 }} />,
                onClick: () => {
                  this.onClickComment(post);
                },
                buttonText: this.props.smallLayout ? undefined : "Disucssion",
                count: post.commentsCount,
                pressed: post.userCommented,
                pressedColor: "primary",
                useCount: true,
              })}
            </Row>
            {/* <ExpandMore
  expand={expanded}
  onClick={handleExpandClick}
  aria-expanded={expanded}
  aria-label='show more'>
  <ExpandMoreIcon />
</ExpandMore> */}
          </CardActions>
        )}
      </React.Fragment>
    );
  }

  render(): ReactNode {
    let post = this.props.postData;
    return (
      <React.Fragment>
        <Card
          sx={{ minWidth: 200, flexShrink: 1, ...this.props.sx }}
          elevation={this.props?.elevation ?? 1}>
          {this.renderMainPost(post)}
          {this.state.currentEditQuote?.postId === post.postId && (
            <CardActions>
              {this.renderCommentEditor({
                userName: post.author.name,
                commentId: post.postId,
              })}
            </CardActions>
          )}
          {!this.props.smallLayout && this.renderComments()}
        </Card>
        {this.renderMenu()}
      </React.Fragment>
    );
  }

  renderComments() {
    return (
      this.props.postData.comments.length > 0 && (
        <CardContent>
          <Divider textAlign='left'>
            <Row vertiCenter spacing={1}>
              <Typography variant='subtitle1'>Discussions</Typography>
              <Typography variant='subtitle2'>
                ({this.props.postData.commentsCount})
              </Typography>
            </Row>
          </Divider>
          <List>
            {this.props.showFullArticleAndComments ? (
              this.props.postData.comments.map((comment, index) =>
                this.renderCommentItem(comment, index)
              )
            ) : (
              <Center>
                {this.renderCommentItem(this.props.postData.comments[0], 0)}
                <Chip
                  icon={
                    this.state.showComments ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  label={
                    this.state.showComments
                      ? "Hide discussions"
                      : "Read more discussions"
                  }
                  size='small'
                  variant='outlined'
                  clickable
                  sx={{ border: "none" }}
                  onClick={() => {
                    this.setState({
                      showComments: !this.state.showComments,
                    });
                    this.props.onReadMoreComments?.();
                  }}
                />
              </Center>
            )}
          </List>
          {this.props.postData.comments.length === 0 && (
            <Typography variant='caption'>No disucssion</Typography>
          )}
        </CardContent>
      )
    );
  }

  onCloseMenu = () => {
    this.setState({ showMenu: false });
  };

  renderMenu() {
    return (
      this.state.showMenu &&
      this.menuAnchorEl && (
        <Menu
          elevation={2}
          anchorEl={this.menuAnchorEl}
          open={this.menuAnchorEl !== null}
          onClose={this.onCloseMenu}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          transformOrigin={{
            horizontal: "right",
            vertical: "top",
          }}>
          <MenuItem
            onClick={() => {
              this.onCloseMenu();
            }}
            dense>
            <ListItemIcon>
              <DeleteRoundedIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography>Delete</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.onCloseMenu();
            }}
            dense>
            <ListItemIcon>
              <ReportRoundedIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography>Spam</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      )
    );
  }

  renderCommentEditor({
    userName,
    commentId,
  }: {
    userName: string;
    commentId: string;
  }) {
    return (
      <Column width={1 / 1}>
        <TextField
          sx={{ width: 1 / 1 }}
          label={`Reply to @${userName}`}
          multiline
          onChange={(event) => {
            this.onUpdatingReplyContent(event.target.value);
          }}
          minRows={6}
        />
        <Row mt={2} spacing={2}>
          <Button
            onClick={(event) => {
              this.onAbandonReply(commentId);
            }}>
            Cancel
          </Button>
          <Button variant='contained' color='primary' disableElevation>
            Comment
          </Button>
        </Row>
      </Column>
    );
  }

  renderQuote(post: PostShortSummaryData) {
    return (
      <ListItem
        sx={{
          bgcolor: "grey.300",
          px: 3,
          py: 1,
          alignItems: "start",
          borderRadius: 2,
        }}>
        <ListItemIcon>
          <FormatQuoteRoundedIcon fontSize='small' />
        </ListItemIcon>
        <Column>
          <Row spacing={1} vertiCenter>
            <Typography variant='body2'>@{post.author.name}</Typography>
            <Typography variant='caption' color='text.secondary'>
              &#x2022;{" "}
              {formatDistanceToNow(post.timestamp, {
                addSuffix: true,
              })}
            </Typography>
            {/* <Avatar src={post.author.avatar} sx={{ width: 24, height: 24 }} /> */}
          </Row>
          <ListItemText secondary={post.summary} />
        </Column>
      </ListItem>
    );
  }

  renderCommentItem(comment: CommentData, index: number) {
    let quoteIsOp = comment.quote?.postId === this.props.postData.postId;
    return (
      <Grid
        container
        sx={{ alignItems: "start", bgcolor: "grey.50", borderRadius: 3 }}
        mb={2}
        padding={2}
        key={comment.key}>
        <Grid item md={12} lg={this.props.smallLayout ? 12 : 3}>
          <ListItem key={index} alignItems='flex-start'>
            <ListItemAvatar>
              {comment.isSkeleton ? (
                <Skeleton width={40} height={40} variant='circular' />
              ) : (
                <Avatar src={comment.author.avatar} />
              )}
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ variant: "body2" }}
              primary={comment.isSkeleton ? <Skeleton /> : comment.author.name}
              secondaryTypographyProps={{
                component: "div",
              }}
              secondary={
                <Column>
                  <Typography variant='caption'>
                    {comment.isSkeleton ? (
                      <Skeleton />
                    ) : (
                      comment.author.profession
                    )}
                  </Typography>
                  <Typography variant='caption'>
                    {comment.isSkeleton ? (
                      <Skeleton width={60} />
                    ) : (
                      formatDistanceToNow(comment.timestamp, {
                        addSuffix: true,
                      })
                    )}
                  </Typography>
                </Column>
              }
            />
          </ListItem>
        </Grid>
        <Grid item md={12} lg={this.props.smallLayout ? 12 : 9}>
          {comment.isSkeleton ? (
            <Skeleton variant='rectangular' height={100} />
          ) : (
            <Column spacing={1}>
              {comment.quote && !quoteIsOp && this.renderQuote(comment.quote)}
              <ListItemText primary={comment.content} sx={{ py: 1 }} />

              <Row vertiCenter spacing={2}>
                {this.renderActionButton({
                  icon: <LinkedInIcon sx={{ height: 20, width: 20 }} />,
                  useCount: false,
                  pressed: false,
                  onClick: function (): void {
                    throw new Error("Function not implemented.");
                  },
                  pressedColor: "primary",
                })}
                {this.renderActionButton({
                  icon: (
                    <FavoriteIcon
                      sx={{ height: 20, width: 20 }}
                      color='inherit'
                    />
                  ),
                  onClick: () => this.onClickLike(comment),
                  count: comment.likesCount,
                  pressed: comment.userLiked,
                  pressedColor: "error",
                  useCount: true,
                })}
                {this.renderActionButton({
                  icon: <SwapCallsRoundedIcon sx={{ height: 20, width: 20 }} />,
                  onClick: () => {
                    appStore.dispatch(
                      new SitePostEditorOpenDialogAppEvent({
                        quote: comment,
                        original: comment.originalPost ?? undefined,
                      })
                    );
                  },
                  count: comment.repostsCount,
                  pressed: comment.userReposted,
                  pressedColor: "secondary",
                  useCount: true,
                })}
                {this.renderActionButton({
                  icon: (
                    <FormatQuoteRoundedIcon sx={{ height: 20, width: 20 }} />
                  ),
                  onClick: () => this.onClickComment(comment),
                  pressed: comment.userCommented,
                  pressedColor: "primary",
                  useCount: false,
                })}
              </Row>
              {this.state.currentEditQuote?.postId === comment.postId &&
                this.renderCommentEditor({
                  userName: comment.author.name,
                  commentId: comment.postId,
                })}
            </Column>
          )}
        </Grid>
      </Grid>
    );
  }

  renderActionButton(props: {
    count?: number;
    icon: React.ReactNode;
    buttonText?: string;
    pressed: boolean;
    onClick: () => void;
    pressedColor:
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    useCount: boolean;
  }) {
    let _count = props.count ?? 0;
    if (props.pressed) {
      _count += 1;
    }
    return (_count && props.useCount) || props.buttonText ? (
      <Button
        sx={{ color: props.pressed ? props.pressedColor : "text.secondary" }}
        color={props.pressed ? props.pressedColor : "inherit"}
        startIcon={props.icon}
        endIcon={_count > 0 && (props.buttonText ? `(${_count})` : _count)}
        onClick={props.onClick}>
        {props.buttonText}
      </Button>
    ) : (
      <IconButton
        sx={{ color: props.pressed ? props.pressedColor : "text.secondary" }}
        color={props.pressed ? props.pressedColor : "inherit"}
        onClick={props.onClick}>
        {props.icon}
      </IconButton>
    );
  }
}
