"use client";

import React, { RefObject, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X, PenLine, Image as ImageIcon } from "lucide-react";

interface Props {
  sigCanvas: RefObject<SignatureCanvas | null>;
  signatureData?: string;
  signatureName?: string;
  signatureRole?: string;
  onChange: (data: { data: string; name: string; role: string }) => void;
}

export default function SignatureSection({
  sigCanvas,
  signatureData = "",
  signatureName = "",
  signatureRole = "Finance Manager",
  onChange,
}: Props) {
  const [signature, setSignature] = useState({
    data: signatureData,
    name: signatureName,
    role: signatureRole,
    mode: signatureData ? ("upload" as "upload" | "draw") : ("draw" as "upload" | "draw"),
  });

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignature((prev) => ({ ...prev, data: "" }));
    onChange({ data: "", name: signature.name, role: signature.role });
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md mx-auto space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <PenLine size={18} /> Signature
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        {["upload", "draw"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() =>
              setSignature((prev) => ({ ...prev, mode: m as "upload" | "draw", data: "" }))
            }
            className={`flex-1 px-2 py-1 rounded text-sm font-medium border ${
              signature.mode === m
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {m === "upload" ? "Upload" : "Draw"}
          </button>
        ))}
      </div>

      {/* Upload Mode */}
      {signature.mode === "upload" && (
        <div className="flex flex-col items-center gap-2">
          {!signature.data ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition bg-gray-50">
              <ImageIcon className="text-gray-400" size={28} />
              <span className="text-sm text-gray-600 mt-1">Upload your signature</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const maxWidth = 200;
                      const maxHeight = 100;
                      let { width, height } = img;
                      if (width > height && width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                      } else if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                      }
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext("2d");
                      ctx?.drawImage(img, 0, 0, width, height);
                      const resizedData = canvas.toDataURL("image/png", 0.8);
                      setSignature((prev) => ({ ...prev, data: resizedData }));
                      onChange({ data: resizedData, name: signature.name, role: signature.role });
                    };
                    img.src = ev.target?.result as string;
                  };
                  reader.readAsDataURL(file);
                }}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative w-full flex justify-center">
              <img
                src={signature.data}
                alt="Signature"
                className="max-w-full max-h-24 border rounded-md object-contain"
              />
              <button
                type="button"
                onClick={clearSignature}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Draw Mode */}
      {signature.mode === "draw" && (
        <div className="flex flex-col gap-2">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 250, height: 100, className: "border rounded-md w-full" }}
            onEnd={() => {
              if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
                const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
                setSignature((prev) => ({ ...prev, data: dataUrl }));
                onChange({ data: dataUrl, name: signature.name, role: signature.role });
              }
            }}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={clearSignature}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Name & Role */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={signature.name}
          onChange={(e) => {
            setSignature((prev) => ({ ...prev, name: e.target.value }));
            onChange({ data: signature.data, name: e.target.value, role: signature.role });
          }}
          className="border p-2 rounded w-full text-sm"
        />
        <input
          type="text"
          placeholder="Role / Designation"
          value={signature.role}
          onChange={(e) => {
            setSignature((prev) => ({ ...prev, role: e.target.value }));
            onChange({ data: signature.data, name: signature.name, role: e.target.value });
          }}
          className="border p-2 rounded w-full text-sm"
        />
      </div>
    </div>
  );
}
