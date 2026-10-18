import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
  Search,
  Tag,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import Select from "react-select";
import { useEffect, useState } from "react";

import {
  getAllProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../api/productService";

import { getAllTypes } from "../../../api/typeService";
import { getAllCategories } from "../../../api/categoriesService";
import { getAllProductNames } from "../../../api/productNameService";

import { useToast } from "../../../context/ToastContext";
import DeleteModal from "../../../components/componentShareds/DeleteModal";

// ─── HELPERS ────────────────────────────────────────────────
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
// ─── SELECT STYLES (مشترك) ────────────────────────────────────
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
    "&:hover": { borderColor: "var(--color-primary)" },
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

// ─── INITIAL FORM ─────────────────────────────────────────────
const EMPTY_FORM = {
  selectedProductName: null,
  selectedType: null,
  selectedCategory: null,
  quantity: "",
  purchasePrice: "",
  salePrice: "",
  isStoreOwned: true,
  _productNames: [],
  _types: [],
  _categories: [],
};

// ─── FORM MODAL ───────────────────────────────────────────────
function FormModal({ open, onClose, onSave, editItem, form, setForm }) {
  const update = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div
      className={`
        fixed inset-0 z-[150]
        flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`
          bg-white w-full max-w-2xl rounded-3xl p-7
          border border-[var(--color-border)] shadow-2xl
          transition-all duration-300
          ${open ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-6"}
        `}
        style={{
          transitionTimingFunction: open
            ? "cubic-bezier(0.34,1.56,0.64,1)"
            : "ease",
        }}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="w-10 h-10 rounded-2xl mb-3 bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Package size={20} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {editItem ? "تعديل المنتج" : "إضافة منتج"}
            </h2>
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              أدخل بيانات المنتج
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* PRODUCT NAME — Select */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              اسم المنتج
            </label>
            <Select
              options={form._productNames}
              value={form.selectedProductName}
              onChange={update("selectedProductName")}
              placeholder="اختر اسم المنتج"
              isSearchable
              className="text-sm"
              styles={selectStyles}
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              النوع
            </label>
            <Select
              options={form._types}
              value={form.selectedType}
              onChange={update("selectedType")}
              placeholder="اختر النوع"
              isSearchable
              className="text-sm"
              styles={selectStyles}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              التصنيف
            </label>
            <Select
              options={form._categories}
              value={form.selectedCategory}
              onChange={update("selectedCategory")}
              placeholder="اختر التصنيف"
              isClearable
              isSearchable
              className="text-sm"
              styles={selectStyles}
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              الكمية
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => update("quantity")(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm focus:border-[var(--color-primary)] transition-colors duration-200"
            />
          </div>

          {/* PURCHASE PRICE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              سعر الشراء
            </label>
            <input
              type="number"
              value={form.purchasePrice}
              onChange={(e) => update("purchasePrice")(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm focus:border-[var(--color-primary)] transition-colors duration-200"
            />
          </div>

          {/* SALE PRICE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              سعر البيع
            </label>
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => update("salePrice")(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm focus:border-[var(--color-primary)] transition-colors duration-200"
            />
          </div>

          {/* IS STORE OWNED */}
          <div className="flex items-center gap-3 mt-8">
            <input
              type="checkbox"
              checked={form.isStoreOwned}
              onChange={(e) => update("isStoreOwned")(e.target.checked)}
            />
            <span className="text-sm text-[var(--color-text)]">
              المنتج تابع للمحل
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="
              flex-1 h-12 rounded-2xl
              bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
              text-white font-medium text-sm
              transition-all active:scale-95
              shadow-lg shadow-[var(--color-primary)]/25
            "
          >
            {editItem ? "حفظ التعديلات" : "إضافة"}
          </button>
          <button
            onClick={onClose}
            className="
              flex-1 h-12 rounded-2xl
              border-2 border-[var(--color-border)]
              text-[var(--color-text)] text-sm
              hover:bg-[var(--color-hover)] transition-all
            "
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function ProductsManagement() {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filters, setFilters] = useState({
    NameProduct: "",
    TypeName: "",
    CategorieName: "",
    OrderByLowestQuantity: false,
  });

  // ── FETCH ──────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);

    try {
      const productsRes = await getAllProducts();
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error("Products Error:", err);
      setProducts([]);
    }

    try {
      const typesRes = await getAllTypes();
      setTypes(typesRes.data || []);
    } catch (err) {
      console.error("Types Error:", err);
      setTypes([]);
    }

    try {
      const categoriesRes = await getAllCategories();
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error("Categories Error:", err);
      setCategories([]);
    }

    try {
      const productNamesRes = await getAllProductNames();
      setProductNames(productNamesRes.data || []);
    } catch (err) {
      console.error("Product Names Error:", err);
      setProductNames([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── OPTIONS ────────────────────────────────────────────────
  const typeOptions = types.map((t) => ({
    value: t.id,
    label: t.typeName,
  }));

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.categorieName,
  }));

  const productNameOptions = productNames.map((p) => ({
    value: p.productName,
    label: p.productName,
  }));

  // ── SEARCH / FILTER ────────────────────────────────────────
  const handleFilter = async (newFilters = filters) => {
    try {
      setLoading(true);
      const hasFilters =
        newFilters.NameProduct.trim() ||
        newFilters.TypeName.trim() ||
        newFilters.CategorieName.trim() ||
        newFilters.OrderByLowestQuantity;

      if (!hasFilters) return fetchData();

      const res = await searchProducts(newFilters);
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    handleFilter(updated);
  };

  // ── CREATE ─────────────────────────────────────────────────
  const openCreate = () => {
    setEditItem(null);
    setForm({
      ...EMPTY_FORM,
      _productNames: productNameOptions,
      _types: typeOptions,
      _categories: categoryOptions,
    });
    setOpen(true);
  };

  // ── EDIT ───────────────────────────────────────────────────
  const openEdit = (item) => {
    setEditItem(item);
    const foundType = types.find((t) => t.typeName === item.typeName);
    const foundCategory = categories.find(
      (c) => c.categorieName === item.categorieName,
    );

    setForm({
      selectedProductName: item.productName
        ? { value: item.productName, label: item.productName }
        : null,

      selectedType: foundType
        ? { value: foundType.id, label: foundType.typeName }
        : null,

      selectedCategory: foundCategory
        ? { value: foundCategory.id, label: foundCategory.categorieName }
        : null,

      quantity: item.quantity,
      purchasePrice: item.purchase_Price,
      salePrice: item.sale_Price,
      isStoreOwned: item.isStoreOwned,

      _productNames: productNameOptions,
      _types: typeOptions,
      _categories: categoryOptions,
    });
    setOpen(true);
  };

  // ── SAVE ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.selectedProductName) return showToast("اختر اسم المنتج", "error");

    const payload = {
      productName: form.selectedProductName.value,
      type_ID: form.selectedType?.value ?? null,
      category_ID: form.selectedCategory?.value ?? null,
      quantity: Number(form.quantity),
      purchase_Price: Number(form.purchasePrice),
      sale_Price: Number(form.salePrice),
      isStoreOwned: form.isStoreOwned,
    };

    try {
      let res;
      if (editItem) {
        res = await updateProduct(editItem.id, payload);
      } else {
        res = await createProduct(payload);
      }
      showToast(res.message || "تم الحفظ بنجاح");
      setOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  // ── DELETE ─────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteProduct(deleteTarget.id);
      showToast(res.message || "تم الحذف");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  const hasActiveFilters =
    filters.NameProduct ||
    filters.TypeName ||
    filters.CategorieName ||
    filters.OrderByLowestQuantity;

  const activeFilterCount = [
    filters.NameProduct,
    filters.TypeName,
    filters.CategorieName,
    filters.OrderByLowestQuantity,
  ].filter(Boolean).length;

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <DashboardLayout title="إدارة المنتجات">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            إدارة المنتجات
          </h1>
          <p className="text-[var(--color-text-light)] mt-1">
            إضافة وتعديل وحذف المنتجات بسهولة
          </p>
        </div>
        <button
          onClick={openCreate}
          className="
            flex items-center gap-2
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
            text-white px-5 py-3 rounded-2xl text-sm font-medium
            transition-all shadow-lg shadow-[var(--color-primary)]/30 active:scale-95
          "
        >
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      {/* FILTERS */}
      <div className="mb-6 bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        {/* Filter Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-hover)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <SlidersHorizontal
                size={15}
                className="text-[var(--color-primary)]"
              />
            </div>
            <div>
              <span className="text-sm font-semibold text-[var(--color-text)]">
                فلترة المنتجات
              </span>
              {activeFilterCount > 0 && (
                <span className="mr-2 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {activeFilterCount} فعّال
                </span>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                const reset = {
                  NameProduct: "",
                  TypeName: "",
                  CategorieName: "",
                  OrderByLowestQuantity: false,
                };
                setFilters(reset);
                fetchData();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition-all"
            >
              <X size={12} />
              مسح الكل
            </button>
          )}
        </div>

        {/* Filter Inputs */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div className="group">
              <label className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide">
                <Search size={11} className="text-[var(--color-primary)]" />
                اسم المنتج
              </label>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  value={filters.NameProduct}
                  onChange={(e) => updateFilter("NameProduct", e.target.value)}
                  placeholder="ابحث باسم المنتج..."
                  className="w-full h-11 pr-9 pl-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm bg-[var(--color-hover)] focus:bg-white focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-gray-400"
                />
                {filters.NameProduct && (
                  <button
                    onClick={() => updateFilter("NameProduct", "")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <X size={9} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* TYPE */}
            <div className="group">
              <label className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide">
                <Tag size={11} className="text-[var(--color-primary)]" />
                النوع
              </label>
              <div className="relative">
                <Tag
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  value={filters.TypeName}
                  onChange={(e) => updateFilter("TypeName", e.target.value)}
                  placeholder="ابحث بالنوع..."
                  className="w-full h-11 pr-9 pl-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm bg-[var(--color-hover)] focus:bg-white focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-gray-400"
                />
                {filters.TypeName && (
                  <button
                    onClick={() => updateFilter("TypeName", "")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <X size={9} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="group">
              <label className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-[var(--color-text)] uppercase tracking-wide">
                <Layers size={11} className="text-[var(--color-primary)]" />
                التصنيف
              </label>
              <div className="relative">
                <Layers
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  value={filters.CategorieName}
                  onChange={(e) =>
                    updateFilter("CategorieName", e.target.value)
                  }
                  placeholder="ابحث بالتصنيف..."
                  className="w-full h-11 pr-9 pl-4 rounded-2xl border-2 border-[var(--color-border)] outline-none text-sm bg-[var(--color-hover)] focus:bg-white focus:border-[var(--color-primary)] transition-all duration-200 placeholder:text-gray-400"
                />
                {filters.CategorieName && (
                  <button
                    onClick={() => updateFilter("CategorieName", "")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    <X size={9} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
              <span className="text-xs text-[var(--color-text-light)]">
                الفلاتر النشطة:
              </span>
              {filters.OrderByLowestQuantity && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  أقل كمية
                  <button
                    onClick={() => updateFilter("OrderByLowestQuantity", false)}
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
              {filters.NameProduct && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <Search size={10} />
                  {filters.NameProduct}
                  <button onClick={() => updateFilter("NameProduct", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {filters.TypeName && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <Tag size={10} />
                  {filters.TypeName}
                  <button onClick={() => updateFilter("TypeName", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {filters.CategorieName && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <Layers size={10} />
                  {filters.CategorieName}
                  <button onClick={() => updateFilter("CategorieName", "")}>
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ORDER BY LOWEST QUANTITY */}
      <div className="mt-2 mr-auto ml-auto mb-5">
        <button
          type="button"
          onClick={() =>
            updateFilter(
              "OrderByLowestQuantity",
              !filters.OrderByLowestQuantity,
            )
          }
          className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-200
            ${
              filters.OrderByLowestQuantity
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20"
                : "bg-[var(--color-hover)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
            }
          `}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center border ${filters.OrderByLowestQuantity ? "bg-white text-[var(--color-primary)] border-white" : "border-gray-300"}`}
          >
            {filters.OrderByLowestQuantity && "✓"}
          </div>
          <span className="font-medium">ترتيب حسب أقل كمية</span>
        </button>
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
                  النوع
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  التصنيف
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  الكمية
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر البيع
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  سعر التكلفة
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  المالك
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
                    {[...Array(9)].map((__, j) => (
                      <td key={j} className="p-4">
                        <div className="w-24 h-4 rounded bg-gray-100 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <Package size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-[var(--color-text-light)] text-sm">
                      لا توجد منتجات بعد
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-all duration-150"
                    style={{ animation: `fadeUp 0.3s ${index * 0.04}s both` }}
                  >
                    <td className="p-4 text-[var(--color-text)]">#{item.id}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-hover)] flex items-center justify-center border border-[var(--color-border)]">
                          <Package
                            size={17}
                            className="text-[var(--color-primary)]"
                          />
                        </div>
                        <span className="font-medium text-[var(--color-text)]">
                          {item.productName}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-[var(--color-text)]">
                      {item.typeName}
                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                      {item.categorieName || "—"}
                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                  {formatMoney(item.sale_Price)}               

                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                  {formatMoney(item.purchase_Price)}                 

                    </td>
                    <td className="p-4 text-[var(--color-text)]">
                      {item.isStoreOwned ? "نعم" : "لا"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          title="تعديل"
                          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 hover:scale-110 flex items-center justify-center transition-all duration-150"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(item);
                            setDeleteOpen(true);
                          }}
                          title="حذف"
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 flex items-center justify-center transition-all duration-150"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        editItem={editItem}
        form={form}
        setForm={setForm}
      />

      <DeleteModal
        open={deleteOpen}
        itemName={deleteTarget?.productName}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
}
