import { EditProductForm } from "@/src/components/Dashboard/Products/EditProductForm";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { TProduct } from "@/src/types/product.type";

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  prevData: TProduct;
  setUpdatedData: (value: TProduct) => void;
  businessType: string;
}

const EditProductDialog = ({
  open,
  onOpenChange,
  prevData,
  setUpdatedData,
  businessType,
}: IProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-3xl overflow-y-auto h-11/12! max-h-11/12 p-0!">
          <DialogTitle className="hidden">Edit Product</DialogTitle>

          <EditProductForm
            prevData={prevData}
            setUpdatedData={setUpdatedData}
            closeModal={onOpenChange}
            businessType={businessType}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
