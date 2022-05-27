import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { FullProps, PartialProps } from "../simple-redux/type_helpers";
import { Random } from "./random-generation";
import { TagAppState } from "./TagAppState";

export function convertStringToHashTag(address: string): string {
  return address
    .split(/[^\w]/)
    .map((x) => x.trim())
    .join("");
}

export class TimelineAppState extends AppState {
  watchedTopics = new ImmuList<TagAppState>([]);
  constructor(props: PartialProps<TimelineAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): TimelineAppState {
    return new TimelineAppState({
      watchedTopics: ImmuList.build(10, () => TagAppState.random()),
    });
  }
}
