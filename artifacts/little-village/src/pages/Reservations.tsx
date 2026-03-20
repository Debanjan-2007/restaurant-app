import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useCreateReservation } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Clock } from "lucide-react";
import { format } from "date-fns";

const resSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  guests: z.coerce.number().min(1).max(20),
  notes: z.string().optional(),
});

type ResFormValues = z.infer<typeof resSchema>;

export default function Reservations() {
  const { toast } = useToast();
  const { mutateAsync: createReservation, isPending } = useCreateReservation();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ResFormValues>({
    resolver: zodResolver(resSchema),
    defaultValues: {
      guests: 2,
    }
  });

  const onSubmit = async (data: ResFormValues) => {
    try {
      await createReservation({
        data: {
          restaurantId: "little-village",
          ...data
        }
      });
      toast({
        title: "Reservation Request Sent!",
        description: "We'll contact you shortly to confirm your booking.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <section className="relative bg-[#2d1b19] pt-32 pb-24 flex items-center justify-center overflow-hidden">
         {/* Simple background pattern or texture could go here */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
         <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Book a Table</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Join us for an unforgettable dining experience. Reserve your table in advance to ensure the best seating.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col md:flex-row -mt-32 relative z-20">
            
            {/* Info Side */}
            <div className="bg-primary text-white p-10 md:w-1/3 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-3xl mb-6">Dine with Us</h3>
                <p className="text-white/80 mb-8 leading-relaxed">
                  We offer a warm and inviting atmosphere suitable for romantic dinners, family gatherings, and special celebrations.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-secondary shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Opening Hours</h4>
                      <p className="text-sm text-white/70">Mon-Fri: 11am - 10:30pm</p>
                      <p className="text-sm text-white/70">Sat-Sun: 11am - 11:30pm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-secondary shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Large Groups</h4>
                      <p className="text-sm text-white/70">For parties larger than 20, please call us directly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-10 md:w-2/3 bg-card">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input placeholder="John Doe" className="h-12" {...register("customerName")} />
                    {errors.customerName && <span className="text-destructive text-sm">{errors.customerName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <Input placeholder="+91..." type="tel" className="h-12" {...register("customerPhone")} />
                    {errors.customerPhone && <span className="text-destructive text-sm">{errors.customerPhone.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                    <div className="relative">
                      <Input type="date" className="h-12 w-full pr-10" min={format(new Date(), 'yyyy-MM-dd')} {...register("date")} />
                    </div>
                    {errors.date && <span className="text-destructive text-sm">{errors.date.message}</span>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                            <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                            <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                            <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                            <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                            <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                            <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.time && <span className="text-destructive text-sm">{errors.time.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                    <Input type="number" min="1" max="20" className="h-12" {...register("guests")} />
                    {errors.guests && <span className="text-destructive text-sm">{errors.guests.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Special Requests (Optional)</label>
                  <Textarea placeholder="Any dietary requirements or special occasions?" className="min-h-[100px] resize-none" {...register("notes")} />
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 text-lg bg-foreground hover:bg-foreground/90 text-background rounded-xl"
                >
                  {isPending ? "Submitting..." : "Confirm Reservation"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
