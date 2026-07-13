import React from "react";
import { X } from "lucide-react";

export default function RemoveBtnPortfolio({ onClick, label, show }) {
  if (!show) return null;

  return (
    <button
      type="button"
      className="remove-file-btn"
      onClick={onClick}
      aria-label={`Remove ${label}`}
      title={`Remove ${label}`}
    >
      <X size={16} />
    </button>
  );
}
