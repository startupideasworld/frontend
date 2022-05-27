import {
  ListItem,
  CardMedia,
  Skeleton,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardActions,
  Chip,
  SxProps,
} from "@mui/material";
import React from "react";
import { Column } from "../layouts/Column";
import { Row } from "../layouts/Row";
import { CompanyShortSummaryData } from "../types/min-combinators";
import { SmartImage } from "./SmartImage";

type _Props = {
  companyData: CompanyShortSummaryData;
  sx?: SxProps;
};
type _State = {};

export class CompanyCard extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    let item = this.props.companyData;
    let imgWidth = 200;
    return (
      <ListItem
        disablePadding
        sx={{ alignItems: "start", ...this.props.sx }}
        onMouseDown={(event) => {
          if (item.isSkeleton) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onClick={(event) => {
          if (item.isSkeleton) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}>
        {item.isSkeleton ? (
          <CardMedia>
            <Skeleton
              variant='rectangular'
              width={imgWidth}
              height={imgWidth}
            />
          </CardMedia>
        ) : (
          <CardMedia sx={{ width: imgWidth, alignSelf: "stretch" }}>
            <SmartImage src={item.thumbnail} height={1} width={imgWidth} />
          </CardMedia>
        )}
        <CardContent sx={{ width: 1 }}>
          <Column spacing={1}>
            {(item.headline || item.isSkeleton) && (
              <Typography variant='caption' color='text.secondary'>
                {item.isSkeleton ? <Skeleton width={100} /> : item.headline}
              </Typography>
            )}
            <Typography variant='h6' sx={{ textTransform: "capitalize" }}>
              {item.isSkeleton ? (
                <Skeleton width={200} />
              ) : (
                <Row vertiCenter spacing={1.5}>
                  {item.isConceptual && (
                    <Chip
                      label='Concept'
                      variant='outlined'
                      size='small'
                      sx={{ fontSize: 11 }}
                      color='primary'
                    />
                  )}
                  {item.isProject && (
                    <Chip
                      label='Project'
                      variant='outlined'
                      size='small'
                      sx={{ fontSize: 11 }}
                      color='secondary'
                    />
                  )}
                  <Box>{item.companyName}</Box>
                </Row>
              )}
            </Typography>
            <Typography variant='body2'>
              {item.isSkeleton ? (
                <Skeleton variant='rectangular' height={35} />
              ) : (
                item.summary
              )}
            </Typography>
            <Row vertiCenter spacing={1} pt={2}>
              {item.isSkeleton ? (
                <React.Fragment>
                  <Skeleton variant='circular' width={32} height={32} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <AvatarGroup max={4}>
                    {item.memberAvatars.map((x, i) => (
                      <Avatar key={i} src={x} sx={{ width: 32, height: 32 }} />
                    ))}
                  </AvatarGroup>
                  <Box>{item.memberNames.join(", ")}</Box>
                </React.Fragment>
              )}
            </Row>
          </Column>
        </CardContent>
        {/* {!item.isSkeleton && (
    <CardActions>
      <Button size='small'>Learn More</Button>
    </CardActions>
  )} */}
      </ListItem>
    );
  }
}
