import { Calendar, Users, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useNavigate } from "react-router-dom";

export function BookingWidget() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/booking");
  };

  return null;
}