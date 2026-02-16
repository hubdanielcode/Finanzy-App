import { X } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../model/TransactionTypes";

interface ModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (updatedTransaction: Transaction) => void;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const Modal: React.FC<ModalProps> = ({
  transaction,
  onClose,
  onSubmit,
  ExpenseOptions,
  IncomeOptions,
}) => {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [amountInput, setAmountInput] = useState(
    transaction.amount.toFixed(2).replace(".", ","),
  );
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState(transaction.type);
  const [date, setDate] = useState(transaction.date);
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed flex inset-0 justify-center items-center bg-black/80 h-screen z-1 mx-auto">
      <div className="flex flex-col bg-white h-fit w-150 rounded-xl border-gray-500/50 border pt-2 relative">
        {/* - Título geral - */}

        <h1 className="flex w-full font-bold text-black text-xl sm:text-3xl justify-center mb-4 pt-2">
          Atualize a sua transação
        </h1>

        <button
          className="absolute top-5 right-5 bg-gray-800 hover:bg-black text-white rounded-xl p-1 cursor-pointer"
          onClick={onClose}
        >
          <X size={25} />
        </button>

        {/* - Título da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Título
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            maxLength={30}
          />
        </div>

        {/* - Valor da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Valor
          </label>
          <div className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none pr-2 font-bold text-gray-700">
            R$:
            <input
              className="outline-none pl-2 font-normal placeholder:font-normal text-gray-700"
              type="text"
              pattern="[0-9]*[.,]?[0-9]{0,2}"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => {
                const value = e.target.value;

                if (!/^[0-9.,]*$/.test(value)) {
                  return;
                }

                if (value.includes("-")) {
                  return;
                }

                setAmountInput(value);

                const raw = e.target.value.replace(",", ".");
                const parsed = parseFloat(raw);

                setAmount(isNaN(parsed) ? 0 : parsed);
              }}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* - Categoria da transação - */}

        <div className="flex flex-col mb-6 px-10 relative">
          <label className="text-gray-700 font-semibold mb-2">Categoria</label>

          <input
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full text-md outline-none text-gray-700 cursor-pointer"
            type="text"
            value={category}
            placeholder="Selecione uma Categoria..."
            readOnly
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <ul className="absolute top-full left-10 right-10 mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-1">
              {(type === "Entrada" ? IncomeOptions : ExpenseOptions).map(
                (option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategory(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ),
              )}
            </ul>
          )}
        </div>

        {/* - Data da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Data
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* - Botões - */}

        <div className="flex justify-around items-center mb-2 px-10">
          <button
            className="flex bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white border border-gray-500/50 py-2 px-4 rounded-lg cursor-pointer mb-2"
            onClick={() => {
              if (!title.trim()) {
                alert("O título não pode ser vazio");
                return;
              }

              onSubmit({ ...transaction, title, amount, category, type, date });
            }}
          >
            Salvar
          </button>
          <button
            className="flex bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg hover:from-blue-500 hover:to-indigo-500 text-white border border-gray-500/50 py-2 px-4 rounded-lg cursor-pointer mb-2"
            onClick={() => {
              setTitle(transaction.title);
              setAmount(transaction.amount);
              setAmountInput(transaction.amount.toFixed(2).replace(".", ","));
              setCategory(transaction.category);
              setType(transaction.type);
              setDate(transaction.date);
            }}
          >
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
};

export { Modal };
