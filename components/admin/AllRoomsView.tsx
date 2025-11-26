import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, X, Crown, PawPrint, RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface Room {
  id: string;
  type: string;
  pricePerNight: number;
  available: boolean;
  capacity?: number;
  amenities?: string[];
  petFriendly?: boolean;
  vip?: boolean;
}

export function AllRoomsView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<"all" | "available" | "booked">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/rooms`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.rooms) {
        setRooms(data.rooms);
      } else {
        toast.error("Failed to fetch rooms");
      }
    } catch (error) {
      toast.error("Error loading rooms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    if (filter === "available") return room.available;
    if (filter === "booked") return !room.available;
    return true;
  });

  const toggleAvailability = async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newAvailability = !room.available;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/rooms/${roomId}/availability`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ available: newAvailability }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setRooms(rooms.map(r => 
          r.id === roomId ? { ...r, available: newAvailability } : r
        ));
        toast.success(`Room ${roomId} marked as ${newAvailability ? "available" : "booked"}`);
      } else {
        toast.error("Failed to update room availability");
      }
    } catch (error) {
      toast.error("Error updating room");
    }
  };

  const availableCount = rooms.filter(r => r.available).length;
  const bookedCount = rooms.filter(r => !r.available).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-amber-900" size={24} />
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl">{rooms.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl text-green-600">{availableCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl text-red-600">{bookedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-amber-900 hover:bg-amber-800" : ""}
        >
          All Rooms
        </Button>
        <Button
          variant={filter === "available" ? "default" : "outline"}
          onClick={() => setFilter("available")}
          className={filter === "available" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Available
        </Button>
        <Button
          variant={filter === "booked" ? "default" : "outline"}
          onClick={() => setFilter("booked")}
          className={filter === "booked" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Booked
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{room.type}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Room ID: {room.id}</p>
                </div>
                <div className="flex gap-2">
                  {room.vip && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Crown size={14} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                  {room.petFriendly && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <PawPrint size={14} className="mr-1" />
                      Pet
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl text-amber-900">₹{room.pricePerNight.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>

                <div className="flex items-center gap-2">
                  {room.available ? (
                    <Badge className="bg-green-600">
                      <Check size={14} className="mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X size={14} className="mr-1" />
                      Booked
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toggleAvailability(room.id)}
                >
                  Mark as {room.available ? "Booked" : "Available"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}