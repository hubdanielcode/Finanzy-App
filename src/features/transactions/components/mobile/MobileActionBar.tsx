import { FaPenSquare, FaPlusSquare } from "react-icons/fa";

interface MobileActionBarProps {
  OpenForm: () => void;
  OpenTransactionList: () => void;
}

const MobileActionBar: React.FC<MobileActionBarProps> = ({
  OpenForm,
  OpenTransactionList,
}) => {
  return (
    <div className="sm:hidden flex flex-1 flex-col gap-4 px-4 mt-6">
      <button
        className="flex items-center gap-2 flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 font-bold"
        onClick={() => OpenForm()}
      >
        <FaPlusSquare className="text-blue-600 bg-blue-200 rounded-lg h-6 w-6" />
        Nova Transação
      </button>

      <button
        className="flex items-center gap-2 flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 font-bold"
        onClick={() => OpenTransactionList()}
      >
        <FaPenSquare className="text-blue-600 bg-blue-200 rounded-lg h-6 w-6" />
        Exibir Transações
      </button>
    </div>
  );
};

export { MobileActionBar };
