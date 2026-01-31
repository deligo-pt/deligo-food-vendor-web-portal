import { EditProductForm } from "@/src/components/Dashboard/Products/EditProductForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { TProduct } from "@/src/types/product.type";

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  prevData: TProduct;
}

const EditProductDialog = ({ open, onOpenChange, prevData }: IProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-3xl overflow-y-scroll max-h-11/12">
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <EditProductForm prevData={prevData} closeModal={onOpenChange} />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
