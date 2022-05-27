import { AppState } from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";
import { Random } from "./random-generation";

export type SessionUserData = {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  profession: string;
};

export class SessionAppState extends AppState {
  user: SessionUserData | null = null;
  constructor(props: PartialProps<SessionAppState>) {
    super();
    this.assignProps(props);
  }

  static random(): SessionAppState {
    return new SessionAppState({
      user: {
        id: Random.id(),
        slug: Random.slug(),
        name: Random.personName(),
        avatar: Random.avatar(),
        profession: Random.profession(),
      },
    });
  }
}
