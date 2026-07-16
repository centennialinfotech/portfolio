import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { loadStripe } from "@stripe/stripe-js";
import usePageCSS from "../hooks/usePageCSS";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth } from "../services/firebase";
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// COUNTRIES ARRAY
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech",
  "Denmark",
  "Dominican",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Papua",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Trinidad",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function Checkout() {
  usePageCSS("/css/checkout.css");
  const navigate = useNavigate();
  const { planId } = useParams();

  const plans = {
    basic: {
      name: "Basic Plan",
      price: "$19",
    },

    professional: {
      name: "Professional Plan",
      price: "$35",
    },

    business: {
      name: "Business Plan",
      price: "$49",
    },
  };

  const plan = plans[planId];

  if (!plan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Invalid Plan
      </div>
    );
  }

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!customer.name || !customer.email || !customer.country) {
      setError("Please fill in all required fields.");
      return;
    }

    // Gmail validation
    if (!customer.email.endsWith("@gmail.com")) {
      setError("Please use a Gmail address (example@gmail.com)");
      return;
    }

    setError("");

    try {
      setLoading(true);

      // SAVE TO FIREBASE
      const docRef = await addDoc(collection(db, "checkouts"), {
        customerName: customer.name,
        customerEmail: customer.email,
        country: customer.country,

        planId,
        planName: plan.name,
        amount: plan.price * 100,

        paymentMethod,

        createdAt: serverTimestamp(),
      });

      console.log("CHECKOUT SAVED:", docRef.id);

      // PAYMENT GATEWAY FLOW
      // PAYMENT GATEWAY FLOW

      // RAZORPAY
      if (paymentMethod === "razorpay") {
        const options = {
          key: "rzp_test_StakiXOncRSqJe",

          amount:
            planId === "basic" ? 1900 : planId === "professional" ? 3500 : 4900,

          currency: "USD",

          name: "Centennial Portfolio",

          description: plan.name,

          handler: async function (response) {
            try {
              const user = auth.currentUser;

              // SAVE PAYMENT
              await addDoc(collection(db, "payments"), {
                customerName: customer.name,
                customerEmail: customer.email,
                country: customer.country,

                planId,
                planName: plan.name,
                amount: plan.price,

                razorpayPaymentId: response.razorpay_payment_id,

                status: "success",

                createdAt: serverTimestamp(),
              });

              // UPDATE USER PREMIUM STATUS
              if (user) {
                await setDoc(
                  doc(db, "users", user.uid),
                  {
                    premium: true,
                    plan: planId,
                    premiumSince: serverTimestamp(),
                  },
                  { merge: true },
                );
              }

              localStorage.setItem(
                "premiumUser",
                JSON.stringify({
                  plan: plan.name,
                  paymentId: response.razorpay_payment_id,
                }),
              );

              navigate("/success");
            } catch (error) {
              console.log(error);
              alert(error.message);
            }
          },

          prefill: {
            name: customer.name,
            email: customer.email,
          },

          theme: {
            color: "#8b5cf6",
          },
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.open();
      }

      // PAYPAL
      if (paymentMethod === "paypal") {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/create-paypal-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              planId,
              customer,
            }),
          },
        );

        const data = await response.json();

        console.log("PayPal Response:", data);

        if (!data.success) {
          throw new Error("Unable to create PayPal order");
        }

        window.location.href = data.approvalUrl;
      }

      // STRIPE / CARD
      if (paymentMethod === "card") {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/create-stripe-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              planId,
              customer,
            }),
          },
        );

        const data = await response.json();
        console.log(data);
        // const text = await response.text();
        // console.log("Response:", text);

        //const data = text ? JSON.parse(text) : {};

        if (!data.success) {
          throw new Error(data.error || "Unable to create Stripe session");
        }

        window.location.assign(data.url);

        if (result.error) {
          throw new Error(result.error.message);
        }

        return;
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-28 py-20">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="bg-white/[0.05] border border-white/10 rounded-[32px] p-10">
          <h1 className="text-4xl font-black mb-4">Checkout</h1>

          <p className="text-white/60 mb-10">
            Complete your purchase securely.
          </p>

          {/* FORM */}
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  name: e.target.value,
                })
              }
              className={`w-full p-4 rounded-2xl bg-black/40 border ${
                error && !customer.name ? "border-red-500" : "border-white/10"
              }`}
            />

            <input
              type="email"
              placeholder="yourname@gmail.com"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
              className={`w-full p-4 rounded-2xl bg-black/40 text-white border ${
                (error && !customer.email) ||
                (customer.email && !customer.email.endsWith("@gmail.com"))
                  ? "border-red-500"
                  : "border-white/10"
              }`}
            />
            <select
              value={customer.country}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  country: e.target.value,
                })
              }
              className={`w-full p-4 rounded-2xl bg-black/40 text-white border ${
                error && !customer.country
                  ? "border-red-500"
                  : "border-white/10"
              } appearance-none`}
            >
              <option value="" className="bg-black">
                Select your country
              </option>
              {countries.map((country) => (
                <option key={country} value={country} className="bg-black">
                  {country}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Coupon Code (Optional)"
              className="w-full p-4 rounded-2xl bg-black/40 border border-white/10"
            />
          </div>

          {/* PAYMENT */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-5">Payment Method</h2>

            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                💳 Credit / Debit Card
              </button>

              <button
                onClick={() => setPaymentMethod("razorpay")}
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  paymentMethod === "razorpay"
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                🇮🇳 UPI / Razorpay
              </button>

              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`w-full border rounded-2xl p-5 text-left transition ${
                  paymentMethod === "paypal"
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                🌍 PayPal
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-[32px] p-10 h-fit sticky top-10">
          <h2 className="text-3xl font-black">Order Summary</h2>

          <div className="mt-10 space-y-5">
            <div className="flex justify-between">
              <span className="text-white/60">Plan</span>

              <span className="font-semibold">{plan.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">Billing</span>

              <span>One Time</span>
            </div>

            <div className="border-t border-white/10 pt-5 flex justify-between text-2xl font-bold">
              <span>Total</span>

              <span>{plan.price}</span>
            </div>
          </div>

          {/* BUY BUTTON */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full mt-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          {/* SECURITY */}
          <p className="text-white/50 text-sm text-center mt-6 leading-relaxed">
            Secure encrypted checkout. Your payment information is protected.
          </p>

          {/* LINKS */}
          <div className="flex justify-center gap-5 mt-6 text-sm text-white/50">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-white"
            >
              Privacy Policy
            </button>

            <button
              onClick={() => navigate("/refund-policy")}
              className="hover:text-white"
            >
              Refund Policy
            </button>

            <button
              onClick={() => navigate("/terms")}
              className="hover:text-white"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
