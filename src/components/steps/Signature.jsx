import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

export default function Signature() {
  const sigRef = useRef();

  const clear = () => {
    sigRef.current.clear();
  };

  return (
    <div>
      <h2>E-Signature</h2>

      <SignatureCanvas
        ref={sigRef}
        canvasProps={{
          width: 500,
          height: 200,
          className: "border",
        }}
      />

      <br />

      <button onClick={clear}>
        Clear Signature
      </button>
    </div>
  );
}