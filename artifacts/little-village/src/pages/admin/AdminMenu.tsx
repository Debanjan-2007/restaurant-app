import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, type MenuItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages"];

export default function AdminMenu() {
  const { data: items, isLoading } = useGetMenuItems({ restaurantId: "little-village" });
  const { mutateAsync: createItem } = useCreateMenuItem();
  const { mutateAsync: updateItem } = useUpdateMenuItem();
  const { mutateAsync: deleteItem } = useDeleteMenuItem();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "Main Course",
      imageUrl: "",
      isAvailable: true,
      isFeatured: false,
    }
  });

  const openNew = () => {
    setEditingId(null);
    reset({ name: "", description: "", price: 0, category: "Main Course", imageUrl: "", isAvailable: true, isFeatured: false });
    setIsDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    reset({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingId) {
        await updateItem({ id: editingId, data });
        toast({ title: "Item updated" });
      } else {
        await createItem({ data: { ...data, restaurantId: "little-village" } });
        toast({ title: "Item created" });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      setIsDialogOpen(false);
    } catch (err) {
      toast({ title: "Error saving item", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      toast({ title: "Item deleted" });
    } catch {
      toast({ title: "Error deleting item", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-primary text-white"><Plus className="w-4 h-4 mr-2"/> Add Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Item" : "Create New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div>
                <Label>Name</Label>
                <Input required {...register("name")} />
              </div>
              <div>
                <Label>Description</Label>
                <Input {...register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" required min="0" step="0.01" {...register("price", { valueAsNumber: true })} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div>
                <Label>Image URL (Optional)</Label>
                <Input type="url" {...register("imageUrl")} placeholder="https://..." />
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <Label className="cursor-pointer font-normal">Available for Order</Label>
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <Label className="cursor-pointer font-normal">Featured (Chef's Special)</Label>
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="w-full">Save Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : items?.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</span>
                  </div>
                </TableCell>
                <TableCell><span className="px-2 py-1 bg-muted rounded text-xs">{item.category}</span></TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="w-4 h-4 text-blue-500" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {items?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No menu items found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
