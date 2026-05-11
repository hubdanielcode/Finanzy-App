import {
  FileText,
  UserCheck,
  AlertTriangle,
  Ban,
  RefreshCw,
  Scale,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { appVersion } from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";

const sections = [
  {
    icon: <UserCheck size={20} />,
    title: "Aceitação dos Termos",
    content: [
      "Ao criar uma conta e utilizar o Finanzy, você declara ter lido, compreendido e concordado com estes Termos de Uso.",
      "Caso não concorde com qualquer parte destes termos, você não deve utilizar o aplicativo.",
      "Estes termos se aplicam a todos os usuários do Finanzy, independentemente do plano ou modalidade de acesso.",
      "Nos reservamos o direito de atualizar estes termos periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou aviso dentro do aplicativo.",
    ],
  },

  {
    icon: <FileText size={20} />,
    title: "Uso do Aplicativo",
    content: [
      "O Finanzy é uma ferramenta de controle financeiro pessoal. Você é responsável por todas as informações que inserir.",
      "Você deve ter pelo menos 18 anos ou a maioridade legal do seu país para criar uma conta.",
      "É proibido utilizar o aplicativo para atividades ilegais, incluindo lavagem de dinheiro, fraude ou qualquer prática contrária à lei brasileira.",
      "Você é responsável por manter a confidencialidade de suas credenciais de acesso (e-mail e senha).",
    ],
  },

  {
    icon: <AlertTriangle size={20} />,
    title: "Limitação de Responsabilidade",
    content: [
      "O Finanzy é uma ferramenta de organização e não presta aconselhamento financeiro, jurídico ou contábil profissional.",
      "Não nos responsabilizamos por decisões financeiras tomadas com base nas informações exibidas no aplicativo.",
      "Apesar de todos os esforços para manter o serviço disponível, não garantimos disponibilidade ininterrupta ou livre de erros.",
      "Em nenhuma hipótese seremos responsáveis por perdas financeiras decorrentes do uso ou impossibilidade de uso do aplicativo.",
    ],
  },

  {
    icon: <Ban size={20} />,
    title: "Condutas Proibidas",
    content: [
      "Tentar acessar dados de outros usuários ou realizar engenharia reversa do aplicativo.",
      "Usar bots, scripts ou qualquer automação não autorizada para interagir com o serviço.",
      "Compartilhar, revender ou sublicenciar o acesso ao aplicativo para terceiros.",
      "Inserir dados falsos, maliciosos ou que violem direitos de terceiros no sistema.",
    ],
  },

  {
    icon: <RefreshCw size={20} />,
    title: "Encerramento de Conta",
    content: [
      "Você pode encerrar sua conta a qualquer momento por meio das configurações do aplicativo ou entrando em contato com o suporte.",
      "Nos reservamos o direito de suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio.",
      "Após o encerramento, seus dados serão mantidos por até 30 dias para fins de backup antes da exclusão permanente.",
      "Em caso de encerramento por violação dos termos, não haverá reembolso de eventuais valores pagos.",
    ],
  },

  {
    icon: <Scale size={20} />,
    title: "Legislação Aplicável",
    content: [
      "Estes Termos de Uso são regidos pela legislação brasileira, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e o Código de Defesa do Consumidor.",
      "Qualquer disputa oriunda destes termos será resolvida no foro da comarca de Salvador, Bahia, Brasil.",
      "A invalidade de qualquer cláusula não afeta a validade das demais disposições destes termos.",
      "Em caso de conflito entre versões em diferentes idiomas, a versão em português prevalece.",
    ],
  },
];

const TermsOfUse = () => {
  /* - Definições - */

  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f13] font-sans">
      {/* - Header - */}

      <div className="w-full px-6 py-10 sm:py-14 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#0f0f13] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="max-w-3xl mx-auto">
          <button
            className="inline-flex items-center gap-2 text-white hover:text-blue-400 dark:hover:text-[#4f9eff] hover:underline text-sm font-semibold mb-6 transition-colors cursor-pointer"
            onClick={() => navigate(state?.from || "/cadastro")}
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 dark:bg-[#6c63ff]/20 border border-gray-50/50 dark:border-[#6c63ff]/30 backdrop-blur-sm rounded-2xl p-3">
              <FileText className="text-white dark:text-[#a09cff] h-8 w-8" />
            </div>

            <div>
              <p className="text-white dark:text-[#aaaacc] text-sm font-semibold tracking-widest">
                Finanzy
              </p>

              <h1 className="text-white dark:text-[#e2e2ef] font-bold text-3xl sm:text-4xl leading-tight">
                Termos de Uso
              </h1>
            </div>
          </div>

          <p className="text-white dark:text-[#aaaacc] text-sm mt-3">
            Última atualização: <strong> 03 de Maio de 2026</strong>{" "}
            &nbsp;·&nbsp; {appVersion}
          </p>
        </div>
      </div>

      {/* - Introdução - */}

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[#1a1a2e] border border-gray-500/20 dark:border-white/10 rounded-xl px-6 py-5 mb-6 shadow-sm">
          <p className="text-gray-700 dark:text-[#aaaacc] leading-relaxed text-base">
            Bem-vindo ao{" "}
            <strong className="text-blue-600 dark:text-[#4f9eff]">
              Finanzy
            </strong>
            . Estes Termos de Uso estabelecem as regras e condições para a
            utilização do nosso aplicativo de controle financeiro pessoal. Leia
            com atenção antes de utilizar o serviço.
          </p>
        </div>

        {/* - Seções - */}

        <div className="flex flex-col gap-5">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#1a1a2e] border border-gray-500/20 dark:border-white/10 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-linear-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-[#6c63ff]/20 dark:via-[#4f46e5]/20 dark:to-[#a09cff]/20">
                <div className="text-blue-600 dark:text-[#a09cff] rounded-lg p-2">
                  {section.icon}
                </div>

                <h2 className="font-bold text-black dark:text-[#e2e2ef] text-lg">
                  {section.title}
                </h2>
              </div>

              <ul className="px-6 py-4 flex flex-col gap-3">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-black dark:text-[#aaaacc] text-sm font-semibold leading-relaxed"
                  >
                    <ChevronRight
                      size={20}
                      className="text-indigo-500 dark:text-[#6c63ff] mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* - Concordo - */}

        <div className="rounded-xl px-6 py-5 mt-5 flex items-start gap-4 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#6c63ff] dark:via-[#4f46e5] dark:to-[#a09cff]">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 dark:bg-white/10 border border-gray-50/50 dark:border-white/10 rounded-lg p-2 shrink-0">
              <Scale className="text-white h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-white text-lg mb-1">
                Concordância
              </h2>

              <p className="text-white dark:text-[#e2e2ef] text-sm leading-relaxed">
                Ao utilizar o Finanzy, você confirma que leu e concorda com
                estes Termos de Uso e com nossa{" "}
                <a
                  className="underline text-white font-semibold hover:text-blue-400 dark:hover:text-[#4f9eff] transition-colors"
                  href="/politica-de-privacidade"
                >
                  Política de Privacidade
                </a>
                . Para dúvidas, entre em contato:{" "}
                <a
                  className="underline text-white font-semibold hover:text-blue-400 dark:hover:text-[#4f9eff] transition-colors"
                  href="mailto:contato@finanzy.app"
                >
                  contato@finanzy.app
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-800 dark:text-[#555577] text-xs mt-8 pb-8">
          © 2026 <strong className="dark:text-[#aaaacc]">Finanzy</strong> Todos
          os direitos reservados. · App desenvolvido por{" "}
          <strong className="dark:text-[#aaaacc]">Daniel Lorenzo</strong>
        </p>
      </div>
    </div>
  );
};

export { TermsOfUse };
