import { ChevronLeft, ChevronRight } from "lucide-react";
import { Meta } from "../types/UserTypes";

type PaginationProps = {
  meta: Meta;
  onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = meta;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btnBase =
    "p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t text-sm text-gray-600">
      <p>
        Showing <span className="font-medium">{from}</span> to{" "}
        <span className="font-medium">{to}</span> of{" "}
        <span className="font-medium">{total}</span> users
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={btnBase}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
              num === page
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={btnBase}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
