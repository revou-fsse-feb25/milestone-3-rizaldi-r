import { ICategoryData } from "@/types/types";
import ButtonRegular from "../_commons/ButtonRegular";
// import ErrorDisplay from "../ErrorDisplay";
// import LoadingDisplay from "../LoadingDisplay";

export default function CategoryList({
    CategoryListData,
    onEachButtonClicked,
}: {
    CategoryListData: ICategoryData[]
    onEachButtonClicked: (newCategoryId: number | null) => void;
}) {
    return (
        <>
            {/* Error display */}
            {/* {error && <ErrorDisplay errorMessage={error} />} */}

            {/* Loading display */}
            {/* {isLoading && <LoadingDisplay />} */}

            {/* Category display */}
            {/* {!isLoading && !error && ( */}
            <div
                className="flex gap-1 my-3 overflow-x-scroll snap-x snap-mandatory no-scrollbar"
            >
                <ButtonRegular onClickProp={() => onEachButtonClicked(null)}>All</ButtonRegular>
                {CategoryListData.map((data) => (
                    <ButtonRegular
                        key={data.id}
                        onClickProp={() => onEachButtonClicked(parseInt(data.id))}
                        customClassName="whitespace-nowrap"
                    >
                        {data.name}
                    </ButtonRegular>
                ))}
            </div>
            {/* )} */}
        </>
    );
}