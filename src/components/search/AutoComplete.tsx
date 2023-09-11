import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import {
  type AutocompleteOptions,
  autocomplete,
} from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";
import { BusinessInfo } from "@prisma/client";

type ItemType = BusinessInfo;
type AutoCompleteProps = {
  props?: Partial<AutocompleteOptions<ItemType>>;
  businesses: BusinessInfo[];
};
const AutoComplete: React.FC<AutoCompleteProps> = ({ props, businesses }) => {
  const autocompleteRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!autocompleteRef.current) {
      return undefined;
    }

    const search = autocomplete({
      detachedMediaQuery: "none",
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
                  <div>
                    <span>{item?.business_name}</span>
                    <span>{item.zip_code}</span>
                  </div>
                );
              },
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
