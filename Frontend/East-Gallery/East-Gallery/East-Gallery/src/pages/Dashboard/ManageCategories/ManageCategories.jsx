// pages/dashboard/categories/CategoriesManagement.jsx

import DashboardLayout from "../../../components/layout/DashboardLayout";
import { Plus, Pencil, Trash2, Shapes, X } from "lucide-react";

import { useEffect, useState, useRef } from "react";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/categoriesService";

import { getAllTypes } from "../../../api/typeService";

import { useToast } from "../../../context/ToastContext";
import DeleteModal from "../../../components/componentShareds/DeleteModal";
import Select from "react-select";

// ───────────── MODAL ─────────────
function FormModal({
  open,
  editItem,
  categoryName,
  selectedType,
  types,
  onChangeName,
  onChangeType,
  onSave,
  onClose,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

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
          bg-white w-full max-w-md rounded-3xl p-7
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
              <Shapes size={20} className="text-[var(--color-primary)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {editItem ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
            </h2>

            <p className="text-sm text-[var(--color-text-light)] mt-1">
              قم بإدخال بيانات التصنيف
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              اسم التصنيف
            </label>

            <input
              ref={inputRef}
              type="text"
              value={categoryName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="مثال: سيارات، موبايلات..."
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

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
              النوع
            </label>

            <Select
              options={types.map((type) => ({
                value: type.id,
                label: type.typeName,
              }))}
              value={
                selectedType
                  ? {
                      value: selectedType,
                      label:
                        types.find((t) => t.id == selectedType)?.typeName || "",
                    }
                  : null
              }
              onChange={(selected) => onChangeType(selected?.value || "")}
              placeholder="اختر النوع"
              isSearchable
              className="text-sm"
              styles={{
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
                  backgroundColor: state.isFocused
                    ? "var(--color-hover)"
                    : "white",
                  color: "var(--color-text)",
                  padding: "12px",
                  cursor: "pointer",
                }),
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="
              flex-1 h-12 rounded-2xl
              bg-[var(--color-primary)]
              hover:bg-[var(--color-primary-hover)]
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

// ───────────── PAGE ─────────────
export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { showToast } = useToast();

  // GET ALL
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getAllCategories();

      setCategories(data.data);
    } catch {
      showToast("فشل تحميل التصنيفات", "error");
    } finally {
      setLoading(false);
    }
  };

  // GET TYPES
  const fetchTypes = async () => {
    try {
      const data = await getAllTypes();
      setTypes(data.data);
    } catch {
      showToast("فشل تحميل الأنواع", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  // CREATE
  const handleOpenCreate = () => {
    setEditItem(null);
    setCategoryName("");
    setSelectedType("");
    setFormOpen(true);
  };

  // EDIT
  const handleOpenEdit = (item) => {
    setEditItem(item);

    setCategoryName(item.categorieName);

    const foundType = types.find((t) => t.typeName === item.typeName);

    setSelectedType(foundType?.id || "");

    setFormOpen(true);
  };

  // SAVE
  const handleSave = async () => {
    if (!categoryName.trim()) return showToast("اسم التصنيف مطلوب", "error");

    if (!selectedType) return showToast("اختر النوع", "error");

    try {
      let res;

      const payload = {
        categorieName: categoryName,
        type_ID: Number(selectedType),
      };

      if (editItem) {
        res = await updateCategory(editItem.id, {
          id: editItem.id,
          ...payload,
        });
      } else {
        res = await createCategory(payload);
      }

      showToast(res.message);

      setFormOpen(false);

      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  // DELETE
  const handleOpenDelete = (item) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await deleteCategory(deleteTarget.id);

      showToast(res.message);

      setDeleteOpen(false);
      setCategories("");
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || "حدث خطأ", "error");
    }
  };

  return (
    <DashboardLayout title="إدارة التصنيفات">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            إدارة التصنيفات
          </h1>

          <p className="text-[var(--color-text-light)] mt-1">
            إضافة وتعديل وحذف التصنيفات بسهولة
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="
            flex items-center gap-2
            bg-[var(--color-primary)]
            hover:bg-[var(--color-primary-hover)]
            text-white
            px-5 py-3 rounded-2xl text-sm font-medium
            transition-all shadow-lg
            shadow-[var(--color-primary)]/30
            active:scale-95
          "
        >
          <Plus size={18} />
          إضافة تصنيف
        </button>
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
                  التصنيف
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)]">
                  النوع
                </th>

                <th className="p-4 text-sm font-semibold text-[var(--color-text-light)] w-28">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td className="p-4">
                      <div className="w-6 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gray-100 animate-pulse" />
                        <div className="w-32 h-4 rounded bg-gray-100 animate-pulse" />
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="w-24 h-4 rounded bg-gray-100 animate-pulse" />
                    </td>

                    <td className="p-4">
                      <div className="w-20 h-8 rounded-xl bg-gray-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <Shapes size={40} className="text-gray-200 mx-auto mb-3" />

                    <p className="text-[var(--color-text-light)] text-sm">
                      لا توجد تصنيفات بعد
                    </p>
                  </td>
                </tr>
              ) : (
                categories.map((item, index) => (
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
                          <Shapes
                            size={17}
                            className="text-[var(--color-primary)]"
                          />
                        </div>

                        <span className="font-medium text-[var(--color-text)]">
                          {item.categorieName}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-[var(--color-text)]">
                        {item.typeName}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="تعديل"
                          className="
                            w-9 h-9 rounded-xl
                            bg-blue-50 text-blue-500
                            hover:bg-blue-100 hover:scale-110
                            flex items-center justify-center
                            transition-all duration-150
                          "
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(item)}
                          title="حذف"
                          className="
                            w-9 h-9 rounded-xl
                            bg-red-50 text-red-500
                            hover:bg-red-100 hover:scale-110
                            flex items-center justify-center
                            transition-all duration-150
                          "
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
        open={formOpen}
        editItem={editItem}
        categoryName={categoryName}
        selectedType={selectedType}
        types={types}
        onChangeName={setCategoryName}
        onChangeType={setSelectedType}
        onSave={handleSave}
        onClose={() => setFormOpen(false)}
      />

      <DeleteModal
        open={deleteOpen}
        itemName={deleteTarget?.categorieName}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
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
