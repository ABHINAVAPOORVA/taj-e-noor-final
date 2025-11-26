import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { rooms, services } from "../../data/mockData";
import { Search, User, Phone, Mail, Calendar, CreditCard } from "lucide-react";
import { bookingsAPI } from "../../utils/api";
import { toast } from "sonner";

export function CustomerSearchView() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSearching(true);
    try {
      const response = await bookingsAPI.searchByEmail(searchEmail);
      
      if (response.success) {
        setSearchResults(response.bookings);
        setSearched(true);
        
        if (response.bookings.length === 0) {
          toast.info("No bookings found for this email");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to search bookings");
    } finally {
      setIsSearching(false);
    }
  };

  const getRoomDetails = (roomId: string) => {
    return rooms.find(r => r.id === roomId);
  };

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => services.find(s => s.id === id)?.name).filter(Boolean);
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Customer History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter customer email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-amber-900 hover:bg-amber-800">
              <Search size={18} className="mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div>
          {searchResults.length > 0 ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Search Results</h2>
                <p className="text-gray-600">Found {searchResults.length} booking(s)</p>
              </div>

              <div className="space-y-6">
                {searchResults.map((booking) => {
                  const room = getRoomDetails(booking.roomId);
                  const serviceNames = getServiceNames(booking.selectedServices);

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
                          <Badge className={booking.status === "confirmed" ? "bg-green-600" : "bg-gray-600"}>
                            {booking.status === "confirmed" ? "Active" : "Cancelled"}
                          </Badge>
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
                              <span className="text-gray-500">Stay Duration:</span> {booking.pricing?.totalDays || 0} nights
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
                              <span className="text-gray-600">Room Charges</span>
                              <span>₹{booking.pricing?.roomCharges.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Service Charges</span>
                              <span>₹{booking.pricing?.serviceCharges.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">GST (18%)</span>
                              <span>₹{booking.pricing?.gst.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span>Grand Total</span>
                              <span className="text-xl text-amber-900">₹{booking.pricing?.grandTotal.toLocaleString() || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No bookings found for "{searchEmail}"</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}