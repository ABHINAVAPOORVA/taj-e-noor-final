import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { sendBookingConfirmationEmail } from "./emailService.tsx";

// Create our main app using Hono framework
const app = new Hono();

// Middleware - Think of these as "helpers" that run on every request
// CORS allows our frontend to talk to backend
app.use("*", cors());
// Logger helps us see what's happening (like a diary!)
app.use("*", logger(console.log));

// Helper function to connect to Supabase database
// serviceRole = true means "admin access" (can do anything)
// serviceRole = false means "public access" (limited permissions)
const getSupabaseClient = (serviceRole = false) => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",  // Our database URL
    serviceRole 
      ? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""  // Secret admin key
      : Deno.env.get("SUPABASE_ANON_KEY") ?? ""          // Public key
  );
};

// ============================================================================
// AUTH ROUTES - Handles user signup, login, and profile
// ============================================================================

// Sign Up Route - Creates new user account
app.post("/make-server-e031cba6/auth/signup", async (c) => {
  try {
    // Get the data sent from frontend
    const body = await c.req.json();
    const { email, password, fullName, phone, age, gender, isAdmin } = body;

    // Step 1: Check if all required fields are provided
    if (!email || !password || !fullName) {
      return c.json({ error: "Email, password, and full name are required" }, 400);
    }

    // Step 2: Validate password length (security!)
    if (password.length < 8) {
      return c.json({ error: "Password must be at least 8 characters long" }, 400);
    }

    // Step 3: Connect to database with admin privileges
    const supabase = getSupabaseClient(true);
    
    // Step 4: Check if user already exists with this email
    console.log(`Checking if user exists: ${email}`);
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);
    
    if (userExists) {
      console.log(`User already exists: ${email}`);
      return c.json({ error: "An account with this email already exists" }, 400);
    }
    
    // Step 5: Create the user account!
    console.log(`Creating new user: ${email}`);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (we haven't set up email server yet)
      user_metadata: {
        full_name: fullName,
        phone: phone || "",
        age: age || "",
        gender: gender || "",
        role: isAdmin ? "admin" : "customer", // Decide if admin or regular customer
      },
    });

    if (error) {
      console.error("Error creating user during signup:", error);
      return c.json({ error: error.message }, 400);
    }

    // Step 6: Save extra user info to our database
    if (data.user) {
      await kv.set(`user_profile:${data.user.id}`, {
        id: data.user.id,
        email,
        fullName,
        phone: phone || "",
        age: age || "",
        gender: gender || "",
        role: isAdmin ? "admin" : "customer",
        createdAt: new Date().toISOString(),
      });
      
      console.log(`✅ User created successfully: ${email} (ID: ${data.user.id}) - Role: ${isAdmin ? "admin" : "customer"}`);
    }

    // Step 7: Send success response to frontend
    return c.json({
      success: true,
      message: "Account created successfully. You can now sign in.",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: isAdmin ? "admin" : "customer",
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Get Current User Profile
app.get("/make-server-e031cba6/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error("Error getting user profile:", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get additional profile data from KV store
    const profile = await kv.get(`user_profile:${user.id}`);

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
        ...profile,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return c.json({ error: "Internal server error while fetching profile" }, 500);
  }
});

// ============================================================================
// ROOM MANAGEMENT ROUTES
// ============================================================================

// Get all rooms
app.get("/make-server-e031cba6/rooms", async (c) => {
  try {
    const rooms = await kv.get("rooms") || [
      {
        id: "zaria-001",
        type: "Zaria Room",
        pricePerNight: 5000,
        available: true,
        capacity: 2,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "City View"],
      },
      {
        id: "nizam-001",
        type: "Nizam Deluxe",
        pricePerNight: 8000,
        available: true,
        capacity: 3,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "Premium Bedding", "Balcony"],
      },
      {
        id: "begum-001",
        type: "Begum Chamber (Pet-Friendly)",
        pricePerNight: 10000,
        available: true,
        capacity: 2,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "Pet Amenities", "Garden View"],
        petFriendly: true,
      },
      {
        id: "emperor-001",
        type: "Emperor Chamber (VIP & Pet-Friendly)",
        pricePerNight: 15000,
        available: true,
        capacity: 4,
        amenities: ["King Bed", "Separate Living Room", "WiFi", "TV", "Mini Bar", "Butler Service", "Pet Amenities"],
        petFriendly: true,
        vip: true,
      },
    ];

    // Initialize rooms if not exists
    await kv.set("rooms", rooms);

    return c.json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return c.json({ error: "Internal server error while fetching rooms" }, 500);
  }
});

// Update room availability
app.patch("/make-server-e031cba6/rooms/:roomId/availability", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized - Admin access required" }, 401);
    }

    const roomId = c.req.param("roomId");
    const { available } = await c.req.json();

    const rooms = await kv.get("rooms") || [];
    const roomIndex = rooms.findIndex((r: any) => r.id === roomId);

    if (roomIndex === -1) {
      return c.json({ error: "Room not found" }, 404);
    }

    rooms[roomIndex].available = available;
    await kv.set("rooms", rooms);

    return c.json({ success: true, room: rooms[roomIndex] });
  } catch (error) {
    console.error("Error updating room availability:", error);
    return c.json({ error: "Internal server error while updating room" }, 500);
  }
});

// ============================================================================
// SERVICES ROUTES
// ============================================================================

// Get all available services
app.get("/make-server-e031cba6/services", async (c) => {
  try {
    const services = await kv.get("services") || [
      { id: "restro", name: "Restro", price: 2000, description: "Fine dining experience" },
      { id: "spa", name: "Spa and wellness", price: 3500, description: "Luxury spa treatments" },
      { id: "palace-tour", name: "Palace tour", price: 1500, description: "Guided heritage tour" },
      { id: "pet-salon", name: "Pet salon", price: 1000, description: "Professional pet grooming" },
      { id: "hobby-room", name: "Hobby room", price: 800, description: "Recreation and activities" },
      { id: "gym", name: "Gym", price: 500, description: "State-of-the-art fitness center" },
      { id: "pool", name: "Swimming pool", price: 1000, description: "Infinity rooftop pool" },
      { id: "bar", name: "Private Bar", price: 2500, description: "Exclusive bar access" },
    ];

    // Initialize services if not exists
    await kv.set("services", services);

    return c.json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return c.json({ error: "Internal server error while fetching services" }, 500);
  }
});

// ============================================================================
// BOOKING ROUTES
// ============================================================================

// Create a new booking
app.post("/make-server-e031cba6/bookings", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized - Please sign in to book" }, 401);
    }

    const body = await c.req.json();
    const {
      roomId,
      roomType,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      customerDetails,
      selectedServices,
      pricing,
    } = body;

    // Validate required fields
    if (!roomId || !checkInDate || !checkOutDate || !customerDetails) {
      return c.json({ error: "Missing required booking information" }, 400);
    }

    // Generate booking ID
    const bookingId = `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create booking object
    const booking = {
      id: bookingId,
      userId: user.id,
      userEmail: user.email,
      roomId,
      roomType,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      customerDetails,
      selectedServices: selectedServices || [],
      pricing,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save booking
    await kv.set(`booking:${bookingId}`, booking);

    // Add to user's bookings list
    const userBookings = await kv.get(`user_bookings:${user.id}`) || [];
    userBookings.push(bookingId);
    await kv.set(`user_bookings:${user.id}`, userBookings);

    // Add to all bookings list
    const allBookings = await kv.get("all_bookings") || [];
    allBookings.push(bookingId);
    await kv.set("all_bookings", allBookings);

    // Update room availability
    const rooms = await kv.get("rooms") || [];
    const roomIndex = rooms.findIndex((r: any) => r.id === roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex].available = false;
      await kv.set("rooms", rooms);
    }

    // Send booking confirmation email
    try {
      const services = await kv.get("services") || [];
      const selectedServiceNames = (selectedServices || [])
        .map((serviceId: string) => services.find((s: any) => s.id === serviceId)?.name)
        .filter(Boolean);

      const emailSuccess = await sendBookingConfirmationEmail({
        customerName: customerDetails.name,
        customerEmail: user.email || "",
        bookingId,
        roomType,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalDays: pricing.totalDays,
        roomCharges: pricing.roomCharges,
        serviceCharges: pricing.serviceCharges,
        gst: pricing.gst,
        grandTotal: pricing.grandTotal,
        services: selectedServiceNames,
      });

      if (emailSuccess) {
        console.log(`Confirmation email sent successfully for booking ${bookingId}`);
      } else {
        console.log(`Booking ${bookingId} created but email notification failed`);
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return c.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ error: "Internal server error while creating booking" }, 500);
  }
});

// Get all bookings (Admin)
app.get("/make-server-e031cba6/bookings", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized - Admin access required" }, 401);
    }

    const allBookingIds = await kv.get("all_bookings") || [];
    const bookings = [];

    for (const bookingId of allBookingIds) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking) {
        bookings.push(booking);
      }
    }

    // Sort by creation date (newest first)
    bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ error: "Internal server error while fetching bookings" }, 500);
  }
});

// Get user's bookings
app.get("/make-server-e031cba6/bookings/my-bookings", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userBookingIds = await kv.get(`user_bookings:${user.id}`) || [];
    const bookings = [];

    for (const bookingId of userBookingIds) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking) {
        bookings.push(booking);
      }
    }

    // Sort by creation date (newest first)
    bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return c.json({ error: "Internal server error while fetching user bookings" }, 500);
  }
});

// Search booking by email (Admin)
app.get("/make-server-e031cba6/bookings/search", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized - Admin access required" }, 401);
    }

    const email = c.req.query("email");
    if (!email) {
      return c.json({ error: "Email parameter is required" }, 400);
    }

    const allBookingIds = await kv.get("all_bookings") || [];
    const bookings = [];

    for (const bookingId of allBookingIds) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking && booking.userEmail?.toLowerCase().includes(email.toLowerCase())) {
        bookings.push(booking);
      }
    }

    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error searching bookings:", error);
    return c.json({ error: "Internal server error while searching bookings" }, 500);
  }
});

// Cancel booking
app.delete("/make-server-e031cba6/bookings/:bookingId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param("bookingId");
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();
    await kv.set(`booking:${bookingId}`, booking);

    // Make room available again
    const rooms = await kv.get("rooms") || [];
    const roomIndex = rooms.findIndex((r: any) => r.id === booking.roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex].available = true;
      await kv.set("rooms", rooms);
    }

    return c.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return c.json({ error: "Internal server error while cancelling booking" }, 500);
  }
});

// Update booking
app.patch("/make-server-e031cba6/bookings/:bookingId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const supabase = getSupabaseClient(true);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingId = c.req.param("bookingId");
    const updates = await c.req.json();
    
    const booking = await kv.get(`booking:${bookingId}`);

    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Update booking with new data
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, updatedBooking);

    return c.json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return c.json({ error: "Internal server error while updating booking" }, 500);
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/make-server-e031cba6/health", (c) => {
  return c.json({ status: "ok", message: "Hotel Management API is running" });
});

// ============================================================================
// ADMIN ACCOUNT MANAGEMENT
// ============================================================================

// Check if an admin account exists
app.post("/make-server-e031cba6/admin/check-account", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const supabase = getSupabaseClient(true);
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const userExists = users?.some(u => u.email?.toLowerCase() === email.toLowerCase());

    return c.json({ exists: userExists, email });
  } catch (error) {
    console.error("Error checking account:", error);
    return c.json({ error: "Failed to check account", exists: false }, 500);
  }
});

// Reset admin password
app.post("/make-server-e031cba6/admin/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return c.json({ error: "Email and new password are required" }, 400);
    }

    if (newPassword.length < 8) {
      return c.json({ error: "Password must be at least 8 characters long" }, 400);
    }

    const supabase = getSupabaseClient(true);
    
    // Find the user by email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return c.json({ error: "Admin account not found" }, 404);
    }

    // Update the user's password
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error("Error resetting password:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log(`Admin password reset successfully for: ${email}`);
    return c.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return c.json({ error: "Failed to reset password" }, 500);
  }
});

// Delete admin account
app.delete("/make-server-e031cba6/admin/delete-account", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const supabase = getSupabaseClient(true);
    
    // Find the user by email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return c.json({ error: "Admin account not found" }, 404);
    }

    // Delete the user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error("Error deleting user:", error);
      return c.json({ error: error.message }, 400);
    }

    // Delete user profile from KV store
    await kv.del(`user_profile:${user.id}`);
    await kv.del(`user_bookings:${user.id}`);

    console.log(`Admin account deleted successfully: ${email}`);
    return c.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    return c.json({ error: "Failed to delete account" }, 500);
  }
});

// ============================================================================
// DATABASE MANAGEMENT
// ============================================================================

// Clear all data (for development/testing)
app.delete("/make-server-e031cba6/admin/clear-database", async (c) => {
  try {
    console.log("[CLEAR DATABASE] ===== STARTING DATABASE CLEAR =====");
    
    // Delete all bookings
    const allBookingIds = await kv.get("all_bookings") || [];
    console.log(`[CLEAR DATABASE] Deleting ${allBookingIds.length} bookings...`);
    
    for (const bookingId of allBookingIds) {
      await kv.del(`booking:${bookingId}`);
    }
    await kv.del("all_bookings");
    
    // Delete all user bookings - we need to find them manually
    console.log("[CLEAR DATABASE] Deleting user bookings...");
    const supabase = getSupabaseClient(true);
    
    // Get all users to find their booking keys
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const userBookingKeys = users?.map(u => `user_bookings:${u.id}`) || [];
    for (const key of userBookingKeys) {
      await kv.del(key);
    }
    
    // Delete all user profiles
    console.log("[CLEAR DATABASE] Deleting user profiles...");
    const userProfileKeys = users?.map(u => `user_profile:${u.id}`) || [];
    for (const key of userProfileKeys) {
      await kv.del(key);
    }
    
    // Reset rooms to default state
    console.log("[CLEAR DATABASE] Resetting rooms to default state...");
    const defaultRooms = [
      {
        id: "zaria-001",
        type: "Zaria Room",
        pricePerNight: 5000,
        available: true,
        capacity: 2,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "City View"],
      },
      {
        id: "nizam-001",
        type: "Nizam Deluxe",
        pricePerNight: 8000,
        available: true,
        capacity: 3,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "Premium Bedding", "Balcony"],
      },
      {
        id: "begum-001",
        type: "Begum Chamber (Pet-Friendly)",
        pricePerNight: 10000,
        available: true,
        capacity: 2,
        amenities: ["King Bed", "WiFi", "TV", "Mini Bar", "Pet Amenities", "Garden View"],
        petFriendly: true,
      },
      {
        id: "emperor-001",
        type: "Emperor Chamber (VIP & Pet-Friendly)",
        pricePerNight: 15000,
        available: true,
        capacity: 4,
        amenities: ["King Bed", "Separate Living Room", "WiFi", "TV", "Mini Bar", "Butler Service", "Pet Amenities"],
        petFriendly: true,
        vip: true,
      },
    ];
    await kv.set("rooms", defaultRooms);
    
    // Reset services to default state
    console.log("[CLEAR DATABASE] Resetting services to default state...");
    const defaultServices = [
      { id: "restro", name: "Restro", price: 2000, description: "Fine dining experience" },
      { id: "spa", name: "Spa and wellness", price: 3500, description: "Luxury spa treatments" },
      { id: "palace-tour", name: "Palace tour", price: 1500, description: "Guided heritage tour" },
      { id: "pet-salon", name: "Pet salon", price: 1000, description: "Professional pet grooming" },
      { id: "hobby-room", name: "Hobby room", price: 800, description: "Recreation and activities" },
      { id: "gym", name: "Gym", price: 500, description: "State-of-the-art fitness center" },
      { id: "pool", name: "Swimming pool", price: 1000, description: "Infinity rooftop pool" },
      { id: "bar", name: "Private Bar", price: 2500, description: "Exclusive bar access" },
    ];
    await kv.set("services", defaultServices);
    
    // Delete all Supabase Auth users
    console.log("[CLEAR DATABASE] Deleting all auth users...");
    
    let deletedUsers = 0;
    if (users && users.length > 0) {
      for (const user of users) {
        await supabase.auth.admin.deleteUser(user.id);
        deletedUsers++;
      }
    }
    
    console.log("[CLEAR DATABASE] ===== DATABASE CLEAR COMPLETE =====");
    console.log(`[CLEAR DATABASE] Deleted ${allBookingIds.length} bookings`);
    console.log(`[CLEAR DATABASE] Deleted ${deletedUsers} users`);
    console.log(`[CLEAR DATABASE] Reset rooms and services to defaults`);

    return c.json({
      success: true,
      message: "Database cleared successfully",
      summary: {
        bookingsDeleted: allBookingIds.length,
        usersDeleted: deletedUsers,
        roomsReset: defaultRooms.length,
        servicesReset: defaultServices.length,
      },
    });
  } catch (error) {
    console.error("[CLEAR DATABASE] Error clearing database:", error);
    return c.json({ error: "Internal server error while clearing database" }, 500);
  }
});

// ============================================================================
// ANALYTICS ENDPOINT FOR ADMIN DASHBOARD
// ============================================================================

app.get("/make-server-e031cba6/admin/analytics", async (c) => {
  try {
    console.log("[ANALYTICS] Fetching dashboard analytics...");

    // Get all bookings
    const allBookings = await kv.getByPrefix("booking:");
    const bookings = Array.isArray(allBookings) ? allBookings : [];
    
    console.log("[ANALYTICS] Total bookings found:", bookings.length);

    // Get all rooms
    const rooms = await kv.get("rooms") || [];
    const totalRooms = rooms.length;

    // Calculate stats
    const activeBookings = bookings.filter((b: any) => {
      if (!b.checkInDate || !b.checkOutDate) return false;
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      const today = new Date();
      return checkIn <= today && checkOut >= today;
    });

    const totalGuests = bookings.reduce((sum: number, b: any) => sum + (b.numberOfGuests || 0), 0);
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.pricing?.grandTotal || b.grandTotal || 0), 0);
    
    const occupiedRooms = activeBookings.length;
    const availableRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Calculate service statistics
    const serviceUsageMap: { [key: string]: { count: number; revenue: number } } = {};
    
    const services = await kv.get("services") || [
      { id: "restro", name: "Restro", price: 2000 },
      { id: "spa", name: "Spa and wellness", price: 3500 },
      { id: "palace-tour", name: "Palace tour", price: 1500 },
      { id: "pet-salon", name: "Pet salon", price: 1000 },
      { id: "hobby-room", name: "Hobby room", price: 800 },
      { id: "gym", name: "Gym", price: 500 },
      { id: "pool", name: "Swimming pool", price: 1000 },
      { id: "bar", name: "Private Bar", price: 2500 },
    ];

    // Initialize all services with 0
    services.forEach((service: any) => {
      serviceUsageMap[service.name] = { count: 0, revenue: 0 };
    });

    bookings.forEach((booking: any) => {
      if (booking.selectedServices && Array.isArray(booking.selectedServices)) {
        booking.selectedServices.forEach((serviceName: string) => {
          if (!serviceUsageMap[serviceName]) {
            serviceUsageMap[serviceName] = { count: 0, revenue: 0 };
          }
          serviceUsageMap[serviceName].count++;
          
          // Find service price
          const service = services.find((s: any) => s.name === serviceName);
          if (service) {
            serviceUsageMap[serviceName].revenue += service.price;
          }
        });
      }
    });

    const serviceStats = Object.entries(serviceUsageMap).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
    }));

    // Calculate booking trends (last 7 days)
    const bookingTrends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayBookings = bookings.filter((b: any) => {
        if (!b.createdAt) return false;
        const bookingDate = new Date(b.createdAt);
        return bookingDate.toDateString() === date.toDateString();
      });
      
      const dayRevenue = dayBookings.reduce((sum: number, b: any) => sum + (b.grandTotal || 0), 0);
      
      bookingTrends.push({
        date: dateStr,
        bookings: dayBookings.length,
        revenue: dayRevenue,
      });
    }

    const stats = {
      totalGuests,
      activeBookings: activeBookings.length,
      totalRevenue,
      occupancyRate,
      availableRooms,
      totalRooms,
    };

    console.log("[ANALYTICS] Stats:", stats);
    console.log("[ANALYTICS] Service Stats:", serviceStats);
    console.log("[ANALYTICS] Booking Trends:", bookingTrends);

    return c.json({
      success: true,
      stats,
      serviceStats,
      bookingTrends,
    });
  } catch (error) {
    console.error("[ANALYTICS] Error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to fetch analytics data",
      stats: {
        totalGuests: 0,
        activeBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        availableRooms: 4,
        totalRooms: 4,
      },
      serviceStats: [],
      bookingTrends: [],
    }, 500);
  }
});

// ============================================================================
// CONTACT FORM ENDPOINT
// ============================================================================

app.post("/make-server-e031cba6/contact/send", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return c.json({ 
        success: false, 
        error: "Missing required fields" 
      }, 400);
    }

    console.log("📧 [CONTACT FORM] New message received");
    console.log(`   From: ${firstName} ${lastName} <${email}>`);
    console.log(`   Subject: ${subject || 'No subject'}`);

    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.log("⚠️ [CONTACT FORM] Resend API key not configured");
      // Save message to database for later retrieval
      const messageId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`contact_message:${messageId}`, {
        id: messageId,
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString(),
      });
      
      return c.json({
        success: true,
        message: "Message saved. We'll get back to you soon!",
        note: "Email delivery requires Resend API configuration"
      });
    }

    // Generate email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Contact Form Submission - TAJ-E-NOOR</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F5F5DC;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5DC; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #8B0000 0%, #B22222 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #FFD700; font-size: 28px; font-weight: 700;">TAJ-E-NOOR</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">New Contact Form Submission</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px 0; color: #8B0000; font-size: 20px;">Contact Details</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #666;">Name:</strong><br/>
                          <span style="color: #333; font-size: 16px;">${firstName} ${lastName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #666;">Email:</strong><br/>
                          <span style="color: #333; font-size: 16px;">${email}</span>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #666;">Phone:</strong><br/>
                          <span style="color: #333; font-size: 16px;">${phone}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${subject ? `
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #666;">Subject:</strong><br/>
                          <span style="color: #333; font-size: 16px;">${subject}</span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                    
                    <h2 style="margin: 0 0 15px 0; color: #8B0000; font-size: 20px;">Message</h2>
                    <div style="background-color: #F5F5DC; padding: 20px; border-radius: 8px; border-left: 4px solid #8B0000;">
                      <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #666; font-size: 12px;">
                        Submitted on ${new Date().toLocaleString('en-US', { 
                          dateStyle: 'full', 
                          timeStyle: 'short' 
                        })}
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F5F5DC; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      This message was sent via the TAJ-E-NOOR Hotel contact form
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email via Resend
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TAJ-E-NOOR Contact <onboarding@resend.dev>",
          to: ["abhinavapoorva2007@gmail.com"],
          reply_to: email,
          subject: subject ? `Contact Form: ${subject}` : `Contact Form Submission from ${firstName} ${lastName}`,
          html: emailHtml,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ [CONTACT FORM] Resend API Error:", result);
        
        // Save message to database as fallback
        const messageId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await kv.set(`contact_message:${messageId}`, {
          id: messageId,
          firstName,
          lastName,
          email,
          phone,
          subject,
          message,
          createdAt: new Date().toISOString(),
        });
        
        return c.json({
          success: true,
          message: "Message saved. We'll get back to you soon!",
          note: "Email delivery failed but message was saved"
        });
      }

      console.log("✅ [CONTACT FORM] Email sent successfully!");
      console.log(`   Email ID: ${result.id}`);

      // Also save to database for record keeping
      const messageId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`contact_message:${messageId}`, {
        id: messageId,
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        emailSent: true,
        emailId: result.id,
        createdAt: new Date().toISOString(),
      });

      return c.json({
        success: true,
        message: "Message sent successfully! We'll get back to you soon."
      });

    } catch (emailError: any) {
      console.error("❌ [CONTACT FORM] Email sending error:", emailError);
      
      // Save message to database as fallback
      const messageId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`contact_message:${messageId}`, {
        id: messageId,
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString(),
      });
      
      return c.json({
        success: true,
        message: "Message saved. We'll get back to you soon!",
        note: "Email delivery failed but message was saved"
      });
    }

  } catch (error: any) {
    console.error("❌ [CONTACT FORM] Error:", error);
    return c.json({ 
      success: false, 
      error: "Internal server error while processing contact form" 
    }, 500);
  }
});

// ============================================================================
// IMAGE MANAGEMENT ROUTES
// ============================================================================

// Get all images
app.get("/make-server-e031cba6/images", async (c) => {
  try {
    const images = await kv.get("website_images") || [];
    return c.json({ success: true, images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return c.json({ error: "Failed to fetch images" }, 500);
  }
});

// Update a specific image
app.patch("/make-server-e031cba6/images/:imageId", async (c) => {
  try {
    const imageId = c.req.param("imageId");
    const { url } = await c.req.json();

    if (!url) {
      return c.json({ error: "Image URL is required" }, 400);
    }

    let images = await kv.get("website_images") || [];
    const imageIndex = images.findIndex((img: any) => img.id === imageId);

    if (imageIndex === -1) {
      return c.json({ error: "Image not found" }, 404);
    }

    images[imageIndex].currentUrl = url;
    await kv.set("website_images", images);

    console.log(`Image ${imageId} updated successfully`);
    return c.json({ success: true, image: images[imageIndex] });
  } catch (error) {
    console.error("Error updating image:", error);
    return c.json({ error: "Failed to update image" }, 500);
  }
});

// ============================================================================
// IMAGE UPLOAD WITH SUPABASE STORAGE
// ============================================================================

// Initialize storage bucket on startup (non-blocking)
const initializeStorageBucket = async () => {
  try {
    const supabase = getSupabaseClient(true);
    const bucketName = "make-3d9d5b74-hotel-images";
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${bucketName}`);
      await supabase.storage.createBucket(bucketName, {
        public: true, // Make bucket public so images are accessible
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      console.log(`✅ Storage bucket created: ${bucketName}`);
    } else {
      console.log(`✅ Storage bucket exists: ${bucketName}`);
    }
  } catch (error) {
    console.error("Error initializing storage bucket:", error);
  }
};

// Call initialization without blocking server startup
initializeStorageBucket().catch(err => console.error("Bucket init error:", err));

// Upload image - Simplified version using base64 storage
app.post("/make-server-e031cba6/upload-image", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      console.error("❌ No authorization token provided");
      return c.json({ error: "Unauthorized - Admin access required" }, 401);
    }

    const supabase = getSupabaseClient(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      console.error("❌ Auth error:", authError);
      return c.json({ error: "Unauthorized - Admin access required" }, 401);
    }

    console.log(`📤 Upload request from user: ${user.email}`);

    // Parse multipart form data
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      console.error("❌ No file in request");
      return c.json({ error: "No file provided" }, 400);
    }

    console.log(`📁 File received: ${file.name} (${file.size} bytes, ${file.type})`);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error(`❌ Invalid file type: ${file.type}`);
      return c.json({ error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" }, 400);
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      console.error(`❌ File too large: ${file.size} bytes`);
      return c.json({ error: "File too large. Maximum size is 5MB" }, 400);
    }

    console.log(`🔄 Processing image upload...`);

    // Try Supabase Storage first
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomStr}.${extension}`;

      // Convert file to ArrayBuffer then Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      console.log(`☁️ Attempting Supabase Storage upload: ${filename}`);

      // Upload to Supabase Storage
      const bucketName = "make-3d9d5b74-hotel-images";
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, uint8Array, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.log(`⚠️ Supabase Storage failed (${error.message}), using fallback...`);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      console.log(`✅ Image uploaded to Supabase Storage: ${filename}`);
      console.log(`🔗 Public URL: ${publicUrl}`);
      
      return c.json({
        success: true,
        url: publicUrl,
        filename: filename,
        size: file.size,
        type: file.type,
        method: 'supabase-storage'
      });

    } catch (storageError) {
      // Fallback: Use external image hosting service (imgbb free API)
      console.log(`📦 Using fallback: external image hosting`);
      
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Try uploading to imgbb (free, no API key needed for small images)
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', base64);
        
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=demo', {
          method: 'POST',
          body: imgbbFormData
        });

        if (imgbbResponse.ok) {
          const imgbbData = await imgbbResponse.json();
          const imageUrl = imgbbData.data.url;
          
          console.log(`✅ Image uploaded to external host`);
          return c.json({
            success: true,
            url: imageUrl,
            filename: file.name,
            size: file.size,
            type: file.type,
            method: 'external-host'
          });
        }
      } catch (imgbbError) {
        console.error('External host failed:', imgbbError);
      }

      // Final fallback: Store as base64 data URL (works but not ideal)
      console.log(`💾 Using final fallback: data URL`);
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return c.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        method: 'data-url',
        warning: 'Image stored as data URL. For production, configure Supabase Storage.'
      });
    }

  } catch (error: any) {
    console.error("❌ Error uploading image:", error);
    console.error("Stack trace:", error.stack);
    return c.json({ error: `Failed to upload image: ${error.message}` }, 500);
  }
});

// Start server
Deno.serve(app.fetch);