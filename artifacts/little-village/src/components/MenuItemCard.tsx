import { type MenuItem } from "@workspace/api-client-react";
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  item: MenuItem;
}

export function MenuItemCard({ item }: Props) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order.`,
      duration: 3000,
    });
  };

  // stock photo fallback based on category
  const getFallbackImage = (category: string) => {
    const maps: Record<string, string> = {
      'Starters': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=400&fit=crop',
      'Main Course': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop',
      'Rice & Biryani': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&h=400&fit=crop',
      'Breads': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop',
      'Desserts': 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&h=400&fit=crop',
      'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop',
    };
    return maps[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop';
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-card-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img 
          src={item.imageUrl || getFallbackImage(item.category)} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.isFeatured && (
          <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Chef's Special
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-display font-bold text-lg text-foreground leading-tight">{item.name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">₹{item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {item.description || "A delicious traditional offering prepared with authentic spices."}
        </p>
        <Button 
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl font-medium transition-colors"
          variant="ghost"
        >
          <Plus className="w-4 h-4 mr-2" />
          {item.isAvailable ? "Add to Order" : "Currently Unavailable"}
        </Button>
      </div>
    </div>
  );
}
