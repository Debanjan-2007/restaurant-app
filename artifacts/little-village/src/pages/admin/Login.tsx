import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutateAsync: login, isPending } = useAdminLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await login({ data });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      setLocation("/admin/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Invalid credentials.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d1b19] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center text-white font-display font-bold text-3xl mb-4 shadow-lg">LV</div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Manage Little Village Restaurant</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="admin@littlevillage.com" className="h-12" {...register("email")} />
            {errors.email && <span className="text-destructive text-sm mt-1">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" className="h-12" {...register("password")} />
            {errors.password && <span className="text-destructive text-sm mt-1">{errors.password.message}</span>}
          </div>
          
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg mt-4"
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
