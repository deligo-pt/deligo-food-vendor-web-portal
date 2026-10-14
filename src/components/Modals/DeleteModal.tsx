import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/src/hooks/use-translation";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  /** Custom wording; each falls back to the generic "are you sure" copy. */
  title?: string;
  description?: string;
  confirmLabel?: string;
  /** `default` for a reversible step such as archiving. */
  confirmVariant?: "destructive" | "default";
}

const DeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
}: IProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title ?? t("are_you_absolutely_sure")}</DialogTitle>
            <DialogDescription>
              {description ?? t("this_action_cannot_be_undone")}
            </DialogDescription>
          </DialogHeader>{" "}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button variant={confirmVariant} onClick={onConfirm} type="submit" disabled={isDeleting}>
              {confirmLabel ?? t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DeleteModal;
