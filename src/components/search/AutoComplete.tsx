import React, { useEffect, useRef, createElement, Fragment } from "react";
import { createRoot } from "react-dom/client";
import {
  type AutocompleteOptions,
  autocomplete,
} from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic";

type ItemType = {
  label: string;
};
type AutoCompleteProps = {
  props?: Partial<AutocompleteOptions<ItemType>>;
};
const AutoComplete: React.FC<AutoCompleteProps> = ({ props }) => {
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
                return <div>{item?.label}</div>;
              },
            },
            getItems() {
              const pattern = getQueryPattern(query);
              return [
                { label: "test" },
                { label: "test2" },
                { label: "test22" },
                { label: "test23" },
                { label: "test33" },
              ].filter((t) => pattern.test(t.label));
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
