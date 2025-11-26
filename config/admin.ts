// ============================================
// ADMIN CONFIGURATION
// ============================================
// 
// To change the authorized admin email:
// 1. Update the AUTHORIZED_ADMIN_EMAIL below
// 2. Create a new admin account at /admin/setup with that email
// 3. Sign in at /admin/signin
//

// Authorized admin email address
// Only this email can access the admin portal
// CHANGE THIS TO YOUR DESIRED ADMIN EMAIL
export const AUTHORIZED_ADMIN_EMAIL = "admin@hotel.com";

// You can also add multiple admin emails if needed
export const AUTHORIZED_ADMIN_EMAILS = [
  "admin@hotel.com",
  "admin@hotel123",      // Secondary admin
  "superadmin@hotel.com", // Super admin
];

// Function to check if an email is authorized for admin access
export const isAuthorizedAdmin = (email: string): boolean => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check against all authorized emails
  return AUTHORIZED_ADMIN_EMAILS.some(
    authorizedEmail => normalizedEmail === authorizedEmail.toLowerCase().trim()
  );
};