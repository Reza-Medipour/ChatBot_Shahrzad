import { ChevronRight, X } from "lucide-react";

interface AppHeaderProps {
  title: string;
  onRightAction?: () => void;
  rightIcon?: "arrow" | "close";
}

export default function AppHeader({
  title,
  onRightAction,
  rightIcon = "arrow",
}: AppHeaderProps) {
  return (
    <div
      className="
        relative
        bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]
        flex items-center justify-center
        px-4
      "
      style={{
        height: 72,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      {onRightAction && (
        <button
          onClick={onRightAction}
          className="absolute right-4 text-white"
          aria-label="action"
        >
          {rightIcon === "close" ? <X size={22} /> : <ChevronRight size={22} />}
        </button>
      )}

      <span className="text-white font-bold text-base">
        {title}
      </span>
    </div>
  );
}