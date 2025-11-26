import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { rooms, services } from "../../data/mockData";
import { Calendar, User, Phone, Mail, CreditCard, X, Edit, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { bookingsAPI } from "../../utils/api";
import { toast } from "sonner";

export function CurrentBookingsView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setIsRefreshing(true);
      
      const response = await bookingsAPI.getAll();
      
      if (response.success) {
        setBookings(response.bookings);
        if (showRefreshToast) {
          toast.success("Bookings refreshed");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activeBookings = bookings.filter(b => b.status === "confirmed");

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await bookingsAPI.cancel(bookingId);
      
      if (response.success) {
        toast.success("Booking cancelled successfully");
        // Refresh the bookings list
        fetchBookings();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const getRoomDetails = (roomId: string) => {
    return rooms.find(r => r.id === roomId);
  };

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => services.find(s => s.id === id)?.name).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-2">Current Bookings</h2>
          <p className="text-gray-600">Total Active Bookings: {activeBookings.length}</p>
        </div>
        <Button 
          onClick={() => fetchBookings(true)} 
          variant="outline"
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} size={16} />
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {activeBookings.map((booking) => {
          const room = getRoomDetails(booking.roomId);
          const serviceNames = getServiceNames(booking.selectedServices || []);

          return (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Booking #{booking.id}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div className="space-y-3">
                    <h3 className="mb-3">Customer Details</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span>{booking.customerDetails.name} ({booking.customerDetails.age} yrs, {booking.customerDetails.gender})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-500" />
                      <span>{booking.customerDetails.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-gray-500" />
                      <span>{booking.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard size={16} className="text-gray-500" />
                      <span>ID: {booking.customerDetails.validId}</span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <h3 className="mb-3">Booking Details</h3>
                    <div className="text-sm">
                      <span className="text-gray-500">Room:</span> {booking.roomType} ({booking.roomId})
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span>{booking.checkInDate} to {booking.checkOutDate}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Guests:</span> {booking.numberOfGuests}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Stay Duration:</span> {booking.pricing.totalDays} nights
                    </div>
                    {serviceNames.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-500">Services:</span> {serviceNames.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="mb-3">Billing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Charges ({booking.pricing.totalDays} nights × ₹{room?.pricePerNight.toLocaleString()})</span>
                      <span>₹{booking.pricing.roomCharges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Charges</span>
                      <span>₹{booking.pricing.serviceCharges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span>₹{booking.pricing.gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span>Grand Total</span>
                      <span className="text-xl text-amber-900">₹{booking.pricing.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Edit size={16} className="mr-2" />
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Booking</DialogTitle>
                        <DialogDescription>
                          Booking update functionality will be available here.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <X size={16} className="mr-2" />
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel booking #{booking.id}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => cancelBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeBookings.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No active bookings found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}