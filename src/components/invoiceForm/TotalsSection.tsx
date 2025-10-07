"use client";

import React from "react";

interface Props {
  subtotal: number;
  tax: number;
  setTax: (value: number) => void;
  taxType: "flat" | "percent";
  setTaxType: (value: "flat" | "percent") => void;
  discount: number;
  setDiscount: (value: number) => void;
  discountType: "flat" | "percent";
  setDiscountType: (value: "flat" | "percent") => void;
  currency: "KES" | "USD" | "EUR";
  setCurrency: (value: "KES" | "USD" | "EUR") => void;
}

export default function TotalsSection({
  subtotal,
  tax,
  setTax,
  taxType,
  setTaxType,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  currency,
  setCurrency,
}: Props) {
  // Calculate tax amount
  const taxAmount = taxType === "percent" ? (subtotal * tax) / 100 : tax;

  // Calculate discount amount
  const discountAmount =
    discountType === "percent" ? (subtotal * discount) / 100 : discount;

  // Calculate total
  const total = subtotal + taxAmount - discountAmount;

  // Helper to format numbers with commas and two decimals
  const formatCurrency = (amount: number) =>
    amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Totals</h2>

      {/* Currency Selection */}
      <div className="flex justify-between items-center text-sm text-gray-700">
        <span>Currency:</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "KES" | "USD" | "EUR")}
          className="border rounded px-2 py-1"
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between text-sm text-gray-700">
        <span>Subtotal:</span>
        <span>{currency} {formatCurrency(subtotal)}</span>
      </div>

      {/* Tax Input */}
      <div className="flex justify-between text-sm text-gray-700 items-center space-x-2">
        <span>Tax:</span>
        <input
          type="number"
          className="border rounded px-2 py-1 w-24 text-right"
          value={tax}
          onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
        />
        <select
          value={taxType}
          onChange={(e) =>
            setTaxType(e.target.value === "percent" ? "percent" : "flat")
          }
          className="border rounded px-2 py-1"
        >
          <option value="percent">%</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      {/* Discount Input */}
      <div className="flex justify-between text-sm text-gray-700 items-center space-x-2">
        <span>Discount:</span>
        <input
          type="number"
          className="border rounded px-2 py-1 w-24 text-right"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
        />
        <select
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value === "percent" ? "percent" : "flat")
          }
          className="border rounded px-2 py-1"
        >
          <option value="flat">Flat</option>
          <option value="percent">%</option>
        </select>
      </div>

      <hr className="my-2" />

      {/* Total */}
      <div className="flex justify-between text-base font-semibold text-gray-900">
        <span>Total:</span>
        <span>{currency} {formatCurrency(total)}</span>
      </div>
    </div>
  );
}
