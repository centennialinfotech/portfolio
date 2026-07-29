import PublicLayout from "../layouts/PublicLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* PRICING */}
      <section
        id="pricing"
        className="relative z-10 px-6 md:px-16 lg:px-28 py-16 border-t border-white/5"
      >
        {" "}
        <div className="max-w-[1180px]  mx-auto">
          {" "}
          <div className="text-center mb-20">
            {" "}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none">
              Simple Pricing
            </h2>{" "}
            <p
              className="
                mt-6
                max-w-2xl
                mx-auto
                text-base
                sm:text-xl
                text-white/60
                font-normal
                leading-relaxed
              "
            >
              {" "}
              Affordable portfolio websites designed to help you stand out.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {" "}
            {/* BASIC */}{" "}
            <div className="
            border
            bg-white/[0.03]
            border-white/5
            rounded-[30px]
            px-8
            pt-8
            pb-8
            min-h-[580px]
            flex
            flex-col
            transition-all
            duration-300
            hover:bg-[#0d0d0d]
            hover:border-white/15
            ">
              {" "}
              <h3 className="text-2xl sm:text-3xl font-black text-center">Basic</h3>{" "}
              <div className="flex items-end gap-2 mt-8">
                {" "}
                <span className="
                  text-5xl
                  sm:text-6xl
                  font-black
                  bg-gradient-to-r
                  from-white
                  to-white/80
                  bg-clip-text
                  text-transparent
                  ">
                  $19
                </span>{" "}
                <span className="uppercase tracking-wider font-semibold text-white/40 mb-2">one time</span>{" "}
              </div>{" "}
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-lg space-y-4 text-center">
                {" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Responsive Portfolio</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Free Hosting</p>{" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Resume Upload</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Contact Section</p>{" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Mobile Friendly</p>{" "}
                </div>
              </div>{" "}
              <button
                onClick={() => navigate("/plan/basic")}
                className="w-full mt-22 py-3 sm:py-4 rounded-xl font-bold py-4 shadow-lg transition-all duration-300 text-sm sm:text-base bg-white text-black font-semibold hover:bg-white/90 active:scale-95 transition-transform"
              >
                {" "}
                View Plan and Checkout{" "}
              </button>{" "}
            </div>{" "}
            {/* PRO */}{" "}
            <div className="
              relative
              rounded-[32px]
              p-[1.5px]
              bg-gradient-to-br
              from-blue-500
              via-purple-600
              to-pink-500
              shadow-2xl
              min-h-[580px]
              shadow-purple-500/10
              hover:shadow-purple-500/20
              hover:scale-[1.01]
              transition-all
              duration-300
              ">
              {" "}
              <div
                className="
                bg-black
                rounded-[29px]
                px-8
                pt-8
                pb-8
                min-h-[560px]
                flex
                flex-col
                "
              >
                {" "}
                <div className=" px-4 py-2 rounded-full bg-white text-black font-medium uppercase tracking-wider text-xs mb-6 text-center">
                  {" "}
                  Most Popular{" "}
                </div>{" "}
                <h3 className="text-2xl sm:text-3xl font-black text-center">
                  Professional
                </h3>{" "}
                <div className="flex items-end gap-2 mt-8">
                  {" "}
                  <span className="text-4xl sm:text-5xl md:text-6xl font-black">
                    $35
                  </span>{" "}
                  <span className="uppercase tracking-wider font-semibold text-white/40 mb-2">one time</span>{" "}
                </div>{" "}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="text-lg space-y-4 text-center">
                  {" "}
                  <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Custom Domain</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Premium Design</p>{" "}
                  <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> SEO Optimization</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Unlimited Projects</p>{" "}
                  <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Priority Support</p>{" "}
                  </div>
                </div>{" "}
                <button
                  onClick={() => navigate("/support")}
                  className="w-full mt-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-semibold hover:opacity-90 transition-opacity"
                >
                  {" "}
                  Contact Sales{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            {/* BUSINESS */}{" "}
            <div className="
              border
              bg-white/[0.03]
              border-white/5
              rounded-[30px]
              px-8
              pt-8
              pb-8
              min-h-[580px]
              flex
              flex-col
              transition-all
              duration-300
              hover:bg-[#0d0d0d]
              hover:border-white/15
              ">
              {" "}
              <h3 className="text-2xl sm:text-3xl font-black text-center">Business</h3>{" "}
              <div className="flex items-end gap-2 mt-8">
                {" "}
                <span className="text-4xl sm:text-5xl md:text-6xl font-black">
                  $49
                </span>{" "}
                <span className="uppercase tracking-wider font-semibold text-white/40 mb-2">one time</span>{" "}
              </div>{" "}
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-lg space-y-4 text-center">
                {" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Advanced Portfolio</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Admin Dashboard</p>{" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Blog Support</p> <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Analytics</p>{" "}
                <p className="text-white/70">
                <span className="text-white/50 font-bold">✓</span> Premium Hosting</p>{" "}
                </div>
              </div>{" "}
              <button
                onClick={() => navigate("/support")}
                className="w-full mt-22 py-3 sm:py-4 rounded-2xl text-sm sm:text-base bg-white text-black font-semibold hover:bg-white/90 active:scale-95 transition-transform"
              >
                {" "}
                Contact Sales{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>
    </PublicLayout>
  );
}
