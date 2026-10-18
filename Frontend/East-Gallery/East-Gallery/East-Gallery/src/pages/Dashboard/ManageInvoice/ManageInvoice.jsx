// pages/Dashboard/ManageInvoice/InvoicesByDate.jsx

import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  FileText,
  Eye,
  X,
  Search,
  Calendar,
  RotateCcw,
  Package,
  Store,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getAllInvoicesByDate,
  getInvoiceItemsById,
} from "../../../api/invoicesService";

import { useToast } from "../../../context/ToastContext";

// ───────────── HELPERS ─────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// يرجع الرقم مع "ل.س" بشكل موحد بكل مكان بالصفحة
const formatMoney = (value) => {
  if (value === undefined || value === null) return "-";
  return `${new Intl.NumberFormat("en-US").format(value)} ل.س`;
};

// ───────────── DETAILS MODAL ─────────────
function DetailsModal({ open, invoiceId, items, loading, onClose }) {
  const itemsTotal = items.reduce(
    (acc, item) => acc + (item.qty || 0) * (item.unitPrice || 0),
    0,
  );

  const netTotal = items.reduce(
    (acc, item) =>
      acc + (item.isReturned ? 0 : (item.qty || 0) * (item.unitPrice || 0)),
    0,
  );

  const hasReturns = items.some((item) => item.isReturned);

  return (
    <div
      className={`
        fixed inset-0 z-[150]
        flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-all duration-300
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`
          bg-white w-full max-w-2xl rounded-3xl p-7
          border border-[var(--color-border)]
          shadow-2xl
          transition-all duration-300
          ${
            open
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-6"
          }
        `}
        style={{
          transitionTimingFunction: open
            ? "cubic-bezier(0.34,1.56,0.64,1)"
            : "ease",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div
              className="
                w-10 h-10 rounded-2xl mb-3
                bg-[var(--color-primary)]/10
                flex items-center justify-center
              "
            >
              <FileText size={20} className="text-[var(--color-primary)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--color-text)]">
              تفاصيل الفاتورة {invoiceId ? `#${invoiceId}` : ""}
            </h2>

            <p className="text-sm text-[var(--color-text-light)] mt-1">
              المنتجات المضافة على هذه الفاتورة
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3 mb-6">
            <div className="w-full h-16 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="w-full h-16 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="w-full h-16 rounded-2xl bg-gray-100 animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center mb-6">
            <Package size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-[var(--color-text-light)]">
              لا توجد عناصر لهذه الفاتورة
            </p>
          </div>
        ) : (
          <div className="mb-6 max-h-[50vh] overflow-y-auto rounded-2xl border-2 border-[var(--color-border)]">
            <table className="w-full">
              <thead className="bg-[var(--color-hover)] sticky top-0">
                <tr className="text-right">
                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)]">
                    المنتج
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)] text-center">
                    الكمية
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)]">
                    السعر الأصلي
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)]">
                    سعر البيع
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)]">
                    التكلفة
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)]">
                    الإجمالي
                  </th>

                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)] text-center">
                    الملكية
                  </th>
                  <th className="p-3 text-xs font-semibold text-[var(--color-text-light)] text-center">
                    الحالة
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="
              w-8 h-8 rounded-xl
              bg-[var(--color-hover)]
              flex items-center justify-center
              border border-[var(--color-border)]
            "
                        >
                          <Package
                            size={13}
                            className="text-[var(--color-primary)]"
                          />
                        </div>

                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {item.productName}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className="
            inline-flex items-center justify-center
            min-w-7 h-7 px-2 rounded-lg text-xs font-semibold
            bg-[var(--color-primary)]/10
            text-[var(--color-primary)]
          "
                      >
                        {item.qty}
                      </span>
                    </td>

                    <td className="p-3">{formatMoney(item.originalPrice)}</td>

                    <td className="p-3">{formatMoney(item.unitPrice)}</td>

                    <td className="p-3">{formatMoney(item.costPrice)}</td>

                    <td className="p-3 font-semibold">
                      {formatMoney((item.qty || 0) * (item.unitPrice || 0))}
                    </td>

                    <td className="p-3 text-center">
                      {item.isStoreOwned ? (
                        <span
                          title="ملك المحل"
                          className="
              inline-flex items-center justify-center
              w-7 h-7 rounded-lg
              bg-emerald-50 text-emerald-500
            "
                        >
                          <Store size={13} />
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-text-light)]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {item.isReturned ? (
                        <span
                          className="
              inline-flex items-center justify-center
              px-2 py-1 rounded-lg text-xs font-semibold
              bg-red-50 text-red-500
            "
                        >
                          مرتجع
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-text-light)]">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="border-t border-[var(--color-border)] bg-[var(--color-hover)]">
                  <td
                    colSpan="5"
                    className="p-3 text-sm font-semibold text-[var(--color-text)]"
                  >
                    الإجمالي الكلي
                  </td>

                  <td className="p-3 font-bold text-[var(--color-primary)]">
                    {formatMoney(itemsTotal)}
                  </td>

                  <td colSpan="2"></td>
                </tr>

                {/* بيظهر بس لو فيه مرتجعات بهاي الفاتورة */}
                {hasReturns && (
                  <tr className="border-t border-[var(--color-border)] bg-red-50/40">
                    <td
                      colSpan="5"
                      className="p-3 text-sm font-semibold text-red-500"
                    >
                      الإجمالي بعد المرتجعات
                    </td>

                    <td className="p-3 font-bold text-red-500">
                      {formatMoney(netTotal)}
                    </td>

                    <td colSpan="2"></td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={onClose}
          className="
            w-full h-12 rounded-2xl
            bg-[var(--color-primary)]
            hover:bg-[var(--color-primary-hover)]
            text-white font-medium text-sm
            transition-all active:scale-95
            shadow-lg shadow-[var(--color-primary)]/25
          "
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}

// ───────────── PAGE ─────────────
export default function ManageInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const { showToast } = useToast();

  // GET ALL BY DATE
  const fetchInvoices = async (from = fromDate, to = toDate) => {
    try {
      setLoading(true);

      const data = await getAllInvoicesByDate(
        from || undefined,
        to || undefined,
      );

      setInvoices(data.data);
    } catch {
      showToast("فشل تحميل الفواتير", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // SEARCH
  const handleSearch = () => {
    fetchInvoices(fromDate, toDate);
  };

  // CLEAR
  const handleClear = () => {
    setFromDate("");
    setToDate("");
    fetchInvoices("", "");
  };

  // VIEW DETAILS (invoice items)
  const handleViewDetails = async (item) => {
    setSelectedInvoiceId(item.id);
    setDetailsOpen(true);
    setDetailsLoading(true);
    setInvoiceItems([]);

    try {
      const data = await getInvoiceItemsById(item.id);
      setInvoiceItems(data.data || []);
    } catch {
      showToast("فشل تحميل تفاصيل الفاتورة", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  // TOTAL (footer summary)
  const totalSum = invoices.reduce((acc, item) => acc + (item.total || 0), 0);

  return (
    <DashboardLayout title="فواتير حسب التاريخ">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            فواتير حسب التاريخ
          </h1>

          <p className="text-[var(--color-text-light)] mt-1">
            استعرض الفواتير ضمن فترة زمنية محددة
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              من تاريخ
            </label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="
                  w-full h-12 pr-11 pl-4 rounded-2xl
                  border-2 border-[var(--color-border)]
                  outline-none text-sm
                  focus:border-[var(--color-primary)]
                  transition-colors duration-200
                "
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              إلى تاريخ
            </label>

            <div className="relative">
              <Calendar
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="
                  w-full h-12 pr-11 pl-4 rounded-2xl
                  border-2 border-[var(--color-border)]
                  outline-none text-sm
                  focus:border-[var(--color-primary)]
                  transition-colors duration-200
                "
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSearch}
              className="
                flex-1 md:flex-none flex items-center justify-center gap-2
                h-12 px-6 rounded-2xl
                bg-[var(--color-primary)]
                hover:bg-[var(--color-primary-hover)]
                text-white font-medium text-sm
                transition-all active:scale-95
                shadow-lg shadow-[var(--color-primary)]/25
              "
            >
              <Search size={16} />
              بحث
            </button>

            <button
              onClick={handleClear}
              title="إعادة تعيين"
              className="
                w-12 h-12 rounded-2xl
                border-2 border-[var(--color-border)]
                text-[var(--color-text)]
                hover:bg-[var(--color-hover)]
                flex items-center justify-center
                transition-all
              "
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-hover)]">
              <tr className="text-right">
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-14">
                  #
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  رقم الفاتورة
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  التاريخ
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  الإجمالي
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-28">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="p-4">
                      <div className="w-6 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="w-16 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="w-36 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="w-24 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <FileText
                      size={40}
                      className="text-gray-200 mx-auto mb-3"
                    />

                    <p className="text-[var(--color-text-light)] text-sm">
                      لا توجد فواتير ضمن هذه الفترة
                    </p>
                  </td>
                </tr>
              ) : (
                invoices.map((item, index) => (
                  <tr
                    key={item.id}
                    className="
                      border-t border-[var(--color-border)]
                      hover:bg-[var(--color-hover)]
                      transition-all duration-150
                    "
                    style={{
                      animation: `fadeUp 0.3s ${index * 0.04}s both`,
                    }}
                  >
                    <td className="p-4">
                      <span
                        className="
                          inline-flex items-center justify-center
                          w-7 h-7 rounded-lg text-xs font-semibold
                          bg-[var(--color-primary)]/10
                          text-[var(--color-primary)]
                        "
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10 h-10 rounded-2xl
                            bg-[var(--color-hover)]
                            flex items-center justify-center
                            border border-[var(--color-border)]
                          "
                        >
                          <FileText
                            size={17}
                            className="text-[var(--color-primary)]"
                          />
                        </div>

                        <span className="font-medium text-[var(--color-text)]">
                          #{item.id}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[var(--color-text)]">
                        {formatDate(item.date)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-[var(--color-text)]">
                        {formatMoney(item.total)}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(item)}
                        title="عرض التفاصيل"
                        className="
                          w-9 h-9 rounded-xl
                          bg-blue-50 text-blue-500
                          hover:bg-blue-100 hover:scale-110
                          flex items-center justify-center
                          transition-all duration-150
                        "
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!loading && invoices.length > 0 && (
              <tfoot>
                <tr className="border-t border-[var(--color-border)] bg-[var(--color-hover)]">
                  <td
                    colSpan="3"
                    className="p-4 text-sm font-semibold text-[var(--color-text)]"
                  >
                    الإجمالي الكلي
                  </td>
                  <td className="p-4 font-bold text-[var(--color-primary)]">
                    {formatMoney(totalSum)}
                  </td>
                  <td className="p-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* MODALS */}
      <DetailsModal
        open={detailsOpen}
        invoiceId={selectedInvoiceId}
        items={invoiceItems}
        loading={detailsLoading}
        onClose={() => setDetailsOpen(false)}
      />

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DashboardLayout>
  );
}