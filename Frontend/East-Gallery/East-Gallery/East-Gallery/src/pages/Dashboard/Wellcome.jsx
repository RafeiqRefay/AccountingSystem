import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Rocket,
} from "lucide-react";

export default function Wellcome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <DashboardLayout title="لوحة التحكم">
      <div
        className={`
          relative overflow-hidden
          bg-white border border-[var(--color-border)]
          rounded-3xl p-8 mb-8
          transition-all duration-700 ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        {/* خلفية جميلة (Glow) */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[var(--color-primary)]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-400/10 blur-3xl rounded-full" />

        <div className="relative">
          {/* العنوان */}
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="text-[var(--color-primary)]" size={20} />
            <span className="text-sm text-[var(--color-text-light)]">
              نظام إدارة متكامل
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            أهلاً بك 👋 في لوحة التحكم
          </h1>

          <p className="text-[var(--color-text-light)] mt-2 leading-relaxed max-w-2xl">
            هذا النظام مخصص لإدارة المنتجات والمبيعات والطلبات والمستخدمين
            وتحليل البيانات بشكل احترافي وسهل الاستخدام.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3 bg-[var(--color-hover)] p-3 rounded-2xl">
              <Package className="text-[var(--color-primary)]" size={18} />
              <span className="text-sm text-[var(--color-text)]">
                إدارة المنتجات
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-hover)] p-3 rounded-2xl">
              <ShoppingCart className="text-[var(--color-primary)]" size={18} />
              <span className="text-sm text-[var(--color-text)]">
                المبيعات والطلبات
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-hover)] p-3 rounded-2xl">
              <Users className="text-[var(--color-primary)]" size={18} />
              <span className="text-sm text-[var(--color-text)]">
                المستخدمين
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-hover)] p-3 rounded-2xl">
              <BarChart3 className="text-[var(--color-primary)]" size={18} />
              <span className="text-sm text-[var(--color-text)]">
                التحليلات
              </span>
            </div>
          </div>

          {/* badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-medium shadow-md shadow-[var(--color-primary)]/20">
            <Sparkles size={16} />
            لوحة ذكية لإدارة أعمالك بكفاءة
          </div>
        </div>
      </div>

      {/* (اختياري) مساحة تحت */}
      <div className="text-sm text-[var(--color-text-light)]">
        اختر قسم من القائمة للبدء بإدارة النظام
      </div>
    </DashboardLayout>
  );
}
