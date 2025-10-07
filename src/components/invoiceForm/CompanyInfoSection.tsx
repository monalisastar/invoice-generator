"use client";

import React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { InvoiceData } from "./index"; // import type from InvoiceForm

interface Props {
  companyName: string;
  setCompanyName: (val: string) => void;
  companyEmail: string;
  setCompanyEmail: (val: string) => void;
  companyPhone: string;
  setCompanyPhone: (val: string) => void;
  companyLocation: string;
  setCompanyLocation: (val: string) => void;
  logoPreview?: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

export default function CompanyInfoSection({
  companyName,
  setCompanyName,
  companyEmail,
  setCompanyEmail,
  companyPhone,
  setCompanyPhone,
  companyLocation,
  setCompanyLocation,
  logoPreview,
  onLogoUpload,
  onRemoveLogo,
}: Props) {
  return (
    <section className="border border-gray-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">🏢 Company Information</h2>

      {/* Company Name */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., Acme Corporation"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Company Email */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Company Email</label>
        <input
          type="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="e.g., hello@acme.com"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Company Phone */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Company Phone</label>
        <input
          type="tel"
          value={companyPhone}
          onChange={(e) => setCompanyPhone(e.target.value)}
          placeholder="e.g., +1 234 567 890"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Company Location */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Company Location</label>
        <input
          type="text"
          value={companyLocation}
          onChange={(e) => setCompanyLocation(e.target.value)}
          placeholder="e.g., 123 Main Street, Nairobi"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Company Logo</label>
        {logoPreview ? (
          <div className="relative inline-block">
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="w-24 h-24 object-contain border rounded-lg"
            />
            <button
              type="button"
              onClick={onRemoveLogo}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center text-gray-600">
              <ImageIcon size={24} className="mb-1" />
              <span className="text-sm">Upload Company Logo</span>
            </div>
          </label>
        )}
      </div>
    </section>
  );
}
