import { Link } from "react-router-dom";
import { Church, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-sacred border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Church className="h-6 w-6 text-primary" />
              <span className="font-playfair text-lg font-bold text-foreground">
                Doações Católicas
              </span>
            </div>
            <p className="text-sm font-inter text-muted-foreground">
              Plataforma de doações para paróquias católicas. Apoie sua comunidade de fé com transparência e segurança.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-foreground">Navegação</h3>
            <nav className="flex flex-col gap-2 font-inter text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link to="/campanhas" className="text-muted-foreground hover:text-foreground transition-colors">
                Campanhas
              </Link>
              <Link to="/como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </Link>
              <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nós
              </Link>
            </nav>
          </div>

          {/* For Parishes */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-foreground">Para Paróquias</h3>
            <nav className="flex flex-col gap-2 font-inter text-sm">
              <Link to="/paroquia/cadastro" className="text-muted-foreground hover:text-foreground transition-colors">
                Cadastre sua Paróquia
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Área da Paróquia
              </Link>
              <Link to="/suporte" className="text-muted-foreground hover:text-foreground transition-colors">
                Suporte
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-playfair font-semibold text-foreground">Contato</h3>
            <div className="flex flex-col gap-3 font-inter text-sm">
              <a href="mailto:contato@doacoescatolicas.com.br" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                contato@doacoescatolicas.com.br
              </a>
              <a href="tel:+5511999999999" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>São Paulo, SP<br />Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-inter text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Doações Católicas. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-primary fill-primary" />
              <span>para a Igreja Católica</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
