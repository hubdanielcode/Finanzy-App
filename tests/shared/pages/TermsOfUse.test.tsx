import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TermsOfUse } from "@/shared";
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
  render(<TermsOfUse />);
  expect(
    screen.getByRole("heading", { name: /Termos de Uso/i }),
  ).toBeInTheDocument();
});

/* - Testando o subtítulo Finanzy - */

test("should render the Finanzy subtitle", () => {
  render(<TermsOfUse />);
  expect(screen.getAllByText(/Finanzy/i).length).toBeGreaterThan(0);
});

/* - Testando a data de atualização - */

test("should render the last update date", () => {
  render(<TermsOfUse />);
  expect(screen.getByText(/03 de Maio de 2026/i)).toBeInTheDocument();
});

/* - Testando o parágrafo de introdução - */

test("should render the introduction paragraph", () => {
  render(<TermsOfUse />);
  expect(
    screen.getByText(/Estes Termos de Uso estabelecem as regras/i),
  ).toBeInTheDocument();
});

/* - Testando as seções principais - */

test("should render all six main sections", () => {
  render(<TermsOfUse />);
  expect(screen.getByText("Aceitação dos Termos")).toBeInTheDocument();
  expect(screen.getByText("Uso do Aplicativo")).toBeInTheDocument();
  expect(screen.getByText("Limitação de Responsabilidade")).toBeInTheDocument();
  expect(screen.getByText("Condutas Proibidas")).toBeInTheDocument();
  expect(screen.getByText("Encerramento de Conta")).toBeInTheDocument();
  expect(screen.getByText("Legislação Aplicável")).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de aceitação dos termos - */

test("should render content inside 'Aceitação dos Termos' section", () => {
  render(<TermsOfUse />);
  expect(
    screen.getByText(/Ao criar uma conta e utilizar o Finanzy/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/atualizar estes termos periodicamente/i),
  ).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de uso do aplicativo - */

test("should render content inside 'Uso do Aplicativo' section", () => {
  render(<TermsOfUse />);
  expect(screen.getByText(/pelo menos 18 anos/i)).toBeInTheDocument();
  expect(
    screen.getByText(/confidencialidade de suas credenciais/i),
  ).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de limitação de responsabilidade - */

test("should render content inside 'Limitação de Responsabilidade' section", () => {
  render(<TermsOfUse />);
  expect(
    screen.getByText(/não presta aconselhamento financeiro/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/perdas financeiras decorrentes do uso/i),
  ).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de condutas proibidas - */

test("should render content inside 'Condutas Proibidas' section", () => {
  render(<TermsOfUse />);
  expect(
    screen.getByText(/engenharia reversa do aplicativo/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/bots, scripts ou qualquer automação/i),
  ).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de encerramento de conta - */

test("should render content inside 'Encerramento de Conta' section", () => {
  render(<TermsOfUse />);
  expect(
    screen.getByText(/encerrar sua conta a qualquer momento/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/mantidos por até 30 dias/i)).toBeInTheDocument();
});

/* - Testando o conteúdo da seção de legislação aplicável - */

test("should render content inside 'Legislação Aplicável' section", () => {
  render(<TermsOfUse />);
  expect(screen.getByText(/Marco Civil da Internet/i)).toBeInTheDocument();
  expect(screen.getByText(/Salvador, Bahia, Brasil/i)).toBeInTheDocument();
});

/* - Testando a seção de concordância - */

test("should render the agreement section", () => {
  render(<TermsOfUse />);
  expect(screen.getByText(/Concordância/i)).toBeInTheDocument();
  expect(
    screen.getByText(/você confirma que leu e concorda/i),
  ).toBeInTheDocument();
});

/* - Testando o link para a política de privacidade - */

test("should render the privacy policy link with correct href", () => {
  render(<TermsOfUse />);
  const link = screen.getByRole("link", { name: /Política de Privacidade/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/politica-de-privacidade");
});

/* - Testando o link de contato - */

test("should render the contact link with correct href", () => {
  render(<TermsOfUse />);
  const link = screen.getByRole("link", { name: /contato@finanzy.app/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "mailto:contato@finanzy.app");
});

/* - Testando o rodapé - */

test("should render the footer text", () => {
  render(<TermsOfUse />);
  expect(screen.getByText(/Daniel Lorenzo/i)).toBeInTheDocument();
  expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
});

/* - Testando o botão de voltar - */

test("should render the back button", () => {
  render(<TermsOfUse />);
  expect(screen.getByRole("button", { name: /Voltar/i })).toBeInTheDocument();
});

/* - Testando a navegação ao clicar em voltar sem state - */

test("should navigate to /cadastro when back button is clicked and state is null", async () => {
  render(<TermsOfUse />);
  await userEvent.click(screen.getByRole("button", { name: /Voltar/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/cadastro");
});

/* - Testando a navegação ao clicar em voltar com state - */

test("should navigate to state.from when back button is clicked and state exists", async () => {
  mockLocation.state = { from: "/login" };
  render(<TermsOfUse />);
  await userEvent.click(screen.getByRole("button", { name: /Voltar/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});
