import { LuDot } from "react-icons/lu";

interface FooterProps {
  isMobileFormOpen: boolean;

  isMobileTransactionListOpen: boolean;
}

const Footer: React.FC<FooterProps> = ({
  isMobileFormOpen,

  isMobileTransactionListOpen,
}) => {
  if (isMobileFormOpen || isMobileTransactionListOpen) {
    return null;
  }

  return (
    <footer className="w-full min-w-fit border-t bg-[#333] text-white border-gray-500/50 mt-8 sticky bottom-0 z-2">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <span>
          © {new Date().getFullYear()} <strong>Finanzy</strong> Todos os
          direitos reservados.
        </span>

        <span className="flex items-center gap-1 text-xs text-white">
          <span>App desenvolvido por</span>

          <strong>Daniel Lorenzo</strong>

          <LuDot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />

          <span>v1.2.0</span>
        </span>
      </div>
    </footer>
  );
};

export { Footer };
