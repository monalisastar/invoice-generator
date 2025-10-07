"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl max-w-lg">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-2xl text-white mb-6">Oops! Page not found.</h2>
        <p className="text-gray-300 mb-6">
          The page you’re looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-blue-600/80 hover:bg-blue-700 text-white rounded-xl font-medium transition"
        >
          <ArrowLeft size={18} /> Go Back Home
        </button>
      </div>

      <footer className="text-gray-400 text-sm mt-8">
        © {new Date().getFullYear()} Smart Invoice Builder · Made with ❤️
      </footer>
    </main>
  );
}
