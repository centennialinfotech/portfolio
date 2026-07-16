import { useState } from "react";
import usePageCSS from "../hooks/usePageCSS";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const BASE_DOMAIN = "centennialinfotech.com";

export default function RetrieveDomain() {
  usePageCSS("/css/retrievedomain.css");
  const [email, setEmail] = useState("");
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setDomains([]);

    try {
      const usersRef = collection(db, "users");

      const q = query(
        usersRef,
        where("email", "==", email.trim().toLowerCase()),
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMessage("❌ No account found with this email.");
        return;
      }

      const foundDomains = [];

      snapshot.forEach((doc) => {
        const user = doc.data();
        if (user.subdomain) {
          foundDomains.push({
            id: doc.id,
            subdomain: user.subdomain,
          });
        }
      });

      if (foundDomains.length === 0) {
        setMessage("❌ No subdomain registered for this account.");
      } else {
        setDomains(foundDomains);
        setMessage("✅ Domain found.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopyMessage("✅ Copied!");
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  const handleShare = async (url, subdomain) => {
    const shareData = {
      title: "My Portfolio",
      text: `Check out my portfolio: ${subdomain}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopy(url);
        }
      }
    } else {
      handleCopy(url);
    }
  };

  return (
    <div className="retrieve-domain-page">
      <div className="retrieve-domain-card">
        <div className="retrieve-domain-badge">🔍 Domain Recovery</div>

        <h1>Retrieve Your Portfolio URL</h1>

        <p className="subtitle">
          Enter the email address you used to register your portfolio. We'll
          locate your registered subdomain(s).
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="retrieve-domain-input"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="retrieve-domain-btn-group">
            <button
              type="submit"
              className="retrieve-domain-primary-btn"
              disabled={loading}
            >
              {loading ? "Searching..." : "Find My Domains"}
            </button>
            <button
              type="button"
              className="retrieve-domain-primary-btn"
              onClick={() => navigate("/choose-subdomain")}
            >
              Register Subdomain
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`retrieve-domain-status ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        {copyMessage && (
          <div className="retrieve-domain-status success">{copyMessage}</div>
        )}

        {domains.length > 0 && (
          <div className="retrieve-domain-found">
            <h3>Your Registered Domains</h3>

            {domains.map((domain) => {
              const fullUrl = `http://${domain.subdomain}.${BASE_DOMAIN}`;
              return (
                <div className="domain-item" key={domain.id}>
                  <span className="domain-url">{fullUrl}</span>
                  <div className="domain-actions">
                    <button
                      className="domain-copy-btn"
                      onClick={() => handleCopy(fullUrl)}
                      title="Copy URL"
                    >
                      📋 Copy
                    </button>
                    <button
                      className="domain-share-btn"
                      onClick={() => handleShare(fullUrl, domain.subdomain)}
                      title="Share URL"
                    >
                      📤 Share
                    </button>
                    <a
                      href={fullUrl}
                      className="open-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
