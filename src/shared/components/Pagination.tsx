import { useEffect, useRef, useState } from "react";
import { pageLimitOptions } from "@/features/transactions/utils/paginationDropdownOptions";
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
  pages,
  itemsPerPage,
  setItemsPerPage,
}) => {
  /* - Estados de dropdown de page limit - */

  const [isPageLimitDropdownOpen, setIsPageLimitDropdownOpen] =
    useState<boolean>(false);

  /* - Definições - */

  const PageLimitDropdownRef = useRef<HTMLDivElement>(null);

  /* - Funções - */

  // 1. Passa para a próxima página ao clicar no botão

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 2. Volta para a página anterior página ao clicar no botão

  const handlePreviousPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  // 3. Muda a página para a página equivalente ao número clicado

  const handleSetPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 4. Fecha o dropdown de itens por página ao clicar fora

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
    <div className="relative bg-white dark:bg-[#1a1a2e] border border-gray-500/50 dark:border-white/10 px-4 py-3 my-6 rounded-xl flex w-87 sm:w-105 md:w-full md:max-w-3xl">
      <div className="flex flex-col gap-5">
        <p className="text-xs md:text-sm text-black dark:text-[#aaaacc] pt-3">
          Mostrando Página{" "}
          <strong className="dark:text-[#e2e2ef]">{currentPage}</strong> de{" "}
          <strong className="dark:text-[#e2e2ef]">{totalPages}</strong>
        </p>

        <div className="flex items-center gap-2">
          <p className="flex font-semibold whitespace-nowrap text-xs md:text-sm text-gray-700 dark:text-[#aaaacc]">
            Itens por página:
          </p>

          {/* - Dropdown - */}

          <div
            className="relative w-10 h-8 md:w-12 md:h-10"
            ref={PageLimitDropdownRef}
          >
            <div
              className={`absolute left-0 top-0 flex items-center overflow-x-hidden border border-gray-500/50 dark:border-white/10 rounded-lg bg-gray-100 dark:bg-[#0f0f13] cursor-pointer transition-all duration-300 ease-in-out text-gray-700 dark:text-[#e2e2ef] ${
                isPageLimitDropdownOpen
                  ? "w-fit shadow-lg z-1"
                  : "w-fit shadow-sm"
              }`}
              onClick={() => setIsPageLimitDropdownOpen((prev) => !prev)}
            >
              {pageLimitOptions
                .filter(
                  (option) =>
                    isPageLimitDropdownOpen || option === itemsPerPage,
                )
                .map((option) => (
                  <div
                    className="flex items-center justify-center w-10 h-8 text-sm transition-colors border-r border-gray-500/50 dark:border-white/10 last:border-none hover:text-blue-600 hover:bg-blue-200 dark:hover:text-[#a09cff] dark:hover:bg-[#6c63ff]/20"
                    key={option}
                    onClick={(e) => {
                      if (!isPageLimitDropdownOpen) return;
                      e.stopPropagation();
                      setItemsPerPage(option);
                      setIsPageLimitDropdownOpen(false);
                      setCurrentPage(1);
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
          className="p-1 md:p-2 rounded-lg border border-gray-500/50 dark:border-[#6c63ff]/30 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-[#6c63ff] dark:via-[#4f46e5] dark:to-[#a09cff] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 dark:hover:from-[#7c74ff] dark:hover:via-[#6560f0] dark:hover:to-[#b3b0ff] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors h-8 md:h-12 w-6 md:w-8 flex items-center justify-center cursor-pointer"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>

        {pages.map((page) => (
          <button
            className={`cursor-pointer flex items-center justify-center h-8 md:h-12 w-6 md:w-8 px-3 py-2 rounded-lg font-medium transition-colors
              ${
                currentPage === page
                  ? "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#6c63ff] dark:via-[#4f46e5] dark:to-[#a09cff] text-white shadow-sm"
                  : "text-gray-700 dark:text-[#aaaacc] hover:bg-gray-100 dark:hover:bg-[#6c63ff]/20 dark:hover:text-[#a09cff] border border-gray-300 dark:border-white/10"
              }
            `}
            key={page}
            onClick={() => handleSetPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="p-1 md:p-2 rounded-lg border border-gray-500/50 dark:border-[#6c63ff]/30 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#6c63ff] dark:via-[#4f46e5] dark:to-[#a09cff] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 dark:hover:from-[#7c74ff] dark:hover:via-[#6560f0] dark:hover:to-[#b3b0ff] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors h-8 md:h-12 w-6 md:w-8 flex items-center justify-center cursor-pointer"
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
