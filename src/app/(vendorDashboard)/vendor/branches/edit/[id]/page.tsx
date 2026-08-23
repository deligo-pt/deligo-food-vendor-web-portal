
interface IProps {
    params: { id: string };
};


const EditBranchPage = async ({ params }: IProps) => {
    const { id } = await params;
    const partnerDetails = await (id);

    return (
        <div>

        </div>
    );
};

export default EditBranchPage;