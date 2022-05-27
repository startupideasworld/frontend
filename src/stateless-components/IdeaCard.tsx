import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardProps,
  Paper,
  PaperProps,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import { TagData } from "../types/min-combinators";
import { StandardLikeButton } from "./StandardLikeButton";

type _Props = {
  ideaData: TagData;
  disableRipple?: boolean;
  onClick?: React.MouseEventHandler;
} & CardProps;
type _State = {};

export class IdeaCard extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  get cardProps(): CardProps {
    let props: Partial<_Props> = { ...this.props };
    delete props.ideaData;
    delete props.disableRipple;
    return props;
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Card
          elevation={1}
          {...this.cardProps}
          sx={{
            borderRadius: 2,
            bgcolor: "grey.50",
            maxWidth: 325,
            ...this.cardProps.sx,
          }}>
          <CardActionArea
            component='div'
            onClick={this.props.onClick}
            disableRipple={this.props.disableRipple}>
            <CardContent>
              <Typography variant='subtitle2'>
                {this.props.ideaData.humanText}
              </Typography>
            </CardContent>
            <CardActions>
              <CardContent>
                <Typography variant='caption' color='text.secondary'>
                  Is this a good idea?
                </Typography>
              </CardContent>
              <StandardLikeButton
                likeCount={0}
                dislikeCount={0}
                liked={false}
                disliked={false}
                disablePropagation
                preventDefault
                onDislike={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onLike={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onUnLike={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onUnDislike={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              />
            </CardActions>
          </CardActionArea>
        </Card>
      </React.Fragment>
    );
  }
}
