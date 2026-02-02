import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/anamnese", label: "Anamnese", icon: ClipboardList },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function NavSidebar() {
  const location = useLocation();

  return (
    <nav className="vyr-card-graphite p-3 flex flex-col gap-1.5 h-fit">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium font-mono transition-all
              ${isActive 
                ? 'bg-vyr-accent/15 text-vyr-white border border-vyr-accent/30' 
                : 'text-vyr-gray-300 hover:text-vyr-white hover:bg-vyr-graphite/50 border border-transparent'}
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-vyr-accent vyr-icon-glow' : 'text-vyr-gray-400'}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
