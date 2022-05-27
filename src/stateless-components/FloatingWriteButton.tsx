import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  Divider,
  Fab,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import React from "react";
import {
  DomainAddRoundedIcon,
  DriveFileRenameOutlineRoundedIcon,
  EditIcon,
  ForumRoundedIcon,
  QuestionAnswerOutlinedIcon,
  SmsOutlinedIcon,
  SmsRoundedIcon,
  TipsAndUpdatesOutlinedIcon,
} from "./icons-collection";

type _Props = {
  children?: React.ReactNode;
};
type _State = {
  menuOpen: boolean;
};
export class FloatingWriteButton extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  anchorEl: HTMLElement | null = null;

  render() {
    return (
      <React.Fragment>
        <Box sx={{ position: "fixed", right: 40, bottom: 40 }}>
          <Fab
            color='primary'
            aria-label='edit'
            onClick={() => {
              this.setState({
                menuOpen: true,
              });
            }}
            ref={(ref) => {
              this.anchorEl = ref;
            }}>
            <EditIcon />
          </Fab>
        </Box>
        {this.anchorEl && (
          <Menu
            open={this.state.menuOpen}
            anchorEl={this.anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            onClose={() => {
              this.setState({
                menuOpen: false,
              });
            }}
            PaperProps={{
              sx: { borderRadius: 2 },
            }}>
            <MenuList
              sx={{
                "& a": {
                  px: 3,
                  py: 1,
                },
              }}>
              <ListItemButton component={Link}>
                <ListItemIcon>
                  <DriveFileRenameOutlineRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="What's on your mind?" />
              </ListItemButton>
              {this.props.children}
            </MenuList>
          </Menu>
        )}
      </React.Fragment>
    );
  }
}
