import { useRef, useState, useLayoutEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import Acknowledgement from "./Acknowledgement";

const DESIGN_WIDTH = 800; // matches the fixed width inside Acknowledgement.jsx

export default function AcknowledgementSection({ student, onRegisterAnother }) {
  const ref = useRef(null); // the actual 800px Acknowledgement node — this is what gets captured
  const wrapperRef = useRef(null); // the responsive box that visually scales it to fit the screen
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // Recompute the visual scale whenever the wrapper's width changes (resize, orientation, etc.)
  useLayoutEffect(() => {
    const recalc = () => {
      if (!wrapperRef.current || !ref.current) return;
      const containerWidth = wrapperRef.current.offsetWidth;
      const nextScale = Math.min(1, containerWidth / DESIGN_WIDTH);
      setScale(nextScale);
      setScaledHeight(ref.current.offsetHeight * nextScale);
    };

    recalc();

    const resizeObserver = new ResizeObserver(recalc);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    if (ref.current) resizeObserver.observe(ref.current);
    window.addEventListener("resize", recalc);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [student]);

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    const node = ref.current;
    const previousTransform = node.style.transform;
    try {
      // Temporarily remove the visual scale so html2canvas always captures
      // the full-size, undistorted layout — regardless of screen size.
      node.style.transform = "none";
      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
      pdf.save(`Graduation_Acknowledgement_${student.roll_no}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Could not generate the PDF. Please try again.");
    } finally {
      node.style.transform = previousTransform;
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

      {/* Responsive viewer: scales the fixed-size certificate to fit any screen */}
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
          <Acknowledgement ref={ref} student={student} />
        </div>
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