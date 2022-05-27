import { ResolvedPos, Schema } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import { PluginSpec } from "prosemirror-state";
import { NodeSpec } from "prosemirror-model";
import { Extension } from "rich-markdown-editor";
import RMENode from "rich-markdown-editor/dist/nodes/Node";

export enum InputEventBehavior {
  preventEditorActions,
  allowEditorActions,
}
export type MentionsPluginOptions = {
  mentionTrigger: string[];
  allowSpace: boolean;
  onActive: (
    text: string,
    anchorEl: HTMLElement,
    completer: (attrs: MentioNodeAttrs) => void
  ) => void;
  onChange: (text: string) => void;
  onAbort: () => void;
  onInputEvent: (event: KeyboardEvent) => InputEventBehavior;
};

type MentionsState = {
  active: boolean;
  range: {
    from: number;
    to: number;
  };
  text: string;
  index: number;
};

export type MentioNodeAttrs = {
  text: string;
  value: string;
};
``;

export class MentionNode extends RMENode {
  get name() {
    return "mention";
  }

  get schema(): NodeSpec {
    /**
     * See https://prosemirror.net/docs/ref/#model.NodeSpec
     */
    return {
      group: "inline",
      inline: true,
      atom: true,

      attrs: {
        text: { default: "" },
        value: { default: "" },
      },

      selectable: false,
      draggable: false,

      toDOM: (node) => {
        return [
          "span",
          {
            "data-mention-text": node.attrs.text,
            "data-mention-value": node.attrs.value,
            class: "prosemirror-mention-node",
          },
          node.attrs.text,
        ];
      },

      parseDOM: [
        {
          // match tag with following CSS Selector
          tag: "span[data-mention-value]",
          getAttrs: (dom) => {
            let _dom = dom as HTMLElement;
            return {
              text: _dom.getAttribute("data-mention-text"),
              value: _dom.getAttribute("data-mention-value"),
            };
          },
        },
      ],
    };
  }

  toMarkdown(state: any, node: any) {
    const value = node.attrs["value"];
    const text = node.attrs["text"];
    if (text) {
      state.write(`[${text}](mention://${value})`);
    }
  }

  override parseMarkdown() {
    return {
      node: "mention",
      getAttrs: (tok: any) => {
        return { text: tok.markup.trim() };
      },
    };
  }
}

export default class MentionsExtension extends Extension {
  constructor(public options: MentionsPluginOptions) {
    super();
  }

  get name() {
    return "mentions";
  }

  get plugins() {
    const mentionPlugin = getMentionsPlugin(this.options);
    return [mentionPlugin];
  }
}

export function getRegexp(mentionTrigger: string[], allowSpace: boolean) {
  let triggers = `[${mentionTrigger.join("")}]`;
  return allowSpace
    ? new RegExp(`(^|\\s)(${triggers}\\w+\\s?[\\w-\\+]*)$`)
    : new RegExp(`(^|\\s)(${triggers}\\w*)$`);
}

export function getNewState(): MentionsState {
  return {
    active: false,
    range: {
      from: 0,
      to: 0,
    },
    text: "",
    index: 0, // current active suggestion index
  };
}

/**
 *
 * @param {ResolvedPosition} $position https://prosemirror.net/docs/ref/#model.Resolved_Positions
 * @param {JSONObject} opts
 * @returns {JSONObject}
 */
export function getMatch($position: ResolvedPos, opts: MentionsPluginOptions) {
  // take current para text content upto cursor start.
  // this makes the regex simpler and parsing the matches easier.
  let parastart = $position.before();
  const text = $position.doc.textBetween(parastart, $position.pos, "\n", "\0");

  let regex = getRegexp(opts.mentionTrigger, opts.allowSpace);
  // only one of the below matches will be true.
  let match = text.match(regex);

  // if match found, return match with useful information.
  if (match) {
    let [entireMatch, space, query] = match;

    // The absolute position of the match in the document
    let from =
      $position.start() +
      (entireMatch.startsWith(" ") ? match.index! + 1 : match.index!);

    let to = from + entireMatch.trimStart().length;

    return {
      range: { from: from, to: to },
      queryText: query,
    };
  }
  return undefined;
}

/**
 * @param {JSONObject} opts
 * @returns {Plugin}
 */
export function getMentionsPlugin(
  opts: MentionsPluginOptions
): Plugin<MentionsState, any> {
  /**
   * See https://prosemirror.net/docs/ref/#state.Plugin_System
   * for the plugin properties spec.
   */
  return new Plugin({
    key: new PluginKey("autosuggestions"),

    // we will need state to track if suggestion dropdown is currently active or not
    state: {
      init() {
        return getNewState();
      },

      apply(tr, state) {
        // compute state.active for current transaction and return
        let newState = getNewState();
        let selection = tr.selection;
        if (selection.from !== selection.to) {
          return newState;
        }

        const $position = selection.$from;
        const match = getMatch($position, opts);

        // if match found update state
        if (match) {
          newState.active = true;
          newState.range = match.range;
          newState.text = match.queryText;
          opts.onChange(newState.text ?? "");
        } else {
          if (state.active) {
            opts.onAbort();
          }
        }

        return newState;
      },
    },

    view(view: EditorView) {
      return {
        update: (view, prevState) => {
          let state = this.key?.getState(view.state);
          if (state?.active) {
            let node = view.domAtPos(view.state.selection.$from.pos);
            let paraDOM = node.node as HTMLElement;
            let anchorEl: HTMLElement | null;
            if (paraDOM.nodeName === "#text") {
              anchorEl = paraDOM.parentNode as HTMLElement;
            } else {
              anchorEl = paraDOM.querySelector(".prosemirror-suggestion");
            }
            if (anchorEl) {
              opts.onActive(state.text, anchorEl, (attrs) => {
                /* Completer */
                let state = this.key?.getState(view.state);
                if (state) {
                  state.active = false;
                  let node = view.state.schema.nodes["mention"].create(attrs);
                  let tr = view.state.tr
                    .insertText(" ", state.range.to)
                    .replaceWith(state.range.from, state.range.to, node);
                  view.dispatch(tr);
                }
              });
            }
          }
        },
      };
    },

    // We'll need props to hi-jack keydown/keyup & enter events when suggestion dropdown
    // is active.
    props: {
      handleKeyDown(view, e) {
        let state = this.getState(view.state);

        // don't handle if no suggestions or not in active mode
        if (state.active) {
          let bebavior = opts.onInputEvent(e);
          if (bebavior === InputEventBehavior.preventEditorActions) {
            return true;
          }
        }

        // default handlers
        return false;
      },

      // to decorate the currently active @mention text in ui
      decorations(editorState) {
        const { active, range } = this.getState(editorState);

        if (!active) return null;

        return DecorationSet.create(editorState.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: "span",
            class: "prosemirror-suggestion",
          }),
        ]);
      },
    },
  });
}
