"use client";

import React from "react";
import { InvoiceData } from "./index"; // import type from InvoiceForm

interface Props {
  clientName: string;
  setClientName: (val: string) => void;
  clientCompany: string;
  setClientCompany: (val: string) => void;
  clientAddress: string; // ← renamed
  setClientAddress: (val: string) => void; // ← renamed
  clientPin: string;
  setClientPin: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
}

export default function ClientInfoSection({
  clientName,
  setClientName,
  clientCompany,
  setClientCompany,
  clientAddress, // ← updated
  setClientAddress, // ← updated
  clientPin,
  setClientPin,
  clientEmail,
  setClientEmail,
}: Props) {
  return (
    <section className="border border-gray-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">👤 Client Information</h2>

      {/* Client Name */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g., John Doe"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Client Company */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Client Company</label>
        <input
          type="text"
          value={clientCompany}
          onChange={(e) => setClientCompany(e.target.value)}
          placeholder="e.g., Acme Corp."
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Client Address */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Client Address</label>
        <textarea
          value={clientAddress} // ← updated
          onChange={(e) => setClientAddress(e.target.value)} // ← updated
          placeholder="e.g., 456 Elm Street, New York"
          rows={2}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Client PIN */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Client PIN</label>
        <input
          type="text"
          value={clientPin}
          onChange={(e) => setClientPin(e.target.value)}
          placeholder="e.g., A12345B"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Client Email */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Client Email</label>
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="e.g., client@email.com"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
