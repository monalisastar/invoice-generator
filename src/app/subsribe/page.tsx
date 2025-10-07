"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if the user already paid from localStorage
  useEffect(() => {
    const hasPaid = localStorage.getItem("invoicePaid") === "true";
    setPaid(hasPaid);
  }, []);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Simulate payment API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPaid(true);
      localStorage.setItem("invoicePaid", "true");
      alert("✅ Payment successful! You can now login and access unlimited invoices.");
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Redirect to invoice page after login
    signIn("google", { callbackUrl: "/invoice" });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-white drop-shadow-md text-center">
          💰 Subscribe for Unlimited Invoices
        </h1>
        <p className="text-gray-200 text-center">
          Complete your payment to unlock unlimited invoice generation and advanced features.
        </p>

        <div className="w-full flex flex-col gap-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-gray-300 font-semibold">Plan:</span>
            <span className="text-white text-lg font-bold">Pro Unlimited</span>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-gray-300 font-semibold">Price:</span>
            <span className="text-white text-lg font-bold">$2 / month</span>
          </div>

          {!paid && (
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all"
            >
              {loading ? "Processing..." : "Pay $2 / month"}
            </button>
          )}

          {paid && !session && (
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Login with Google to Access Dashboard
            </button>
          )}

          {paid && session && (
            <button
              onClick={() => router.push("/invoice")}
              className="w-full py-3 rounded-2xl font-semibold text-white bg-green-500 hover:bg-green-600 active:scale-95 transition-all"
            >
              Go to Invoice Dashboard
            </button>
          )}

          {paid && (
            <p className="text-green-400 text-center">
              Payment successful! {session ? "You can now access unlimited invoices." : "Login to continue."}
            </p>
          )}
        </div>

        <footer className="text-gray-400 text-sm mt-4 text-center">
          © {new Date().getFullYear()} Smart Invoice Builder · Made with ❤️
        </footer>
      </div>
    </main>
  );
}
