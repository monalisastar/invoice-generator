"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

// ─── Sections ─────────────────────────────
import CompanyInfoSection from "./CompanyInfoSection";
import ClientInfoSection from "./ClientInfoSection";
import ItemsSection from "./ItemsSection";
import TotalsSection from "./TotalsSection";
import PaymentDetailsSection from "./PaymentDetailsSection";
import SignatureSection from "./SignatureSection";

// ─── Types ─────────────────────────────
export type LineItem = {
  description: string;
  quantity: number;
  price: number;
};

export type InvoiceData = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLocation: string;
  logoPreview?: string | null;

  clientName: string;
  clientCompany: string;
  clientAddress: string;
  clientPin: string;
  clientEmail: string;

  invoiceNumber: string;
  invoiceDate: string;
  paymentTerms: string;

  items: LineItem[];
  tax: number;
  taxType: "flat" | "percent";
  discount: number;
  discountType: "flat" | "percent";

  mpesaName: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;

  notes?: string;
  specialNotes?: string;
  signatureData?: string | null;
  signatureName?: string;
  signatureRole?: string;

  currency: "KES" | "USD" | "EUR";

  totals?: {
    subtotal: number;
    total: number;
  };
};

// ─── Props ─────────────────────────────
interface InvoiceFormProps {
  onUpdate?: (data: InvoiceData, totals: { subtotal: number; total: number }) => void;
}

// ─── Main Component ─────────────────────────
export default function InvoiceForm({ onUpdate }: InvoiceFormProps) {
  // ─── Company Info ─────────────────────────
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ─── Client Info ─────────────────────────
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPin, setClientPin] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // ─── Invoice Info ────────────────────────
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentTerms, setPaymentTerms] = useState("Net 14");

  // ─── Payment Details ─────────────────────
  const [mpesaName, setMpesaName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");

  // ─── Notes & Financials ─────────────────
  const [specialNotes, setSpecialNotes] = useState("");

  const [tax, setTax] = useState(0);
  const [taxType, setTaxType] = useState<"flat" | "percent">("percent");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [currency, setCurrency] = useState<"KES" | "USD" | "EUR">("KES");

  // ─── Items / Signature ───────────────────
  const [items, setItems] = useState<LineItem[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureName, setSignatureName] = useState("");
  const [signatureRole, setSignatureRole] = useState("");

  const sigCanvas = useRef<SignatureCanvas>(null);

  // ─── Handlers ────────────────────────────
  const addItem = () => setItems([...items, { description: "", quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, updated: Partial<LineItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updated };
    setItems(newItems);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const taxAmount = taxType === "percent" ? (subtotal * tax) / 100 : tax;
  const discountAmount = discountType === "percent" ? (subtotal * discount) / 100 : discount;
  const total = subtotal + taxAmount - discountAmount;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => setLogoPreview(null);

  // ─── Aggregate Invoice Data ─────────────
  const invoiceData: InvoiceData = {
    companyName,
    companyEmail,
    companyPhone,
    companyLocation,
    logoPreview: logoPreview || undefined,

    clientName,
    clientCompany,
    clientAddress,
    clientPin,
    clientEmail,

    invoiceNumber,
    invoiceDate,
    paymentTerms,

    items,
    tax,
    taxType,
    discount,
    discountType,

    mpesaName,
    bankName,
    accountName,
    accountNumber,
    branchCode,

    notes: specialNotes,
    specialNotes,
    signatureData: signature || undefined,
    signatureName,
    signatureRole,

    currency,

    totals: {
      subtotal,
      total,
    },
  };

  // ─── Effect to notify parent ─────────────
  useEffect(() => {
    if (onUpdate) {
      onUpdate(invoiceData, { subtotal, total });
    }
  }, [invoiceData, subtotal, total, onUpdate]);

  // ─── Render ──────────────────────────────
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto space-y-6">
      {/* Company Info */}
      <CompanyInfoSection
        companyName={companyName}
        setCompanyName={setCompanyName}
        companyEmail={companyEmail}
        setCompanyEmail={setCompanyEmail}
        companyPhone={companyPhone}
        setCompanyPhone={setCompanyPhone}
        companyLocation={companyLocation}
        setCompanyLocation={setCompanyLocation}
        logoPreview={logoPreview || undefined}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={handleRemoveLogo}
      />

      {/* Client Info */}
      <ClientInfoSection
        clientName={clientName}
        setClientName={setClientName}
        clientCompany={clientCompany}
        setClientCompany={setClientCompany}
        clientAddress={clientAddress}
        setClientAddress={setClientAddress}
        clientPin={clientPin}
        setClientPin={setClientPin}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
      />

      {/* Line Items */}
      <ItemsSection
        items={items}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
      />

      {/* Totals Section */}
      <TotalsSection
        subtotal={subtotal}
        tax={tax}
        setTax={setTax}
        taxType={taxType}
        setTaxType={setTaxType}
        discount={discount}
        setDiscount={setDiscount}
        discountType={discountType}
        setDiscountType={setDiscountType}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Payment Details */}
      <PaymentDetailsSection
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        paymentTerms={paymentTerms}
        setPaymentTerms={setPaymentTerms}
        mpesaName={mpesaName}
        setMpesaName={setMpesaName}
        bankName={bankName}
        setBankName={setBankName}
        accountName={accountName}
        setAccountName={setAccountName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        branchCode={branchCode}
        setBranchCode={setBranchCode}
        specialNotes={specialNotes}
        setSpecialNotes={setSpecialNotes}

        taxRate={tax}
        discountRate={discount}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Signature */}
      <SignatureSection
        sigCanvas={sigCanvas}
        signatureData={signature || undefined}
        signatureName={signatureName}
        signatureRole={signatureRole}
        onChange={(payload: { data?: string | null; name?: string; role?: string }) => {
          setSignature(payload.data || null);
          setSignatureName(payload.name || "");
          setSignatureRole(payload.role || "");
        }}
      />
    </div>
  );
}
