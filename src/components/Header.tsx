import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Church, Heart, LogIn, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Church className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all" />
            </div>
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Doações Católicas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Início
            </Link>
            <Link
              to="/campanhas"
              className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Campanhas
            </Link>
            <Link
              to="/como-funciona"
              className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Sobre
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sacred" asChild>
              <Link to="/paroquia/cadastro">
                <Heart className="mr-2 h-4 w-4" />
                Sou Paróquia
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/campanhas"
                className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Campanhas
              </Link>
              <Link
                to="/como-funciona"
                className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link
                to="/sobre"
                className="text-sm font-inter font-medium text-foreground/80 hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/paroquia/cadastro" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="mr-2 h-4 w-4" />
                    Sou Paróquia
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
