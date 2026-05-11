import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { appVersion } from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";

const sections = [
  {
    icon: <Database size={20} />,
    title: "Dados que Coletamos",
    content: [
      "Informações de cadastro: nome, e-mail e senha (criptografada) fornecidos no momento do registro.",
      "Dados financeiros: transações inseridas por você, incluindo título, valor, categoria, tipo e data.",
      "Dados de uso: informações sobre como você interage com o aplicativo para melhorarmos a experiência.",
      "Dados de sessão: tokens de autenticação gerados pelo Supabase para manter sua sessão ativa com segurança.",
    ],
  },

  {
    icon: <Lock size={20} />,
    title: "Como Protegemos seus Dados",
    content: [
      "Suas senhas são armazenadas usando algoritmos de hash seguros — nunca em texto puro.",
      "Toda comunicação entre o aplicativo e nossos servidores é feita via HTTPS/TLS.",
      "Utilizamos o Supabase como provedor de banco de dados, que segue padrões internacionais de segurança (SOC 2 Type II).",
      "O acesso aos dados é restrito por políticas de Row Level Security (RLS), garantindo que cada usuário acesse apenas suas próprias informações.",
    ],
  },

  {
    icon: <Eye size={20} />,
    title: "Como Usamos seus Dados",
    content: [
      "Para exibir seu histórico de transações, gráficos e resumos financeiros dentro do aplicativo.",
      "Para autenticar sua identidade e manter sua sessão segura.",
      "Para calcular saldos, entradas, saídas e métricas financeiras personalizadas.",
      "Não vendemos, alugamos ou compartilhamos seus dados financeiros com terceiros para fins comerciais.",
    ],
  },

  {
    icon: <Shield size={20} />,
    title: "Seus Direitos",
    content: [
      "Você pode acessar, corrigir ou excluir seus dados a qualquer momento por meio das configurações da conta.",
      "Você tem o direito de solicitar a exportação de todos os seus dados pessoais.",
      "Você pode encerrar sua conta e solicitar a exclusão permanente de todos os seus dados.",
      "Em conformidade com a LGPD (Lei Geral de Proteção de Dados — Lei nº 13.709/2018), garantimos transparência no tratamento de suas informações.",
    ],
  },
];

const PrivacyPolicy = () => {
  /* - Definições - */

  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f13] font-sans">
      {/* - Header - */}

      <div className="w-full px-6 py-10 sm:py-14 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#0f0f13] dark:via-[#1a1a2e] dark:to-[#16213e]">
        <div className="max-w-3xl mx-auto">
          <button
            className="inline-flex items-center gap-2 text-white
          hover:text-blue-400 dark:hover:text-[#4f9eff] hover:underline text-sm
          font-semibold mb-6 transition-colors cursor-pointer"
            onClick={() => navigate(state?.from || "/cadastro")}
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 dark:bg-[#6c63ff]/20 border border-gray-50/50 dark:border-[#6c63ff]/30 backdrop-blur-sm rounded-2xl p-3">
              <Shield className="text-white dark:text-[#a09cff] h-8 w-8" />
            </div>

            <div>
              <p className="text-white dark:text-[#aaaacc] text-sm font-semibold tracking-widest">
                Finanzy
              </p>

              <h1 className="text-white dark:text-[#e2e2ef] font-bold text-3xl sm:text-4xl leading-tight">
                Política de Privacidade
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
            Sua privacidade é fundamental para o{" "}
            <strong className="text-blue-600 dark:text-[#4f9eff]">
              Finanzy
            </strong>
            . Esta política descreve de forma clara e transparente quais
            informações coletamos, como as utilizamos e quais são os seus
            direitos como titular dos dados. Ao usar nosso aplicativo, você
            concorda com as práticas descritas aqui.
          </p>
        </div>

        {/* - Seções - */}

        <div className="flex flex-col gap-5">
          {sections.map((section, index) => (
            <div
              className="bg-white dark:bg-[#1a1a2e] border border-gray-500/20 dark:border-white/10 rounded-xl shadow-sm overflow-hidden"
              key={index}
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
                {section.content.map((content, contentIndex) => (
                  <li
                    key={contentIndex}
                    className="flex items-start gap-3 text-black dark:text-[#aaaacc] text-sm font-semibold leading-relaxed"
                  >
                    <ChevronRight
                      size={20}
                      className="text-blue-500 dark:text-[#6c63ff] mt-0.5 shrink-0"
                    />
                    {content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* - Cookies - */}

        <div className="bg-white dark:bg-[#1a1a2e] border border-gray-500/20 dark:border-white/10 rounded-xl px-6 py-5 mt-5 shadow-sm">
          <h2 className="font-bold text-gray-800 dark:text-[#e2e2ef] text-lg mb-3">
            Cookies e Armazenamento Local
          </h2>

          <p className="text-black dark:text-[#aaaacc] text-sm leading-relaxed">
            O Finanzy utiliza cookies de sessão e armazenamento local apenas
            para manter você autenticado e salvar preferências de interface. Não
            utilizamos cookies de rastreamento publicitário ou terceiros. Você
            pode limpar esses dados a qualquer momento pelo navegador.
          </p>
        </div>

        {/* - Contato - */}

        <div className="rounded-xl px-6 py-5 mt-5 flex items-start gap-4 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-[#6c63ff] dark:via-[#4f46e5] dark:to-[#a09cff]">
          <div className="bg-white/20 dark:bg-white/10 border border-gray-50/50 dark:border-white/10 rounded-lg p-2 shrink-0">
            <Mail className="text-white h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-white text-lg mb-1">
              Entre em Contato
            </h2>

            <p className="text-white dark:text-[#e2e2ef] text-sm leading-relaxed">
              Dúvidas sobre esta política ou sobre o tratamento dos seus dados?
              Fale com o desenvolvedor:{" "}
              <a
                className="underline text-white font-semibold hover:text-blue-400 dark:hover:text-[#4f9eff] hover:underline transition-colors"
                href="mailto:contato@finanzy.app"
              >
                contato@finanzy.app
              </a>
            </p>
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

export { PrivacyPolicy };
