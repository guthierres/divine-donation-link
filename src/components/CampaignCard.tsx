import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface CampaignCardProps {
  id: string;
  title: string;
  parish: string;
  location: string;
  image: string;
  currentAmount: number;
  goalAmount: number;
  donorsCount: number;
  slug: string;
}

const CampaignCard = ({
  title,
  parish,
  location,
  image,
  currentAmount,
  goalAmount,
  donorsCount,
  slug,
}: CampaignCardProps) => {
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-divine transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground shadow-sacred">
            Ativa
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="font-playfair font-semibold text-lg line-clamp-2 text-foreground">
          {title}
        </h3>
        <div className="space-y-1">
          <p className="font-inter text-sm font-medium text-foreground/90">
            {parish}
          </p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="font-inter text-xs">{location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center font-inter text-sm">
            <span className="text-muted-foreground">Arrecadado</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(currentAmount)}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between items-center font-inter text-xs text-muted-foreground">
            <span>{percentage.toFixed(0)}% da meta</span>
            <span>Meta: {formatCurrency(goalAmount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-inter text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" />
          <span>{donorsCount} doadores</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sacred"
          asChild
        >
          <Link to={`/campanha/${slug}`}>
            Doar Agora
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
