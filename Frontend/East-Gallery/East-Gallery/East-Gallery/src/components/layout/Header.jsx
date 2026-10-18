import { useSidebar } from "./SidebarContext";

export default function Header({ title }) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <header
      className="
        fixed top-0 h-16
        bg-[var(--color-header)]
        backdrop-blur-xl
        border-b border-[var(--color-border)]
        flex items-center px-6
        z-10
      "
      style={{
        right: isCollapsed ? "4rem" : "15rem",
        left: 0,
      }}
    >
      <div className="flex-1" />
    </header>
  );
}
