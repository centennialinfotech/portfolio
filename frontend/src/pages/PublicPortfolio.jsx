import { useMemo } from "react";

export default function PublicPortfolio() {
  const subdomain = useMemo(() => {
    return window.location.hostname.split(".")[0];
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Public Portfolio</h1>

      <p>
        <strong>Subdomain:</strong> {subdomain}
      </p>
    </div>
  );
}
