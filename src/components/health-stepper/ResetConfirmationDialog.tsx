import { forwardRef } from "react";
import type { ReactElement, Ref } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Grow from "@mui/material/Grow";
import type { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return (
    <Grow
      ref={ref}
      {...props}
      timeout={{ enter: 320, exit: 240 }}
      style={{ transformOrigin: "center" }}
    />
  );
});

interface ResetConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog = ({
  open,
  onCancel,
  onConfirm,
}: ResetConfirmationDialogProps) => (
  <Dialog
    open={open}
    onClose={onCancel}
    TransitionComponent={Transition}
    aria-labelledby="reset-dialog-title"
    aria-describedby="reset-dialog-description"
    PaperProps={{
      sx: {
        borderRadius: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      },
    }}
    slotProps={{
      backdrop: {
        style: { backdropFilter: "blur(5px)" },
      },
    }}
  >
    <DialogTitle id="reset-dialog-title" sx={{ fontWeight: 600 }}>
      Reset Form?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="reset-dialog-description">
        All entered data will be lost. Are you sure you want to continue?
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button
        onClick={onCancel}
        color="inherit"
        sx={{ fontWeight: 600, borderRadius: 100 }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        variant="contained"
        sx={{ fontWeight: 600, boxShadow: "none", borderRadius: 100 }}
        autoFocus
      >
        Reset Form
      </Button>
    </DialogActions>
  </Dialog>
);

export default ResetConfirmationDialog;
