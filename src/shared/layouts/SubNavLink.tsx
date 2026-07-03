import { usePlanModule } from "@features/auth/hooks/usePlanModule";
import { getMenuKeyFromPath } from "@shared/layouts/nav.config";
import { SubNavItem } from "@shared/types/nav";
import { Lock } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

export interface SubNavLinkProps {
  item: SubNavItem;
  onClose: () => void;
}

export const SubNavLink: React.FC<SubNavLinkProps> = ({ item, onClose }) => {
  const { to, label, icon: Icon, description } = item;
  const itemKey = getMenuKeyFromPath(to);
  const { isLocked, isReadOnly } = usePlanModule(itemKey);

  return (
    <li>
      <NavLink
        to={to}
        end
        onClick={onClose}
        className={({ isActive }) =>
          `group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-primary/10 to-transparent"
              : "hover:bg-gradient-to-r hover:from-base-content/5 hover:to-transparent"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={20}
              className={`shrink-0 transition-colors duration-300 ${
                isActive
                  ? "text-primary"
                  : "text-base-content/40 group-hover:text-base-content/80"
              }`}
            />
            <div className="flex flex-col gap-0.5">
              <span
                className={`text-[14px] font-semibold transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? "text-primary"
                    : "text-base-content/80 group-hover:text-base-content/95"
                }`}
              >
                {label}
                {isLocked && (
                  <Lock size={12} className="text-warning shrink-0" />
                )}
                {isReadOnly && (
                  <span className="badge badge-warning badge-outline text-[9px] h-4 font-extrabold uppercase shrink-0">
                    Solo Lectura
                  </span>
                )}
              </span>
              {description && (
                <p
                  className={`text-[11px] leading-snug transition-colors duration-300 ${
                    isActive
                      ? "text-primary/60"
                      : "text-base-content/40 group-hover:text-base-content/60"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </NavLink>
    </li>
  );
};
