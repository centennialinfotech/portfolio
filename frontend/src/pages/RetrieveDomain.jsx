import { useState } from "react";
import "../css/retrievedomain.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
const BASE_DOMAIN = "centennialinfotech.com"; // Change to your domain
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
                  http://{domain.subdomain}.{BASE_DOMAIN}
                </div>

                <a
                  href={`http://${domain.subdomain}.${BASE_DOMAIN}`}
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
