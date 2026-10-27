// seed_25_houses.js
// 25 detailed houses with at least 5 photos each: Exterior, Sitting Room, Bedroom, Kitchen, Bathroom/Balcony
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { query } = require('./database/db');

const NEW_25_HOUSES = [
  {
    id: "house_new_001",
    title: "Executive 2-Bedroom Sky Penthouse in Westlands",
    location: "Westlands",
    latitude: -1.267420,
    longitude: 36.805210,
    bedrooms: 2,
    monthlyRent: 850.0,
    depositAmount: 250.0,
    description: "Ultra-modern 2-bedroom executive penthouse located along Westlands Road. Features high-speed fiber internet, an expansive sunlit sitting room, a fully fitted gourmet kitchen with quartz countertops, master bedroom with walk-in closet, and a private skyline terrace.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Rooftop Heated Pool", "24/7 Security", "Equipped Gym", "Backup Generator", "Borehole Water", "High-Speed Elevators", "Covered Parking"],
    contactName: "Stephen Kamau",
    contactPhone: "+254712987111",
    contactEmail: "stephen.kamau@westlandsluxury.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_002",
    title: "Chic 1-Bedroom Designer Suite near Yaya Centre",
    location: "Kilimani",
    latitude: -1.291500,
    longitude: 36.787200,
    bedrooms: 1,
    monthlyRent: 520.0,
    depositAmount: 150.0,
    description: "Stylish 1-bedroom apartment right in the heart of Kilimani. Designed with an open-concept living and sitting room, bespoke dining nook, imported European open kitchen, cozy bedroom with double glazed windows, and sparkling bathroom.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["Swimming Pool", "High-Speed WiFi", "Fitness Centre", "Card Access Security", "Intercom", "Solar Water Heating"],
    contactName: "Faith Njeri",
    contactPhone: "+254721445566",
    contactEmail: "faith.njeri@kilimaniliving.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_003",
    title: "Lush 3-Bedroom Villa with Private Garden in Karen",
    location: "Karen",
    latitude: -1.321400,
    longitude: 36.708100,
    bedrooms: 3,
    monthlyRent: 1400.0,
    depositAmount: 400.0,
    description: "Idyllic 3-bedroom colonial style cottage situated on half an acre in quiet Karen. Boasts a sunken sitting room with stone fireplace, spacious country kitchen with cedar cabinetry, three ensuite bedrooms, and a blooming garden terrace.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Garden", "Perimeter Electric Fence", "Fireplace", "Servant Quarters (DSQ)", "Pet Friendly", "Solar Water", "Double Garage"],
    contactName: "Patrick Omondi",
    contactPhone: "+254734556677",
    contactEmail: "patrick.omondi@karenestates.co.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_new_004",
    title: "Sunlit 2-Bedroom Haven near Riverside Drive",
    location: "Kileleshwa",
    latitude: -1.278900,
    longitude: 36.789100,
    bedrooms: 2,
    monthlyRent: 780.0,
    depositAmount: 200.0,
    description: "Peaceful 2-bedroom residence set amidst leafy Riverside greenery. Offers a spacious open sitting lounge, modern breakfast bar kitchen, master bedroom with large wardrobes, double shower bathroom, and a generous laundry area.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Swimming Pool", "High-Speed WiFi", "24/7 Manned Gate", "Borehole", "Dedicated Parking", "Clubhouse"],
    contactName: "Mercy Chebet",
    contactPhone: "+254701223344",
    contactEmail: "mercy.chebet@kileleshwahomes.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_005",
    title: "Opulent 4-Bedroom Townhouse with DSQ in Lavington",
    location: "Lavington",
    latitude: -1.284200,
    longitude: 36.765400,
    bedrooms: 4,
    monthlyRent: 1650.0,
    depositAmount: 500.0,
    description: "Prestigious 4-bedroom townhouse inside an exclusive gated compound. Features a dramatic double-height ceiling sitting room, contemporary chef's kitchen with pantry, family TV lounge, 4 ensuite bedrooms, and private landscaped courtyard.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Courtyard", "Full Backup Generator", "DSQ", "Gated Security", "CCTV", "Solar Heating", "Children Play Area"],
    contactName: "Samuel Githinji",
    contactPhone: "+254719887766",
    contactEmail: "samuel.githinji@lavingtonproperties.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_006",
    title: "Panoramic 2-Bedroom City View Residence in Parklands",
    location: "Parklands",
    latitude: -1.262500,
    longitude: 36.821400,
    bedrooms: 2,
    monthlyRent: 720.0,
    depositAmount: 200.0,
    description: "Centrally positioned 2-bedroom home near Diamond Plaza. Highlights include expansive living/sitting room with bamboo flooring, granite-top modular kitchen, tranquil master ensuite, and a large balcony overlooking city park greenery.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["High-Speed WiFi", "Elevator", "Borehole", "24/7 Guards", "Covered Parking", "Water Tanks"],
    contactName: "Rashid Patel",
    contactPhone: "+254722556688",
    contactEmail: "rashid.patel@parklandshomes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_007",
    title: "Royal 5-Bedroom Ambassadorial Mansion in Runda",
    location: "Runda",
    latitude: -1.214800,
    longitude: 36.821100,
    bedrooms: 5,
    monthlyRent: 2400.0,
    depositAmount: 700.0,
    description: "Exceptional ambassadorial home set on half-acre manicured grounds. Boasts a grand foyer, formal sitting room with chandeliers, designer kitchen with island, 5 palatial ensuite bedrooms, executive study, and private swimming pool.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Swimming Pool", "Perimeter Wall & Laser Sensors", "Dual DSQ", "Backup Generator", "Solar Inverter", "Guard House", "Ample Parking"],
    contactName: "Harrison Mbugua",
    contactPhone: "+254733990011",
    contactEmail: "harrison.mbugua@rundaluxury.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_008",
    title: "Modern 1-Bedroom Corporate Loft in Upper Hill",
    location: "Upper Hill",
    latitude: -1.298800,
    longitude: 36.817200,
    bedrooms: 1,
    monthlyRent: 580.0,
    depositAmount: 180.0,
    description: "A tailored executive loft perfect for corporate professionals. Equipped with an ergonomic workspace, designer sitting room furniture, sleek open kitchen with stainless steel appliances, cozy bedroom suite, and high-floor city views.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Rooftop Cafe", "Gym", "High-Speed Internet", "CCTV", "Biometric Access", "Backup Generator"],
    contactName: "Evans Onyango",
    contactPhone: "+254711334499",
    contactEmail: "evans.onyango@upperhillrealty.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_009",
    title: "Charming 3-Bedroom Forest-View Flat in Muthaiga",
    location: "Muthaiga",
    latitude: -1.251800,
    longitude: 36.833500,
    bedrooms: 3,
    monthlyRent: 1350.0,
    depositAmount: 400.0,
    description: "Serene 3-bedroom apartment facing the lush Karura forest reserve. Highlights include hardwood teak flooring, warm fireplaced sitting room, open plan kitchen with breakfast bar, 3 lavish bedrooms, and dual verandas.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Forest Trails Access", "Heated Pool", "Tennis Court", "24/7 Security", "Borehole Water", "Clubhouse"],
    contactName: "Claire De Souza",
    contactPhone: "+254728990022",
    contactEmail: "claire.desouza@muthaigahomes.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_010",
    title: "Sunny 2-Bedroom Courtyard Flat in Riara Road",
    location: "Kilimani",
    latitude: -1.297500,
    longitude: 36.776200,
    bedrooms: 2,
    monthlyRent: 680.0,
    depositAmount: 200.0,
    description: "Delightful 2-bedroom home situated in leafy Riara road just minutes from The Junction Mall. Offers a bright sitting room opening to a balcony, modern galley kitchen, master bedroom with bathtub, and secondary guest room.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["Gym", "High-Speed WiFi", "Borehole", "Electric Fence", "Intercom System", "Reserved Parking"],
    contactName: "Moses Kilonzo",
    contactPhone: "+254714112233",
    contactEmail: "moses.kilonzo@riarahomes.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_011",
    title: "Cozy 3-Bedroom Gated Bungalow in Lang'ata",
    location: "Lang'ata",
    latitude: -1.352800,
    longitude: 36.755100,
    bedrooms: 3,
    monthlyRent: 790.0,
    depositAmount: 220.0,
    description: "Family-friendly 3-bedroom detached bungalow inside a serene court in Lang'ata near Galleria Mall. Features a light-filled sitting room with tiled floors, well-ventilated kitchen with outdoor dhobi sink, 3 bedrooms, and a fenced front yard.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Compound", "Perimeter Wall", "Pet Friendly", "Solar Water", "Water Storage Tanks", "Quiet Gated Court"],
    contactName: "Anthony Ndegwa",
    contactPhone: "+254720334455",
    contactEmail: "anthony.ndegwa@langatarealty.co.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_new_012",
    title: "Sleek 1-Bedroom Minimalist Studio in South B",
    location: "South B",
    latitude: -1.309200,
    longitude: 36.834600,
    bedrooms: 1,
    monthlyRent: 380.0,
    depositAmount: 120.0,
    description: "Affordable and chic 1-bedroom suite in accessible South B. Comes with a bright sitting room area, breakfast counter kitchen, ceramic tiled bedroom, modern shower room, and convenient proximity to Mombasa Road and CBD.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["CCTV", "24/7 Guards", "Fiber WiFi Ready", "Borehole Water", "Easy Public Transit"],
    contactName: "Jane Akoth",
    contactPhone: "+254705667788",
    contactEmail: "jane.akoth@southbrentals.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_013",
    title: "Luxury 3-Bedroom Garden Flat with Pool in Westlands",
    location: "Westlands",
    latitude: -1.269100,
    longitude: 36.803800,
    bedrooms: 3,
    monthlyRent: 1150.0,
    depositAmount: 350.0,
    description: "High-spec 3-bedroom apartment inside a boutique compound in Westlands. Enjoys a grand sitting room with floor-to-ceiling glass, European open-plan kitchen, 3 ensuite bedrooms, maid's room, and direct pool deck access.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Infinity Pool", "Fully Fitted Gym", "Steam & Sauna", "Backup Generator", "Borehole", "24/7 Security", "2 Car Parking"],
    contactName: "Kelvin Mutua",
    contactPhone: "+254716778899",
    contactEmail: "kelvin.mutua@westlandsrealty.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_014",
    title: "Chic 2-Bedroom Corner Unit with Sunset Balcony",
    location: "Kileleshwa",
    latitude: -1.280100,
    longitude: 36.787600,
    bedrooms: 2,
    monthlyRent: 760.0,
    depositAmount: 200.0,
    description: "Delightful corner apartment flooded with afternoon golden sunlight. Includes an expansive sitting room with dining zone, granite kitchen with breakfast island, 2 spacious bedrooms with fitted wardrobes, and wide balcony.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["Swimming Pool", "Gym", "High-Speed WiFi", "Intercom", "Borehole", "CCTV Surveillance"],
    contactName: "Brenda Kwamboka",
    contactPhone: "+254724991122",
    contactEmail: "brenda.kwamboka@kileleshwahomes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_015",
    title: "Spacious 4-Bedroom Villa with Swimming Pool in Karen",
    location: "Karen",
    latitude: -1.318200,
    longitude: 36.705400,
    bedrooms: 4,
    monthlyRent: 1800.0,
    depositAmount: 550.0,
    description: "Exceptional modern-rustic family villa on a tranquil private cul-de-sac. Features a magnificent sitting room with timber trusses, open country kitchen with gas hob, four master bedrooms, expansive patio, and private pool.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Pool", "Half-Acre Garden", "Staff Quarters", "Electric Fencing", "Perimeter Lighting", "Solar Water"],
    contactName: "Richard Kiprono",
    contactPhone: "+254735221100",
    contactEmail: "richard.kiprono@karenliving.co.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_new_016",
    title: "Contemporary 2-Bedroom Apartment in Kilimani",
    location: "Kilimani",
    latitude: -1.293400,
    longitude: 36.785800,
    bedrooms: 2,
    monthlyRent: 710.0,
    depositAmount: 200.0,
    description: "A tastefully designed contemporary 2-bedroom home on Kindaruma Road. Offers a calm sitting room with ambient lighting, sleek kitchen fitted with microwave and cooker, 2 ensuite bedrooms, and laundry balcony.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Rooftop Lounge", "Gym", "High-Speed Lifts", "24/7 Security", "Borehole", "Generator"],
    contactName: "Cynthia Wangari",
    contactPhone: "+254718443322",
    contactEmail: "cynthia.wangari@kilimaniproperties.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_017",
    title: "Designer 1-Bedroom Loft near Sarit Centre in Westlands",
    location: "Westlands",
    latitude: -1.266800,
    longitude: 36.804900,
    bedrooms: 1,
    monthlyRent: 590.0,
    depositAmount: 160.0,
    description: "Trendy 1-bedroom urban loft within walking distance of Sarit Centre and Westgate. Features polished concrete finishes, comfortable sitting room, quartz kitchen island, luxury bedroom with soundproof glass, and designer shower.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Heated Swimming Pool", "Gym", "High-Speed WiFi", "Keyless Entry", "Cafeteria in Building", "24/7 Concierge"],
    contactName: "Brian Kibet",
    contactPhone: "+254707112244",
    contactEmail: "brian.kibet@westlandshomes.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_018",
    title: "Elegant 3-Bedroom Duplex with DSQ in Lavington",
    location: "Lavington",
    latitude: -1.282900,
    longitude: 36.767100,
    bedrooms: 3,
    monthlyRent: 1250.0,
    depositAmount: 380.0,
    description: "Two-level architectural duplex featuring grand volume and natural light. Enjoys an expansive sitting room with floor-to-ceiling glass, gourmet kitchen with pantry, family TV room on upper floor, 3 ensuite bedrooms, and private patio.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["Swimming Pool", "DSQ", "Gym", "Full Generator", "Borehole", "2 Covered Parking Bays"],
    contactName: "Florence Muthoni",
    contactPhone: "+254723887711",
    contactEmail: "florence.muthoni@lavingtonproperties.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_019",
    title: "Chic 2-Bedroom Serenity Home in South C",
    location: "South C",
    latitude: -1.317500,
    longitude: 36.824200,
    bedrooms: 2,
    monthlyRent: 620.0,
    depositAmount: 180.0,
    description: "Peaceful 2-bedroom sanctuary within a secure gated estate in South C. Offers a comfortable sitting room, modern fitted kitchen with smoke extractor, 2 bright bedrooms, tiled bathroom, and private utility balcony.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Gated Security", "CCTV", "High-Speed WiFi Ready", "Borehole Water", "Reserved Parking"],
    contactName: "Abdi Hassan",
    contactPhone: "+254710223311",
    contactEmail: "abdi.hassan@southchomes.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_020",
    title: "Grand 5-Bedroom Estate with Tennis Court in Muthaiga",
    location: "Muthaiga",
    latitude: -1.250900,
    longitude: 36.835100,
    bedrooms: 5,
    monthlyRent: 2600.0,
    depositAmount: 800.0,
    description: "Prestigious ambassadorial manor situated on one acre of rolling lawn in prime Old Muthaiga. Offers a classical drawing sitting room with fireplace, industrial chef's kitchen, 5 luxury ensuite bedrooms, heated pool, and private tennis court.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Tennis Court", "Heated Pool", "Staff Quarters (3 rooms)", "Electric Fence", "Perimeter Lighting", "Full Backup Generator", "Guard House"],
    contactName: "Jonathan Ross",
    contactPhone: "+254729110022",
    contactEmail: "jonathan.ross@muthaigaestates.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_021",
    title: "Sun-drenched 2-Bedroom Flat near Valley Arcade",
    location: "Lavington",
    latitude: -1.285500,
    longitude: 36.764800,
    bedrooms: 2,
    monthlyRent: 730.0,
    depositAmount: 200.0,
    description: "Quiet, secure 2-bedroom flat minutes from Valley Arcade shopping centre. Enjoys a breezy sitting room leading to a balcony with green canopy views, open-plan kitchen, master ensuite, and second bedroom.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"  // Balcony
    ],
    amenities: ["Gym", "High-Speed WiFi", "Borehole Water", "24/7 Security", "Covered Parking", "Intercom"],
    contactName: "Lucy Njoroge",
    contactPhone: "+254715889900",
    contactEmail: "lucy.njoroge@lavingtonliving.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_new_022",
    title: "Modernist 3-Bedroom Penthouse in Kileleshwa",
    location: "Kileleshwa",
    latitude: -1.277800,
    longitude: 36.786900,
    bedrooms: 3,
    monthlyRent: 1100.0,
    depositAmount: 320.0,
    description: "Striking 3-bedroom top-floor penthouse with towering ceilings and floor-to-ceiling glass. Features a massive sitting room with dining hall, custom German kitchen, three ensuite bedrooms, rooftop entertainment deck, and DSQ.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Rooftop Pool", "Private Terrace", "DSQ", "Gym", "Full Generator", "24/7 Security", "2 High-Speed Lifts"],
    contactName: "Daniel Wanyama",
    contactPhone: "+254726332211",
    contactEmail: "daniel.wanyama@kileleshwapenthouses.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_023",
    title: "Charming 1-Bedroom Cottage in Karen Greenery",
    location: "Karen",
    latitude: -1.323500,
    longitude: 36.704200,
    bedrooms: 1,
    monthlyRent: 480.0,
    depositAmount: 140.0,
    description: "Quaint detached 1-bedroom sanctuary with stone masonry and rustic wooden beams. Boasts an intimate sitting room with wood-burning stove, fully equipped kitchen, ensuite bedroom, and a patio overlooking towering indigenous trees.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Garden", "Fireplace", "High-Speed Fiber", "Solar Water Heating", "Quiet Neighborhood", "Pet Friendly"],
    contactName: "Mary Kerubo",
    contactPhone: "+254731889900",
    contactEmail: "mary.kerubo@karencottages.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_new_024",
    title: "Contemporary 3-Bedroom Family Flat in Parklands",
    location: "Parklands",
    latitude: -1.260500,
    longitude: 36.822800,
    bedrooms: 3,
    monthlyRent: 890.0,
    depositAmount: 260.0,
    description: "Generous 3-bedroom, 3-bathroom family flat in peaceful 4th Parklands Avenue. Highlights include a warm tiled sitting room, granite kitchen with dual sinks, spacious ensuite master bedroom, utility balcony, and high security.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Borehole Water", "Backup Generator", "High-Speed Elevators", "24/7 Security", "Covered Parking", "Intercom"],
    contactName: "Ashish Shah",
    contactPhone: "+254725443322",
    contactEmail: "ashish.shah@parklandsproperties.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_new_025",
    title: "Luxurious 4-Bedroom Sanctuary Villa in Runda",
    location: "Runda",
    latitude: -1.216200,
    longitude: 36.819400,
    bedrooms: 4,
    monthlyRent: 2100.0,
    depositAmount: 600.0,
    description: "Exceptional modern villa inside a private gated court in Runda Mumwe. Features a double-volume sitting lounge with garden views, open-plan island kitchen, four ensuite bedrooms with walk-in wardrobes, private landscaped lawn, and DSQ.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Exterior
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", // Sitting Room
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", // Bedroom
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // Kitchen
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"  // Bathroom
    ],
    amenities: ["Private Half-Acre Lawn", "Staff Quarters (DSQ)", "Solar Inverter & Generator", "Perimeter Electric Fence", "Double Garage", "Pet Friendly"],
    contactName: "Grace Muthoni",
    contactPhone: "+254719554433",
    contactEmail: "grace.muthoni@rundavillas.co.ke",
    contactRole: "Property Manager"
  }
];

async function seed25Houses() {
  console.log(`[Seed 25] Preparing to insert 25 verified houses with 5+ photos each...`);
  
  for (const h of NEW_25_HOUSES) {
    try {
      const sqlText = `
        INSERT INTO houses (
          id, title, location, latitude, longitude, bedrooms, monthly_rent, deposit_amount,
          description, images, amenities, contact_name, contact_phone, contact_email, contact_role, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'AVAILABLE')
        ON CONFLICT (id) DO UPDATE SET
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          images = EXCLUDED.images,
          description = EXCLUDED.description,
          title = EXCLUDED.title,
          monthly_rent = EXCLUDED.monthly_rent;
      `;
      await query(sqlText, [
        h.id,
        h.title,
        h.location,
        h.latitude,
        h.longitude,
        h.bedrooms,
        h.monthlyRent,
        h.depositAmount,
        h.description,
        h.images,
        h.amenities,
        h.contactName,
        h.contactPhone,
        h.contactEmail,
        h.contactRole
      ]);
      console.log(`✓ Inserted/Updated: ${h.title} (Lat: ${h.latitude}, Lng: ${h.longitude}, Photos: ${h.images.length})`);
    } catch (err) {
      console.error(`Failed to insert ${h.id}:`, err.message);
    }
  }

  console.log('[Seed 25] Finished seeding 25 houses.');
}

if (require.main === module) {
  seed25Houses()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = { NEW_25_HOUSES, seed25Houses };

