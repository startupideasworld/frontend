import * as Router from "react-router-dom";
import { CreateCompanyPageTabIndex } from "./connected-components/CreateCompanyPage";
import { PushRouteAppEvent } from "./events/PushRouteAppEvent";
import { ReceiveUrlAppEvent } from "./events/ReceiveURLAppEvent";
import { AddressPrediction } from "./stateless-components/google-map";
import { appStore } from "./store-config";
import { CompanyShortSummaryData, TagData } from "./types/min-combinators";

export enum RoutePath {
  home = "/",
  searchResult = "/r",
  companyDetail = "/b/:slug",
  createCompany = "/idea/create",
  createCompanySuccess = "/idea/create/success",
  editCompany = "/b/:slug/edit",
  createPost = "/post/create",
  acceptCompanyInvitation = "/b/:slug/invitation/:token",
  timelineList = "/u/:userSlug",
  timelinePost = "/u/:userSlug/p/:postSlug",
  timelinePublic = "/trends",
  timelineTopic = "/topic/:topicSlug",
  myCompanies = "/account/companies",
  myAccount = "/account/companies",
  myProfile = "/account/profile",
}

export const useBase64Encode = {
  [RoutePath.timelinePublic]: true,
  [RoutePath.timelineTopic]: true,
  [RoutePath.createCompanySuccess]: true,
};

export type _BaseUrlType = {
  path: RoutePath;
  params: unknown;
  search: unknown;
};

export type HomeUrlType = {
  path: RoutePath.home;
  params: {};
  search: {};
};

export type SearchResultUrlType = {
  path: RoutePath.searchResult;
  params: {};
  search: { q?: string };
};

export type CompanyDetailUrlType = {
  path: RoutePath.companyDetail;
  params: { slug: string };
  search: {};
};

export type CreateCompanyUrlType = {
  path: RoutePath.createCompany;
  params: {};
  search: {
    idea: string;
    create: CreateCompanyPageTabIndex;
  };
};

export type CreateCompanySuccessUrlType = {
  path: RoutePath.createCompanySuccess;
  params: {};
  search: {
    create: CreateCompanyPageTabIndex;
    idea?: TagData;
    companyData?: CompanyShortSummaryData;
  };
};

export type EditCompanyUrlType = {
  path: RoutePath.editCompany;
  params: { slug: string };
  search: { page: EditCompanyChildPage };
};

export type AcceptCompanyInvitationUrlType = {
  path: RoutePath.acceptCompanyInvitation;
  params: { slug: string; token: string };
  search: {};
};

export type TimelineListUrlType = {
  path: RoutePath.timelineList;
  params: { userSlug: string };
  search: {};
};

export type TimelinePostUrlType = {
  path: RoutePath.timelinePost;
  params: { userSlug: string; postSlug: string };
  search: {};
};

export type TimelineUrlType = {
  path: RoutePath.timelinePublic | RoutePath.timelineTopic;
  params: {
    userSlug?: string;
    postSlug?: string;
    topicSlug?: string;
  };
  search: {
    findCollaborator?: {
      idea: string;
      city?: AddressPrediction;
      createPost?: boolean;
    };
    filters?: {
      tags?: string[];
    };
  };
};

export type MyCompaniesListUrlType = {
  path: RoutePath.myCompanies;
  params: {};
  search: {};
};

export type MyAccountUrlType = {
  path: RoutePath.myAccount;
  params: {};
  search: {};
};

export type MyProfileUrlType = {
  path: RoutePath.myAccount;
  params: {};
  search: {};
};

export enum EditCompanyChildPage {
  default,
  profile = "profile",
  content = "content",
  people = "people",
}

export function buildRoutePath<R extends _BaseUrlType = never>(
  path: RoutePath,
  params: R["params"],
  search: R["search"]
) {
  const base = Router.generatePath(path, params ?? ({} as any));
  if ((useBase64Encode as any)[path]) {
    if (Object.keys(search as object).length === 0) {
      return base;
    }
    let encoded = btoa(JSON.stringify(search, undefined, 1));
    const destination = base + "?" + encoded;
    return destination;
  } else {
    const query = Router.createSearchParams(search ?? ({} as any)).toString();
    const destination = base + (query ? "?" + query : "");
    return destination;
  }
}

export function findParams(pathname: string): any {
  for (const val of Object.values(RoutePath)) {
    const match = Router.matchPath(val, pathname);
    if (match !== null) {
      return match.params;
    }
  }
  return undefined;
}

export function matchHref(href: string):
  | {
      router: Router.PathMatch<string>;
      routePath: RoutePath;
      params: any;
      search: any;
    }
  | undefined {
  let url = new URL(href, document.location.origin);
  let pathname = url.pathname;
  for (const path of Object.values(RoutePath)) {
    const match = Router.matchPath(path, pathname);
    if (match !== null) {
      let search: any = {};
      if ((useBase64Encode as any)[path]) {
        let searchStr = url.search;
        if (searchStr) {
          if (searchStr[0] === "?") {
            searchStr = searchStr.substring(1);
          }
          search = JSON.parse(atob(searchStr));
        } else {
          search = {};
        }
      } else {
        search = Object.fromEntries(url.searchParams);
      }
      return {
        router: match,
        routePath: path,
        params: match.params,
        search: search,
      };
    }
  }
  return undefined;
}
