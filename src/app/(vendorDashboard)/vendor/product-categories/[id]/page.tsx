import CategoryDetails from "@/src/components/Dashboard/ProductCategories/CategoryDetails";
import { getSingleProductCategory } from "@/src/services/dashboard/categories/product-categories";



interface IProps {
    params: { id: string };
}


const CategoryDetailsPage = async ({ params }: IProps) => {
    const { id } = await params;
    const { data } = await getSingleProductCategory(id);

    return (
        <div>
            <CategoryDetails category={data} />
        </div>
    );
};

export default CategoryDetailsPage;