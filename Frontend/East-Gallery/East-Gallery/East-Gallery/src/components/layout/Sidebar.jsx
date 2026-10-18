import {
  LayoutDashboard,
  Shapes,
  Wallet,
  FolderTree,
  Package,
  FilePlus2,
  RotateCcw,
  Tags,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useSidebar } from "./SidebarContext";

const NAV_ITEMS = [
  {
    section: "لوحة التحكم",
    items: [
      {
        label: "التقارير",
        icon: LayoutDashboard,
        path: "/",
      },
    ],
  },

  {
    section: "العمليات",
    items: [
      {
        label: "الأنواع",
        icon: Shapes,
        path: "/dashboard/manage-types",
      },
      {
        label: "التصنيفات",
        icon: FolderTree,
        path: "/dashboard/manage-categories",
      },
      {
        label: "أسماء المنتجات",
        icon: Tags,
        path: "/dashboard/manage-name-products",
      },
      {
        label: "المنتجات",
        icon: Package,
        path: "/dashboard/manage-products",
      },
      {
        label: "المصاريف",
        icon: Wallet,
        path: "/dashboard/manage-expenses",
      },
      {
        label: "المرتجعات",
        icon: RotateCcw,
        path: "/dashboard/display-invoice-returns",
      },
      {
        label: "فاتورة جديدة",
        icon: FilePlus2,
        path: "/dashboard/create-invoices",
      },
      {
        label: "سجل الفواتير",
        icon: FilePlus2,
        path: "/dashboard/view-invoices",
      },
      {
        label: "تقرير المبيعات ",
        icon: Package,
        path: "/dashboard/view-sales",
      },
    ],
  },
];

export default function Sidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={`
        fixed top-0 right-0 h-screen z-20
        flex flex-col
        bg-[var(--color-sidebar)]
        backdrop-blur-xl
        border-l border-[var(--color-border)]
        transition-all duration-300
        shadow-lg
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Logo */}
      <div className="h-16 shrink-0 flex items-center px-6 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] shadow-md flex items-center justify-center">
          <LayoutDashboard size={18} className="text-white" />
        </div>

        {!isCollapsed && (
          <span className="mr-3 font-bold text-[var(--color-text)]">
            لوحة التحكم
          </span>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.section} className="mb-7">
            {!isCollapsed && (
              <p className="px-3 mb-3 text-xs font-semibold tracking-wide uppercase text-[var(--color-text-light)]">
                {group.section}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3
                      px-4 py-3
                      rounded-2xl
                      transition-all duration-200
                      ${
                        isActive
                          ? `
                            bg-[var(--color-hover)]
                            text-[var(--color-primary)]
                            border border-[#d1fae5]
                            shadow-sm
                            font-semibold
                          `
                          : `
                            text-[var(--color-text-light)]
                            hover:bg-[var(--color-hover)]
                            hover:text-[var(--color-primary)]
                          `
                      }
                    `}
                  >
                    <Icon size={20} className="shrink-0 text-inherit" />

                    {!isCollapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Scrollbar Style */}
      <style>{`
        nav::-webkit-scrollbar {
          width: 6px;
        }

        nav::-webkit-scrollbar-track {
          background: transparent;
        }

        nav::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 9999px;
        }

        nav::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </aside>
  );
}
