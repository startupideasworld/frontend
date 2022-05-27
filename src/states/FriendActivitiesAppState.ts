import { formatDistanceToNow } from "date-fns";
import formatDistance from "date-fns/formatDistance";
import { AppState, Identifiable, ImmuList, uuid4 } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { FriendActivityData } from "../stateless-components/StandardFriendActivities";
import { Random } from "./random-generation";

export class FriendActivityItemAppState
  extends AppState
  implements Identifiable
{
  name = "";
  avatar = "";
  profession = "";
  userId = "";
  userSlug = "";
  activitiesCount = 0;
  lastActive = new Date();
  isSkeleton = false;

  constructor(props: PartialProps<FriendActivityItemAppState>) {
    super();
    this.assignProps(props);
  }

  get key() {
    return this.userId;
  }

  asFriendActivityData(): FriendActivityData {
    return {
      key: this.key,
      name: this.name,
      avatar: this.avatar,
      profession: this.profession,
      userId: this.userId,
      userSlug: this.userSlug,
      activitiesCount: this.activitiesCount,
      isSkeleton: this.isSkeleton,
      lastActive:
        "Posted " +
        formatDistanceToNow(this.lastActive, {
          addSuffix: true,
        }),
    };
  }

  static random(): FriendActivityItemAppState {
    return new FriendActivityItemAppState({
      name: Random.personName(),
      avatar: Random.avatar(),
      profession: Random.profession(),
      userId: Random.id(),
      userSlug: Random.slug(),
      lastActive: Random.time(-10000, 0),
      activitiesCount: Random.int(1, 10),
    });
  }

  static skeleton(): FriendActivityItemAppState {
    return new FriendActivityItemAppState({
      userId: uuid4(),
      isSkeleton: true,
    });
  }
}

export class FriendActivitiesAppState extends AppState {
  activities = new ImmuList<FriendActivityItemAppState>([]);
  constructor(props: PartialProps<FriendActivitiesAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): FriendActivitiesAppState {
    return new FriendActivitiesAppState({
      activities: ImmuList.build(Random.int(0, 10), (x) =>
        FriendActivityItemAppState.random()
      ),
    });
  }
}
