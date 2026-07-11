import { useState } from "react";
import "../css/retrievedomain.css";
const BASE_DOMAIN = "portfolio.com"; // Change to your domain
export default function RetrieveDomain() {
  const [email, setEmail] = useState("");
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setDomains([]);

    try {
      const response = await fetch("/api/domains/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setDomains(data.domains);

        if (data.domains.length === 0) {
          setMessage("No domains found.");
        }
      } else {
        setMessage(data.message || "Unable to retrieve domains.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="subdomain-page">
      <div className="subdomain-card">
        <div className="badge">🔍 Domain Recovery</div>

        <h1>Retrieve Your Portfolio URL</h1>

        <p className="subtitle">
          Enter the email address you used to register your portfolio. We'll
          locate your registered subdomain(s).
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="retrieve-input"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="btn-group">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Searching..." : "Find My Domains"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`status ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        {domains.length > 0 && (
          <>
            <div className="divider"></div>

            <h3>Your Registered Domains</h3>

            {domains.map((domain) => (
              <div className="domain-card" key={domain.id}>
                <div className="domain-name">
                  https://{domain.subdomain}.{BASE_DOMAIN}
                </div>

                <a
                  href={`https://${domain.subdomain}.${BASE_DOMAIN}`}
                  className="primary-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
