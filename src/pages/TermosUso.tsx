import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TermosUso = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold text-slate-900">
                  Termos de Uso
                </h1>
                <p className="text-slate-600 mt-2">Última atualização: Janeiro de 2025</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-slate-700 leading-relaxed">
                  Ao acessar e usar a Plataforma Doações Católicas, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar a plataforma.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">2. Descrição do Serviço</h2>
                <p className="text-slate-700 leading-relaxed">
                  A Doações Católicas é uma plataforma online que conecta doadores a paróquias católicas, facilitando campanhas de arrecadação e doações seguras. Atuamos como intermediários tecnológicos, não somos responsáveis pela aplicação dos recursos arrecadados.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">3. Cadastro e Conta</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Para usar alguns serviços da plataforma, você deve:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Ter no mínimo 18 anos de idade</li>
                  <li>Fornecer informações precisas e completas</li>
                  <li>Manter suas credenciais de acesso em sigilo</li>
                  <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                  <li>Atualizar suas informações quando necessário</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">4. Uso da Plataforma</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Você concorda em NÃO:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Usar a plataforma para atividades ilegais ou fraudulentas</li>
                  <li>Violar direitos de terceiros ou leis aplicáveis</li>
                  <li>Transmitir vírus, malware ou códigos maliciosos</li>
                  <li>Tentar acessar áreas restritas da plataforma</li>
                  <li>Coletar dados de outros usuários sem autorização</li>
                  <li>Fazer engenharia reversa ou copiar a plataforma</li>
                  <li>Criar campanhas falsas ou enganosas</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">5. Doações</h2>
                <p className="text-slate-700 leading-relaxed mb-3">Ao fazer uma doação, você declara que:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>As informações de pagamento fornecidas são legítimas</li>
                  <li>Tem autorização para usar o método de pagamento escolhido</li>
                  <li>A doação é voluntária e irrevogável</li>
                  <li>Entende que as doações não são reembolsáveis, exceto em casos específicos previstos em lei</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">6. Campanhas de Paróquias</h2>
                <p className="text-slate-700 leading-relaxed mb-3">As paróquias que criam campanhas comprometem-se a:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Fornecer informações verdadeiras e precisas sobre as campanhas</li>
                  <li>Usar os recursos arrecadados conforme descrito na campanha</li>
                  <li>Manter a transparência sobre o uso dos recursos</li>
                  <li>Cumprir todas as obrigações legais e fiscais</li>
                  <li>Não criar campanhas fraudulentas ou enganosas</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">7. Taxas e Pagamentos</h2>
                <p className="text-slate-700 leading-relaxed">
                  A plataforma pode cobrar taxas pelos serviços prestados. Todas as taxas serão claramente informadas antes da conclusão de qualquer transação. Os pagamentos são processados por meio de gateways de pagamento terceirizados seguros.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">8. Propriedade Intelectual</h2>
                <p className="text-slate-700 leading-relaxed">
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, imagens e software, é propriedade da Doações Católicas ou de seus licenciadores e está protegido por leis de propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">9. Limitação de Responsabilidade</h2>
                <p className="text-slate-700 leading-relaxed mb-3">A plataforma não se responsabiliza por:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Uso indevido dos recursos arrecadados pelas paróquias</li>
                  <li>Informações incorretas fornecidas por paróquias ou usuários</li>
                  <li>Problemas técnicos ou interrupções de serviço</li>
                  <li>Perdas ou danos indiretos resultantes do uso da plataforma</li>
                  <li>Ações de processadores de pagamento terceirizados</li>
                </ul>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">10. Suspensão e Encerramento</h2>
                <p className="text-slate-700 leading-relaxed">
                  Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio. Você pode encerrar sua conta a qualquer momento através das configurações da plataforma.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">11. Modificações</h2>
                <p className="text-slate-700 leading-relaxed">
                  Podemos modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após publicação na plataforma. O uso continuado após modificações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">12. Lei Aplicável</h2>
                <p className="text-slate-700 leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro da comarca competente.
                </p>
              </section>

              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-4">13. Contato</h2>
                <p className="text-slate-700 leading-relaxed">
                  Para dúvidas ou questões sobre estes Termos de Uso, entre em contato:
                </p>
                <div className="bg-slate-50 rounded-lg p-6 mt-4">
                  <p className="text-slate-700"><strong>E-mail:</strong> contato@doacoescatolicas.com.br</p>
                  <p className="text-slate-700 mt-2"><strong>Suporte:</strong> suporte@doacoescatolicas.com.br</p>
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

export default TermosUso;
