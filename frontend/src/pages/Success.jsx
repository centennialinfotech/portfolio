import { useNavigate } from "react-router-dom";
export default function Success() {
  const navigate = useNavigate();
  const premiumUser = JSON.parse(localStorage.getItem("premiumUser"));

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white/[0.05] border border-white/10 rounded-[32px] p-10 text-center">
        <h1 className="text-5xl font-black mb-6">Payment Successful 🎉</h1>

        <p className="text-white/60 mb-10">
          Your premium portfolio access is now active.
        </p>

        <div className="bg-black/40 rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-white/50">Plan</span>

            <span>{premiumUser?.plan}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/50">Payment ID</span>

            <span className="truncate ml-5">{premiumUser?.paymentId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/50">Status</span>

            <span className="text-green-400">Active</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/portfolio")}
          className="w-full mt-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-semibold"
        >
          Go To Dashboard
        </button>
      </div>
    </div>
  );
}
