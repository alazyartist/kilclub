import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import {
  type AutocompleteOptions,
  autocomplete,
} from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import type { BusinessInfo, Category } from "@prisma/client";
import { useRouter } from "next/router";

type ItemType = Category | BusinessInfo;
type AutoCompleteProps = {
  props?: Partial<AutocompleteOptions<ItemType>>;
  businesses: BusinessInfo[];
  categories: Category[];
};
const AutoComplete: React.FC<AutoCompleteProps> = ({ props, categories }) => {
  const autocompleteRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!autocompleteRef.current) {
      return undefined;
    }

    const search = autocomplete({
      openOnFocus: true,
      detachedMediaQuery: "none",
      classNames: { panel: " h-[50vh] " },
      onSubmit: ({ state: { query } }) => router.push(`/search?sq=${query}`),
      container: autocompleteRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }
        panelRootRef.current.render(children);
      },

      getSources: ({ query }) => {
        return [
          {
            sourceId: "categories",
            templates: {
              item({ item }) {
                if ("category_id" in item) {
                  return (
                    <div className="flex justify-between">
                      <p>{item?.name}</p>
                    </div>
                  );
                }
              },
            },
            onSelect(params) {
              const { item } = params;
              if ("category_id" in item) {
                return router.push(`/search?sq=${item.category_id}`);
              }
              //handle select from search here
            },
            getItems() {
              const pattern = getQueryPattern(query);
              if (!categories) return [];
              if (query.length > 0) {
                return categories.filter((t) => pattern.test(t.name));
              } else return categories;
            },
          },
          // {
          //   sourceId: "businesses",
          //   templates: {
          //     item({ item }) {
          //       if ("business_name" in item) {
          //         return (
          //           <div className="flex justify-between">
          //             <p>{item?.business_name}</p>
          //             <p>{item.zip_code}</p>
          //           </div>
          //         );
          //       }
          //     },
          //   },
          //   onSelect(params) {
          //     const { item, setQuery } = params;
          //     //handle select from search here
          //     if ("business_id" in item) {
          //       router.push(`/business?bid=${item.business_id}`);
          //     }
          //   },
          //   getItems() {
          //     const pattern = getQueryPattern(query);
          //     if (!businesses) return [];
          //     return businesses.filter((t) => pattern.test(t.zip_code));
          //   },
          // },
        ];
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  });

  return (
    <>
      <div id="autocomplete" ref={autocompleteRef} />
    </>
  );
};

export default AutoComplete;

export const getQueryPattern = (query: string, flags = "i") => {
  const pattern = new RegExp(
    `(${query
      .trim()
      .toLowerCase()
      .split(" ")
      .map((token) => `${token}`)
      .join("|")})`,
    flags,
  );
  return pattern;
};
