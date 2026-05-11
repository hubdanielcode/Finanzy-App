import { useClickOutside } from "@/features/transactions/hooks/useClickOutside";
import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";

/* - Limpando o mock entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
});

/* - Testando o clique fora do elemento - */

test("should call setIsOpen(false) when clicking outside the element", () => {
  const setIsOpen = vi.fn();
  const div = document.createElement("div");
  document.body.appendChild(div);

  renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(div);
    useClickOutside(ref, setIsOpen);
  });

  fireEvent.mouseDown(document.body);

  expect(setIsOpen).toHaveBeenCalledWith(false);

  document.body.removeChild(div);
});

/* - Testando o clique dentro do elemento - */

test("should not call setIsOpen when clicking inside the element", () => {
  const setIsOpen = vi.fn();
  const div = document.createElement("div");
  document.body.appendChild(div);

  renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(div);
    useClickOutside(ref, setIsOpen);
  });

  fireEvent.mouseDown(div);

  expect(setIsOpen).not.toHaveBeenCalled();

  document.body.removeChild(div);
});

/* - Testando o clique em elemento filho - */

test("should not call setIsOpen when clicking on a child element", () => {
  const setIsOpen = vi.fn();
  const div = document.createElement("div");
  const child = document.createElement("button");
  div.appendChild(child);
  document.body.appendChild(div);

  renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(div);
    useClickOutside(ref, setIsOpen);
  });

  fireEvent.mouseDown(child);

  expect(setIsOpen).not.toHaveBeenCalled();

  document.body.removeChild(div);
});

/* - Testando o comportamento com ref nula - */

test("should not call setIsOpen when ref is null", () => {
  const setIsOpen = vi.fn();

  renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(null);
    useClickOutside(ref, setIsOpen);
  });

  fireEvent.mouseDown(document.body);

  expect(setIsOpen).not.toHaveBeenCalled();
});

/* - Testando a remoção do event listener ao desmontar - */

test("should remove event listener when component unmounts", () => {
  const setIsOpen = vi.fn();
  const div = document.createElement("div");
  document.body.appendChild(div);

  const spy = vi.spyOn(document, "removeEventListener");

  const { unmount } = renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(div);
    useClickOutside(ref, setIsOpen);
  });

  unmount();

  expect(spy).toHaveBeenCalledWith("mousedown", expect.any(Function));

  spy.mockRestore();
  document.body.removeChild(div);
});
