import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, MapPin, ChefHat } from "lucide-react";
import { useGetMenuItems } from "@workspace/api-client-react";
import { MenuItemCard } from "@/components/MenuItemCard";

export default function Home() {
  const { data: menuItems, isLoading } = useGetMenuItems({
    restaurantId: "little-village",
  });

  const featuredItems =
    menuItems?.filter((i) => i.isFeatured && i.isAvailable).slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10" />
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Little Village Restaurant Atmosphere"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-secondary font-medium tracking-widest uppercase text-sm md:text-base mb-4 block">
              Welcome to
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 drop-shadow-lg">
              Little Village
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              Traditional provisions are dished up in this spacious,
              unpretentious restaurant. Experience the authentic flavors of
              Andhra in every bite.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/order">
                <Button className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white border-2 border-primary shadow-xl shadow-primary/20 transition-all hover:scale-105">
                  Order Online
                </Button>
              </Link>
              <Link href="/reservations">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white hover:text-foreground transition-all"
                >
                  Book a Table
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={`${import.meta.env.BASE_URL}images/about-img.png`}
                  alt="Chef preparing dish"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-card p-6 rounded-2xl shadow-xl border border-border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl">4.9/5</p>
                    <p className="text-sm text-muted-foreground">
                      Customer Rating
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                Authentic Flavors, <br />
                Unforgettable Moments.
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                At Little Village, we believe that great food brings people
                together. Our recipes have been passed down through generations,
                ensuring that every dish we serve is packed with traditional
                flavors and cooked with the utmost care.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Whether you're joining us for a family dinner, a casual lunch,
                or ordering from the comfort of your home, we promise an
                experience that celebrates the true essence of Indian cuisine.
              </p>
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/5 rounded-full px-0 font-semibold group"
                >
                  Discover Our Story
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
              Chef's Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Signature Dishes
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore the dishes that made us famous. Prepared fresh daily with
              locally sourced ingredients and traditional spices.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-card animate-pulse rounded-2xl"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.length > 0 ? (
                featuredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <MenuItemCard item={item} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No featured items available right now. Please check our full
                  menu.
                </div>
              )}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/menu">
              <Button className="h-12 px-8 rounded-full bg-foreground hover:bg-foreground/90 text-background">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <ChefHat className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">
                Master Chefs
              </h3>
              <p className="text-muted-foreground">
                Our culinary team brings decades of experience from the finest
                kitchens.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary/20 text-secondary-foreground flex items-center justify-center mb-6">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">
                Fast Delivery
              </h3>
              <p className="text-muted-foreground">
                Order online and get your food delivered hot and fresh directly
                to you via WhatsApp.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-accent/20 text-accent-foreground flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">
                Perfect Location
              </h3>
              <p className="text-muted-foreground">
                Spacious and unpretentious setting in Mangalagiri, perfect for
                families.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
