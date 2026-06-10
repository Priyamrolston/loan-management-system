import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLoanStore } from "../../store/loanStore";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function DropzoneUpload({ label, required, type, uploads, setUploads }) {
  const file = uploads[type];
  // Bug fix: track rejected files to show an error message
  const [rejectionMsg, setRejectionMsg] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setRejectionMsg("");
      if (rejectedFiles && rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0];
        if (reason.code === "file-too-large") {
          setRejectionMsg("File exceeds 5 MB limit. Please choose a smaller file.");
        } else if (reason.code === "file-invalid-type") {
          setRejectionMsg("Only JPG, PNG, and PDF files are accepted.");
        } else {
          setRejectionMsg("File rejected: " + reason.message);
        }
        return;
      }
      const f = acceptedFiles[0];
      if (!f) return;
      setUploads((prev) => ({
        ...prev,
        [type]: {
          name: f.name,
          // Bug fix: show both KB and MB for large files
          size:
            f.size >= 1024 * 1024
              ? (f.size / (1024 * 1024)).toFixed(2) + " MB"
              : (f.size / 1024).toFixed(1) + " KB",
          preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
          type: f.type,
        },
      }));
    },
    [type, setUploads]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  if (file) {
    return (
      <div className="form-group">
        <label>
          {label} {required && <span className="required">*</span>}
        </label>
        <div className="file-preview">
          <div className="file-preview-icon">
            {file.type === "application/pdf" ? "📄" : "🖼️"}
          </div>
          <div className="file-preview-body">
            <div className="file-preview-name">{file.name}</div>
            <div className="file-preview-size">{file.size}</div>
          </div>
          <button
            type="button"
            className="btn-danger-ghost"
            onClick={() => {
              // Bug fix: revoke object URL to avoid memory leak
              if (file.preview) URL.revokeObjectURL(file.preview);
              setUploads((prev) => ({ ...prev, [type]: null }));
            }}
          >
            Remove
          </button>
        </div>
        {/* Show image preview if applicable */}
        {file.preview && (
          <div style={{ marginTop: "0.5rem" }}>
            <img
              src={file.preview}
              alt="Preview"
              style={{
                height: "80px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      <div
        {...getRootProps()}
        className={`dropzone-area${isDragActive ? " dragging" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">📁</div>
        <div className="dropzone-title">
          {isDragActive ? "Drop the file here…" : "Drag & drop or click to browse"}
        </div>
        <div className="dropzone-sub">JPG, PNG, or PDF — max 5 MB per file</div>
      </div>
      {rejectionMsg && (
        <span className="error-msg" style={{ marginTop: "0.375rem" }}>
          ⚠ {rejectionMsg}
        </span>
      )}
    </div>
  );
}

export default function FileUpload() {
  const { currentStep, setStep, formData, updateForm } = useLoanStore();

  const [uploads, setUploads] = useState(() => {
    const stored = formData.documents;
    if (stored && stored.length) {
      return {
        pan: stored.find((d) => d._key === "pan") || null,
        aadhaar: stored.find((d) => d._key === "aadhaar") || null,
        extra: stored.find((d) => d._key === "extra") || null,
      };
    }
    return { pan: null, aadhaar: null, extra: null };
  });

  // Bug fix: home loan also needs an extra document (property docs / income proof)
  const needsExtra =
    formData.loanType === "personal" ||
    formData.loanType === "business" ||
    formData.loanType === "home";

  const extraLabel =
    formData.loanType === "personal"
      ? "Salary Slip (Latest Month)"
      : formData.loanType === "business"
      ? "GST Certificate"
      : formData.loanType === "home"
      ? "Property / Income Documents"
      : null;

  const isReady = uploads.pan && uploads.aadhaar && (!needsExtra || uploads.extra);

  const handleNext = () => {
    const docs = Object.entries(uploads)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => ({ ...v, _key: k }));
    updateForm({ documents: docs });
    setStep(currentStep + 1);
  };

  return (
    <div>
      <DropzoneUpload
        label="PAN Card"
        required
        type="pan"
        uploads={uploads}
        setUploads={setUploads}
      />

      <DropzoneUpload
        label="Aadhaar Card"
        required
        type="aadhaar"
        uploads={uploads}
        setUploads={setUploads}
      />

      {needsExtra && extraLabel && (
        <DropzoneUpload
          label={extraLabel}
          required
          type="extra"
          uploads={uploads}
          setUploads={setUploads}
        />
      )}

      {/* Progress indicator */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            fontSize: "0.8125rem",
            color: "#6b7280",
          }}
        >
          <span>
            {[uploads.pan, uploads.aadhaar, needsExtra ? uploads.extra : true].filter(
              Boolean
            ).length}{" "}
            of {needsExtra ? 3 : 2} files uploaded
          </span>
          {isReady && <span className="badge badge-success">All documents uploaded ✓</span>}
        </div>
      </div>

      {!isReady && (
        <div className="info-box warning">
          <span className="info-box-icon">⚠️</span>
          <span>Upload all required documents to continue.</span>
        </div>
      )}

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
          >
            ← Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isReady}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}