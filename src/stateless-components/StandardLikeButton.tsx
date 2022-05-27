import { Button, CardProps, Typography } from "@mui/material";
import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

type _Props = {
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  disliked: boolean;
  onLike: React.MouseEventHandler;
  onDislike: React.MouseEventHandler;
  onUnLike: React.MouseEventHandler;
  onUnDislike: React.MouseEventHandler;
  disablePropagation?: boolean;
  preventDefault?: boolean;
};

type _State = {
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  disliked: boolean;
};

export class StandardLikeButton extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      likeCount: props.likeCount,
      dislikeCount: props.dislikeCount,
      liked: props.liked,
      disliked: props.disliked,
    };
  }

  onClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    isDislike: boolean
  ) => {
    if (this.props.disablePropagation) {
      event.stopPropagation();
    }
    switch ([this.state.liked, this.state.disliked, isDislike].toString()) {
      case [true, false, true].toString():
        this.setState({
          likeCount: this.state.likeCount - 1,
          dislikeCount: this.state.dislikeCount + 1,
          liked: false,
          disliked: true,
        });
        this.props.onDislike(event);
        this.props.onUnLike(event);
        break;
      case [false, true, false].toString():
        this.setState({
          likeCount: this.state.likeCount + 1,
          dislikeCount: this.state.dislikeCount - 1,
          liked: true,
          disliked: false,
        });
        this.props.onLike(event);
        this.props.onUnDislike(event);
        break;
      case [false, false, false].toString():
        this.setState({
          likeCount: this.state.likeCount + 1,
          liked: true,
        });
        this.props.onLike(event);
        break;
      case [false, false, true].toString():
        this.setState({
          dislikeCount: this.state.dislikeCount + 1,
          disliked: true,
        });
        this.props.onUnLike(event);
        break;
      case [true, false, false].toString():
        this.setState({
          likeCount: this.state.likeCount - 1,
          liked: false,
        });
        this.props.onUnLike(event);
        break;
      case [false, true, true].toString():
        this.setState({
          dislikeCount: this.state.dislikeCount - 1,
          disliked: false,
        });
        this.props.onUnDislike(event);
        break;
    }
  };

  render() {
    return (
      <span>
        <Button
          size='small'
          onMouseDown={(event) => {
            if (this.props.disablePropagation) {
              event.stopPropagation();
            }
            if (this.props.preventDefault) {
              event.preventDefault();
            }
          }}
          onClick={(event) => {
            this.onClick(event, false /* isDislike? */);
          }}
          startIcon={renderIcon(
            this.state.liked, // hightlight?
            false // isDislike?
          )}>
          {renderCount(
            this.state.likeCount,
            this.state.liked, // hightlight?
            false // isDislike?
          )}
        </Button>
        <Button
          size='small'
          onMouseDown={(event) => {
            if (this.props.disablePropagation) {
              event.stopPropagation();
            }
            if (this.props.preventDefault) {
              event.preventDefault();
            }
          }}
          onClick={(event) => {
            this.onClick(event, true /* isDislike? */);
          }}
          startIcon={renderIcon(
            this.state.disliked, // hightlight?
            true // isDislike?
          )}>
          {renderCount(
            this.state.dislikeCount,
            this.state.disliked, // hightlight?
            true // isDislike?
          )}
        </Button>
      </span>
    );
  }
}

function renderIcon(highlighted: boolean, isDislike: boolean) {
  if (highlighted) {
    if (isDislike) {
      return <ThumbDownIcon color='error' />;
    } else {
      return <ThumbUpIcon color='primary' />;
    }
  } else {
    if (isDislike) {
      return <ThumbDownOutlinedIcon color='action' />;
    } else {
      return <ThumbUpOutlinedIcon color='action' />;
    }
  }
}

function renderCount(count: number, highlighted: boolean, isDislike: boolean) {
  let color: string;
  if (highlighted) {
    if (isDislike) {
      color = "error";
    } else {
      color = "primary";
    }
  } else {
    color = "text.secondary";
  }
  return (
    <Typography variant='caption' color={color}>
      {count}
    </Typography>
  );
}
