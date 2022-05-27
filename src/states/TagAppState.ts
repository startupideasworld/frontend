import { AppState, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { PersonData, TagData, TagType } from "../types/min-combinators";
import { Random } from "./random-generation";

export class TagAppState extends AppState {
  tagId = "";
  originalText = "";
  type = TagType.none;
  personData?: PersonData;
  isSkeleton = false;

  constructor(props: PartialProps<TagAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.originalText;
  }

  getLinkText() {
    return this.originalText
      .toLowerCase()
      .split(/[^\w]/)
      .map((x) => x.trim())
      .join("-");
  }

  getTagText() {
    return this.originalText
      .split(/[^\w]/)
      .map((x) => x.trim())
      .map((x) => x && x[0].toUpperCase() + x.substring(1))
      .join("");
  }

  getSymbol() {
    switch (this.type) {
      case TagType.person:
      case TagType.company:
        return "@";
      default:
        return "#";
    }
  }

  getTag() {
    return this.getSymbol() + this.getTagText();
  }

  asTagData(): TagData {
    return {
      tagId: this.tagId,
      humanText: this.originalText,
      linkText: this.getLinkText(),
      tagWithSymbol: this.getTag(),
      type: this.type,
    };
  }

  static random(props?: { type: TagType }): TagAppState {
    let type =
      props?.type ??
      Random.choice([
        TagType.none,
        TagType.idea,
        TagType.location,
        TagType.mega,
        TagType.person,
        TagType.company,
      ]);
    return new TagAppState({
      tagId: Random.id(),
      originalText: Random.idea(),
      type: type,
    });
  }

  static mega = {
    findCollaborator: new TagAppState({
      tagId: "FindCollaborator",
      originalText: "FindCollaborator",
      type: TagType.mega,
    }),
  };

  static skeleton(): TagAppState {
    return new TagAppState({
      tagId: uuid4(),
      isSkeleton: true,
    });
  }
}
