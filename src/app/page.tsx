"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InvoiceForm, { InvoiceData } from "@/components/invoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import GeneratePDF from "@/components/GeneratePDF";
import { Printer } from "lucide-react";

export default function LandingPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [usedOnce, setUsedOnce] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("invoiceData");
    const savedTotals = localStorage.getItem("invoiceTotals");
    const guestUsedOnce = localStorage.getItem("invoiceUsedOnce");

    if (guestUsedOnce) setUsedOnce(true);

    if (saved && savedTotals) {
      try {
        setInvoiceData(JSON.parse(saved));
        const { subtotal, total } = JSON.parse(savedTotals);
        setSubtotal(subtotal);
        setTotal(total);
      } catch (err) {
        console.error("⚠️ Failed to parse saved invoice:", err);
      }
    }
  }, []);

  const handleUpdate = (
    data: InvoiceData,
    totals: { subtotal: number; total: number }
  ) => {
    setInvoiceData(data);
    setSubtotal(totals.subtotal);
    setTotal(totals.total);

    localStorage.setItem("invoiceData", JSON.stringify(data));
    localStorage.setItem("invoiceTotals", JSON.stringify(totals));
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear this invoice?")) {
      localStorage.removeItem("invoiceData");
      localStorage.removeItem("invoiceTotals");
      setInvoiceData(null);
      setSubtotal(0);
      setTotal(0);
      setPdfPreviewUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!invoiceData) {
      alert("Please fill out the invoice form first.");
      return;
    }

    if (!session && usedOnce) {
      router.push("/subscribe");
      return;
    }

    try {
      const res = await fetch("/api/generateInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      const data = await res.json();

      if (!session) {
        localStorage.setItem("invoiceUsedOnce", "true");
        setUsedOnce(true);
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start p-4 md:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white drop-shadow-md text-center">
        💎 Smart Invoice Builder
      </h1>

      {!session && usedOnce && (
        <div className="mb-4 w-full flex justify-center">
          <button
            onClick={() => router.push("/subscribe")}
            className="bg-yellow-500/80 hover:bg-yellow-600 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition shadow-md text-sm sm:text-base"
          >
            Subscribe for Unlimited Access
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-7xl">
        {/* Left: Invoice Form */}
        <div className="overflow-y-auto max-h-[70vh] sm:max-h-[75vh] md:max-h-[85vh] p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-inner">
          <InvoiceForm onUpdate={handleUpdate} />
          <button
            onClick={handleGenerate}
            className="mt-4 w-full bg-blue-600/80 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base"
          >
            Generate Invoice
          </button>
        </div>

        {/* Right: Invoice Preview */}
        <div className="flex flex-col p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 border-b border-white/20 pb-2 sm:pb-3 gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Preview</h2>
            <div className="flex flex-wrap gap-2">
              <GeneratePDF
                targetId="invoice-preview"
                fileName="Invoice.pdf"
                onPreview={(url) => setPdfPreviewUrl(url)}
              />
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Swipeable invoice preview container with momentum */}
          <div
            className="flex-1 overflow-x-auto overflow-y-hidden bg-white rounded-xl p-3 sm:p-4 border border-gray-200 text-black shadow-md scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="min-w-[320px] sm:min-w-full">
              {invoiceData ? (
                <InvoicePreview data={invoiceData} subtotal={subtotal} total={total} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 italic text-sm sm:text-base">
                  Fill in the form to see your invoice preview
                </div>
              )}
            </div>
          </div>

          {/* Swipeable PDF iframe container with momentum */}
          {pdfPreviewUrl && (
            <div
              className="mt-4 overflow-x-auto w-full border rounded-lg relative scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="min-w-[600px] sm:min-w-full h-[400px] sm:h-[500px] md:h-[600px]">
                <iframe
                  src={pdfPreviewUrl}
                  className="w-full h-full"
                  title="Invoice PDF Preview"
                />
              </div>
              <button
                onClick={() => setPdfPreviewUrl(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md text-xs sm:text-sm"
              >
                Close Preview
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8 text-center">
        © {new Date().getFullYear()} Smart Invoice Builder · Made with ❤️
      </footer>
    </main>
  );
}
