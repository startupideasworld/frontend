import {
  AppState,
} from "../simple-redux";
import { PartialProps } from "../simple-redux/type_helpers";

export class HomeAppState extends AppState {
  searchText = "";
  constructor(props: PartialProps<HomeAppState>) {
    super();
    this.assignProps(props);
  }
}

// export class _HomeAppState extends AppStateWrapper<{
//   searchText: string;
// }> {
//   static initial(): HomeAppState {
//     return appState(_HomeAppState, {
//       searchText: "",
//     });
//   }
// }

// export type HomeAppState = PropsForwarded<_HomeAppState>;
