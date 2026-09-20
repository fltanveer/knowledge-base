import { ReactNode } from "react";

type Props = {
  type: "info" | "tip" | "warning" | "danger" | "quote";
  title?: string;
  children: ReactNode;
};

const styles: Record<Props["type"], { bg: string; border: string; icon: string; text: string }> = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: "ℹ️",
    text: "text-blue-900 dark:text-blue-100",
  },
  tip: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    icon: "💡",
    text: "text-green-900 dark:text-green-100",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    icon: "⚠️",
    text: "text-amber-900 dark:text-amber-100",
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    icon: "🚨",
    text: "text-red-900 dark:text-red-100",
  },
  quote: {
    bg: "bg-gray-50 dark:bg-gray-900/50",
    border: "border-gray-300 dark:border-gray-600",
    icon: "💬",
    text: "text-gray-800 dark:text-gray-200",
  },
};

export function Callout({ type, title, children }: Props) {
  const s = styles[type];

  return (
    <aside className={`my-6 rounded-lg border-l-4 p-4 ${s.bg} ${s.border} ${s.text}`}>
      {title && (
        <p className="mb-2 font-semibold">
          <span className="mr-2">{s.icon}</span>
          {title}
        </p>
      )}
      <div className={`prose-sm ${type === "quote" ? "italic" : ""}`}>{children}</div>
    </aside>
  );
}
