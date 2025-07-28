// src/components/Fancybox.jsx
import { useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";

function Fancybox({ delegate = "[data-fancybox]", options, children }) {
  useEffect(() => {
    NativeFancybox.bind(delegate, options || {});

    return () => {
      NativeFancybox.destroy();
    };
  }, [delegate, options]);

  return children;
}

export default Fancybox;
