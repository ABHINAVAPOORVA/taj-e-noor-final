# 📸 Image Management Guide

## Quick Start - How to Change Any Image

All images in your hotel management system are now centrally managed in **one single file**: `/config/imageAssets.tsx`

### Step-by-Step Instructions:

1. **Upload your new image** in Figma Make
2. **Copy the import path** - It will look like: `figma:asset/xxxxxxxxxxxxx.png`
3. **Open** `/config/imageAssets.tsx`
4. **Find the image** you want to replace (see list below)
5. **Replace the import path** with your new one
6. **Save** - Done! ✅

---

## 🏨 Complete Image List

### ROOM IMAGES

#### Dream's Classic Room
- **Variable:** `dreamClassicRoom`
- **Used in:** RoomsPage, RoomDetails, GalleryPage
- **Current path:** `figma:asset/b739fed169085477f032b3d732c107aa5e408c56.png`

#### Nizam Delux Room
- **Variable:** `nizamDeluxRoom`
- **Used in:** RoomsPage, RoomDetails, GalleryPage
- **Current path:** `figma:asset/b739fed169085477f032b3d732c107aa5e408c56.png`

#### Begum Chamber (Pet-friendly)
- **Variable:** `begumChamber`
- **Used in:** RoomsPage, RoomDetails, GalleryPage
- **Current path:** `figma:asset/b739fed169085477f032b3d732c107aa5e408c56.png`

#### Emperor's Chamber VIP (Pet-friendly)
- **Variable:** `emperorChamber`
- **Used in:** RoomsPage, RoomDetails, GalleryPage
- **Current path:** `figma:asset/a71b149a121e2f9111a4d467dd69b7495c81d221.png`

---

### DINING & RESTAURANT IMAGES

#### The Royal Court Restaurant
- **Variable:** `royalCourtRestaurant`
- **Used in:** DiningPage, DiningSection, GalleryPage, AmenitiesPage
- **Current path:** `figma:asset/6f40939ebc2d770f428d068eb9051e2a842558ee.png`

#### Cafe Serenity
- **Variable:** `cafeSerenity`
- **Used in:** DiningPage, DiningSection
- **Current path:** Unsplash URL

#### The Maharaja Lounge / Private Bar
- **Variable:** `maharajaLounge`
- **Used in:** DiningPage
- **Current path:** Unsplash URL

---

### AMENITIES IMAGES

#### Swimming Pool
- **Variable:** `swimmingPool`
- **Used in:** AmenitiesPage, GalleryPage
- **Current path:** Unsplash URL

#### Spa & Wellness
- **Variable:** `spaWellness`
- **Used in:** AmenitiesPage, GalleryPage
- **Current path:** Unsplash URL

#### Gym / Fitness Center
- **Variable:** `gymFitness`
- **Used in:** AmenitiesPage, GalleryPage
- **Current path:** Unsplash URL

#### Pet Salon
- **Variable:** `petSalon`
- **Used in:** AmenitiesPage
- **Current path:** Unsplash URL

#### Game Room / Hobby Room
- **Variable:** `gameRoom`
- **Used in:** AmenitiesPage
- **Current path:** Unsplash URL

#### Private Bar
- **Variable:** `privateBar`
- **Used in:** AmenitiesPage
- **Current path:** Unsplash URL

---

### GENERAL / EXTERIOR IMAGES

#### Hotel Exterior
- **Variable:** `hotelExterior`
- **Used in:** GalleryPage, HomePage
- **Current path:** Unsplash URL

#### Hero Background
- **Variable:** `heroBackground`
- **Used in:** HomePage HeroSection
- **Current path:** Unsplash URL

---

## 💡 Example - Changing a Room Image

Let's say you want to change **Dream's Classic Room** image:

1. Upload your new image in Figma Make
2. You get the path: `figma:asset/abc123def456.png`
3. Open `/config/imageAssets.tsx`
4. Find this line:
   ```tsx
   import dreamClassicRoom from "figma:asset/b739fed169085477f032b3d732c107aa5e408c56.png";
   ```
5. Replace it with:
   ```tsx
   import dreamClassicRoom from "figma:asset/abc123def456.png";
   ```
6. Save - The image is now updated everywhere! 🎉

---

## 🔄 Benefits of This System

✅ **Change once, update everywhere** - Update one line, changes reflect across all pages
✅ **Easy to find** - All images organized by category in one file
✅ **Clear documentation** - Know exactly where each image is used
✅ **No searching** - Don't hunt through multiple files
✅ **Consistent** - Same image used consistently across the app

---

## 📍 File Location

**Main Config File:** `/config/imageAssets.tsx`

---

## ⚠️ Important Notes

- Always use the **full import path** from Figma Make (starts with `figma:asset/`)
- For external images, you can use direct URLs (like Unsplash)
- The variable names are descriptive - don't change them
- Save the file after making changes
- The app will automatically reload with your new images

---

## 🆘 Need Help?

If an image doesn't update:
1. Check that you saved `/config/imageAssets.tsx`
2. Verify the import path is correct
3. Make sure the variable name matches exactly
4. Refresh your browser

---

**Last Updated:** November 24, 2025
