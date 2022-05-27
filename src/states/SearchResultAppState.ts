import { random } from "lodash";
import { LoremIpsum } from "lorem-ipsum";
import { AppState, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { Random } from "./random-generation";
import { PostData, TimelinePostAppState } from "./TimelinePostAppState";

export class SearchResultCompanyItemAppState extends AppState {
  companyId = "";
  image = "";
  companyName = "";
  description = "";
  homepageUrl = "";
  learnMoreLink = "";
  isSkeleton = false;

  constructor(props: PartialProps<SearchResultCompanyItemAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.companyId;
  }

  static random(): SearchResultCompanyItemAppState {
    const lorem = new LoremIpsum({ wordsPerSentence: { min: 1, max: 3 } });
    return new SearchResultCompanyItemAppState({
      companyId: uuid4(),
      image: "https://picsum.photos/200",
      companyName: lorem.generateWords(),
      homepageUrl: "https://google.ca",
      description: lorem.generateParagraphs(1),
      learnMoreLink: `/b/${lorem.generateWords().replaceAll(" ", "-")}`,
    });
  }

  static skeleton(): SearchResultCompanyItemAppState {
    return new SearchResultCompanyItemAppState({
      companyId: uuid4(),
      isSkeleton: true,
    });
  }
}

export class SearchResultIdeaItemAppState extends AppState {
  id = "";
  text = "";
  likes = 0;
  dislikes = 0;
  userLiked = false;
  userDisliked = false;
  isSkeleton = false;

  constructor(props: PartialProps<SearchResultIdeaItemAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.id;
  }

  static random(): SearchResultIdeaItemAppState {
    return new SearchResultIdeaItemAppState({
      id: uuid4(),
      text: Random.idea(),
      likes: random(0, 10000),
      dislikes: random(0, 10000),
    });
  }

  static skeleton(): SearchResultIdeaItemAppState {
    return new SearchResultIdeaItemAppState({
      id: uuid4(),
      isSkeleton: true,
    });
  }
}

export enum SearchResultLoadingStatus {
  initial,
  loading,
  loaded,
}
export class SearchResultAppState extends AppState {
  loadingStatus = SearchResultLoadingStatus.initial;
  companiesList = new ImmuList<SearchResultCompanyItemAppState>([]);
  relatedIdeasList = new ImmuList<SearchResultIdeaItemAppState>([]);
  exactMatchIdea: SearchResultIdeaItemAppState | null = null;
  communityPosts = new ImmuList<PostData>([]);
  collaboratorPosts = new ImmuList<PostData>([]);
  currentSearchText = "";

  constructor(props: PartialProps<SearchResultAppState>) {
    super();
    this.assignProps(props);
  }

  random(): SearchResultAppState {
    return new SearchResultAppState({
      companiesList: ImmuList.build(
        random(0, 10),
        SearchResultCompanyItemAppState.random
      ),
      relatedIdeasList: ImmuList.build(
        random(0, 10),
        SearchResultIdeaItemAppState.random
      ),
      communityPosts: ImmuList.build(random(0, 10), (x) =>
        TimelinePostAppState.random().asPostData()
      ),
      collaboratorPosts: ImmuList.build(random(0, 10), (x) =>
        TimelinePostAppState.random().asPostData()
      ),
      exactMatchIdea: SearchResultIdeaItemAppState.random(),
    });
  }
}
// export class _SearchResultAppState extends AppStateWrapper<{
//   searchText: string;
//   itemList: ImmuList<SearchResultItemAppState>;
// }> {
//   static initial(): SearchResultAppState {
//     return appState(_SearchResultAppState, {
//       searchText: "",
//       itemList: new ImmuList([
//         _SearchResultItemAppState.random(),
//         _SearchResultItemAppState.random(),
//         _SearchResultItemAppState.random(),
//         _SearchResultItemAppState.random(),
//       ]),
//     });
//   }
// }

// export type SearchResultAppState = PropsForwarded<_SearchResultAppState>;
