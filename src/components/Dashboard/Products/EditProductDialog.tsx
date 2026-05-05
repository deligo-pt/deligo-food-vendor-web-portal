import { EditProductForm } from "@/src/components/Dashboard/Products/EditProductForm";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { TProduct } from "@/src/types/product.type";

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  prevData: TProduct;
  businessType: string;
}

const EditProductDialog = ({
  open,
  onOpenChange,
  prevData,
  businessType,
}: IProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-3xl overflow-y-auto h-11/12! max-h-11/12 p-0!">
          <EditProductForm
            prevData={prevData}
            closeModal={onOpenChange}
            businessType={businessType}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
