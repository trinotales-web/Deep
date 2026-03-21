"use client";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {categories.map((category) => {
        const isActive = category === active;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`rounded-full px-5 py-2 text-[13px] font-body transition-colors ${
              isActive
                ? "bg-site-dark text-white font-semibold"
                : "bg-transparent border-[1.5px] border-site-border text-site-secondary font-medium hover:border-site-muted"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
