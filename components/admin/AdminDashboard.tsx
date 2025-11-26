import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AllRoomsView } from "./AllRoomsView";
import { CurrentBookingsView } from "./CurrentBookingsView";
import { CustomerSearchView } from "./CustomerSearchView";
import { OverviewDashboard } from "./OverviewDashboard";
import { LayoutDashboard, Bed, Calendar, Search, Image, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage rooms, bookings, and customer information</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/admin/image-manager')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Image size={18} />
              Manage Images
            </Button>
            <Button
              onClick={() => navigate('/admin/email-setup-guide')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail size={18} />
              Email Setup
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Bed size={18} />
              <span>All Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Current Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search size={18} />
              <span>Customer Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewDashboard />
          </TabsContent>

          <TabsContent value="rooms">
            <AllRoomsView />
          </TabsContent>

          <TabsContent value="bookings">
            <CurrentBookingsView />
          </TabsContent>

          <TabsContent value="search">
            <CustomerSearchView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}