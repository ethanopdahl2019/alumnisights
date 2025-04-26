
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Clock, DollarSign } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  duration: string;
  description?: string;
  onBook: () => void;
}

const ProductCard = ({ title, price, duration, description, onBook }: ProductCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-2xl font-semibold">${price}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{duration}</span>
        </div>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={onBook} className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
