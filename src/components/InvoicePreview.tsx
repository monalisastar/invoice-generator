"use client";

import React from "react";
import InvoiceForm, { InvoiceData } from "@/components/invoiceForm";
import GeneratePDF from "./GeneratePDF"; // make sure path matches your project

interface Props {
  data: InvoiceData;
  subtotal: number;
  total: number;
  currency?: "USD" | "KES";
}

export default function InvoicePreview({
  data,
  subtotal,
  total,
  currency = "KES",
}: Props) {
  const {
    companyName,
    companyEmail,
    companyPhone,
    companyLocation,
    logoPreview,
    clientName,
    clientCompany,
    clientEmail,
    clientAddress,
    clientPin,
    invoiceNumber,
    invoiceDate,
    paymentTerms,
    items,
    tax,
    discount,
    notes,
    mpesaName,
    bankName,
    accountName,
    accountNumber,
    branchCode,
    specialNotes,
    signatureData,
    signatureName,
    signatureRole,
  } = data;

  // Currency formatter
  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "—";
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } else {
      return `KSh ${amount.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Invoice Preview Container */}
      <div
        id="invoice-preview"
        className="rounded-xl border border-gray-300 shadow-lg text-gray-900 overflow-auto"
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          width: "800px",
          margin: "auto",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* ─── Header ─────────────────────────────── */}
        <header className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
          <div>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo"
                className="h-20 w-auto mb-2 object-contain"
              />
            ) : (
              <div className="h-20 w-20 mb-2 bg-gray-100 border border-dashed flex items-center justify-center text-gray-400 text-sm">
                No Logo
              </div>
            )}

            <h1 className="text-2xl font-bold">{companyName || "Company Name"}</h1>
            {companyLocation && (
              <p className="text-sm text-gray-700">{companyLocation}</p>
            )}
            <p className="text-sm text-gray-700">
              {companyEmail && <span>{companyEmail}</span>}
              {companyPhone && <span> • {companyPhone}</span>}
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
              INVOICE
            </h2>
            <p className="text-gray-700 font-medium">
              Invoice #: {invoiceNumber || "0001"}
            </p>
            <p className="text-gray-600">
              {invoiceDate || new Date().toLocaleDateString()}
            </p>
          </div>
        </header>

        {/* ─── Bill To Section ─────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Bill To:</h3>
            <p className="text-gray-700 font-medium">{clientName || "Client Name"}</p>
            {clientCompany && <p className="text-gray-700 text-sm">{clientCompany}</p>}
            {clientEmail && <p className="text-gray-700">{clientEmail}</p>}
            {clientAddress && <p className="text-gray-700">{clientAddress}</p>}
            {clientPin && <p className="text-gray-700"> PIN: {clientPin}</p>}
          </div>

          <div className="text-right">
            <h3 className="font-semibold text-gray-800 mb-1">Payment Terms:</h3>
            <p className="text-gray-700">{paymentTerms || "Due on receipt"}</p>
          </div>
        </section>

        {/* ─── Items Table ─────────────────────────────── */}
        <section className="mb-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  Description
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                  Qty
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                  Price ({currency === "USD" ? "$" : "KSh"})
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 text-gray-800">
                      {item.description || "-"}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-right text-gray-800">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-right text-gray-800">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-900">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="border px-3 py-4 text-center text-gray-400 italic"
                  >
                    No items added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ─── Totals Section ─────────────────────────────── */}
        <section className="flex justify-end mb-6">
          <table className="text-sm">
            <tbody>
              <tr>
                <td className="pr-4 text-gray-600">Subtotal:</td>
                <td className="text-right font-medium">{formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td className="pr-4 text-gray-600">Tax ({tax || 0}%):</td>
                <td className="text-right font-medium">
                  {formatCurrency((subtotal * (tax || 0)) / 100)}
                </td>
              </tr>
              <tr>
                <td className="pr-4 text-gray-600">Discount ({discount || 0}%):</td>
                <td className="text-right font-medium">
                  -{formatCurrency((subtotal * (discount || 0)) / 100)}
                </td>
              </tr>
              <tr className="border-t border-gray-400 font-semibold text-lg">
                <td className="pr-4 pt-2 text-gray-900">Total:</td>
                <td className="pt-2 text-right font-bold">{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ─── Payment Details ─────────────────────────────── */}
        {(mpesaName ||
          bankName ||
          accountName ||
          accountNumber ||
          branchCode ||
          specialNotes) && (
          <section className="border-t border-gray-300 pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {mpesaName && <p>M-Pesa Name: {mpesaName}</p>}
              {bankName && <p>Bank: {bankName}</p>}
              {accountName && <p>Account Name: {accountName}</p>}
              {accountNumber && <p>Account Number: {accountNumber}</p>}
              {branchCode && <p>Branch / Swift Code: {branchCode}</p>}
              {specialNotes && (
                <p className="italic text-gray-600 pt-2">{specialNotes}</p>
              )}
            </div>
          </section>
        )}

        {/* ─── Signature Section ─────────────────────────────── */}
        <section className="border-t border-gray-300 pt-4 mt-6">
          <h3 className="text-lg font-semibold mb-2">Authorized Signature</h3>
          <div className="flex flex-col items-start">
            {signatureData && signatureData.length > 100 ? (
              <div className="relative w-36 sm:w-32 md:w-36 lg:w-40 xl:w-44 max-w-[160px]">
                <img
                  src={signatureData}
                  alt="Signature"
                  className="w-full h-auto object-contain border rounded-md bg-white shadow-sm mb-2"
                  style={{ maxHeight: "80px", objectFit: "contain" }}
                />
              </div>
            ) : (
              <p className="text-gray-500 italic mb-2">No signature provided</p>
            )}
            <p className="font-medium">{signatureName || "—"}</p>
            {signatureRole && <p className="text-gray-600 text-sm">{signatureRole}</p>}
          </div>
        </section>

        {/* ─── Notes Section ─────────────────────────────── */}
        {notes && (
          <footer className="border-t border-gray-300 pt-4 mt-6 text-sm italic text-gray-700">
            {notes}
          </footer>
        )}
      </div>

      {/* PDF Download Button */}
      <div className="flex justify-end w-[800px]">
        <GeneratePDF targetId="invoice-preview" fileName="invoice.pdf" />
      </div>
    </div>
  );
}
