import { Trash2, X } from "lucide-react";

export default function DeleteModal({ open, itemName, onConfirm, onCancel }) {
  return (
    <div
      className={`
        fixed inset-0 z-[150]
        flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className={`
          bg-white w-full max-w-sm rounded-3xl p-7
          border border-[var(--color-border)]
          shadow-2xl
          transition-all duration-300
          ${open ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-6"}
        `}
        style={{
          transitionTimingFunction: open
            ? "cubic-bezier(0.34,1.56,0.64,1)"
            : "ease",
        }}
      >
        {/* Close */}
        <div className="flex justify-end mb-1">
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Icon */}
        <div className="flex flex-col items-center text-center pb-2">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <Trash2 size={28} className="text-red-500" />
          </div>

          <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
            تأكيد الحذف
          </h3>
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed mb-3">
            هل أنت متأكد أنك تريد الحذف ؟
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </p>

          {/* Item name chip */}
          {itemName && (
            <span className="inline-block bg-[var(--color-hover)] text-[var(--color-primary)] font-semibold text-sm px-4 py-2 rounded-xl mb-1">
              {itemName}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onConfirm}
            className="
              flex-1 h-11 rounded-2xl
              bg-red-500 hover:bg-red-600
              text-white font-medium text-sm
              flex items-center justify-center gap-2
              transition-all active:scale-95
            "
          >
            <Trash2 size={16} />
            نعم، احذف
          </button>
          <button
            onClick={onCancel}
            className="
              flex-1 h-11 rounded-2xl
              border border-[var(--color-border)]
              text-[var(--color-text)] font-medium text-sm
              hover:bg-[var(--color-hover)]
              transition-all
            "
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
