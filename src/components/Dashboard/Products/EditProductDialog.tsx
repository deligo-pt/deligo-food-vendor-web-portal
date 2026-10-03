import { EditProductForm } from "@/src/components/Dashboard/Products/EditProductForm";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { TProductCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";

interface IProps {
  open: boolean;
  onOpenChange: () => void;
  prevData: TProduct;
  businessTypeSlug: string;
  /** Passed through to the form, so category names show at once. */
  productCategories?: TProductCategory[];
}

const EditProductDialog = ({
  open,
  onOpenChange,
  prevData,
  businessTypeSlug,
  productCategories,
}: IProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="w-full! sm:max-w-6xl overflow-y-auto h-11/12! max-h-11/12 p-0!">
          <DialogTitle className="hidden">Edit Product</DialogTitle>

          <EditProductForm
            prevData={prevData}
            closeModal={onOpenChange}
            businessTypeSlug={businessTypeSlug}
            productCategories={productCategories}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
