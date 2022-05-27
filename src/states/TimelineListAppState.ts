import { AppState, ImmuList } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { PostData } from "./TimelinePostAppState";
import { Random } from "./random-generation";

export enum TimelineListLoadingStatus {
  initial,
  loading,
  loaded,
}
export class TimelineListAppState extends AppState {
  loadingStatus = TimelineListLoadingStatus.initial;
  posts = new ImmuList<PostData>([]);
  // currentUserAvatar = "";
  // currentUserName = "";
  // currentUserProfession = "";
  // currentUserId = "";
  currentUserSlug = "";
  currentTopicSlug = "";
  currentUrlHash: string | null = null;

  constructor(props: PartialProps<TimelineListAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): TimelineListAppState {
    return new TimelineListAppState({
      // currentUserId: Random.id(),
      // currentUserName: Random.personName(),
      // currentUserProfession: Random.profession(),
      // currentUserAvatar: Random.avatar(),
      // currentUserSlug: Random.slug(),
    });
  }
}
