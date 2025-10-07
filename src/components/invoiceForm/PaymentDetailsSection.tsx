"use client";

import React from "react";

interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

interface Props {
  invoiceNumber: string;
  setInvoiceNumber: React.Dispatch<React.SetStateAction<string>>;
  invoiceDate: string;
  setInvoiceDate: React.Dispatch<React.SetStateAction<string>>;
  paymentTerms: string;
  setPaymentTerms: React.Dispatch<React.SetStateAction<string>>;

  mpesaName: string;
  setMpesaName: React.Dispatch<React.SetStateAction<string>>;
  bankName: string;
  setBankName: React.Dispatch<React.SetStateAction<string>>;
  accountName: string;
  setAccountName: React.Dispatch<React.SetStateAction<string>>;
  accountNumber: string;
  setAccountNumber: React.Dispatch<React.SetStateAction<string>>;
  branchCode: string;
  setBranchCode: React.Dispatch<React.SetStateAction<string>>;

  specialNotes: string;
  setSpecialNotes: React.Dispatch<React.SetStateAction<string>>;

  lineItems?: LineItem[];
  taxRate: number;
  discountRate: number;
  currency: "KES" | "USD" | "EUR";
  setCurrency: React.Dispatch<React.SetStateAction<"KES" | "USD" | "EUR">>;
}

export default function PaymentDetailsSection({
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  paymentTerms,
  setPaymentTerms,
  mpesaName,
  setMpesaName,
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  branchCode,
  setBranchCode,
  specialNotes,
  setSpecialNotes,
  currency,
  setCurrency,
}: Props) {
  return (
    <div className="space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h2>

      {/* Invoice Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      {/* Invoice Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
        <select
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100 bg-white"
        >
          <option value="Net 7">Net 7 (due in 7 days)</option>
          <option value="Net 14">Net 14 (due in 14 days)</option>
          <option value="Net 30">Net 30 (due in 30 days)</option>
          <option value="Due on receipt">Due on receipt</option>
        </select>
      </div>

      {/* Mpesa / Bank Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mpesa Name</label>
        <input
          type="text"
          value={mpesaName}
          onChange={(e) => setMpesaName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
        <input
          type="text"
          value={branchCode}
          onChange={(e) => setBranchCode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100"
        />
      </div>

      {/* Currency Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "KES" | "USD" | "EUR")}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100 bg-white"
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Special Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-100 resize-none"
          placeholder="Include payment instructions or other notes..."
        />
      </div>
    </div>
  );
}
