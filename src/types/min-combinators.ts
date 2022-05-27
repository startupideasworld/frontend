export type PersonData = {
  avatar: string;
  profession: string;
  name: string;
  userSlug: string;
};

export type BasePostData = {
  postId: string;
  postSlug: string;
  author: PersonData;
  content: string;
  timestamp: Date;
  commentsCount: number;
  repostsCount: number;
  userReposted: boolean;
  userCommented: boolean;
  userLiked: boolean;
  likesCount: number;
  isSkeleton: boolean;
};

export type CompanyShortSummaryData = {
  companyId: string;
  companySlug: string;
  companyName: string;
  isConceptual: boolean;
  isProject: boolean;
  thumbnail: string;
  summary: string;
  memberAvatars: string[];
  memberNames: string[];
  isSkeleton: boolean;
  headline: string;
};

export type PostShortSummaryData = {
  author: PersonData;
  postSlug: string;
  postId: string;
  summary: string;
  timestamp: Date;
};

export enum TagType {
  none,
  idea,
  location,
  mega,
  person,
  company,
}

export type TagData = {
  tagId: string;
  humanText: string;
  linkText: string;
  tagWithSymbol: string;
  type: TagType;
};
