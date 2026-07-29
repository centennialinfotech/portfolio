import PublicLayout from "../layouts/PublicLayout";
import usePageCSS from "../hooks/usePageCSS";
export default function FAQ() {
  usePageCSS("/css/faq.css");

  const faqs = [
    {
      q: "How long does it take to build my portfolio?",
      a: "Your portfolio is available immediately after setup.",
    },
    {
      q: "Can I use my own domain?",
      a: "Yes, you can connect your own custom domain.",
    },
    {
      q: "Is hosting included?",
      a: "Yes, hosting is included in all plans.",
    },
    {
      q: "Will it work on mobile devices?",
      a: "Yes, every portfolio is fully responsive.",
    },
    {
      q: "Can I update my content later?",
      a: "Yes, you can update projects, skills and resume anytime.",
    },
    {
      q: "Do you provide support?",
      a: "Yes, email support and live chat are available.",
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-black text-white px-6 md:px-16 lg:px-28 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-center">
            Frequently Asked Questions
          </h1>

          <p className="text-white/60 text-base sm:text-xl mt-6 font-light text-center mb-16">
            Find answers to common questions.
          </p>

          <div className="space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="
                bg-white/[0.02]
                border
                border-white/5
                rounded-[24px]
                p-6
                sm:p-8
                backdrop-blur-xl
                hover:border-white/20
                hover:bg-white/[0.05]
                transition-all
                duration-300
                "
              >
                <h3 className="text-base sm:text-lg font-semibold text-white/90 mb-4">{faq.q}</h3>

                <p className="text-white/50 text-sm sm:text-base leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
