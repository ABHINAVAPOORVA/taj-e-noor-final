import { rooms } from "../../data/mockData";
import { Room } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Crown, PawPrint, Check } from "lucide-react";

interface RoomSelectionProps {
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room) => void;
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  numberOfGuests: number;
  setNumberOfGuests: (guests: number) => void;
}

export function RoomSelection({
  selectedRoom,
  setSelectedRoom,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  numberOfGuests,
  setNumberOfGuests,
}: RoomSelectionProps) {
  const availableRooms = rooms.filter(room => room.available);

  return (
    <div>
      <h2 className="text-3xl mb-6">Select Your Room</h2>

      {/* Date and Guest Selection */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
        <div>
          <Label>Check-in Date</Label>
          <Input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <Label>Check-out Date</Label>
          <Input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <Label>Number of Guests</Label>
          <Select value={numberOfGuests.toString()} onValueChange={(val) => setNumberOfGuests(parseInt(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="3">3 Guests</SelectItem>
              <SelectItem value="4">4 Guests</SelectItem>
              <SelectItem value="5">5+ Guests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Available Rooms */}
      <h3 className="text-xl mb-4">Available Rooms</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {availableRooms.map((room) => (
          <Card
            key={room.id}
            className={`cursor-pointer transition-all ${
              selectedRoom?.id === room.id
                ? "border-amber-900 border-2 shadow-lg"
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Room ID: {room.id}</p>
                </div>
                <div className="flex gap-2 items-start">
                  {selectedRoom?.id === room.id && (
                    <div className="w-6 h-6 bg-amber-900 text-white rounded-full flex items-center justify-center">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {room.vip && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Crown size={14} className="mr-1" />
                      VIP
                    </Badge>
                  )}
                  {room.petFriendly && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <PawPrint size={14} className="mr-1" />
                      Pet Friendly
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-3xl text-amber-900">₹{room.pricePerNight.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableRooms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No rooms available for the selected dates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
