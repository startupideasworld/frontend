import {
  Avatar,
  Box,
  BoxProps,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Popper,
  ThemeProvider,
} from "@mui/material";
import RichMarkdownEditor from "rich-markdown-editor";
import { Props as RichEditorProps } from "rich-markdown-editor";
import { light as lightTheme } from "rich-markdown-editor/dist/styles/theme";
import "./StandardEditor.scss";
import React from "react";
import MentionsExtension, {
  InputEventBehavior,
  MentionNode,
  MentioNodeAttrs,
} from "./StandardEditorPlugin";
import { Random } from "../states/random-generation";

export type StandardEditorProps = {
  editorProps?: Partial<RichEditorProps>;
  placeholder?: string;
  minRows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (getValue: () => string) => void;
  mutators?: (mutators: { changeText: (text: string) => void }) => void;
  mentionsOptions: {
    attrs: MentioNodeAttrs;
    display: {
      avatar: string;
      name: string;
    };
  }[];
} & Omit<BoxProps, "onChange">;
type _State = {
  mentionMenuAnchorEl?: HTMLElement;
  mentionMenuSearchText?: string;
  mentionMenuCompleter?: (attrs: MentioNodeAttrs) => void;
  mentionsHoverIndex: number;
};

export class StandardEditor extends React.PureComponent<
  StandardEditorProps,
  _State
> {
  constructor(props: StandardEditorProps) {
    super(props);
    this.state = {
      mentionsHoverIndex: 0,
    };
  }

  editor: RichMarkdownEditor | null = null;

  onRemoveMenu = {
    mentionMenuAnchorEl: undefined,
    mentionMenuCompleter: undefined,
    mentionsHoverIndex: 0,
  };

  insertText(text: string) {
    if (this.editor) {
      let newTr = this.editor.view.state.tr.insertText(text);
      this.editor.view.dispatch(newTr);
    }
  }

  insertMention(attrs: MentioNodeAttrs) {
    if (this.editor) {
      let state = this.editor.view.state;
      let node = state.schema.nodes["mention"].create(attrs);
      let pos = state.selection.$to.before(state.selection.$to.depth + 1);
      let tr = state.tr.insert(pos, node).insertText(" ");
      this.editor.view.dispatch(tr);
    }
  }

  render(): React.ReactNode {
    let minRows = this.props.minRows ?? 5;
    let _boxProps = {
      backgroundColor: "grey.50",
      minHeight: minRows + "em",
      py: 2,
      px: 4,
      ...this.props,
    };
    delete _boxProps.editorProps;
    delete _boxProps.onChange;
    let boxProps = _boxProps as Omit<BoxProps, "onChange">;
    return (
      <React.Fragment>
        <Popper
          open={this.state.mentionMenuAnchorEl !== undefined}
          placement='bottom-start'
          anchorEl={this.state.mentionMenuAnchorEl}>
          <Paper>
            <List>
              {this.props.mentionsOptions &&
                this.props.mentionsOptions.map((mention, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      onMouseOver={() => {
                        this.setState({
                          mentionsHoverIndex: -1,
                        });
                      }}
                      onClick={() => {
                        this.state.mentionMenuCompleter?.(mention.attrs);
                        this.setState({
                          ...this.onRemoveMenu,
                        });
                      }}
                      selected={index === this.state.mentionsHoverIndex}>
                      <ListItemAvatar>
                        <Avatar src={mention.display.avatar}></Avatar>
                      </ListItemAvatar>
                      <ListItemText>{mention.display.name}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Popper>
        <Box {...boxProps} className='StandardEditorBox'>
          <RichMarkdownEditor
            ref={(ref) => {
              this.editor = ref;
            }}
            value={this.props.value}
            defaultValue={this.props.defaultValue}
            theme={{
              ...lightTheme,
              background: "transparent",
            }}
            onChange={(value) => {
              this.props.onChange?.(value);
            }}
            onClickHashtag={(tag) => {}}
            onSearchLink={async (searchTerm) => {
              // const results = await MyAPI.search(searchTerm);
              return [
                {
                  title: "@title",
                  subtitle: "subtitle",
                  url: "url",
                },
              ];
            }}
            placeholder={this.props.placeholder}
            {...this.props.editorProps}
            extensions={[
              new MentionNode(),
              new MentionsExtension({
                mentionTrigger: ["@", "#"],
                allowSpace: false,
                onActive: (text, anchorEl, completer) => {
                  this.setState({
                    mentionMenuSearchText: text,
                    mentionMenuAnchorEl: anchorEl,
                    mentionMenuCompleter: completer,
                  });
                },
                onChange: (text) => {
                  this.setState({
                    mentionMenuSearchText: text,
                  });
                },
                onAbort: () => {
                  console.log("onAbort");
                  this.setState({
                    ...this.onRemoveMenu,
                  });
                },
                onInputEvent: (event) => {
                  // console.log(event.key, text);
                  switch (event.key) {
                    case "ArrowUp":
                      this.setState({
                        mentionsHoverIndex: Math.max(
                          0,
                          this.state.mentionsHoverIndex - 1
                        ),
                      });
                      return InputEventBehavior.preventEditorActions;
                    case "ArrowDown":
                      if (this.props.mentionsOptions) {
                        this.setState({
                          mentionsHoverIndex: Math.min(
                            this.props.mentionsOptions.length - 1,
                            this.state.mentionsHoverIndex + 1
                          ),
                        });
                      }
                      return InputEventBehavior.preventEditorActions;
                    case "Escape":
                      this.setState({
                        ...this.onRemoveMenu,
                      });
                      return InputEventBehavior.preventEditorActions;
                    case "Tab":
                    case "Enter":
                      if (
                        this.props.mentionsOptions &&
                        this.props.mentionsOptions.length > 0
                      ) {
                        this.state.mentionMenuCompleter?.(
                          this.props.mentionsOptions[
                            this.state.mentionsHoverIndex
                          ].attrs
                        );
                      }
                      this.setState({
                        ...this.onRemoveMenu,
                      });
                      return InputEventBehavior.preventEditorActions;
                    default:
                      return InputEventBehavior.allowEditorActions;
                  }
                },
              }),
            ]}
          />
        </Box>
      </React.Fragment>
    );
  }
}
