import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrivacyPolicy } from "@/shared";
import { vi } from "vitest";

/* - Criando os mocks do react-router-dom - */

const mockNavigate = vi.fn();
const mockLocation: { state: { from: string } | null } = { state: null };

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

/* - Limpando os mocks entre os testes para evitar erros - */

afterEach(() => {
  vi.clearAllMocks();
  mockLocation.state = null;
});

/* - Testando o título da página - */

test("should render the page title", () => {
  render(<PrivacyPolicy />);
  expect(
    screen.getByRole("heading", { name: /Política de Privacidade/i }),
  ).toBeInTheDocument();
});

/* - Testando o subtítulo Finanzy - */

test("should render the Finanzy subtitle", () => {
  render(<PrivacyPolicy />);
  expect(screen.getAllByText(/Finanzy/i).length).toBeGreaterThan(0);
});

/* - Testando a data de atualização - */

test("should render the last update date", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/03 de Maio de 2026/i)).toBeInTheDocument();
});

/* - Testando o parágrafo de introdução - */

test("should render the introduction paragraph", () => {
  render(<PrivacyPolicy />);
  expect(
    screen.getByText(/Sua privacidade é fundamental/i),
  ).toBeInTheDocument();
});

/* - Testando as seções principais - */

test("should render all four main sections", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText("Dados que Coletamos")).toBeInTheDocument();
  expect(screen.getByText("Como Protegemos seus Dados")).toBeInTheDocument();
  expect(screen.getByText("Como Usamos seus Dados")).toBeInTheDocument();
  expect(screen.getByText("Seus Direitos")).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de dados coletados - */

test("should render content inside 'Dados que Coletamos' section", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/Informações de cadastro/i)).toBeInTheDocument();
  expect(
    screen.getByText(/transações inseridas por você/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Dados de sessão/i)).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de proteção de dados - */

test("should render content inside 'Como Protegemos seus Dados' section", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/algoritmos de hash seguros/i)).toBeInTheDocument();
  expect(screen.getByText(/HTTPS\/TLS/i)).toBeInTheDocument();
  expect(screen.getByText(/Row Level Security/i)).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de direitos - */

test("should render content inside 'Seus Direitos' section", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/LGPD/i)).toBeInTheDocument();
  expect(
    screen.getByText(/exportação de todos os seus dados/i),
  ).toBeInTheDocument();
});

/* - Testando a seção de cookies - */

test("should render the cookies section", () => {
  render(<PrivacyPolicy />);
  expect(
    screen.getByText(/Cookies e Armazenamento Local/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/cookies de sessão e armazenamento local/i),
  ).toBeInTheDocument();
});

/* - Testando a seção de contato - */

test("should render the contact section", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/Entre em Contato/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /contato@finanzy.app/i }),
  ).toBeInTheDocument();
});

/* - Testando o href do link de contato - */

test("should have the correct href on the contact link", () => {
  render(<PrivacyPolicy />);
  const link = screen.getByRole("link", { name: /contato@finanzy.app/i });
  expect(link).toHaveAttribute("href", "mailto:contato@finanzy.app");
});

/* - Testando o rodapé - */

test("should render the footer text", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByText(/Daniel Lorenzo/i)).toBeInTheDocument();
  expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
});

/* - Testando o botão de voltar - */

test("should render the back button", () => {
  render(<PrivacyPolicy />);
  expect(screen.getByRole("button", { name: /Voltar/i })).toBeInTheDocument();
});

/* - Testando a navegação ao clicar em voltar sem state - */

test("should navigate to /cadastro when back button is clicked and state is null", async () => {
  render(<PrivacyPolicy />);
  await userEvent.click(screen.getByRole("button", { name: /Voltar/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/cadastro");
});

/* - Testando a navegação ao clicar em voltar com state - */

test("should navigate to state.from when back button is clicked and state exists", async () => {
  mockLocation.state = { from: "/login" };
  render(<PrivacyPolicy />);
  await userEvent.click(screen.getByRole("button", { name: /Voltar/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});
