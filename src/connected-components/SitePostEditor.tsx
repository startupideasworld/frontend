import { Dialog, IconButton } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { SitePostEditorCloseDialogAppEvent } from "../events/SitePostEditorAppEvent";
import { ClearRoundedIcon } from "../stateless-components/icons-collection";
import {
  PostEditorProps,
  PostEditor,
} from "../stateless-components/PostEditor";
import { RootAppState } from "../states/RootAppState";
import { SessionAppState } from "../states/SessionAppState";
import { SitePostEditorAppState } from "../states/SitePostEditorAppState";
import { appStore } from "../store-config";

type _Props = {
  sitePostEditor: SitePostEditorAppState;
  sessionAppState: SessionAppState;
};
type _State = {};

class _SitePostEditor extends React.Component<_Props, _State> {
  constructor(props: _Props) {
    super(props);
    this.state = {};
  }

  renderEditor(editorProps?: Partial<PostEditorProps>) {
    let _session = this.props.sessionAppState;
    let _state = this.props.sitePostEditor;
    if (_session.user) {
      return (
        <PostEditor
          {...editorProps}
          author={_session.user}
          context={{
            prefilledIdea: _state.findCollaborator?.idea || undefined,
            prefilledLocation: _state.findCollaborator?.city || undefined,
          }}
          initialText={_state.initialText}
        />
      );
    }
    return undefined;
  }

  render() {
    let _state = this.props.sitePostEditor;
    return (
      <Dialog open={_state.openDialog} maxWidth='md' fullWidth={true}>
        {this.renderEditor({
          defaultQuote: _state.quote ?? undefined,
          defaultRepost: _state.repost ?? undefined,
          autoFocus: true,
          cardHeaderProps: {
            action: (
              <IconButton
                onClick={() => {
                  appStore.dispatch(new SitePostEditorCloseDialogAppEvent());
                }}>
                <ClearRoundedIcon />
              </IconButton>
            ),
          },
        })}
      </Dialog>
    );
  }
}

export const SitePostEditor = connect<_Props, {}, {}, RootAppState>((state) => {
  return {
    sitePostEditor: state.sitePostEditor,
    sessionAppState: state.session,
  };
})(_SitePostEditor);

export default SitePostEditor;
