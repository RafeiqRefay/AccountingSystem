import { AlertTriangle, CheckCircle } from "lucide-react";

export default function Toast({ message, type, visible }) {
  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[200]
        flex items-center gap-3
        px-5 py-3 rounded-2xl
        shadow-2xl
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        ${
          type === "success"
            ? "bg-[#0F6E56] text-white"
            : "bg-[#993C1D] text-white"
        }
      `}
    >
      {type === "success" ? (
        <CheckCircle size={18} className="shrink-0" />
      ) : (
        <AlertTriangle size={18} className="shrink-0" />
      )}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
}
