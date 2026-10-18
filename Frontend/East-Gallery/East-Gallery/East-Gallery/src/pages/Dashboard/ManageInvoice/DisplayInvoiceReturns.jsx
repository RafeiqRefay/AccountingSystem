import DashboardLayout from "../../../components/layout/DashboardLayout";
import { Package, RotateCcw, Store } from "lucide-react";

import { useEffect, useState } from "react";

import { getAllInvoiceReturns } from "../../../api/invoicesService";

import { useToast } from "../../../context/ToastContext";

// ---------------- HELPERS ----------------

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  if (value === undefined || value === null) return "-";

  return new Intl.NumberFormat("en-US").format(value);
};

// ---------------- PAGE ----------------

export default function DisplayInvoiceReturns() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const fetchReturns = async () => {
    try {
      setLoading(true);

      const data = await getAllInvoiceReturns();

      setItems(data.data || []);
    } catch {
      showToast("فشل تحميل المرتجعات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const totalReturns = items.reduce(
    (sum, item) => sum + (item.returnPrice || 0),
    0,
  );

  return (
    <DashboardLayout title="مرتجعات الفواتير">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          مرتجعات الفواتير
        </h1>

        <p className="mt-1 text-[var(--color-text-light)]">
          جميع المنتجات التي تم إرجاعها
        </p>
      </div>

      {/* TABLE */}

      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-hover)]">
              <tr className="text-right">
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  #
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  المنتج
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  تاريخ الإرجاع
                </th>

                <th className="p-4 text-center text-sm font-semibold text-[var(--color-text-light)]">
                  الكمية
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر الإرجاع
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر التكلفة
                </th>

                <th className="p-4 text-center text-sm font-semibold text-[var(--color-text-light)]">
                  الملكية
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 rounded bg-gray-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <RotateCcw
                      size={45}
                      className="mx-auto text-gray-300 mb-4"
                    />

                    <p className="text-[var(--color-text-light)]">
                      لا يوجد مرتجعات
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-all"
                  >
                    <td className="p-4">
                      <span
                        className="
                        inline-flex
                        items-center
                        justify-center
                        w-7
                        h-7
                        rounded-lg
                        bg-[var(--color-primary)]/10
                        text-[var(--color-primary)]
                        text-xs
                        font-semibold
                      "
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                          w-10
                          h-10
                          rounded-2xl
                          bg-[var(--color-hover)]
                          border
                          border-[var(--color-border)]
                          flex
                          items-center
                          justify-center
                        "
                        >
                          <Package
                            size={16}
                            className="text-[var(--color-primary)]"
                          />
                        </div>

                        <span className="font-medium">{item.productName}</span>
                      </div>
                    </td>

                    <td className="p-4">{formatDate(item.returnDate)}</td>

                    <td className="p-4 text-center">
                      <span
                        className="
                        inline-flex
                        items-center
                        justify-center
                        min-w-7
                        h-7
                        px-2
                        rounded-lg
                        bg-[var(--color-primary)]/10
                        text-[var(--color-primary)]
                        text-xs
                        font-semibold
                      "
                      >
                        {item.qty}
                      </span>
                    </td>

                    <td className="p-4">{formatMoney(item.returnPrice)}                     <span style={{ color: "var(--color-primary)" }}>ل.س</span>
</td>

                    <td className="p-4">{formatMoney(item.costPrice)}                    <span style={{ color: "var(--color-primary)" }}>ل.س</span>
</td>

                    <td className="p-4 text-center">
                      {item.isStoreOwned ? (
                        <span
                          className="
                          inline-flex
                          items-center
                          justify-center
                          w-8
                          h-8
                          rounded-lg
                          bg-emerald-50
                          text-emerald-500
                        "
                          title="ملك المحل"
                        >
                          <Store size={15} />
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-text-light)]">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!loading && items.length > 0 && (
              <tfoot>
                <tr className="border-t border-[var(--color-border)] bg-[var(--color-hover)]">
                  <td
                    colSpan={4}
                    className="p-4 font-semibold text-[var(--color-text)]"
                  >
                    إجمالي المرتجعات ({items.length} )
                  </td>

                  <td className="p-4 font-bold text-[var(--color-primary)]">
                    {formatMoney(totalReturns)}                    <span style={{ color: "var(--color-primary)" }}>ل.س</span>

                  </td>

                  <td></td>

                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
