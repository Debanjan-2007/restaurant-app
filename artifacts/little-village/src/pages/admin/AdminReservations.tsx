import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetReservations, useUpdateReservationStatus } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "confirmed": "bg-green-100 text-green-800 border-green-200",
  "completed": "bg-blue-100 text-blue-800 border-blue-200",
  "cancelled": "bg-red-100 text-red-800 border-red-200"
};

export default function AdminReservations() {
  const { data: reservations, isLoading } = useGetReservations({ restaurantId: "little-village" });
  const { mutate: updateStatus } = useUpdateReservationStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateStatus(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
          toast({ title: "Reservation updated" });
        },
        onError: () => toast({ title: "Update failed", variant: "destructive" })
      }
    );
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Table Reservations</h2>
        <p className="text-muted-foreground">Manage dining bookings and guest seating.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer Info</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : reservations?.map(res => (
              <TableRow key={res.id}>
                <TableCell>
                  <div className="font-bold">{res.date}</div>
                  <div className="text-primary font-medium">{res.time}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{res.customerName}</div>
                  <div className="text-sm text-muted-foreground">{res.customerPhone}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold">{res.guests}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[200px] truncate" title={res.notes}>
                    {res.notes || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Select value={res.status} onValueChange={(val) => handleStatusChange(res.id, val)}>
                    <SelectTrigger className={`w-[130px] h-8 text-xs font-bold border ${STATUS_COLORS[res.status] || ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {reservations?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No reservations found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
