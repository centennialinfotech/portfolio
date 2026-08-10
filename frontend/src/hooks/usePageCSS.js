import { useInsertionEffect } from "react";

export default function usePageCSS(cssText, key = "page") {
  const styleId = `page-css-${key}`;

  useInsertionEffect(() => {
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = cssText;

    return () => {
      const currentStyle = document.getElementById(styleId);

      if (currentStyle) {
        currentStyle.remove();
      }
    };
  }, [cssText, styleId]);
}