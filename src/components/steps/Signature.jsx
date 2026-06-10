import SignatureCanvas from "react-signature-canvas";
import { useRef, useState, useEffect, useCallback } from "react";
import { useLoanStore } from "../../store/loanStore";

export default function Signature() {
  const sigRef = useRef(null);
  const containerRef = useRef(null);
  const { setSignature, currentStep, setStep } = useLoanStore();
  const [isEmpty, setIsEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Bug fix: SignatureCanvas does NOT respond to CSS width:100%.
  // The canvas pixel dimensions must be set explicitly, or signatures appear
  // stretched / in wrong position. Use ResizeObserver to set canvas size.
  const resizeCanvas = useCallback(() => {
    if (!containerRef.current || !sigRef.current) return;
    const width = containerRef.current.offsetWidth;
    const canvas = sigRef.current.getCanvas();
    // Save current drawing as data URL before resize
    const dataURL = sigRef.current.isEmpty() ? null : sigRef.current.toDataURL();
    canvas.width = width;
    canvas.height = 220;
    // Restore drawing after resize
    if (dataURL) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataURL;
    } else {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resizeCanvas]);

  const handleClear = () => {
    sigRef.current?.clear();
    // Re-fill white background after clear
    const canvas = sigRef.current?.getCanvas();
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setIsEmpty(true);
  };

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setIsEmpty(false);
    }
  };

  const handleSubmit = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSignature(sigRef.current.toDataURL("image/png"));
      setStep(currentStep + 1);
    }, 800);
  };

  return (
    <div>
      <div className="info-box info">
        <span className="info-box-icon">ℹ️</span>
        <span>
          By signing below, you confirm that all information provided is accurate
          and you authorise Zetheta to process your loan application.
        </span>
      </div>

      <div className="form-group">
        <label>
          Your Signature <span className="required">*</span>
        </label>
        {/* Bug fix: ref the container so ResizeObserver can measure actual width */}
        <div className="signature-container" ref={containerRef}>
          <SignatureCanvas
            ref={sigRef}
            onEnd={handleEnd}
            penColor="#1a1a2e"
            canvasProps={{
              // Do NOT set width/height here — managed by ResizeObserver above
              style: {
                display: "block",
                cursor: "crosshair",
              },
            }}
            backgroundColor="white"
          />
          <div className="signature-pad-label">
            {isEmpty ? "Sign here using mouse or touch" : ""}
          </div>
        </div>

        {isEmpty && (
          <span
            style={{
              fontSize: "0.78rem",
              color: "#9ca3af",
              marginTop: "0.4rem",
              display: "block",
            }}
          >
            Please draw your signature in the box above.
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleClear}
          disabled={submitting}
        >
          🗑 Clear Signature
        </button>
      </div>

      <div className="info-box warning">
        <span className="info-box-icon">⚠️</span>
        <span>
          This is a legally binding e-signature. Ensure your signature is
          accurate before submitting.
        </span>
      </div>

      <div
        className="form-footer"
        style={{ margin: "0 -2.5rem -2rem", marginTop: "2rem" }}
      >
        <span className="form-footer-info">Auto-saved locally</span>
        <div className="form-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep(currentStep - 1)}
            disabled={submitting}
          >
            ← Back
          </button>
          <button
            type="button"
            className={`btn btn-success${submitting ? " btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={isEmpty || submitting}
          >
            {submitting ? (
              <>
                <span className="loading-spinner" />
                Submitting…
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}