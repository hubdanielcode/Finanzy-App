import { act, renderHook } from "@testing-library/react";
import { useOrientation } from "@/features/transactions";
import { vi } from "vitest";

/* - Criando o mock para simular o window nos testes - */

const setWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
};

/* - Limpando o mock entre os testes para evitar erros - */

beforeEach(() => {
  setWindowSize(1024, 768);
});

/* - Testando o useOrientation - */

test("should return true when screen is in landscape mode", () => {
  setWindowSize(1024, 768);

  const { result } = renderHook(() => useOrientation());

  expect(result.current).toBe(true);
});

test("should return false when screen is in portrait mode", () => {
  setWindowSize(768, 1024);

  const { result } = renderHook(() => useOrientation());

  expect(result.current).toBe(false);
});

test("should return false when width and height are equal", () => {
  setWindowSize(768, 768);

  const { result } = renderHook(() => useOrientation());

  expect(result.current).toBe(false);
});

test("should update orientation when window is resized to landscape", () => {
  setWindowSize(768, 1024);

  const { result } = renderHook(() => useOrientation());

  expect(result.current).toBe(false);

  act(() => {
    setWindowSize(1024, 768);
    window.dispatchEvent(new Event("resize"));
  });

  expect(result.current).toBe(true);
});

test("should update orientation when window is resized to portrait", () => {
  setWindowSize(1024, 768);

  const { result } = renderHook(() => useOrientation());

  expect(result.current).toBe(true);

  act(() => {
    setWindowSize(768, 1024);
    window.dispatchEvent(new Event("resize"));
  });

  expect(result.current).toBe(false);
});

test("should remove resize event listener on unmount", () => {
  const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

  const { unmount } = renderHook(() => useOrientation());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    "resize",
    expect.any(Function),
  );
});
