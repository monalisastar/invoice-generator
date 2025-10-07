"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas-oklch"; // ✅ modern OKLCH-safe build
import jsPDF from "jspdf";
import { FileDown, Loader2 } from "lucide-react";

interface Props {
  targetId: string;
  fileName?: string;
  onPreview?: (pdfUrl: string) => void;
}

/** ───────────────────────────────────────────────
 *  Utility: Replace unsupported CSS colors
 *  ─────────────────────────────────────────────── */
function sanitizeColor(color: string, fallback: string) {
  if (!color) return fallback;
  if (color.includes("oklch") || color.includes("lab")) return fallback;
  return color;
}

/** ───────────────────────────────────────────────
 *  Sanitize element tree before PDF rendering
 *  ─────────────────────────────────────────────── */
function sanitizeElementForPDF(el: HTMLElement) {
  const allElements = el.querySelectorAll<HTMLElement>("*");

  allElements.forEach((child) => {
    const style = getComputedStyle(child);

    // Fix unsupported colors
    child.style.color = sanitizeColor(style.color, "#000000");
    child.style.backgroundColor = sanitizeColor(style.backgroundColor, "#ffffff");
    child.style.borderColor = sanitizeColor(style.borderColor, "#000000");
    child.style.fill = sanitizeColor(style.fill, "#000000");
    child.style.stroke = sanitizeColor(style.stroke, "#000000");

    // Preserve safe props
    child.style.opacity = style.opacity;
    if (style.backgroundImage !== "none") child.style.backgroundImage = style.backgroundImage;

    // Disable unsupported visual effects
    child.style.backdropFilter = "none";
    child.style.filter = "none";
    child.style.mixBlendMode = "normal";

    // ── PDF-specific fix: add extra bottom padding for table cells
    if (child.tagName === "TD" || child.tagName === "TH") {
      const currentPaddingBottom = parseFloat(style.paddingBottom) || 0;
      child.style.paddingBottom = `${currentPaddingBottom + 4}px`; // add 4px extra
    }
  });

  const rootStyle = getComputedStyle(el);
  el.style.background = sanitizeColor(rootStyle.backgroundColor, "#ffffff");
}

/** ───────────────────────────────────────────────
 *  Component: GeneratePDF
 *  ─────────────────────────────────────────────── */
export default function GeneratePDF({
  targetId,
  fileName = "invoice.pdf",
  onPreview,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.error("❌ Invoice preview not found:", targetId);
      return;
    }

    try {
      setLoading(true);
      window.scrollTo(0, 0);

      // Clone to avoid layout shifts
      const cloned = element.cloneNode(true) as HTMLElement;
      cloned.style.position = "absolute";
      cloned.style.left = "-9999px";
      cloned.style.top = "0";
      cloned.style.width = element.scrollWidth + "px";
      cloned.style.overflow = "visible";
      document.body.appendChild(cloned);

      sanitizeElementForPDF(cloned);

      // Ensure images fully load
      const imgs = cloned.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((res) => {
                  img.onload = img.onerror = () => res();
                })
        )
      );

      // Setup PDF
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const canvas = await html2canvas(cloned, {
        scale: 2, // Higher = sharper output
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Handle multi-page if too tall
      let y = 0;
      while (y < imgHeight) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
        y += pageHeight;
      }

      // Clean up cloned node
      document.body.removeChild(cloned);

      // Preview or download
      if (onPreview) {
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        onPreview(url);
      } else {
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("⚠️ Failed to generate PDF:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-md backdrop-blur-lg transition-all
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
        }`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileDown size={18} />
          Download PDF
        </>
      )}
    </button>
  );
}
