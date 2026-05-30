import React, { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
//console.log("DB OBJECT:", db);

export default function Login() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type");

  const isDemo = type === "demo";
  const isRegister = type === "register";

  const [name, setName] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        if (type === "register") {
          navigate("/portfolio");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, type]);

  // EMAIL REGISTER
  const registerUser = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: form.username,
        email: user.email,

        provider: "email",

        plan: "trial",
        trialStartedAt: Date.now(),
        trialEndsAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
      });

      navigate("/portfolio");
    } catch (error) {
      alert(error.message);
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("USER:", user);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,

          provider: "google",

          plan: "trial",
          createdAt: Date.now(),
          trialEndsAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
        },
        { merge: true },
      );
      console.log("WRITE SUCCESS");
      navigate("/portfolio");
    } catch (error) {
      console.error("FULL ERROR:", error);
      console.log(error);
      console.log(error.code);
      console.log(error.message);
      alert(error.message);
    }
  };
  const loginUser = async () => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const user = result.user;

      // OPTIONAL: fetch user profile from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("USER DATA:", docSnap.data());
      }

      navigate("/portfolio");
    } catch (error) {
      alert(error.message);
    }
  };

  if (type !== "register" && type !== "demo") {
    navigate("/");
    return null;
  }

  const handleStart = () => {
    const demoUser = {
      name: name || "Demo User",
      type: "demo",
      createdAt: Date.now(),
    };

    localStorage.setItem("demoUser", JSON.stringify(demoUser));

    navigate("/demo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {isDemo && (
        <div className="w-[400px] p-8 rounded-2xl bg-white/5 border border-white/10">
          <h1 className="text-3xl font-bold mb-3">Start Demo</h1>

          <p className="text-white/50 mb-6">
            Preview the portfolio dashboard instantly.
          </p>

          <input
            placeholder="Enter demo name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 mb-6"
          />

          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-blue-500 font-semibold"
          >
            Start Demo
          </button>
        </div>
      )}
      {isRegister && (
        <div className="w-[420px] p-8 rounded-2xl bg-white/5 border border-white/10">
          <h1 className="text-3xl font-bold mb-2">Start Free Trial</h1>

          <p className="text-white/50 mb-8">
            3-Day Trial • Watermarked Version
          </p>

          {/* USERNAME */}
          {/* <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          className="w-full p-3 rounded-xl bg-black/30 border border-white/10 mb-4"
        /> */}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 mb-4"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 mb-6"
          />

          {/* REGISTER */}
          <button
            onClick={registerUser}
            className="w-full py-3 rounded-xl bg-purple-500 mb-5"
          >
            Start Free Trial
          </button>
          <button onClick={loginUser}>Login</button>

          {/* DIVIDER */}
          <div className="text-center text-white/40 mb-5">OR</div>

          {/* GOOGLE */}
          <button
            onClick={googleLogin}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold"
          >
            Continue with Google
          </button>
        </div>
      )}
    </div>
  );
}
