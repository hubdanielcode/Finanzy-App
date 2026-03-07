import { renderHook } from "@testing-library/react";
import { useIsMobileDevice } from "@/features/transactions";

/* - Criando o mock para simular o navigator nos testes - */

const setUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, "userAgent", {
    writable: true,
    configurable: true,
    value: userAgent,
  });
};

/* - Testando o useIsMobileDevice - */

test("should return false when user agent is a desktop browser", () => {
  setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(false);
});

test("should return true when user agent is Android", () => {
  setUserAgent("Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36");

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(true);
});

test("should return true when user agent is iPhone", () => {
  setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)");

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(true);
});

test("should return true when user agent is iPad", () => {
  setUserAgent("Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)");

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(true);
});

test("should return true when user agent is Opera Mini", () => {
  setUserAgent("Opera/9.80 (Android; Opera Mini/8.0)");

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(true);
});

test("should return true when user agent is IEMobile", () => {
  setUserAgent(
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; IEMobile/10.0)",
  );

  const { result } = renderHook(() => useIsMobileDevice());

  expect(result.current).toBe(true);
});
