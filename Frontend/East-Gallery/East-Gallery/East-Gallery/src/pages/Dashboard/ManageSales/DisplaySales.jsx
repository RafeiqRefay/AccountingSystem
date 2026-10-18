import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  Package,
  Search,
  RotateCcw,
  Calendar,
  Store,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Undo2,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  searchProductItems,
  createInvoiceReturn,
} from "../../../api/invoicesService";

import { useToast } from "../../../context/ToastContext";
import Select from "react-select";

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
const formatMoney = (value) => {
  if (value === undefined || value === null) return "-";

  return (
    <span className="whitespace-nowrap">
      {new Intl.NumberFormat("en-US").format(value)}
      <span className="text-xs text-[var(--color-text-light)] mr-1">
        ل.س
      </span>
    </span>
  );
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "18px",
    borderWidth: "2px",
    borderColor: state.isFocused
      ? "var(--color-primary)"
      : "var(--color-border)",
    boxShadow: "none",
    paddingInline: "6px",
    transition: "0.2s",
    "&:hover": {
      borderColor: "var(--color-primary)",
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "18px",
    overflow: "hidden",
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--color-hover)" : "white",
    color: "var(--color-text)",
    padding: "12px",
    cursor: "pointer",
  }),
};

const ownershipOptions = [
  { value: "", label: "الكل" },
  { value: "true", label: "ملك المحل" },
  { value: "false", label: "غير ملك المحل" },
];

// ───────────── PAGE ─────────────
export default function DisplaySales() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(true);

  const [filters, setFilters] = useState({
    productID: "",
    fromDate: "",
    toDate: "",
    isStoreOwned: "",
  });

  const { showToast } = useToast();
  const handleReturnProduct = async (invoiceItemID) => {
    console.log(invoiceItemID);
    const confirmed = window.confirm("هل أنت متأكد من إرجاع هذا المنتج؟");
    if (!confirmed) return;
    try {
      await createInvoiceReturn(invoiceItemID);

      showToast("تم إرجاع المنتج بنجاح", "success");
      fetchItems(filters);
    } catch (err) {
      console.log(err.response?.data);
      showToast("فشل إرجاع المنتج", "error");
    }
  };
  // SEARCH
  const fetchItems = async (currentFilters = filters) => {
    try {
      setLoading(true);

      const data = await searchProductItems(currentFilters);

      setItems(data.data || []);
      setSearched(true);
    } catch {
      showToast("فشل تحميل النتائج", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HANDLERS
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    fetchItems(filters);
  };

  const handleClear = () => {
    const empty = {
      productID: "",
      fromDate: "",
      toDate: "",
      isStoreOwned: "",
    };
    setFilters(empty);
    fetchItems(empty);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const totalSum = items.reduce(
    (acc, item) => acc + (item.qty || 0) * (item.unitPrice || 0),
    0,
  );

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined,
  ).length;

  return (
    <DashboardLayout title="بحث عن منتجات الفوات">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            البحث في عناصر الفواتير
          </h1>

          <p className="text-[var(--color-text-light)] mt-1">
            ابحث وفلتر المنتجات المباعة حسب رقم المنتج، التاريخ، والملكية
          </p>
        </div>
      </div>

      {/* FILTERS CARD */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl mb-6 shadow-sm overflow-hidden">
        {/* Filters toggle header */}
        <button
          onClick={() => setFiltersOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10 rounded-2xl
                bg-[var(--color-primary)]/10
                flex items-center justify-center
              "
            >
              <SlidersHorizontal
                size={18}
                className="text-[var(--color-primary)]"
              />
            </div>

            <div className="text-right">
              <p className="font-semibold text-[var(--color-text)] text-sm">
                خيارات الفلترة
              </p>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-[var(--color-text-light)]">
                  {activeFiltersCount} فلتر مُفعّل
                </p>
              )}
            </div>
          </div>

          {filtersOpen ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </button>

        {/* Filters body */}
        <div
          className={`
            transition-all duration-300 overflow-hidden
            ${filtersOpen ? "max-h-[600px]" : "max-h-0"}
          `}
        >
          <div className="px-5 pb-5 border-t border-[var(--color-border)] pt-5 position-relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Product ID */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  رقم المنتج
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.productID}
                  onChange={(e) => handleChange("productID", e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="مثال: 5015"
                  className="
                    w-full h-12 px-4 rounded-2xl
                    border-2 border-[var(--color-border)]
                    outline-none text-sm
                    focus:border-[var(--color-primary)]
                    transition-colors duration-200
                    placeholder:text-gray-300
                  "
                />
              </div>

              {/* From Date */}
              <div>
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
                    value={filters.fromDate}
                    onChange={(e) => handleChange("fromDate", e.target.value)}
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

              {/* To Date */}
              <div>
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
                    value={filters.toDate}
                    onChange={(e) => handleChange("toDate", e.target.value)}
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

              {/* Ownership */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  الملكية
                </label>
                <Select
                  options={ownershipOptions}
                  value={ownershipOptions.find(
                    (o) => o.value === filters.isStoreOwned,
                  )}
                  onChange={(selected) =>
                    handleChange("isStoreOwned", selected?.value ?? "")
                  }
                  isSearchable={false}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSearch}
                className="
                  flex items-center justify-center gap-2
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
                className="
                  flex items-center justify-center gap-2
                  h-12 px-6 rounded-2xl
                  border-2 border-[var(--color-border)]
                  text-[var(--color-text)] text-sm
                  hover:bg-[var(--color-hover)]
                  transition-all
                "
              >
                <RotateCcw size={16} />
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS TABLE */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-hover)]">
              <tr className="text-right">
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-14">
                  #
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  المنتج
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  التاريخ
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] text-center">
                  الكمية
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  السعر الأصلي
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر التكلفة
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر البيع الفعلي
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  الإجمالي
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] text-center w-24">
                  الملكية
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] text-center">
                  الإجراء
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    {[...Array(10)].map((__, j) => (
                      <td className="p-4" key={j}>
                        <div className="w-full h-4 rounded bg-gray-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-16 text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-[var(--color-text-light)] text-sm">
                      {searched
                        ? "لا توجد نتائج مطابقة لهذا البحث"
                        : "لا توجد بيانات بعد"}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="
                      border-t border-[var(--color-border)]
                      hover:bg-[var(--color-hover)]
                      transition-all duration-150
                    "
                    style={{
                      animation: `fadeUp 0.3s ${index * 0.03}s both`,
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
                        {item.id}
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
                          <Package
                            size={16}
                            className="text-[var(--color-primary)]"
                          />
                        </div>
                        <span className="font-medium text-[var(--color-text)]">
                          {item.productName || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[var(--color-text)] text-sm">
                        {formatDate(item.date)}
                      </span>
                    </td>

                    <td className="p-4 text-center">
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

                    <td className="p-4">
                      <span className="text-[var(--color-text)]">
                        {formatMoney(item.originalPrice)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-[var(--color-text)]">
                        {formatMoney(item.costPrice)}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-[var(--color-text)]">
                        {formatMoney(item.unitPrice)}  



                        
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-[var(--color-text)]">
                        {formatMoney((item.qty || 0) * (item.unitPrice || 0))}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {item.isStoreOwned ? (
                        <span
                          title="ملك المحل"
                          className="
                            inline-flex items-center justify-center
                            w-8 h-8 rounded-lg
                            bg-emerald-50 text-emerald-500
                          "
                        >
                          <Store size={14} />
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-text-light)]">
                          -
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleReturnProduct(item.id)}
                        className="
      inline-flex items-center gap-2
      px-3 py-2 rounded-xl
      bg-red-50
      hover:bg-red-100
      text-red-600
      transition-all
      text-sm
      font-medium
    "
                      >
                        <Undo2 size={15} />
                        إرجاع المنتج
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!loading && items.length > 0 && (
              <tfoot>
                <tr className="border-t border-[var(--color-border)] bg-[var(--color-hover)]">
                  <td
                    colSpan="7"
                    className="p-4 text-sm font-semibold text-[var(--color-text)]"
                  >
                    الإجمالي الكلي ({items.length} عنصر)
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
