import { AppState, ImmuList, to, uuid4 } from "../simple-redux";
import { MakeNonNullable, PartialProps } from "../simple-redux/type_helpers";
import {
  BasePostData,
  PersonData,
  PostShortSummaryData,
} from "../types/min-combinators";
import { Random } from "./random-generation";

/**
 * What are the types of posts?
 *
 * 1. Just a post (aka the Original Post):
 *
 *    This is the only type of post whose .originalPost is null.
 *
 * 2. Comment on a Post, or comment of a comment:
 *
 *      This type of post quotes the post being commented on, and also contains
 *      the summary of the original post.
 *
 * 3. Repost of a post
 *
 *      This type of post contains the summary of the original post.
 *
 * 4. Repost of a repost
 *
 *      This type of post contains the summary of the original post, and quotes
 *      the previous repost.
 *
 * 5. Repost of a comment
 *
 *      This is modeled as a repost quoting the comment.
 */

type PostDataBase = {
  key: string;
  quote: PostShortSummaryData | null;
} & BasePostData &
  PostShortSummaryData;

export type PostData = PostDataBase & {
  originalPost: PostShortSummaryData | null;
  comments: CommentData[];
};

export type CommentData = MakeNonNullable<PostDataBase, "quote"> & {
  originalPost: PostShortSummaryData;
};

export enum TimelinePostLoadingStatus {
  initial,
  loading,
  loaded,
}
export class TimelinePostAppState extends AppState {
  loadingStatus = TimelinePostLoadingStatus.initial;
  postId = "";
  timestamp = new Date();
  authorId = "";
  authorAvatar = "";
  authorName = "";
  authorProfession = "";
  authorSlug = "";
  content = "";
  comments = new ImmuList<TimelinePostAppState>([]);
  commentsCount = 0;
  postSlug = "";
  originalPost: PostShortSummaryData | null = null;
  quote: PostShortSummaryData | null = null;
  userReposted = false;
  userLiked = false;
  userCommented = false;
  repostsCount = 0;
  likesCount = 0;
  isSkeleton = false;

  get key() {
    return this.postId;
  }

  asPostDataBase(): PostDataBase {
    return {
      key: this.postId,
      postId: this.postId,
      postSlug: this.postSlug,
      author: {
        name: this.authorName,
        profession: this.authorProfession,
        avatar: this.authorAvatar,
        userSlug: this.authorSlug,
      },
      quote: this.quote,
      content: this.content,
      timestamp: this.timestamp,
      commentsCount: this.commentsCount,
      repostsCount: this.repostsCount,
      userCommented: this.userCommented,
      userReposted: this.userReposted,
      userLiked: this.userLiked,
      likesCount: this.likesCount,
      summary: this.content,
      isSkeleton: this.isSkeleton,
    };
  }

  asPostShortSummaryData(): PostShortSummaryData {
    return {
      postId: this.postId,
      author: {
        avatar: this.authorAvatar,
        name: this.authorName,
        profession: this.authorProfession,
        userSlug: this.authorSlug,
      },
      postSlug: this.postSlug,
      summary: this.content,
      timestamp: this.timestamp,
    };
  }

  asPostData(): PostData {
    return {
      ...this.asPostDataBase(),
      originalPost: this.originalPost,
      comments: this.comments.toArray().map((x) => x.asCommentData()),
    };
  }

  asCommentData(): CommentData {
    return {
      ...this.asPostDataBase(),
      quote: this.quote,
      originalPost: this.originalPost!,
    };
  }

  constructor(props: PartialProps<TimelinePostAppState>) {
    super();
    this.assignProps(props);
  }

  static random(props?: {
    withComments?: boolean;
    originalPost?: PostShortSummaryData | null;
    quote?: PostShortSummaryData | null;
  }): TimelinePostAppState {
    let withComments = props?.withComments ?? true;
    let postId = Random.id();
    let postSlug = Random.slug();
    let author = Random.personData();
    let content = Random.comment();
    let quote =
      props?.quote ??
      Random.choice([
        null,
        {
          postId: postId,
          author: Random.personData(),
          postSlug: Random.id(),
          summary: Random.comment(),
          timestamp: Random.time(-1000, 0),
        },
      ]);
    // If the post has quote, then it must have an OP, because the quote must be
    // an comment of some other post.
    let originalPost =
      props?.originalPost ??
      Random.choice([
        ...(quote ? [] : [null]),
        {
          postId: postId,
          author: Random.personData(),
          postSlug: Random.id(),
          summary: Random.comment(),
          timestamp: Random.time(-1000, 0),
        },
      ]);
    return new TimelinePostAppState({
      postId: postId,
      authorAvatar: Random.avatar(),
      content,
      authorId: Random.id(),
      postSlug: postSlug,
      commentsCount: Random.int(0, 10),
      authorName: author.name,
      quote,
      originalPost,
      authorProfession: Random.profession(),
      authorSlug: author.userSlug,
      likesCount: Random.int(0, 10),
      repostsCount: Random.int(0, 10),
      userLiked: Random.choice([true, false]),
      userCommented: Random.choice([true, false]),
      userReposted: Random.choice([true, false]),
      comments: ImmuList.build(withComments ? 10 : 0, () =>
        TimelinePostAppState.random({
          withComments: false,
          originalPost: originalPost,
          quote: Random.choice([
            {
              author: author,
              postSlug: postSlug,
              postId: postId,
              summary: content,
              timestamp: Random.time(-1000, 0),
            },
            {
              author: Random.personData(),
              postId: Random.id(),
              postSlug: Random.slug(),
              summary: Random.comment(),
              timestamp: Random.time(-1000, 0),
            },
          ]),
        })
      ),
    });
  }

  static skeleton(): TimelinePostAppState {
    return new TimelinePostAppState({
      postId: uuid4(),
      isSkeleton: true,
    });
  }
}
