import { EditProductForm } from "@/src/components/Dashboard/Products/EditProductForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { TTax } from "@/src/types/tax.type";

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  prevData: TProduct;
  taxesData: { data: TTax[]; meta?: TMeta };
}

const EditProductDialog = ({
  open,
  onOpenChange,
  prevData,
  taxesData,
}: IProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-3xl overflow-y-scroll max-h-11/12">
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <EditProductForm
            prevData={prevData}
            closeModal={onOpenChange}
            taxesData={taxesData}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
