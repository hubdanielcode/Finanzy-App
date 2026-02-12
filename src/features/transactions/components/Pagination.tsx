import { useContext, useEffect, useRef, useState } from "react";
import { TransactionContext } from "..";
import { PageLimitOptions } from "../model/PaginationDropdownOptions";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  pages,
  itemsPerPage,
  setItemsPerPage,
}) => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "TransactionContext must be used within a TransactionProvider",
    );
  }
  const { transactions } = context;

  const [isPageLimitDropdownOpen, setIsPageLimitDropdownOpen] = useState(false);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSetPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const PageLimitDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickAnywhere = (event: MouseEvent) => {
      if (
        PageLimitDropdownRef.current &&
        !PageLimitDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPageLimitDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickAnywhere);
    };
  }, [isPageLimitDropdownOpen]);
  return (
    <div className="relative bg-white border border-gray-500/50 px-4 py-3 my-6 rounded-lg flex w-80 sm:w-202">
      <div className="flex flex-col gap-5">
        <p className="text-xs sm:text-sm text-black pt-3">
          Mostrando
          <span className="font-bold"> {startIndex + 1} - </span>
          <span className="font-bold"> {endIndex} </span>
          <span>de </span>
          <span className="font-bold">{transactions.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <p className="flex font-semibold whitespace-nowrap text-xs sm:text-sm text-gray-700">
            Itens por página:
          </p>

          {/* - Dropdown - */}

          <div
            className="relative w-10 h-8 sm:w-12 sm:h-10"
            ref={PageLimitDropdownRef}
          >
            <div
              className={`absolute left-0 top-0 flex items-center overflow-x-hidden border border-gray-500/50 rounded-lg bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out text-gray-700 ${isPageLimitDropdownOpen ? " w-fit shadow-lg z-1" : " w-fit shadow-sm z-1"}`}
              onClick={() => setIsPageLimitDropdownOpen((prev) => !prev)}
            >
              {PageLimitOptions.filter(
                (option) => isPageLimitDropdownOpen || option === itemsPerPage,
              ).map((option) => (
                <div
                  className="flex items-center justify-center w-10 h-8 text-sm transition-colors border-r border-gray-500/50 last:border-none hover:text-blue-600 hover:bg-blue-200"
                  key={option}
                  onClick={(e) => {
                    if (!isPageLimitDropdownOpen) return;
                    e.stopPropagation();
                    setItemsPerPage(option);
                    setIsPageLimitDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* - Botões - */}

      <div className="flex flex-1 gap-2 justify-center items-center">
        <button
          className=" p-1 sm:p-2 rounded-lg border border-gray-500/50 bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors h-8 sm:h-12 w-6 sm:w-8 flex items-center justify-center cursor-pointer"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>

        {pages.map((page) => (
          <button
            className={`cursor-pointer flex items-center justify-center h-8 sm:h-12 w-6 sm:w-8 px-3 py-2 rounded-lg font-medium transition-colors
              ${
                currentPage === page
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }
            `}
            key={page}
            onClick={() => handleSetPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className=" p-1 sm:p-2 rounded-lg border border-gray-500/50 bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500  text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors h-8 sm:h-12 w-6 sm:w-8 flex items-center justify-center cursor-pointer"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export { Pagination };
