import { useState } from "react";

export default function FileUpload() {
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);

  return (
    <div>
      <h2>Upload Documents</h2>

      <div>
        <h3>PAN Card</h3>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            setPanFile(e.target.files[0])
          }
        />

        {panFile && (
          <div>
            <p>Name: {panFile.name}</p>
            <p>
              Size:
              {(panFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      <br />

      <div>
        <h3>Aadhaar Card</h3>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) =>
            setAadhaarFile(
              e.target.files[0]
            )
          }
        />

        {aadhaarFile && (
          <div>
            <p>Name: {aadhaarFile.name}</p>
            <p>
              Size:
              {(aadhaarFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}