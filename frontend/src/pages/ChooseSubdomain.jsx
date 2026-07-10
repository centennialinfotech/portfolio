import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "../css/choose-subdomain.css";
import { defaultPortfolio } from "../data/defaultPortfolio";

export default function ChooseSubdomain() {
  const [subdomain, setSubdomain] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!auth.currentUser) return;

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const userData = userSnap.data();

        // User already has a subdomain
        if (userData.subdomain) {
          navigate("/portfolio");
          return;
        }

        // User clicked "Skip for Now" previously
        if (userData.skippedSubdomain) {
          navigate("/portfolio");
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUserStatus();
  }, [navigate]);

  const checkAvailability = async () => {
    setChecking(true);
    setIsAvailable(false);

    const value = subdomain.trim().toLowerCase();

    if (!value) {
      setMessage("❌ Please enter a subdomain.");
      setChecking(false);
      return false;
    }

    if (value.length < 3) {
      setMessage("❌ Minimum 3 characters.");
      setChecking(false);
      return false;
    }

    // Maximum length
    if (value.length > 30) {
      setMessage("❌ Maximum 30 characters.");
      setChecking(false);
      return false;
    }

    // Only lowercase letters, numbers and hyphens
    const regex = /^[a-z0-9-]+$/;

    if (!regex.test(value)) {
      setMessage(
        "❌ Only lowercase letters, numbers and hyphens (-) are allowed.",
      );
      setChecking(false);
      return false;
    }

    // Cannot start or end with a hyphen
    if (value.startsWith("-") || value.endsWith("-")) {
      setMessage("❌ Subdomain cannot start or end with a hyphen.");
      setChecking(false);
      return false;
    }

    const reserved = [
      "www",
      "admin",
      "api",
      "mail",
      "support",
      "login",
      "dashboard",
    ];

    if (reserved.includes(value)) {
      setMessage("❌ This name is reserved.");
      setChecking(false);
      return false;
    }

    const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

    if (userSnap.exists() && userSnap.data().subdomain) {
      setMessage(`❌ You already own ${userSnap.data().subdomain}`);
      setChecking(false);
      return false;
    }

    const snap = await getDoc(doc(db, "subdomains", value));

    if (snap.exists()) {
      setMessage("❌ This subdomain is already taken.");
      setChecking(false);
      return false;
    }

    setMessage("✅ Great! This subdomain is available.");
    setIsAvailable(true);
    setChecking(false);
    return true;
  };

  const skipForNow = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        skippedSubdomain: true,
      });

      navigate("/portfolio");
    } catch (err) {
      console.error(err);
    }
  };

  const reserve = async () => {
    console.log("Reserve button clicked");

    if (!auth.currentUser) {
      setMessage("❌ Please login first.");
      return;
    }

    try {
      const value = subdomain.trim().toLowerCase();

      // Check if the user already owns a subdomain
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.subdomain) {
          setMessage(`❌ You already own "${userData.subdomain}".`);
          navigate("/portfolio");
          return;
        }
      }

      // Validate and check availability
      const available = await checkAvailability();

      if (!available) {
        return;
      }

      console.log("Saving subdomain...");

      // Reserve the subdomain
      await setDoc(doc(db, "subdomains", value), {
        uid: auth.currentUser.uid,
        createdAt: new Date(),
      });

      // Update user document
      await updateDoc(userRef, {
        subdomain: value,
        portfolioPublished: true,
        skippedSubdomain: false,
      });

      console.log("Subdomain reserved successfully.");

      setMessage("✅ Subdomain reserved successfully!");
      const portfolioRef = doc(db, "trialData", auth.currentUser.uid);
      const portfolioSnap = await getDoc(portfolioRef);
      if (!portfolioSnap.exists()) {
        await setDoc(portfolioRef, defaultPortfolio);
      }

      // Redirect to portfolio
      navigate("/portfolio");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="subdomain-page">
      <div className="subdomain-card">
        <div className="badge">🚀 FREE Portfolio URL</div>

        <h1>Choose Your Portfolio URL</h1>

        <p className="subtitle">
          Every account includes a free portfolio URL that you can share with
          recruiters, clients and friends.
        </p>

        <div className="url-box">
          <span>https://</span>

          <input
            type="text"
            placeholder="john"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
          />

          <span>.centennialinfotech.com</span>
        </div>

        <div className="preview">
          Portfolio URL Preview
          <strong>
            https://
            {subdomain || "john"}
            .centennialinfotech.com
          </strong>
        </div>

        {message && (
          <div
            className={`status ${
              message.startsWith("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="btn-group">
          <button className="secondary-btn" onClick={checkAvailability}>
            {checking ? "Checking..." : "Check Availability"}
          </button>

          <button
            className="primary-btn"
            onClick={reserve}
            // disabled={!isAvailable}
          >
            Reserve My URL
          </button>

          <button className="secondary-btn" onClick={skipForNow}>
            Skip for Now
          </button>
        </div>

        <div className="divider"></div>

        <div className="feature-grid">
          <div className="feature">
            🌍
            <h4>Public Portfolio</h4>
            <p>Share your portfolio with one click.</p>
          </div>

          <div className="feature">
            🔒
            <h4>Free SSL</h4>
            <p>Your portfolio is automatically secure.</p>
          </div>

          <div className="feature">
            ⚡<h4>Fast Loading</h4>
            <p>Hosted globally for better performance.</p>
          </div>

          <div className="feature">
            🚀
            <h4>Custom Domain</h4>
            <p>Upgrade anytime and connect your own domain.</p>
          </div>
        </div>

        <div className="rules">
          <h3>Subdomain Rules</h3>

          <ul>
            <li>Minimum 3 characters</li>
            <li>Maximum 30 characters</li>
            <li>Lowercase letters only</li>
            <li>Numbers are allowed</li>
            <li>Hyphens (-) are allowed</li>
            <li>No spaces or special characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
