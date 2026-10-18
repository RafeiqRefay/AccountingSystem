import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wallet, X } from "lucide-react";

import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../../api/expensessService";

import { useToast } from "../../../context/ToastContext";
import DeleteModal from "../../../components/componentShareds/DeleteModal";

// ───────────── MODAL ─────────────
function FormModal({
  open,
  editItem,
  amount,
  description,
  onChangeAmount,
  onChangeDesc,
  onSave,
  onClose,
}) {
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
          bg-white w-full max-w-md rounded-3xl p-7
          border border-[var(--color-border)]
          shadow-2xl
          transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="w-10 h-10 rounded-2xl mb-3 bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Wallet size={20} className="text-[var(--color-primary)]" />
            </div>

            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {editItem ? "تعديل مصروف" : "إضافة مصروف"}
            </h2>

            <p className="text-sm text-[var(--color-text-light)] mt-1">
              أدخل بيانات المصروف
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <input
            className="
              w-full h-12 px-4 rounded-2xl
              border-2 border-[var(--color-border)]
              focus:border-[var(--color-primary)]
              outline-none
              transition-all
              text-sm
            "
            placeholder="المبلغ"
            value={amount}
            onChange={(e) => onChangeAmount(e.target.value)}
          />

          <input
            className="
              w-full h-12 px-4 rounded-2xl
              border-2 border-[var(--color-border)]
              focus:border-[var(--color-primary)]
              outline-none
              transition-all
              text-sm
            "
            placeholder="الوصف"
            value={description}
            onChange={(e) => onChangeDesc(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="
              flex-1 h-12 rounded-2xl
              bg-[var(--color-primary)]
              hover:bg-[var(--color-primary-hover)]
              text-white font-medium
              transition-all active:scale-95
            "
          >
            {editItem ? "حفظ التعديل" : "إضافة"}
          </button>

          <button
            onClick={onClose}
            className="
              flex-1 h-12 rounded-2xl
              border border-[var(--color-border)]
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
export default function ExpensesManagement() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { showToast } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getAllExpenses();
      setExpenses(data.data);
    } catch {
      showToast("فشل تحميل المصاريف", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setAmount("");
    setDescription("");
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setAmount(item.amount);
    setDescription(item.description);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      let res;

      if (editItem) {
        res = await updateExpense(editItem.id, {
          id: editItem.id,
          amount,
          description,
          date: editItem.date,
        });
      } else {
        res = await createExpense({ amount, description });
      }

      showToast(res.message);
      setOpen(false);
      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "خطأ", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteExpense(deleteTarget.id);
      showToast(res.message);
      setDeleteOpen(false);

      const updated = expenses.filter((e) => e.id !== deleteTarget.id);
      setExpenses(updated);

      fetchExpenses();
    } catch (err) {
      showToast(err.response?.data?.message || "خطأ", "error");
    }
  };

  return (
    <DashboardLayout title="إدارة المصاريف">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            إدارة المصاريف
          </h1>
          <p className="text-[var(--color-text-light)] mt-1">
            إضافة وتعديل وحذف المصاريف
          </p>
        </div>

        <button
          onClick={openCreate}
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
          إضافة مصروف
        </button>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-[var(--color-hover)]">
            <tr className="text-right">
              <th className="p-4 text-sm text-[var(--color-text-light)]">
                المبلغ
              </th>
              <th className="p-4 text-sm text-[var(--color-text-light)]">
                الوصف
              </th>
              <th className="p-4 text-sm text-[var(--color-text-light)] w-28">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4">...</td>
                </tr>
              ))
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-16 text-gray-400">
                  لا يوجد مصاريف
                </td>
              </tr>
            ) : (
              expenses.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-all"
                >
                  <td className="p-4 font-medium text-[var(--color-text)]">
                    {item.amount}{" "}
                    <span style={{ color: "var(--color-primary)" }}>ل.س</span>
                  </td>

                  <td className="p-4 text-[var(--color-text)]">
                    {item.description}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 hover:scale-110 flex items-center justify-center transition-all"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteTarget(item);
                          setDeleteOpen(true);
                        }}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 flex items-center justify-center transition-all"
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

      <FormModal
        open={open}
        editItem={editItem}
        amount={amount}
        description={description}
        onChangeAmount={setAmount}
        onChangeDesc={setDescription}
        onSave={handleSave}
        onClose={() => setOpen(false)}
      />

      <DeleteModal
        open={deleteOpen}
        itemName={deleteTarget?.description}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </DashboardLayout>
  );
}
