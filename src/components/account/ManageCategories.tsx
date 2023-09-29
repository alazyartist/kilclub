import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { api } from "~/utils/api";

const ManageCategories = () => {
  const { data: categories } = api.category.getCategories.useQuery();
  return (
    <div>
      <div className="w-full rounded-md bg-accent p-2 text-zinc-100">
        Manage Categories
      </div>
      <AddCategoryForm />
      {categories &&
        categories.map((c) => (
          <div onClick={() => console.log(c)} key={c.name}>
            {c.name}
          </div>
        ))}
    </div>
  );
};

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
