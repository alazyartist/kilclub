import React, { useState } from "react";
import { type GetCategories } from "~/utils/RouterTypes";
import { api } from "~/utils/api";

const CategoryPopup = ({
  categories,
  close,
  type,
  startCategories,
  business_id,
  job_id,
}: {
  type: "business" | "job";
  categories: GetCategories;
  business_id: string;
  job_id?: string;
  startCategories: string[];
  close: React.Dispatch<React.SetStateAction<Boolean>>;
}) => {
  const [selected, setSelected] = useState<Array<string>>(startCategories);
  const [openCats, setOpenCats] = useState<Array<string>>([]);
  const { mutate: saveBusinessCateories } =
    api.business.saveBusinessCategories.useMutation();
  const { mutate: saveJobCateories } = api.jobs.saveJobCategories.useMutation();

  const handleSave = async () => {
    const activeCategories = categories.filter((c) =>
      selected.includes(c.name),
    );
    if (type === "business") {
      console.log(activeCategories);
      saveBusinessCateories({
        business_id: business_id,
        categories: activeCategories,
      });
      close(false);
      //businessCategory save logic
    } else if (type === "job") {
      //jobCategory save logic
      saveJobCateories({
        business_id: business_id,
        job_id: job_id,
        categories: activeCategories,
      });
      close(false);
    }
  };

  return (
    <>
      {categories && (
        <div className="minimalistScroll absolute left-[0] top-[0vh] z-10 h-[100vh] w-[100vw] space-y-3 overflow-y-scroll rounded-md p-2 backdrop-blur-md">
          <div className="minimalistScroll sticky top-1 z-20 h-[20vh] w-full space-y-2 overflow-y-scroll rounded-md bg-zinc-800 p-2">
            <div
              className="top-2s absolute right-4 z-20 text-xl font-black text-zinc-200"
              onClick={() => close(false)}
            >
              X
            </div>
            <p className="sticky top-0 border-b-2 border-zinc-200 bg-zinc-800 text-xl text-zinc-100">
              active categories
            </p>
            <div className=" flex flex-wrap gap-2  ">
              {selected.length > 0 &&
                selected.map((name) => (
                  <p
                    key={name}
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
          <div className="minimalistScroll h-[75vh] overflow-y-scroll rounded-md bg-zinc-200">
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
                                key={c.name}
                                onClick={() => {
                                  setSelected((prev) =>
                                    selected.some((e) =>
                                      e.includes(child.Child.name),
                                    )
                                      ? prev.filter(
                                          (p) => p !== child.Child.name,
                                        )
                                      : Array.from(
                                          new Set([...prev, child.Child.name]),
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
        onClick={() => handleSave()}
        className="fixed bottom-2 left-[40vw] z-20 rounded-3xl bg-accent px-6 py-2 text-xl text-zinc-100"
      >
        save
      </button>
    </>
  );
};

export default CategoryPopup;
