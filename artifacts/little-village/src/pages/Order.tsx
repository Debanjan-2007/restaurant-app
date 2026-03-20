import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";
import { useCreateOrder } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerAddress: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function Order() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useReactHookForm<OrderFormValues>({
    resolver: zodResolver(orderSchema)
  });

  const total = getCartTotal();
  const tax = total * 0.05; // 5% tax
  const finalTotal = total + tax;

  const onSubmit = async (data: OrderFormValues) => {
    if (items.length === 0) return;

    try {
      const itemsString = items.map(i => `${i.quantity}x ${i.name}`).join(", ");
      
      await createOrder({
        data: {
          restaurantId: "little-village",
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          items: itemsString,
          totalAmount: finalTotal
        }
      });

      // Generate WhatsApp Link
      const waText = `*New Order - Little Village Restaurant*\n\n*Customer:* ${data.customerName}\n*Phone:* ${data.customerPhone}\n*Address:* ${data.customerAddress}\n\n*Items:*\n${items.map(i => `- ${i.quantity}x ${i.name} (₹${i.price * i.quantity})`).join('\n')}\n\n*Total Amount:* ₹${finalTotal.toFixed(2)}\n${data.notes ? `\n*Notes:* ${data.notes}` : ''}`;
      
      const waUrl = `https://wa.me/919010038444?text=${encodeURIComponent(waText)}`;
      
      clearCart();
      window.location.href = waUrl;

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <section className="bg-[#2d1b19] pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Complete Your Order</h1>
        </div>
      </section>

      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-6">
          
          {items.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-card rounded-3xl border border-border shadow-sm">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added any delicious dishes yet.</p>
              <Link href="/menu">
                <Button className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Cart Items */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                  Order Summary
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">{items.length} items</span>
                </h2>
                
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">LV</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-primary font-bold mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                          <div className="flex items-center bg-muted rounded-full p-1 border border-border">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="lg:col-span-5 relative">
                <div className="bg-card rounded-3xl border border-border shadow-xl p-8 sticky top-32">
                  <h2 className="text-2xl font-display font-bold mb-6">Delivery Details</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <Input placeholder="Full Name" className="h-12 bg-background" {...register("customerName")} />
                      {errors.customerName && <span className="text-destructive text-sm mt-1">{errors.customerName.message}</span>}
                    </div>
                    <div>
                      <Input placeholder="Phone Number (WhatsApp)" type="tel" className="h-12 bg-background" {...register("customerPhone")} />
                      {errors.customerPhone && <span className="text-destructive text-sm mt-1">{errors.customerPhone.message}</span>}
                    </div>
                    <div>
                      <Textarea placeholder="Complete Delivery Address" className="min-h-[100px] bg-background resize-none" {...register("customerAddress")} />
                      {errors.customerAddress && <span className="text-destructive text-sm mt-1">{errors.customerAddress.message}</span>}
                    </div>
                    <div>
                      <Textarea placeholder="Any special instructions? (Optional)" className="min-h-[80px] bg-background resize-none" {...register("notes")} />
                    </div>

                    <div className="border-t border-border pt-6 mt-6 space-y-3">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Taxes & Fees (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xl text-foreground pt-3 border-t border-border">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full h-14 text-lg mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-lg shadow-[#25D366]/20 transition-all flex gap-2 items-center"
                    >
                      {isPending ? "Processing..." : (
                        <>
                          Checkout via WhatsApp <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      You will be redirected to WhatsApp to confirm and send your order directly to our kitchen.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
