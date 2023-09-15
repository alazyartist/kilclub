import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import {
  type AutocompleteOptions,
  autocomplete,
} from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { BusinessInfo } from "@prisma/client";
import { useRouter } from "next/router";

type ItemType = BusinessInfo;
type AutoCompleteProps = {
  props?: Partial<AutocompleteOptions<ItemType>>;
  businesses: BusinessInfo[];
};
const AutoComplete: React.FC<AutoCompleteProps> = ({ props, businesses }) => {
  const autocompleteRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!autocompleteRef.current) {
      return undefined;
    }

    const search = autocomplete({
      detachedMediaQuery: "none",
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
            sourceId: "businesses",
            templates: {
              item({ item }) {
                return (
                  <div className="flex justify-between">
                    <p>{item?.business_name}</p>
                    <p>{item.zip_code}</p>
                  </div>
                );
              },
            },
            onSelect(params) {
              const { item, setQuery } = params;
              //handle select from search here
              router.push(`/business?bid=${item.business_id}`);
            },
            getItems() {
              const pattern = getQueryPattern(query);
              if (!businesses) return [];
              return businesses.filter((t) => pattern.test(t.zip_code));
            },
          },
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
