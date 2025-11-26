import { Room, Customer } from "../../types";
import { services } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Calendar, User, Phone, Mail, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useState } from "react";
import { bookingsAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface BillingSummaryProps {
  selectedRoom: Room;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  selectedServices: string[];
  customerDetails: Customer;
}

export function BillingSummary({
  selectedRoom,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  selectedServices,
  customerDetails,
}: BillingSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Calculate days
  const calculateDays = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalStayDays = calculateDays();
  const roomCharges = selectedRoom.pricePerNight * totalStayDays;
  
  const serviceCharges = services
    .filter(service => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0);
  
  const subtotal = roomCharges + serviceCharges;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const selectedServiceNames = services
    .filter(s => selectedServices.includes(s.id))
    .map(s => s.name);

  const handleConfirmBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your booking");
      navigate("/signin");
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        roomId: selectedRoom.id,
        roomType: selectedRoom.name,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        customerDetails: {
          name: customerDetails.name,
          age: customerDetails.age,
          gender: customerDetails.gender,
          contact: customerDetails.contactNo,
          validId: customerDetails.validId,
        },
        selectedServices,
        pricing: {
          totalDays: totalStayDays,
          roomCharges,
          serviceCharges,
          gst,
          grandTotal,
        },
      };

      const response = await bookingsAPI.create(bookingData);

      if (response.success) {
        toast.success("Booking Confirmed!", {
          description: `Your booking has been successfully confirmed. Booking ID: ${response.booking.id}. A confirmation email has been sent to ${customerDetails.email || user?.email}`,
          duration: 5000,
        });
        
        // Redirect to home after successful booking
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-6">Review & Confirm Booking</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Booking Details */}
        <div className="space-y-6">
          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Room Type</p>
                <p className="text-lg">{selectedRoom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Room ID</p>
                <p>{selectedRoom.id}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-gray-500" />
                <span>{checkInDate} to {checkOutDate}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{totalStayDays} night(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Guests</p>
                <p>{numberOfGuests} guest(s)</p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span>{customerDetails.name} ({customerDetails.age} yrs, {customerDetails.gender})</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span>{customerDetails.contactNo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span>{customerDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-500" />
                <span>ID: {customerDetails.validId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          {selectedServiceNames.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedServiceNames.map((name, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Billing */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Room Charges */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Room Charges</span>
                  <span>₹{roomCharges.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {totalStayDays} night(s) × ₹{selectedRoom.pricePerNight.toLocaleString()}
                </p>
              </div>

              <Separator />

              {/* Service Charges */}
              {serviceCharges > 0 && (
                <>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Additional Services</span>
                      <span>₹{serviceCharges.toLocaleString()}</span>
                    </div>
                    {services
                      .filter(s => selectedServices.includes(s.id))
                      .map(service => (
                        <div key={service.id} className="flex justify-between text-sm text-gray-500">
                          <span>{service.name}</span>
                          <span>₹{service.price.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                  <Separator />
                </>
              )}

              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <Separator />

              {/* GST */}
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>

              <Separator />

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl">Grand Total</span>
                <span className="text-3xl text-amber-900">₹{grandTotal.toLocaleString()}</span>
              </div>

              <Button
                className="w-full bg-amber-900 hover:bg-amber-800 h-12 text-lg"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading ? "Confirming..." : "Confirm Booking & Pay"}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                📧 A confirmation email will be sent to <strong>{customerDetails.email}</strong> after booking
              </div>

              <p className="text-xs text-gray-500 text-center">
                By confirming, you agree to our Terms & Conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}