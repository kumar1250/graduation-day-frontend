import { useRef, useState, useLayoutEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Acknowledgement from "./Acknowledgement";

const DESIGN_WIDTH = 800; // matches the fixed width inside Acknowledgement.jsx

export default function AcknowledgementSection({ student, onRegisterAnother }) {
  // Two separate instances, on purpose:
  // - captureRef: hidden, full-size, NEVER transformed — this is what html2canvas reads
  // - previewRef: the visible one, shown scaled to fit the screen
  const captureRef = useRef(null);
  const previewRef = useRef(null);
  const wrapperRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // Recompute the visual scale whenever the wrapper's width changes (resize, orientation, etc.)
  useLayoutEffect(() => {
    const recalc = () => {
      if (!wrapperRef.current || !previewRef.current) return;
      const containerWidth = wrapperRef.current.offsetWidth;
      const nextScale = Math.min(1, containerWidth / DESIGN_WIDTH);
      setScale(nextScale);
      setScaledHeight(previewRef.current.offsetHeight * nextScale);
    };

    recalc();

    const resizeObserver = new ResizeObserver(recalc);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    if (previewRef.current) resizeObserver.observe(previewRef.current);
    window.addEventListener("resize", recalc);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [student]);

  // Reliable cross-browser download: works on desktop and on mobile
  // browsers (including in-app browsers) where jsPDF's own .save() can
  // silently fail or just open a blank tab instead of downloading.
  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      // Custom fonts loading late is a common cause of misaligned/ghosted
      // text in html2canvas snapshots — wait for them first.
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const node = captureRef.current;
      const canvas = await html2canvas(node, {
        scale: 2, // sharp output for print
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      // Fit the image inside the page (contain + center) so it can never
      // get cut off, regardless of the certificate's exact height.
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = margin;

      pdf.setProperties({
        title: `Graduation Acknowledgement - ${student.roll_no}`,
      });
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

      const filename = `Graduation_Acknowledgement_${student.roll_no}.pdf`;
      triggerDownload(pdf.output("blob"), filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-semibold uppercase tracking-wide px-3 sm:px-4 py-1.5 rounded-full">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m20 6-11 11-5-5" />
          </svg>
          Registration Confirmed
        </div>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink-950 mt-3">
          You're all set for Graduation Day
        </h2>
        <p className="text-ink-900/60 text-sm mt-2">
          Save or print the acknowledgement below — you'll need it at check-in.
        </p>
      </div>

      {/* Responsive viewer: scales the fixed-size certificate to fit any screen.
          This copy is for DISPLAY ONLY — it is never captured for the PDF. */}
      <div
        ref={wrapperRef}
        className="mx-auto rounded-xl shadow-[0_24px_60px_-24px_rgba(14,33,68,0.4)] overflow-hidden"
        style={{ height: scaledHeight ? `${scaledHeight}px` : "auto" }}
      >
        <div
          style={{
            width: `${DESIGN_WIDTH}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <Acknowledgement ref={previewRef} student={student} />
        </div>
      </div>

      {/* Hidden, untransformed, always full-size copy — the ONLY thing
          html2canvas ever reads, so the PDF is byte-for-byte identical
          whether it's generated from a phone or a desktop. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-10000px",
          width: `${DESIGN_WIDTH}px`,
          pointerEvents: "none",
        }}
      >
        <Acknowledgement ref={captureRef} student={student} />
      </div>

      {error && (
        <div className="mt-4 max-w-lg mx-auto bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 bg-brass-500 hover:bg-brass-400 text-ink-950 font-semibold px-5 sm:px-7 py-3 rounded-xl shadow-[0_10px_30px_-8px_rgba(201,162,39,0.5)] disabled:opacity-50 transition text-sm sm:text-base"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {downloading ? "Preparing PDF…" : "Download Acknowledgement (PDF)"}
        </button>
        <button
          onClick={onRegisterAnother}
          className="text-ink-900/60 hover:text-ink-950 text-sm font-medium px-4 py-3 transition"
        >
          Register another student
        </button>
      </div>
    </div>
  );
}