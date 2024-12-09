import React from "react";

const Pagination = ({
  totalOrders,
  ordersPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            page === currentPage
              ? "bg-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
