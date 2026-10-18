// pages/Dashboard/Reports/DisplaySalesInventory.jsx

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  Search,
  RotateCcw,
  Calendar,
  Package,
  Wallet,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  RotateCcw as ReturnIcon,
} from "lucide-react";

import { useEffect, useState } from "react";

import Select from "react-select";

import { searchSalesInventory } from "../../api/invoicesService";

import { useToast } from "../../context/ToastContext";

// ---------------- HELPERS ----------------

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

const formatNumber = (value) => {
  if (value === undefined || value === null) return "-";

  return new Intl.NumberFormat("en-US").format(value);
};

// ---------------- OPTIONS ----------------

const periodOptions = [
  {
    value: "",
    label: "كل البيانات",
  },

  {
    value: "1",
    label: "اليوم",
  },

  {
    value: "2",
    label: "هذا الأسبوع",
  },

  {
    value: "3",
    label: "هذا الشهر",
  },

  {
    value: "4",
    label: "آخر 30 يوم",
  },

  {
    value: "5",
    label: "هذه السنة",
  },

  {
    value: "6",
    label: "فترة مخصصة",
  },
];

const ownershipOptions = [
  {
    value: "",
    label: "الكل",
  },

  {
    value: "true",
    label: "ملك المحل",
  },

  {
    value: "false",
    label: "غير ملك المحل",
  },
];

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
  }),

  menuPortal: (base) => ({
    ...base,

    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,

    padding: "12px",

    cursor: "pointer",

    backgroundColor: state.isFocused ? "var(--color-hover)" : "white",

    color: "var(--color-text)",
  }),
};

// ---------------- CARDS ----------------
const cards = [
  {
    title: "إجمالي القطع بالمخزون",
    key: "totalProducts",
    icon: Package,
    isCount: true, // عدد، مو مبلغ
  },
  {
    title: "قيمة الشراء",
    key: "totalPurchasePriceProduct",
    icon: ShoppingCart,
  },
  {
    title: "القيمة السوقية للمخزون الحالي",
    key: "totalSalePriceProduct",
    icon: DollarSign,
  },
  {
    title: "تكلفة البضاعة المباعة",
    key: "totalCost",
    icon: Wallet,
  },
  {
    title: "عدد القطع المباعة",
    key: "totalProductsSold",
    icon: TrendingUp,
    isCount: true, // عدد، مو مبلغ
  },
  {
    title: "صافي الربح",
    key: "totalProfit",
    icon: TrendingUp,
  },
  {
    title: "إجمالي المبيعات",
    key: "totalInventorySaleValue",
    icon: Package,
  },
  {
    title: "إجمالي المصاريف",
    key: "totalExpenses",
    icon: Wallet,
  },
  {
    title: "قيمة المرتجعات",
    key: "totalReturnCost",
    icon: ReturnIcon,
  },

];

// ---------------- PAGE ----------------

export default function DisplaySalesInventory() {
  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    period: "",

    fromDate: "",

    toDate: "",

    isStoreOwned: "",
  });

  const { showToast } = useToast();

  // LOAD DATA

  const fetchReport = async (current = filters) => {
    try {
      setLoading(true);

      const data = await searchSalesInventory(current);

      setReport(data.data?.[0] || null);
    } catch (error) {
      console.log(error);

      showToast("فشل تحميل التقرير", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handlePeriodChange = (value) => {
    setFilters((prev) => ({
      ...prev,

      period: value,

      fromDate: value === "6" ? prev.fromDate : "",

      toDate: value === "6" ? prev.toDate : "",
    }));
  };

  const reset = () => {
    const empty = {
      period: "",

      fromDate: "",

      toDate: "",

      isStoreOwned: "",
    };

    setFilters(empty);

    fetchReport(empty);
  };

  return (
    <DashboardLayout title="تقرير المبيعات والمخزون">
      {/* HEADER */}

      <div className="mb-8">
        <h1
          className="
text-2xl
font-bold
text-[var(--color-text)]
"
        >
          تقرير المبيعات والمخزون
        </h1>

        <p
          className="
mt-1
text-[var(--color-text-light)]
"
        >
          تحليل شامل لحركة المخزون والمبيعات والأرباح
        </p>
      </div>

      {/* FILTER CARD */}

      <div
        className="
bg-white
border
border-[var(--color-border)]
rounded-3xl
p-5
mb-6
shadow-sm
"
      >
        <div
          className="
grid
grid-cols-1
md:grid-cols-4
gap-4
"
        >
          {/* PERIOD */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              نوع التقرير
            </label>

            <Select
              options={periodOptions}
              value={periodOptions.find((x) => x.value === filters.period)}
              onChange={(x) => handlePeriodChange(x?.value || "")}
              styles={selectStyles}
              menuPortalTarget={document.body}
              isSearchable={false}
            />
          </div>

          {/* FROM DATE */}

          {/* FROM DATE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              من تاريخ
            </label>
            <div className="relative">
              <Calendar
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
              />
              <input
                type="date"
                disabled={filters.period !== "6"}
                value={filters.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
                className={`
        w-full h-11 pr-9 pl-4 rounded-2xl
        border-2 border-[var(--color-border)]
        outline-none text-sm transition-all duration-200
        ${
          filters.period !== "6"
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-[var(--color-hover)] focus:bg-white focus:border-[var(--color-primary)] text-[var(--color-text)]"
        }
      `}
              />
            </div>
          </div>

          {/* TO DATE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              إلى تاريخ
            </label>
            <div className="relative">
              <Calendar
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
              />
              <input
                type="date"
                disabled={filters.period !== "6"}
                value={filters.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
                className={`
        w-full h-11 pr-9 pl-4 rounded-2xl
        border-2 border-[var(--color-border)]
        outline-none text-sm transition-all duration-200
        ${
          filters.period !== "6"
            ? "bg-gray-100 cursor-not-allowed text-gray-400"
            : "bg-[var(--color-hover)] focus:bg-white focus:border-[var(--color-primary)] text-[var(--color-text)]"
        }
      `}
              />
            </div>
          </div>

          {/* OWNERSHIP */}

          <div>
            <label className="block mb-2 text-sm font-medium">الملكية</label>

            <Select
              options={ownershipOptions}
              value={ownershipOptions.find(
                (x) => x.value === filters.isStoreOwned,
              )}
              onChange={(x) => handleChange("isStoreOwned", x?.value || "")}
              styles={selectStyles}
              menuPortalTarget={document.body}
              isSearchable={false}
            />
          </div>
        </div>

        <div
          className="
flex
gap-3
mt-5
"
        >
          <button
            onClick={() => fetchReport(filters)}
            className="
h-12
px-6
rounded-2xl
bg-[var(--color-primary)]
text-white
flex
items-center
gap-2
shadow-lg
"
          >
            <Search size={16} />
            بحث
          </button>

          <button
            onClick={reset}
            className="
h-12
px-6
rounded-2xl
border-2
border-[var(--color-border)]
flex
items-center
gap-2
"
          >
            <RotateCcw size={16} />
            إعادة
          </button>
        </div>
      </div>

      {/* CARDS */}

      <div
        className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-5
"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="
bg-white
border
border-[var(--color-border)]
rounded-3xl
p-5
shadow-sm
hover:shadow-md
transition
"
            >
              <div
                className="
w-12
h-12
rounded-2xl
bg-[var(--color-primary)]/10
flex
items-center
justify-center
mb-5
"
              >
                <Icon size={22} className="text-[var(--color-primary)]" />
              </div>

              <p
                className="
text-sm
text-[var(--color-text-light)]
mb-2
"
              >
                {card.title}
              </p>
<h2
  className="
text-2xl
font-bold
"
>
  {loading
    ? "..."
    : card.isCount
    ? formatNumber(report?.[card.key])
    : formatMoney(report?.[card.key])}
</h2>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
