import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { api } from "~/utils/api";

const ManageCategories = () => {
  const { data: categories } = api.category.getCategories.useQuery();
  type CategoryList = typeof categories;

  const CategoryPopup = ({ categories }: { categories: CategoryList }) => {
    const [selected, setSelected] = useState<Array<string>>([]);
    const [openCats, setOpenCats] = useState<Array<string>>([]);
    return (
      <>
        {categories && (
          <div className="absolute left-[0] top-[0vh] h-[100vh] w-[100vw] space-y-3 overflow-y-scroll rounded-md p-2 backdrop-blur-md">
            <div className="sticky top-1 z-10 h-[20vh] w-full space-y-2 overflow-y-scroll rounded-md bg-zinc-800 p-2">
              <p className="sticky top-0 border-b-2 border-zinc-200 bg-zinc-800 text-xl text-zinc-100">
                active categories
              </p>
              <div className=" flex flex-wrap gap-2  ">
                {selected.length > 0 &&
                  selected.map((name) => (
                    <p
                      onClick={() =>
                        setSelected((prev) => prev.filter((p) => p !== name))
                      }
                      className="h-fit w-fit flex-grow whitespace-nowrap rounded-md bg-zinc-200 p-2 text-center"
                    >
                      {name}
                    </p>
                  ))}
              </div>
            </div>
            <div className="h-[75vh] overflow-scroll rounded-md bg-zinc-200">
              {categories.map(
                (c) =>
                  c.type === "base" && (
                    <div key={c.name} className="flex flex-col p-2">
                      <p
                        id="baseCategory"
                        className="border-b-2 border-zinc-800 p-1 pb-0 text-xl"
                        onClick={() => {
                          setOpenCats((prev) => {
                            return openCats.some((cat) => cat.includes(c.name))
                              ? prev.filter((pc) => pc !== c.name)
                              : Array.from(new Set([...prev, c.name]));
                          });
                          console.log(c, openCats);
                        }}
                      >
                        {c.name}
                      </p>
                      <div className="space-y-2">
                        {Array.isArray(c.Children) &&
                          c.Children.map(
                            (child) =>
                              child.Child?.name &&
                              openCats.includes(c.name) && (
                                <p
                                  onClick={() => {
                                    setSelected((prev) =>
                                      selected.some((e) =>
                                        e.includes(child.Child.name),
                                      )
                                        ? prev.filter(
                                            (p) => p !== child.Child.name,
                                          )
                                        : Array.from(
                                            new Set([
                                              ...prev,
                                              child.Child.name,
                                            ]),
                                          ),
                                    );
                                    console.log(child);
                                  }}
                                  className={`${
                                    selected.some((e) =>
                                      e.includes(child.Child.name),
                                    )
                                      ? "bg-zinc-900 bg-opacity-20"
                                      : "bg-zinc-200"
                                  } drop rounded-sm p-1 pl-5 drop-shadow-md`}
                                >
                                  {child.Child.name}
                                </p>
                              ),
                          )}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
        <button
          onClick={() =>
            console.log(categories.filter((c) => selected.includes(c.name)))
          }
          className="fixed bottom-2 left-[40vw] z-20 rounded-3xl bg-accent px-6 py-2 text-xl text-zinc-100"
        >
          save
        </button>
      </>
    );
  };
  return (
    <div>
      <div className="w-full rounded-md bg-accent p-2 text-zinc-100">
        Manage Categories
      </div>
      <AddCategoryForm />
      {categories && <CategoryPopup categories={categories} />}
    </div>
  );
};

// type CategoryList = Array<
//   Category & {
//     Children?: Array<Category & { Child: Category; Parent: Category }>;
//     Parents?: Array<Category & { Parent: Category; Child: Category }>;
//   }
// >;

export default ManageCategories;

const AddCategoryForm = () => {
  const { register, handleSubmit, formState, control } = useForm();
  const { data: categories } = api.category.getCategories.useQuery();
  const { mutate: createCategory } = api.category.addCategory.useMutation();
  const baseType = useWatch({ name: "type", defaultValue: "base", control });
  const handleFinalSubmit = (data: {
    type: string;
    name: string;
    parent_id?: string;
  }) => {
    // console.log(data);
    createCategory(data);
  };
  return (
    <form
      className="flex flex-col gap-2 bg-accent p-2"
      onSubmit={handleSubmit(handleFinalSubmit)}
    >
      {baseType === "sub" && (
        <select
          placeholder="Parent"
          className="rounded-md p-2"
          {...register("parent_id")}
        >
          <option value="">Select Parent Category</option>
          {categories &&
            categories
              .filter((c) => c.type === "base")
              .map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
        </select>
      )}
      <input
        className="rounded-md p-2"
        {...register("name")}
        placeholder="name"
      />
      <select
        className="rounded-md p-2"
        {...register("type")}
        placeholder="type"
      >
        <option value={"base"}>Base Category</option>
        <option value={"sub"}>Sub Category</option>
      </select>
      <button
        className="rounded-md bg-accent-light p-2 text-zinc-100"
        type="submit"
      >
        Add Category
      </button>
    </form>
  );
};
