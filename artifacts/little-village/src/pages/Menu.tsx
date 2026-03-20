import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useGetMenuItems } from "@workspace/api-client-react";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: menuItems, isLoading } = useGetMenuItems({ restaurantId: "little-village" });

  const filteredItems = menuItems?.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <Layout>
      {/* Menu Header */}
      <section className="bg-[#2d1b19] pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Our Menu</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Discover our carefully curated selection of traditional Indian dishes, made with love and authentic spices.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-card border-border h-11"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                 <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl"></div>
               ))}
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuItemCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
