"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import InvoiceForm, { InvoiceData } from "@/components/invoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import GeneratePDF from "@/components/GeneratePDF";
import { Printer, LogOut } from "lucide-react";

export default function InvoiceDashboard() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  // Update invoice data and totals
  const handleUpdate = (
    data: InvoiceData,
    totals: { subtotal: number; total: number }
  ) => {
    setInvoiceData(data);
    setSubtotal(totals.subtotal);
    setTotal(totals.total);
  };

  // Clear invoice
  const handleClear = () => {
    if (confirm("Are you sure you want to clear this invoice?")) {
      setInvoiceData(null);
      setSubtotal(0);
      setTotal(0);
      setPdfPreviewUrl(null);
    }
  };

  // Generate invoice via API (enforces guest/paid logic)
  const handleGenerate = async () => {
    if (!invoiceData) {
      alert("Please fill out the invoice form first.");
      return;
    }

    try {
      const res = await fetch("/api/generateInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      const data = await res.json();

      if (res.status === 403 || res.status === 402) {
        router.push(data.redirect);
        return;
      }

      if (!session) {
        // Guest one-time use tracking
        localStorage.setItem("invoiceUsedOnce", "true");
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md text-center">
        💎 Smart Invoice Builder - Pro Dashboard
      </h1>

      {session && (
        <div className="flex gap-4 mb-6">
          <span className="text-white">Signed in as: {session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-7xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
        {/* Left: Invoice Form */}
        <div className="overflow-y-auto max-h-[85vh] p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-inner">
          <InvoiceForm onUpdate={handleUpdate} />
          <button
            onClick={handleGenerate}
            className="mt-4 w-full bg-blue-600/80 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Generate Invoice
          </button>
        </div>

        {/* Right: Invoice Preview */}
        <div className="flex flex-col p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-inner">
          <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-3">
            <h2 className="text-xl font-semibold text-white">Preview</h2>
            <div className="flex gap-2">
              <GeneratePDF
                targetId="invoice-preview"
                fileName="Invoice.pdf"
                onPreview={(url) => setPdfPreviewUrl(url)}
              />
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div
            id="invoice-preview"
            className="flex-1 overflow-auto bg-white rounded-xl p-4 border border-gray-200 text-black shadow-md"
          >
            {invoiceData ? (
              <InvoicePreview data={invoiceData} subtotal={subtotal} total={total} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                Fill in the form to see your invoice preview
              </div>
            )}
          </div>

          {pdfPreviewUrl && (
            <div className="mt-4 w-full h-[600px] border rounded-lg overflow-hidden relative">
              <iframe src={pdfPreviewUrl} className="w-full h-full" title="Invoice PDF Preview" />
              <button
                onClick={() => setPdfPreviewUrl(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg shadow-md"
              >
                Close Preview
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-gray-400 text-sm mt-8">
        © {new Date().getFullYear()} Smart Invoice Builder · Made with ❤️
      </footer>
    </main>
  );
}
