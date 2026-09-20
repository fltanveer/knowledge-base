import { ReactNode } from "react";

type Props = {
  columns: "2" | "3" | "4";
  gap: "sm" | "md" | "lg";
  children: ReactNode;
};

const gapClasses = { sm: "gap-2", md: "gap-4", lg: "gap-6" };
const colClasses = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export function ImageGallery({ columns, gap, children }: Props) {
  return (
    <div className={`my-8 grid ${colClasses[columns]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}
