import { useEffect } from "react";

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  type = "delete",
  title,
  message,
}) {
  // Fermer avec Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const config = {
    delete: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H5z"
            />
          </svg>
        </div>
      ),
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
      confirmLabel: "Supprimer",
    },
    edit: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      ),
      confirmClass: "bg-amber-500 hover:bg-amber-600 text-white",
      confirmLabel: "Modifier",
    },
    logout: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-slate-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      ),
      confirmClass: "bg-slate-800 hover:bg-slate-900 text-white",
      confirmLabel: "Se déconnecter",
    },
  };

  const c = config[type];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-[fadeUp_0.2s_ease-out]">
          {c.icon}

          <h3 className="text-center text-slate-800 font-bold text-lg mb-2">
            {title}
          </h3>
          <p className="text-center text-slate-500 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${c.confirmClass}`}
            >
              {c.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
