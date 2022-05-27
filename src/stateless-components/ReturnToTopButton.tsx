import { Fab, Zoom } from "@mui/material";
import React from "react";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

type _Props = {};
type _State = {
  show: boolean;
};

export class ReturnToTopButton extends React.Component<_Props, _State> {
  scrollButton: HTMLButtonElement | null = null;

  constructor(props: _Props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", (e) => {
      if (window.scrollY > 2000) {
        this.setState({
          show: true,
        });
      }
      if (window.scrollY < 1000) {
        this.setState({
          show: false,
        });
      }
    });
  }

  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Zoom in={this.state.show}>
          <Fab
            ref={(ref) => {
              this.scrollButton = ref;
            }}
            sx={{
              zIndex: 10,
              position: "fixed",
              right: 50,
              bottom: 50,
              height: 50,
              width: 50,
              borderRadius: "50%",
            }}
            size='large'
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            variant='extended'
            color='primary'
            aria-label='add'>
            <ArrowUpwardRoundedIcon />
          </Fab>
        </Zoom>
      </React.Fragment>
    );
  }
}
