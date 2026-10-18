import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllProductNames,
  createProductName,
  updateProductName,
  deleteProductName,
} from "../../../api/productNameService";
import { useToast } from "../../../context/ToastContext";
import DeleteModal from "../../../components/componentShareds/DeleteModal";

// ─────────────────────────────────────────────
// INITIAL FORM
// ─────────────────────────────────────────────

const EMPTY_FORM = { productName: "" };

// ─────────────────────────────────────────────
// FORM MODAL
// ─────────────────────────────────────────────

function FormModal({ open, onClose, onSave, editItem, form, setForm }) {
  return (
    <div
      className={`
        fixed inset-0 z-[150]
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        transition-all duration-300
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`
          bg-white w-full max-w-xl rounded-3xl p-7
          border border-[var(--color-border)]
          shadow-2xl transition-all duration-300
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
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
              <Package size={20} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {editItem ? "تعديل اسم المنتج" : "إضافة اسم منتج"}
            </h2>
            <p className="text-sm text-[var(--color-text-light)] mt-1">
              أدخل اسم المنتج
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="mb-7">
          <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
            اسم المنتج
          </label>
          <input
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            placeholder="مثال : شامبو"
            className="
              w-full h-12 px-4 rounded-2xl
              border-2 border-[var(--color-border)]
              outline-none text-sm
              focus:border-[var(--color-primary)]
              transition-colors placeholder:text-gray-400
            "
          />
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="
              flex-1 h-12 rounded-2xl
              bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
              text-white font-medium transition-all active:scale-95
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

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function ProductNamesManagement() {
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  // ── FETCH ──────────────────────────────────

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllProductNames();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── CREATE ─────────────────────────────────

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  // ── EDIT ───────────────────────────────────

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ productName: item.productName });
    setOpen(true);
  };

  // ── SAVE ───────────────────────────────────

  const handleSave = async () => {
    if (!form.productName.trim()) {
      return showToast("اسم المنتج مطلوب", "error");
    }
    try {
      let res;
      if (editItem) {
        // UPDATE — يبعث اسم المنتج الجديد فقط كما يتوقع السيرفس
        res = await updateProductName(editItem.productNameID, form.productName);
      } else {
        // CREATE — يبعث اسم المنتج فقط كما يتوقع السيرفس
        res = await createProductName(form.productName);
      }
      showToast(res.message || "تم الحفظ بنجاح");
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  // ── DELETE ─────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteProductName(deleteTarget.productNameID);
      showToast(res.message || "تم الحذف");
      setDeleteOpen(false);
      setDeleteTarget(null);
      setItems([]);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  // ── SEARCH ─────────────────────────────────

  const filteredItems = items.filter((item) =>
    item.productName?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── RENDER ─────────────────────────────────

  return (
    <DashboardLayout title="إدارة أسماء المنتجات">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            إدارة أسماء المنتجات
          </h1>
          <p className="text-[var(--color-text-light)] mt-1">
            إضافة وتعديل وحذف أسماء المنتجات
          </p>
        </div>
        <button
          onClick={openCreate}
          className="
            flex items-center gap-2
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
            text-white px-5 py-3 rounded-2xl text-sm font-medium
            transition-all shadow-lg shadow-[var(--color-primary)]/25 active:scale-95
          "
        >
          <Plus size={18} />
          إضافة اسم منتج
        </button>
      </div>

      {/* ── SEARCH CARD ── */}
      <div className="mb-6 bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-hover)] border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <SlidersHorizontal
                size={15}
                className="text-[var(--color-primary)]"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">البحث</p>
              {search && (
                <p className="text-xs text-[var(--color-text-light)]">
                  يوجد فلتر نشط
                </p>
              )}
            </div>
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs transition-all"
            >
              <X size={12} />
              مسح البحث
            </button>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="relative">
            <Search
              size={17}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المنتج..."
              className="
                w-full h-12 pr-11 pl-10 rounded-2xl
                border-2 border-[var(--color-border)]
                outline-none text-sm
                focus:border-[var(--color-primary)] transition-all
              "
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-hover)]">
              <tr className="text-right">
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-20">
                  #
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  اسم المنتج
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-40">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING SKELETON */}
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="p-4">
                      <div className="w-10 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="w-48 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="w-24 h-8 rounded-xl bg-gray-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                /* EMPTY STATE */
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <Package size={42} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-[var(--color-text-light)]">
                      {search ? "لا توجد نتائج للبحث" : "لا توجد أسماء منتجات"}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-3 text-sm text-[var(--color-primary)] hover:underline"
                      >
                        مسح البحث
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                /* DATA ROWS */
                filteredItems.map((item, index) => (
                  <tr
                    key={item.productNameID}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-all duration-150"
                    style={{ animation: `fadeUp .3s ${index * 0.04}s both` }}
                  >
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-xs">
                        {item.productNameID}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-hover)] border border-[var(--color-border)] flex items-center justify-center">
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

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          title="تعديل"
                          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 hover:scale-110 transition-all flex items-center justify-center"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(item);
                            setDeleteOpen(true);
                          }}
                          title="حذف"
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 transition-all flex items-center justify-center"
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

      {/* ── MODALS ── */}
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
