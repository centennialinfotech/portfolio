import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Trial from "./pages/Trial";
import Pricing from "./pages/Pricing";
import PlanDetails from "./pages/PlanDetails";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermCondition from "./pages/TermCondition";
import CookieBanner from "./components/CookieBanner";

function App() {
  return (
    <>
      <CookieBanner />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<Dashboard />} />
        <Route path="/trial" element={<Trial />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/plan/:planId" element={<PlanDetails />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/payment/:planId" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/term-condition" element={<TermCondition />} />
      </Routes>
    </>
  );
}

export default App;
