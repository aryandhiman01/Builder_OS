"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MoreVertical,
  ChevronRight,
} from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick?: () => void;
  children?: ActionMenuItem[];
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

export default function ActionMenu({
  items,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  const [activeSubmenu, setActiveSubmenu] =
    useState<string | null>(null);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function toggleSubmenu(label: string) {
    setActiveSubmenu((prev) =>
      prev === label ? null : label
    );
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => {
          setOpen((prev) => !prev);

          if (open) {
            setActiveSubmenu(null);
          }
        }}
        className="
        rounded-xl
        p-2
        text-zinc-500
        transition
        hover:bg-white/5
        hover:text-white
        "
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          className="
          absolute
          right-0
          top-11
          z-50
          w-60
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#111111]
          shadow-2xl
          "
        >
          {items.map((item) => (
            <div
              key={item.label}
              className="relative"
            >
              <button
                onClick={() => {
                  if (item.children) {
                    toggleSubmenu(item.label);
                  } else {
                    item.onClick?.();
                    setOpen(false);
                    setActiveSubmenu(null);
                  }
                }}
                className={`
                flex
                w-full
                items-center
                justify-between
                px-4
                py-3
                text-sm
                transition

                ${
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}

                  {item.label}
                </div>

                {item.children && (
                  <ChevronRight
                    size={15}
                    className={`
                      transition-transform duration-200
                      ${activeSubmenu === item.label ? "rotate-90" : ""}
                    `}
                  />
                )}
              </button>

              {item.children &&
                activeSubmenu === item.label && (
                  <div
                    className="
                    border-t
                    border-white/5
                    bg-[#0d0d0d]
                    "
                  >
                    {item.children.map(
                      (child) => (
                        <button
                          key={child.label}
                          onClick={() => {
                            child.onClick?.();
                            setOpen(false);
                            setActiveSubmenu(null);
                          }}
                          className={`
                          flex
                          w-full
                          items-center
                          gap-3
                          px-6
                          py-2.5
                          text-sm
                          transition

                          ${
                            child.danger
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }
                          `}
                        >
                          {child.icon}
                          {child.label}
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}