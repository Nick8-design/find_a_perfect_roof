// seed_50_houses.js
// Adds 50 fully detailed houses to the running backend API at http://localhost:5000/api/houses

const API_URL = process.env.API_URL || 'http://localhost:5000/api/houses';

const houses = [
  {
    id: "house_seed_001",
    title: "Modern 1-Bedroom Executive Suite in Westlands",
    location: "Westlands",
    bedrooms: 1,
    monthlyRent: 550.0,
    depositAmount: 150.0,
    description: "Sleek and contemporary 1-bedroom apartment located in the vibrant hub of Westlands. Features high-speed fiber internet, floor-to-ceiling double-glazed windows, a fully equipped open-plan kitchen with granite countertops, and panoramic skyline views.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["High-Speed WiFi", "24/7 Security", "Rooftop Gym", "Backup Generator", "Borehole Water", "Elevator"],
    contactName: "Kevin Otieno",
    contactPhone: "+254711223344",
    contactEmail: "kevin.otieno@properties.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_002",
    title: "Sunny 2-Bedroom Apartment with Balcony in Kilimani",
    location: "Kilimani",
    bedrooms: 2,
    monthlyRent: 750.0,
    depositAmount: 200.0,
    description: "Bright and airy 2-bedroom, 2-bathroom apartment in prime Kilimani near Yaya Centre. Boasts polished wooden floors, master ensuite with rain shower, expansive private balcony overlooking leafy gardens, and dedicated covered parking.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Swimming Pool", "Gym", "High-Speed WiFi", "Covered Parking", "CCTV Surveillance", "Intercom"],
    contactName: "Beatrice Wanjiku",
    contactPhone: "+254722334455",
    contactEmail: "beatrice.wanjiku@realtyhub.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_003",
    title: "Luxury 3-Bedroom Penthouse with Panoramic Views",
    location: "Kileleshwa",
    bedrooms: 3,
    monthlyRent: 1100.0,
    depositAmount: 300.0,
    description: "Spectacular top-floor penthouse offering 360-degree views of Nairobi. Includes master bedroom with walk-in closet and jacuzzi tub, custom Italian modular kitchen, servant quarters (DSQ), and a wraparound entertaining terrace.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Rooftop Pool", "Private Terrace", "DSQ", "Jacuzzi", "Full Backup Generator", "24/7 Armed Security", "Solar Water Heating"],
    contactName: "Dennis Kiprono",
    contactPhone: "+254733445566",
    contactEmail: "dennis.kiprono@luxuryliving.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_004",
    title: "Spacious 4-Bedroom Townhouse with Private Garden",
    location: "Lavington",
    bedrooms: 4,
    monthlyRent: 1800.0,
    depositAmount: 400.0,
    description: "Charming family townhouse nestled in a secure gated community in Lavington. All bedrooms ensuite, sunlit living room with wood-burning fireplace, modern pantry, manicured private lawn, and automated double garage.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Garden", "Fireplace", "Double Garage", "Children Play Area", "Gated Security", "Pet-Friendly", "Borehole Water"],
    contactName: "Faith Muthoni",
    contactPhone: "+254744556677",
    contactEmail: "faith.muthoni@lavingtonhomes.com",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_005",
    title: "Exclusive 5-Bedroom Country Villa on 0.5 Acres",
    location: "Karen",
    bedrooms: 5,
    monthlyRent: 2600.0,
    depositAmount: 600.0,
    description: "Magnificent colonial-inspired 5-bedroom villa surrounded by mature indigenous trees in Karen. Features double-volume ceilings, mahogany staircases, chef's kitchen, detached guest wing, swimming pool, and electric perimeter fence.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Swimming Pool", "0.5 Acre Garden", "Guest Wing", "Electric Fence", "Solar Power", "Borehole Water", "Staff Quarters"],
    contactName: "Simon Ndung'u",
    contactPhone: "+254755667788",
    contactEmail: "simon.karenhomes@gmail.com",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_006",
    title: "Contemporary 2-Bedroom Flat near Diamond Plaza",
    location: "Parklands",
    bedrooms: 2,
    monthlyRent: 650.0,
    depositAmount: 180.0,
    description: "Freshly renovated 2-bedroom apartment situated within walking distance to Diamond Plaza and Aga Khan Hospital. Features fitted kitchen cabinets, modern tiled bathrooms, ample natural daylight, and high-speed lifts.",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee15242ab830?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["High-Speed WiFi", "24/7 Guarded Gate", "Water Storage Tanks", "CCTV", "High-Speed Lift", "Access Control"],
    contactName: "Rajesh Patel",
    contactPhone: "+254766778899",
    contactEmail: "rajesh.parklands@estates.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_007",
    title: "Chic 1-Bedroom Loft with River Views",
    location: "Riverside",
    bedrooms: 1,
    monthlyRent: 600.0,
    depositAmount: 150.0,
    description: "Industrial chic 1-bedroom duplex loft overlooking the lush greenery of Riverside Drive. Vaulted ceilings, polished concrete floors, steel-frame windows, designer pendant lighting, and quiet ambiance.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Riverfront View", "High-Speed WiFi", "Gym", "Heated Pool", "Underground Parking", "24/7 Security"],
    contactName: "Grace Achieng",
    contactPhone: "+254777889900",
    contactEmail: "grace.riverside@urbanlofts.ke",
    contactRole: "Leasing Agent"
  },
  {
    id: "house_seed_008",
    title: "Cozy 3-Bedroom Maisonette with Perimeter Wall",
    location: "South C",
    bedrooms: 3,
    monthlyRent: 700.0,
    depositAmount: 200.0,
    description: "Secure and peaceful 3-bedroom family maisonette in South C near Mugoya estate. Features private front parking for two cars, spacious dining section, dedicated laundry yard, and 24/7 neighborhood patrol.",
    images: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Perimeter Wall", "Private Parking", "Laundry Yard", "Water Reservoir", "Pet-Friendly", "Neighborhood Watch"],
    contactName: "Hassan Mohamed",
    contactPhone: "+254788990011",
    contactEmail: "hassan.mohamed@southchomes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_009",
    title: "Bright 2-Bedroom Urban Apartment near Junction",
    location: "Ngong Road",
    bedrooms: 2,
    monthlyRent: 620.0,
    depositAmount: 160.0,
    description: "Conveniently situated along Ngong Road minutes from The Junction Mall. Offers open-concept lounge, ceramic tile flooring throughout, solar water heating, and fast fiber optic connectivity.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Fiber Internet", "Solar Water Heating", "CCTV", "Borehole Water", "Elevator", "Secured Parking"],
    contactName: "Joshua Kariuki",
    contactPhone: "+254799001122",
    contactEmail: "joshua.kariuki@ngongrd.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_010",
    title: "Prestigious 5-Bedroom Ambassadorial Residence",
    location: "Runda",
    bedrooms: 5,
    monthlyRent: 3200.0,
    depositAmount: 750.0,
    description: "Palatial 5-bedroom residence built to UN security specifications in gated Runda. Set on half an acre of manicured grounds with heated swimming pool, sauna, guardhouse, safe room, and 2 DSQs.",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["UN Approved Security", "Heated Pool", "Sauna", "Safe Room", "Guard House", "2 DSQs", "Full Generator", "Landscaped Gardens"],
    contactName: "Catherine Njoroge",
    contactPhone: "+254710112233",
    contactEmail: "catherine@rundaluxury.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_011",
    title: "Sleek 1-Bedroom High-Rise Studio for Professionals",
    location: "Upperhill",
    bedrooms: 1,
    monthlyRent: 580.0,
    depositAmount: 150.0,
    description: "Tailored for business executives and consultants working in Upperhill financial district. Premium soundproof windows, smart card access, fully equipped gym on the 14th floor, and rooftop coffee lounge.",
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Keycard Access", "Rooftop Lounge", "Gym", "High-Speed Elevators", "Concierge Desk", "Fiber WiFi", "Backup Power"],
    contactName: "Mark Maina",
    contactPhone: "+254721223344",
    contactEmail: "mark.upperhill@execresidences.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_012",
    title: "Stately 4-Bedroom Colonial Bungalow with Lush Lawn",
    location: "Muthaiga",
    bedrooms: 4,
    monthlyRent: 2800.0,
    depositAmount: 700.0,
    description: "Classic colonial mansion on prime Muthaiga soil. Boasts hardwood timber floors, wrap-around veranda, huge stone fireplaces, expansive guest suite, manicured hedge fencing, and separate staff quarters.",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Large Lawn", "Veranda", "Dual Fireplaces", "Staff Quarters", "Perimeter Wall", "Solar Water Heating", "Quiet Neighborhood"],
    contactName: "Geoffrey Mutua",
    contactPhone: "+254732334455",
    contactEmail: "geoffrey.muthaiga@heritageestates.co.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_013",
    title: "Modernist 4-Bedroom Villa with Swimming Pool",
    location: "Spring Valley",
    bedrooms: 4,
    monthlyRent: 2400.0,
    depositAmount: 500.0,
    description: "Architectural masterpiece in Spring Valley with minimalist aesthetics, soaring glass walls, custom minimalist kitchen, infinity plunge pool, and serene private courtyard.",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Plunge Pool", "Courtyard", "Solar Power Grid", "Double Carport", "CCTV Security", "Smart Lighting", "Borehole"],
    contactName: "Valerie Kemunto",
    contactPhone: "+254743445566",
    contactEmail: "valerie@springvalleyhomes.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_014",
    title: "Affordable 1-Bedroom Apartment near Two Rivers Mall",
    location: "Ruaka",
    bedrooms: 1,
    monthlyRent: 320.0,
    depositAmount: 90.0,
    description: "Budget-friendly, highly modern 1-bedroom flat just 5 minutes from Two Rivers Mall and Rosslyn Riviera. Tiled interiors, clean finishes, steady borehole water supply, and easy highway access.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Borehole Water", "CCTV Cameras", "Biometric Gate", "Token Electricity", "Balcony", "Parking Space"],
    contactName: "Daniel Wambua",
    contactPhone: "+254754556677",
    contactEmail: "daniel.wambua@ruakarentals.com",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_015",
    title: "Elegant 3-Bedroom Gated Villa with Clubhouse Access",
    location: "Kiambu Road",
    bedrooms: 3,
    monthlyRent: 950.0,
    depositAmount: 250.0,
    description: "Stunning family home inside a prestigious gated development along Kiambu Road. Community features a clubhouse, communal swimming pool, tennis court, jogging trail, and 24-hour guarded security.",
    images: [
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Clubhouse", "Tennis Court", "Jogging Track", "Communal Pool", "Private Garden", "24/7 Gate Security", "Solar Backup"],
    contactName: "Esther Nyambura",
    contactPhone: "+254765667788",
    contactEmail: "esther.nyambura@kiambuvillas.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_016",
    title: "Family-Friendly 3-Bedroom Townhouse near National Park",
    location: "Langata",
    bedrooms: 3,
    monthlyRent: 780.0,
    depositAmount: 200.0,
    description: "Peaceful 3-bedroom semi-detached townhouse bordering the perimeter of Nairobi National Park. Enjoy occasional sightings of wildlife against the sunset, dedicated parking for 2 cars, and spacious bedrooms.",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Park View", "Perimeter Electric Fence", "Water Tanks", "Children Play Area", "2 Car Parking", "Garden"],
    contactName: "Moses Cheruiyot",
    contactPhone: "+254776778899",
    contactEmail: "moses.cheruiyot@langatahomes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_017",
    title: "Vibrant 1-Bedroom Studio near TRM",
    location: "Roysambu",
    bedrooms: 1,
    monthlyRent: 280.0,
    depositAmount: 80.0,
    description: "Compact, well-designed 1-bedroom studio apartment adjacent to Thika Road Mall. Features fast fiber internet, biometric building access, roof-deck drying line area, and rapid access to public transit.",
    images: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Fiber Internet", "Biometric Access", "Roof Terrace", "Constant Water", "CCTV", "Street Lighted"],
    contactName: "Kelvin Kamau",
    contactPhone: "+254787889900",
    contactEmail: "kelvin.kamau@roysamburentals.com",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_018",
    title: "Secure 4-Bedroom Diplomatic Haven near UN Complex",
    location: "Gigiri",
    bedrooms: 4,
    monthlyRent: 3000.0,
    depositAmount: 700.0,
    description: "Top-tier diplomatic property situated within walking distance of the United Nations headquarters and Village Market. Features blast-resistant perimeter wall, razor wire, safe haven master room, solar grid, and private pool.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["UN Compliant", "Private Swimming Pool", "Safe Room", "Backup Generator", "Borehole", "Electric Fence", "Guard House"],
    contactName: "Hannah Van Der Merwe",
    contactPhone: "+254798990011",
    contactEmail: "hannah.gigiri@diplomatichomes.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_019",
    title: "Magnificent 5-Bedroom Mansion with Heated Pool",
    location: "Nyari",
    bedrooms: 5,
    monthlyRent: 3500.0,
    depositAmount: 800.0,
    description: "Spectacular ultra-luxury residence in prestigious Nyari Estate. Features 5 ensuite bedrooms, home cinema room, private sauna, heated infinity pool, chef's gourmet kitchen, marble floors, and 4-car garage.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Heated Infinity Pool", "Home Cinema", "Sauna & Steam", "4-Car Garage", "Marble Flooring", "Smart Home Automation", "Full Generator"],
    contactName: "Leonard Githinji",
    contactPhone: "+254709112233",
    contactEmail: "leonard@nyariestates.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_020",
    title: "Airy 2-Bedroom Apartment off Argwings Kodhek",
    location: "Hurlingham",
    bedrooms: 2,
    monthlyRent: 680.0,
    depositAmount: 180.0,
    description: "Centrally positioned 2-bedroom home in Hurlingham. Close to international hospitals, shopping malls, and dining spots. Offers wooden parquet floors, separate dining area, solar heater, and dedicated parking.",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Wooden Floors", "Solar Water Heating", "Elevator", "24/7 Security", "Borehole Water", "Intercom"],
    contactName: "Patricia Odhiambo",
    contactPhone: "+254719223344",
    contactEmail: "patricia.hurlingham@realty.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_021",
    title: "Peaceful 3-Bedroom Standalone House with Orchard",
    location: "Thome",
    bedrooms: 3,
    monthlyRent: 850.0,
    depositAmount: 220.0,
    description: "Quiet residential bungalow on a quarter acre plot in Thome Estate off Northern Bypass. Features fruit orchard (avocado and mango trees), expansive front patio, perimeter stonewall with electric wire, and garage.",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Fruit Orchard", "Quarter Acre Yard", "Electric Fence", "Pet-Friendly", "Water Reservoir", "Lockable Garage"],
    contactName: "Francis Macharia",
    contactPhone: "+254728334455",
    contactEmail: "francis.macharia@thomehomes.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_022",
    title: "Refurbished 2-Bedroom Apartment with Fast City Access",
    location: "Pangani",
    bedrooms: 2,
    monthlyRent: 420.0,
    depositAmount: 120.0,
    description: "Clean and recently modernized 2-bedroom unit in Pangani, offering unmatched commute times to Nairobi CBD via Thika Superhighway. Fitted kitchen with tiled backsplash and reliable water supply.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Near CBD", "Constant Water", "CCTV", "Manned Security Guard", "Tiled Flooring", "Fiber Ready"],
    contactName: "Salim Ahmed",
    contactPhone: "+254737445566",
    contactEmail: "salim.ahmed@panganiproperties.com",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_023",
    title: "Modern 2-Bedroom Flat in Gated Estate",
    location: "South B",
    bedrooms: 2,
    monthlyRent: 480.0,
    depositAmount: 130.0,
    description: "Neat 2-bedroom home in a gated court in South B (Mariakani area). Close to Capital Centre mall, public transport, and schools. Comes with prepaid electricity meters and reliable municipal water plus storage tanks.",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee15242ab830?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Gated Court", "Near Shopping Mall", "Water Tanks", "Prepaid Electricity", "Balcony", "Security Guard"],
    contactName: "Mary Muthoni",
    contactPhone: "+254746556677",
    contactEmail: "mary.southb@courtliving.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_024",
    title: "Spacious 3-Bedroom Villa near SGR & Airport",
    location: "Syokimau",
    bedrooms: 3,
    monthlyRent: 600.0,
    depositAmount: 150.0,
    description: "Modern gated villa in Syokimau, ideal for frequent flyers or SGR commuters. Master ensuite, spacious American open-plan kitchen, solar water heating system, cabro-paved driveway, and private yard.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Cabro Driveway", "Solar Water Heating", "Borehole Water", "Near SGR Station", "24/7 Security", "Pet-Friendly"],
    contactName: "Bernard Mutua",
    contactPhone: "+254755667799",
    contactEmail: "bernard.syokimau@villas.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_025",
    title: "Serene 4-Bedroom Bungalow with Solar Panels",
    location: "Kitengela",
    bedrooms: 4,
    monthlyRent: 550.0,
    depositAmount: 150.0,
    description: "Eco-friendly standalone 4-bedroom bungalow situated on an eighth of an acre in Kitengela. Fully off-grid solar setup with grid backup, bio-digester waste system, organic kitchen garden, and spacious rooms.",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Off-grid Solar", "Kitchen Garden", "Bio-digester", "Own Compound", "Perimeter Wall", "Ample Parking"],
    contactName: "Stephen Saitoti",
    contactPhone: "+254764778899",
    contactEmail: "saitoti.kitengela@ecohomes.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_026",
    title: "Ultra-Modern 2-Bedroom Apartment with Rooftop Infinity Pool",
    location: "Westlands",
    bedrooms: 2,
    monthlyRent: 950.0,
    depositAmount: 250.0,
    description: "High-end 2-bedroom executive residence on Rhapta Road. Features smart door locks, heated rooftop infinity pool with lounge bar, steam bath, high-speed elevators, and backup generator.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Infinity Pool", "Steam Bath", "Smart Locks", "Full Generator", "Gym", "High-Speed Lifts", "24/7 Concierge"],
    contactName: "Diana Kimani",
    contactPhone: "+254773889900",
    contactEmail: "diana.rhapta@primeapartments.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_027",
    title: "Stylishly Furnished 1-Bedroom Condo with Gym Access",
    location: "Kilimani",
    bedrooms: 1,
    monthlyRent: 700.0,
    depositAmount: 180.0,
    description: "Fully furnished 1-bedroom designer condo on Wood Avenue. Includes plush Scandinavian furniture, 55-inch smart TV, fitted oven and induction hob, king-size orthopedic bed, and serene garden balcony.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Fully Furnished", "Smart TV", "Equipped Gym", "Swimming Pool", "Fiber Internet", "Balcony View"],
    contactName: "Caroline Chebet",
    contactPhone: "+254782990011",
    contactEmail: "caroline.kilimani@condos.co.ke",
    contactRole: "Leasing Agent"
  },
  {
    id: "house_seed_028",
    title: "Quiet 2-Bedroom Duplex with Private Terrace",
    location: "Kileleshwa",
    bedrooms: 2,
    monthlyRent: 880.0,
    depositAmount: 220.0,
    description: "Unique two-level duplex in an exclusive low-density development in Kileleshwa. Ground floor features airy open living space and guest washroom; upper floor houses two ensuite bedrooms opening to private terrace.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Terrace", "Duplex Layout", "Solar Heating", "Covered Carport", "Intercom", "24/7 Guarded"],
    contactName: "Anthony Mwangi",
    contactPhone: "+254791001122",
    contactEmail: "anthony.kileleshwa@duplexes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_029",
    title: "Architect-Designed 3-Bedroom Garden Flat",
    location: "Lavington",
    bedrooms: 3,
    monthlyRent: 1350.0,
    depositAmount: 350.0,
    description: "Exceptional ground-floor apartment opening directly into a private landscaped zen garden. Features floor-to-ceiling glass doors, master suite with soaking tub, modern scullery, and silent backup generator.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Zen Garden", "Soaking Tub", "Silent Generator", "Borehole Water", "Clubhouse", "2 Car Spaces"],
    contactName: "Miriam Njeri",
    contactPhone: "+254701223344",
    contactEmail: "miriam.lavington@zengardens.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_030",
    title: "Rustic 3-Bedroom Cottage with Fireplace and Veranda",
    location: "Karen",
    bedrooms: 3,
    monthlyRent: 1500.0,
    depositAmount: 380.0,
    description: "Character-filled cedar and stone cottage on a peaceful Karen lane. Features stone hearth fireplace in the sunken living room, timber beams, deep shaded veranda, organic vegetable patch, and bird sanctuary views.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Stone Fireplace", "Deep Veranda", "Vegetable Garden", "Timber Beams", "Pet-Friendly", "Electric Gate", "Borehole"],
    contactName: "David Ochieng",
    contactPhone: "+254712334455",
    contactEmail: "david.ochieng@karencottages.com",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_031",
    title: "Sunlit 3-Bedroom Apartment with High Ceilings",
    location: "Parklands",
    bedrooms: 3,
    monthlyRent: 820.0,
    depositAmount: 200.0,
    description: "Airy 3-bedroom apartment with 3-meter high ceilings and oversized windows offering abundant natural lighting. Features granite kitchen with double sink, pantry, separate utility balcony, and two basement parking slots.",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee15242ab830?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["High Ceilings", "Basement Parking", "Solar Water", "Borehole", "24/7 Security", "Elevator"],
    contactName: "Harish Shah",
    contactPhone: "+254723445566",
    contactEmail: "harish.shah@parklandsluxury.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_032",
    title: "Waterfront 2-Bedroom Suite with Italian Finishes",
    location: "Riverside",
    bedrooms: 2,
    monthlyRent: 1050.0,
    depositAmount: 280.0,
    description: "Exquisite 2-bedroom suite fronting Nairobi River green belt. Italian marble countertops, German Grohe sanitaryware, centralized gas line, heated lap pool, gym, and 24-hour manned reception.",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Heated Lap Pool", "Grohe Fittings", "Central Gas", "Concierge Desk", "Gym", "Full Generator", "Borehole"],
    contactName: "Joy Nekesa",
    contactPhone: "+254734556677",
    contactEmail: "joy.riverside@waterfrontliving.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_033",
    title: "Charming 1-Bedroom Garden Studio",
    location: "Ngong Road",
    bedrooms: 1,
    monthlyRent: 400.0,
    depositAmount: 110.0,
    description: "Quiet garden studio apartment tucked away off Ngong Road behind Adams Arcade. Features independent private entrance, compact kitchenette, leafy outdoor sitting area, and solar heated shower.",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Entrance", "Outdoor Patio", "Solar Shower", "Fiber Internet", "Secure Compound"],
    contactName: "Samuel Gathogo",
    contactPhone: "+254745667788",
    contactEmail: "samuel.gathogo@adamsgardens.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_034",
    title: "Modern 2-Bedroom Master Ensuite with Elevator",
    location: "Ruaka",
    bedrooms: 2,
    monthlyRent: 450.0,
    depositAmount: 120.0,
    description: "Contemporary 2-bedroom flat with master ensuite in prime Ruaka. Boasts high-speed elevator, private balcony with green views, borehole water supply, perimeter electric fencing, and designated parking.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["High-Speed Elevator", "Master Ensuite", "Borehole Water", "Electric Fence", "Balcony", "Designated Parking"],
    contactName: "Eunice Mwikali",
    contactPhone: "+254756778899",
    contactEmail: "eunice.ruaka@estates.co.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_035",
    title: "Premium 4-Bedroom Townhouse in Edenville Estate",
    location: "Kiambu Road",
    bedrooms: 4,
    monthlyRent: 1400.0,
    depositAmount: 350.0,
    description: "Prestigious 4-bedroom villa inside Edenville Estate on Kiambu Road. Boasts spacious living room opening to private garden, modern kitchen, self-contained DSQ, 2 parking bays, and 24/7 security patrol.",
    images: [
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Garden", "Self-contained DSQ", "24/7 Security Patrol", "Solar Heating", "Children Playground", "Borehole"],
    contactName: "Patrick Gitau",
    contactPhone: "+254767889900",
    contactEmail: "patrick.gitau@edenvilleliving.com",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_036",
    title: "Gated 2-Bedroom Apartment overlooking Otiende",
    location: "Langata",
    bedrooms: 2,
    monthlyRent: 500.0,
    depositAmount: 140.0,
    description: "Conveniently located 2-bedroom home in Langata near Otiende Shopping Centre. Features modern tiled floors, built-in wardrobes, perimeter wall with CCTV, and constant water supply from on-site underground tank.",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee15242ab830?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Built-in Wardrobes", "CCTV Security", "Underground Water Tank", "Balcony", "Gated Compound"],
    contactName: "Isaac Kiprop",
    contactPhone: "+254778990011",
    contactEmail: "isaac.kiprop@langatarentals.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_037",
    title: "Executive 2-Bedroom Furnished Apartment",
    location: "Upperhill",
    bedrooms: 2,
    monthlyRent: 1150.0,
    depositAmount: 300.0,
    description: "Luxurious furnished 2-bedroom corporate apartment in Upperhill. Equipped with state-of-the-art electronics, daily housekeeping option, high-speed fiber, heated swimming pool, and round-the-clock security.",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Fully Furnished", "Heated Pool", "Daily Housekeeping", "High-Speed WiFi", "Gym", "Full Generator"],
    contactName: "Mercy Achieng",
    contactPhone: "+254789001122",
    contactEmail: "mercy.achieng@upperhillsuites.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_038",
    title: "Enchanting 3-Bedroom Guest Cottage near Village Market",
    location: "Gigiri",
    bedrooms: 3,
    monthlyRent: 1900.0,
    depositAmount: 450.0,
    description: "Idyllic 3-bedroom detached cottage inside a secured 2-acre private compound in Gigiri. Beautifully finished with hardwood timber ceilings, cozy stone fireplace, manicured lawn, and solar backup power.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Hardwood Ceilings", "Stone Fireplace", "Solar Backup", "2-Acre Compound", "UN Security Compliant", "Pet-Friendly"],
    contactName: "Alexander Bruce",
    contactPhone: "+254790112233",
    contactEmail: "alexander.bruce@gigiricottages.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_039",
    title: "Secluded 3-Bedroom Forest-View Residence",
    location: "Muthaiga",
    bedrooms: 3,
    monthlyRent: 2200.0,
    depositAmount: 550.0,
    description: "Nestled in the prestigious ridge of Old Muthaiga overlooking Karura Forest canopy. Unrivaled serenity, birdwatching deck, master ensuite with walk-in closet, high-end kitchen appliances, and perimeter razor wire.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Forest View", "Birdwatching Deck", "Karura Proximity", "Walk-in Closet", "High-End Appliances", "24/7 Security"],
    contactName: "Lucy Wambui",
    contactPhone: "+254701998877",
    contactEmail: "lucy.muthaiga@karurahomes.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_040",
    title: "Contemporary 2-Bedroom Flat in Boutique Complex",
    location: "Spring Valley",
    bedrooms: 2,
    monthlyRent: 920.0,
    depositAmount: 240.0,
    description: "Exclusive 2-bedroom home in a low-rise boutique development of only 12 residences in Spring Valley. Features landscaped central courtyard, rooftop sunset terrace, borehole, and standby generator.",
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Boutique Complex", "Sunset Terrace", "Standby Generator", "Borehole Water", "Solar Water Heating", "Covered Parking"],
    contactName: "Nicholas Koech",
    contactPhone: "+254712887766",
    contactEmail: "nicholas.koech@springvalleyboutique.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_041",
    title: "High-Rise 3-Bedroom Corner Unit with Wrap-Around Balcony",
    location: "Westlands",
    bedrooms: 3,
    monthlyRent: 1250.0,
    depositAmount: 320.0,
    description: "Corner 3-bedroom apartment on the 10th floor with breathtaking vistas of Nairobi city skyline. Expansive wrap-around balcony, master bedroom with en-suite bathtub, German kitchen fittings, and 2 designated underground parking slots.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Wrap-Around Balcony", "Skyline Views", "En-suite Bathtub", "German Fittings", "Underground Parking", "Heated Pool", "Gym"],
    contactName: "Elizabeth Njoki",
    contactPhone: "+254723776655",
    contactEmail: "elizabeth.njoki@westlandstowers.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_042",
    title: "Minimalist 1-Bedroom Loft near Yaya Centre",
    location: "Kilimani",
    bedrooms: 1,
    monthlyRent: 560.0,
    depositAmount: 150.0,
    description: "Modern minimalist 1-bedroom loft apartment just 3 minutes walk from Yaya Centre. Custom built-in wardrobes, sleek island kitchen counter, fast fiber connectivity, high-speed lift, and biometric entry.",
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Island Kitchen", "Biometric Entry", "Fiber Internet", "Near Yaya Centre", "CCTV", "High-Speed Lift"],
    contactName: "Brian Omondi",
    contactPhone: "+254734665544",
    contactEmail: "brian.omondi@kilimanilofts.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_043",
    title: "Expansive 4-Bedroom Duplex Penthouse",
    location: "Kileleshwa",
    bedrooms: 4,
    monthlyRent: 1650.0,
    depositAmount: 420.0,
    description: "Magnificent two-story penthouse apartment offering ultimate luxury and privacy in Kileleshwa. Features double-height living room windows, private elevator foyer, staff quarters, private sauna, and large barbecue terrace.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Elevator Foyer", "Private Sauna", "Barbecue Terrace", "Double-Height Ceilings", "Staff Quarters", "Full Generator", "Gym"],
    contactName: "Judith Kemboi",
    contactPhone: "+254745554433",
    contactEmail: "judith.kemboi@kileleshwapenthouses.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_044",
    title: "Refined 5-Bedroom Detached Villa with DSQ",
    location: "Lavington",
    bedrooms: 5,
    monthlyRent: 2500.0,
    depositAmount: 600.0,
    description: "Grand detached 5-bedroom villa with self-contained domestic staff quarters in prime Lavington. All bedrooms ensuite with walk-in wardrobes. Features family room, private garden, solar water heater, and 24-hour guarded gate.",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Private Garden", "All Ensuite", "Family Room", "Self-contained DSQ", "Solar Water Heating", "Electric Perimeter Fence"],
    contactName: "Pauline Wairimu",
    contactPhone: "+254756443322",
    contactEmail: "pauline.wairimu@lavingtonvillas.co.ke",
    contactRole: "Landlord"
  },
  {
    id: "house_seed_045",
    title: "Tranquil 4-Bedroom Ranch House with Horse Stables",
    location: "Karen",
    bedrooms: 4,
    monthlyRent: 2900.0,
    depositAmount: 700.0,
    description: "Picturesque 4-bedroom country home set on 1 acre of lush land in Karen. Includes equestrian stables, paddocks, separate guest cottage, outdoor fireplace, solar grid system, and borehole with industrial filtration.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Horse Stables", "1-Acre Compound", "Guest Cottage", "Outdoor Fireplace", "Industrial Water Filter", "Solar Power Grid"],
    contactName: "Rupert Campbell",
    contactPhone: "+254767332211",
    contactEmail: "rupert.campbell@karenranches.com",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_046",
    title: "Newly Built 2-Bedroom Flat with Lift and Solar Backup",
    location: "South C",
    bedrooms: 2,
    monthlyRent: 520.0,
    depositAmount: 140.0,
    description: "Brand new 2-bedroom apartment completed this year in South C. Offers elevator access, solar common lighting, master ensuite, built-in kitchen cabinets, and easy access to Mombasa Road and Southern Bypass.",
    images: [
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee15242ab830?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Elevator Access", "Solar Backup Lighting", "Master Ensuite", "Near Southern Bypass", "CCTV Security", "Water Tanks"],
    contactName: "Abdi Noor",
    contactPhone: "+254778221100",
    contactEmail: "abdi.noor@southchomes.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_047",
    title: "Spacious 3-Bedroom Family Flat with DSQ",
    location: "Hurlingham",
    bedrooms: 3,
    monthlyRent: 890.0,
    depositAmount: 230.0,
    description: "Generous 3-bedroom apartment with detached servant quarters on Lenana Road. Close to French School and Nairobi Hospital. Features solid wooden floors, large kitchen with pantry, high-speed lift, and swimming pool.",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Detached DSQ", "Swimming Pool", "Wooden Parquet", "Near French School", "Elevator", "Borehole Water"],
    contactName: "Sylvia Mumo",
    contactPhone: "+254789110099",
    contactEmail: "sylvia.mumo@lenanahomes.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_048",
    title: "Bright 3-Bedroom Apartment with Open Plan Kitchen",
    location: "Ruaka",
    bedrooms: 3,
    monthlyRent: 580.0,
    depositAmount: 150.0,
    description: "Modern and well-proportioned 3-bedroom apartment in Ruaka near Joyland. Features large American open-plan kitchen, ceramic floor tiles, balcony with panoramic valley views, and solar water heating.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Open Plan Kitchen", "Valley Views Balcony", "Solar Water Heating", "Borehole Supply", "24/7 Gate Guard", "CCTV"],
    contactName: "Victor Gathitu",
    contactPhone: "+254790009988",
    contactEmail: "victor.gathitu@ruakaapartments.ke",
    contactRole: "Caretaker"
  },
  {
    id: "house_seed_049",
    title: "Luxury 4-Bedroom Riverbank Penthouse with Jacuzzi",
    location: "Riverside",
    bedrooms: 4,
    monthlyRent: 2100.0,
    depositAmount: 500.0,
    description: "Palatial 4-bedroom duplex penthouse directly overlooking the quiet riverside nature sanctuary. Includes rooftop jacuzzi with deck, imported Italian kitchen with built-in appliances, smart security, and heated community pool.",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Rooftop Jacuzzi", "Nature Sanctuary Views", "Imported Kitchen", "Smart Locks", "Heated Pool", "Full Generator"],
    contactName: "Natasha Romanova",
    contactPhone: "+254701889900",
    contactEmail: "natasha@riversideluxury.ke",
    contactRole: "Property Manager"
  },
  {
    id: "house_seed_050",
    title: "Designer 2-Bedroom Smart Home with EV Charging",
    location: "Westlands",
    bedrooms: 2,
    monthlyRent: 1000.0,
    depositAmount: 260.0,
    description: "State-of-the-art 2-bedroom smart apartment on General Mathenge Drive. Equipped with voice-controlled lighting and blinds, dedicated electric vehicle (EV) charging bay, heated rooftop lap pool, and co-working lounge.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["EV Charging Station", "Smart Home Automation", "Co-Working Lounge", "Rooftop Heated Lap Pool", "High-Speed WiFi", "24/7 Armed Guard"],
    contactName: "Kiprotich Sang",
    contactPhone: "+254712990011",
    contactEmail: "kiprotich.sang@smarthomes.co.ke",
    contactRole: "Property Manager"
  }
];

async function seed() {
  console.log(`Starting to seed ${houses.length} houses to ${API_URL}...`);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(house),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        successCount++;
        console.log(`[${i + 1}/${houses.length}] Added: "${house.title}" (${house.location}) - Status: ${response.status}`);
      } else {
        failCount++;
        console.error(`[${i + 1}/${houses.length}] FAILED: "${house.title}" - Status: ${response.status}`, data);
      }
    } catch (err) {
      failCount++;
      console.error(`[${i + 1}/${houses.length}] ERROR: "${house.title}"`, err.message);
    }
  }

  console.log('\n=============================================');
  console.log(`Seeding complete!`);
  console.log(`Successfully added: ${successCount}`);
  console.log(`Failed:               ${failCount}`);
  console.log('=============================================');

  // Verify total count from API
  try {
    const getRes = await fetch(API_URL);
    const getData = await getRes.json();
    console.log(`Total houses currently returned by GET ${API_URL}: ${getData.count}`);
  } catch (err) {
    console.error('Failed to verify total count:', err.message);
  }
}

seed();

