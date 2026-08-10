import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import loginCss from "../css/login.css?inline";
import usePageCSS from "../hooks/usePageCSS";

export default function Login() {
  usePageCSS(loginCss, "login");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [resetMode, setResetMode] = useState(false);
  const [demoName, setDemoName] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const isDemo = type === "demo";
  const isRegister = type === "register";
  const isLogin = type === "login";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/choose-subdomain");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!isRegister && !isLogin && !isDemo) {
    navigate("/");
    return null;
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const getFirebaseError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "An account already exists with this email.";
      case "auth/weak-password":
        return "Password must be at least 6 characters long.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return error.message || "An authentication error occurred.";
    }
  };

  const registerUser = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!form.email.trim() || !isValidEmail(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: user.email,
        provider: "email",
        plan: "trial",
        trialStartedAt: Date.now(),
        trialEndsAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
      });

      setSuccessMsg("Account created successfully!");
      navigate("/choose-subdomain");
    } catch (error) {
      setErrorMsg(getFirebaseError(error));
    }
  };

  const loginUser = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.email.trim() || !isValidEmail(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!form.password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      setSuccessMsg("Login successful!");
      navigate("/choose-subdomain");
    } catch (error) {
      setErrorMsg(getFirebaseError(error));
    }
  };

  const googleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "google",
          plan: "trial",
          createdAt: Date.now(),
          trialStartedAt: Date.now(),
          trialEndsAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        });
      }
    } catch (error) {
      setErrorMsg(getFirebaseError(error));
    }
  };

  const forgotPassword = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.email.trim() || !isValidEmail(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email.trim());
      setSuccessMsg("Password reset link sent to your email.");
    } catch (error) {
      setErrorMsg(getFirebaseError(error));
    }
  };

  const handleStartDemo = () => {
  setErrorMsg("");

  const name = demoName.trim();

  if (!name) {
    setErrorMsg("Please enter your name to start the demo.");
    return;
  }

  const demoUser = {
    name,
    type: "demo",
    createdAt: Date.now(),
  };

  localStorage.setItem("demoUser", JSON.stringify(demoUser));
  navigate("/demo");
};

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 font-medium text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {isDemo && (
        <div className="login-card">
          <h1 className="login-title">Start Instant Demo</h1>

          <p className="login-subtitle">
            Preview your interactive portfolio dashboard immediately.
          </p>

          {errorMsg && (
            <div className="login-status-error">
              {errorMsg}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter your name"
            value={demoName}
            onChange={(e) => setDemoName(e.target.value)}
            className="login-input"
          />

          <button onClick={handleStartDemo} className="login-btn-primary">
            Start Demo
          </button>
        </div>
      )}

      {(isRegister || isLogin) && (
        <div className="login-card">
          <h1 className="login-title">
            {resetMode
              ? "Reset Password"
              : isRegister
              ? "Start Free Trial"
              : "Welcome Back"}
          </h1>

          <p className="login-subtitle">
            {resetMode
              ? "Enter your email to receive a password reset link."
              : isRegister
              ? "Create your account to launch your portfolio."
              : "Log in to manage your portfolio dashboard."}
          </p>

          {errorMsg && <div className="login-status-error">{errorMsg}</div>}
          {successMsg && <div className="login-status-success">{successMsg}</div>}

          {isRegister && !resetMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name *"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="login-input"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="login-input"
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="login-input"
          />

          {!resetMode && (
            <input
              type="password"
              placeholder="Password *"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="login-input"
            />
          )}

          {isLogin && !resetMode && (
            <button
              type="button"
              onClick={() => {
                setResetMode(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="forgot-btn"
            >
              Forgot Password?
            </button>
          )}

          {resetMode ? (
            <div className="flex flex-col gap-3 mt-4">
              <button onClick={forgotPassword} className="login-btn-primary">
                Send Reset Link
              </button>
              <button
                onClick={() => {
                  setResetMode(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="login-btn-secondary"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {isRegister ? (
                <>
                  <button onClick={registerUser} className="login-btn-primary">
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => {
                      setErrorMsg("");
                      setSuccessMsg("");
                      navigate("/login?type=login");
                    }}
                    className="login-btn-secondary"
                  >
                    Already have an account? Login
                  </button>
                </>
              ) : (
                <>
                  <button onClick={loginUser} className="login-btn-primary">
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setErrorMsg("");
                      setSuccessMsg("");
                      navigate("/login?type=register");
                    }}
                    className="login-btn-secondary"
                  >
                    Create an Account
                  </button>
                </>
              )}
            </div>
          )}

          {!resetMode && (
            <>
              <div className="login-divider">OR</div>
              <button onClick={googleLogin} className="login-btn-google">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {isRegister ? "Sign up with Google" : "Login with Google"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
