import PublicLayout from "../layouts/PublicLayout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePageCSS from "../hooks/usePageCSS";
export default function Support() {
  usePageCSS("/css/support.css");
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Tawk.to to load
    const checkTawk = setInterval(() => {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === "function") {
        window.Tawk_API.hideWidget();
        clearInterval(checkTawk);
      }
    }, 500);

    return () => clearInterval(checkTawk);
  }, []);

  const openChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-16 lg:px-28 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight px-2">
              Support Center
            </h1>

            <p className="text-white/60 mt-5 text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-light leading-7 px-2">
              Need assistance? Our support team is here to help. Choose the
              support option that works best for you.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 gap-5">
            {/* Email */}
            <div className="
            group
            bg-white/[0.03]
            border
            border-white/5
            rounded-[24px]
            p-6
            sm:p-8
            backdrop-blur-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/5
            hover:border-white/15
            text-center
            ">
              <div
                className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  text-2xl
                  sm:text-3xl
                  mb-6
                  sm:mb-8
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mx-auto
                  mb-8
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >📧</div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 mb-3">Email Support</h2>

              <p className="text-white/50 leading-relaxed mb-6">
                Contact our support team directly via email.
              </p>

              <a
                href="mailto:support@centennialinfotech.com"
                className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                px-4
                py-3
                text-xs
                sm:text-sm
                font-semibold
                text-white
                text-center
                break-all
                transition-all
                duration-300
                hover:shadow-xl
                hover:shadow-purple-500/20
                "
              >
                support@centennialinfotech.com
              </a>
            </div>

            {/* Live Chat */}
              <div className="
              group
              bg-white/[0.03]
              border
              border-white/5
              rounded-[24px]
              p-6
              sm:p-8
              backdrop-blur-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/5
              hover:border-white/15
              text-center
              ">
              <div
                className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  text-2xl
                  sm:text-3xl
                  mb-6
                  sm:mb-8
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mx-auto
                  mb-8
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >💬</div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 mb-3">Live Chat</h2>

              <p className="text-white/50 leading-relaxed mb-6">
                Chat with our team in real time for quick assistance.
              </p>

              <button
                onClick={openChat}
                className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-green-500
                to-emerald-600
                px-6
                py-3
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-xl
                hover:shadow-green-500/20
                "
              >
                Start Live Chat
              </button>
            </div>

            {/* Ticket */}
            <div className="
            group
            bg-white/[0.03]
            border
            border-white/5
            rounded-[24px]
            p-6
            sm:p-8
            backdrop-blur-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/5
            hover:border-white/15
            text-center
            ">
              <div
                className="
                  w-14
                  h-14
                  sm:w-16
                  sm:h-16
                  text-2xl
                  sm:text-3xl
                  mb-6
                  sm:mb-8
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-purple-600
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mx-auto
                  mb-8
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >🎫</div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90 mb-3">Create a Ticket</h2>

              <p className="text-white/50 leading-relaxed mb-6">
                Submit a support request and we'll get back to you.
              </p>

              <button
                onClick={() => navigate("/ticket")}
                className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-pink-600
                px-6
                py-3
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-xl
                hover:shadow-pink-500/20
                "
              >
                Create Ticket
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="
          mt-16
          bg-white/[0.03]
          border
          border-white/5
          rounded-3xl
          p-8
          backdrop-blur-lg
          ">
            <h3 className="text-2xl font-bold tracking-tight text-white/90 mb-3">Response Times</h3>

            <div className="space-y-3
            text-white/60
            leading-relaxed">
              <p>📧 Email Support: Within 24 hours</p>

              <p>💬 Live Chat: Usually within a few minutes</p>

              <p>🎫 Support Tickets: Within 1 business day</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
