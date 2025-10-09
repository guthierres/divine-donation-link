import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold text-slate-900">
                  Política de Privacidade
                </h1>
                <p className="text-slate-600 mt-2">Última atualização: Janeiro de 2025</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">1. Introdução</h2>
                <p className="text-slate-700 leading-relaxed">
                  A Plataforma Doações Católicas está comprometida em proteger a privacidade e os dados pessoais de seus usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">2. Dados Coletados</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Coletamos os seguintes tipos de dados:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Dados de Identificação:</strong> Nome completo, e-mail, telefone</li>
                  <li><strong>Dados de Paróquia:</strong> Nome da paróquia, endereço, diocese, CNPJ</li>
                  <li><strong>Dados de Doação:</strong> Valor doado, método de pagamento, histórico de doações</li>
                  <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">3. Finalidade do Tratamento</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Utilizamos seus dados para:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Processar e registrar doações</li>
                  <li>Gerenciar campanhas de arrecadação</li>
                  <li>Enviar recibos e comprovantes fiscais</li>
                  <li>Comunicar atualizações sobre campanhas</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">4. Base Legal</h2>
                <p className="text-slate-700 leading-relaxed">
                  O tratamento de dados é realizado com base em: consentimento do titular, execução de contrato, cumprimento de obrigação legal, exercício regular de direitos e legítimo interesse.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">5. Compartilhamento de Dados</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Seus dados podem ser compartilhados com:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li><strong>Paróquias:</strong> Informações necessárias para processar doações</li>
                  <li><strong>Processadores de Pagamento:</strong> Para executar transações financeiras</li>
                  <li><strong>Autoridades Governamentais:</strong> Quando exigido por lei</li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-3">
                  Não vendemos, alugamos ou comercializamos seus dados pessoais para terceiros.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">6. Segurança dos Dados</h2>
                <p className="text-slate-700 leading-relaxed">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS, firewalls, controle de acesso e monitoramento contínuo.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">7. Retenção de Dados</h2>
                <p className="text-slate-700 leading-relaxed">
                  Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, incluindo requisitos legais, contábeis e fiscais. Dados de doações são mantidos por no mínimo 5 anos conforme legislação tributária.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">8. Direitos do Titular</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar o consentimento</li>
                  <li>Opor-se ao tratamento de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">9. Cookies</h2>
                <p className="text-slate-700 leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">10. Alterações na Política</h2>
                <p className="text-slate-700 leading-relaxed">
                  Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas por e-mail ou através da plataforma.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">11. Contato</h2>
                <p className="text-slate-700 leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mt-4">
                  <p className="text-slate-700"><strong>E-mail:</strong> privacidade@doacoescatolicas.com.br</p>
                  <p className="text-slate-700 mt-2"><strong>Encarregado de Proteção de Dados (DPO)</strong></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
