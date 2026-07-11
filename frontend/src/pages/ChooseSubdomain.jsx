import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "../css/choose-subdomain.css";
import { defaultPortfolio } from "../data/defaultPortfolio";
import { onAuthStateChanged } from "firebase/auth";

export default function ChooseSubdomain() {
  const [subdomain, setSubdomain] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const user = auth.currentUser;

      console.log("USER:", user);

      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      console.log("EXISTS:", snap.exists());

      if (snap.exists()) {
        console.log("DATA:", snap.data());
      }
    };

    check();
  }, []);

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

    if (value.length > 30) {
      setMessage("❌ Maximum 30 characters.");
      setChecking(false);
      return false;
    }

    const regex = /^[a-z0-9-]+$/;

    if (!regex.test(value)) {
      setMessage(
        "❌ Only lowercase letters, numbers and hyphens (-) are allowed.",
      );
      setChecking(false);
      return false;
    }

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

      const available = await checkAvailability();

      if (!available) {
        return;
      }

      console.log("Saving subdomain...");

      await setDoc(doc(db, "subdomains", value), {
        uid: auth.currentUser.uid,
        createdAt: new Date(),
      });

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

      navigate("/portfolio");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopyMessage("✅ Copied!");
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  const handleShare = async (url) => {
    const shareData = {
      title: "My Portfolio",
      text: `Check out my portfolio: ${subdomain || "john"}`,
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

  const getFullUrl = () => {
    const value = subdomain.trim().toLowerCase() || "john";
    return `https://${value}.centennialinfotech.com`;
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
          <small>Portfolio URL Preview</small>
          <strong>{getFullUrl()}</strong>

          {/* Copy & Share Buttons */}
          <div className="preview-actions">
            <button
              className="preview-copy-btn"
              onClick={() => handleCopy(getFullUrl())}
              title="Copy URL"
            >
              📋 Copy
            </button>
            <button
              className="preview-share-btn"
              onClick={() => handleShare(getFullUrl())}
              title="Share URL"
            >
              📤 Share
            </button>
          </div>

          {copyMessage && <div className="copy-success">{copyMessage}</div>}
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
