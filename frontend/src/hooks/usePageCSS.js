import { useEffect } from "react";

export default function usePageCSS(href) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [href]);
}
