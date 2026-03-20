import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { MessageCircle, RefreshCw } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "preparing": "bg-blue-100 text-blue-800 border-blue-200",
  "ready": "bg-green-100 text-green-800 border-green-200",
  "delivered": "bg-gray-100 text-gray-800 border-gray-200",
  "cancelled": "bg-red-100 text-red-800 border-red-200"
};

const STATUS_LABELS: Record<string, string> = {
  "pending": "⏳ Pending",
  "preparing": "👨‍🍳 Preparing",
  "ready": "✅ Ready",
  "delivered": "🚀 Delivered",
  "cancelled": "❌ Cancelled"
};

function buildConfirmationMessage(order: {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: string;
  totalAmount: number;
  status: string;
}) {
  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const msg =
    `🍽️ *Little Village Restaurant*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Hello *${order.customerName}* 👋\n\n` +
    `Your order *#${order.id}* has been received and is now *${statusLabel}*.\n\n` +
    `📋 *Order Details:*\n${order.items}\n\n` +
    `💰 *Total Amount:* ₹${Number(order.totalAmount).toFixed(2)}\n\n` +
    `📍 *Delivery Address:*\n${order.customerAddress}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `Thank you for choosing Little Village Restaurant! 🙏\n` +
    `For any queries, call us: *090100 38444*`;
  return msg;
}

function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return "91" + cleaned.slice(1);
  if (cleaned.length === 10) return "91" + cleaned;
  return cleaned;
}

export default function AdminOrders() {
  const { data: orders, isLoading, refetch } = useGetOrders({ restaurantId: "little-village" });
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
          toast({ title: "Order status updated" });
        },
        onError: () => toast({ title: "Update failed", variant: "destructive" })
      }
    );
  };

  const handleSendConfirmation = (order: NonNullable<typeof orders>[number]) => {
    const phone = formatPhone(order.customerPhone);
    const message = buildConfirmationMessage({
      ...order,
      totalAmount: Number(order.totalAmount),
    });
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground">Manage incoming orders and send WhatsApp confirmations to customers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, cls]) => (
          <span key={status} className={`px-3 py-1 rounded-full border font-semibold ${cls}`}>
            {STATUS_LABELS[status]}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Notify</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders?.map(order => (
              <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="font-bold text-primary">#{order.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM d, h:mm a")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[160px]" title={order.customerAddress}>
                    📍 {order.customerAddress}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[220px] text-muted-foreground leading-relaxed">
                    {order.items}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-foreground text-base">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                    disabled={isPending}
                  >
                    <SelectTrigger className={`w-[140px] h-8 text-xs font-bold border ${STATUS_COLORS[order.status] || ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">⏳ Pending</SelectItem>
                      <SelectItem value="preparing">👨‍🍳 Preparing</SelectItem>
                      <SelectItem value="ready">✅ Ready</SelectItem>
                      <SelectItem value="delivered">🚀 Delivered</SelectItem>
                      <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() => handleSendConfirmation(order)}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-1.5 shadow-sm"
                    title={`Send WhatsApp confirmation to ${order.customerName}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-xs">Send</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-medium">No orders yet</p>
                  <p className="text-sm mt-1">Orders from the website will appear here.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
