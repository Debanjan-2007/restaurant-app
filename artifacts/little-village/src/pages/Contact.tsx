import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We will get back to you shortly.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="bg-[#2d1b19] pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            We'd love to hear from you. Reach out with any questions, feedback, or special requests.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Our Location</h4>
                      <p className="text-muted-foreground">Service Road, Mangalagiri, Chinnakakani, Andhra Pradesh 522508, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone / WhatsApp</h4>
                      <p className="text-muted-foreground">+91 90100 38444</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Email Address</h4>
                      <p className="text-muted-foreground">hello@littlevillage.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed dummy representation */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border h-64 bg-muted relative flex items-center justify-center">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15302.261942004246!2d80.5422!3d16.4307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0f3ffffffff%3A0x8888888888888888!2sLittle%20Village%20Restaurant!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    className="absolute inset-0"
                    title="Google Map Location"
                  ></iframe>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card p-10 rounded-3xl border border-border shadow-xl">
              <h3 className="text-2xl font-display font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input required placeholder="Your Name" className="h-12 bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input required type="email" placeholder="you@example.com" className="h-12 bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input required placeholder="How can we help?" className="h-12 bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea required placeholder="Write your message here..." className="min-h-[150px] bg-background resize-none" />
                </div>
                <Button type="submit" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20">
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
