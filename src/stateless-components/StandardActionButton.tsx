import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { Overlay } from "../layouts/Overlay";

export type StandardActionButtonProps = {
  isSaving: boolean;
} & ButtonProps;

export function StandardActionButton(props: StandardActionButtonProps) {
  let buttonProps: any = { ...props };
  delete buttonProps.isSaving;
  return (
    <Overlay center>
      <Button
        variant='contained'
        size='large'
        disabled={props.isSaving}
        {...buttonProps}>
        {props.children}
      </Button>
      {props.isSaving && <CircularProgress size={26} color='primary' />}
    </Overlay>
  );
}
