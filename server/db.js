const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.json');

let dbData = {
  users: [],
  agent_profiles: [],
  properties: [],
  property_images: [],
  amenities: [],
  property_amenities: [],
  favourites: [],
  enquiries: [],
  reviews: [],
  reports: [],
  notifications: []
};

function saveDB() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

function loadDB() {
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf8');
      dbData = JSON.parse(raw);
      console.log('Loaded database from', dbPath);
      return;
    } catch (err) {
      console.error('Error reading database, re-seeding:', err);
    }
  }
  seedInitialData();
}

function seedInitialData() {
  console.log('Seeding database with initial real estate records...');

  const adminPass = bcrypt.hashSync('admin123', 10);
  const agentPass = bcrypt.hashSync('agent123', 10);
  const sellerPass = bcrypt.hashSync('seller123', 10);
  const buyerPass = bcrypt.hashSync('buyer123', 10);

  dbData.users = [
    {
      id: 1,
      name: 'System Admin',
      email: 'admin@estate.com',
      password: adminPass,
      role: 'admin',
      phone: '+91 98765 01928',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Platform Administrator & Content Moderator',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'sarah.agent@estate.com',
      password: agentPass,
      role: 'agent',
      phone: '+91 98201 23456',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Top Luxury Real Estate Agent with over 10 years experience in prime seafront & urban properties.',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Vikramaditya Rao',
      email: 'david.agent@estate.com',
      password: agentPass,
      role: 'agent',
      phone: '+91 98450 87654',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      bio: 'Commercial & Residential Property Consultant specializing in modern high-rise penthouses & villas.',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Rajesh Varma',
      email: 'john.seller@estate.com',
      password: sellerPass,
      role: 'seller',
      phone: '+91 98112 34567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Private homeowner selling premium eco-friendly suburban properties & villas.',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Ananya Sen',
      email: 'buyer@estate.com',
      password: buyerPass,
      role: 'buyer',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Active home buyer looking for modern luxury villas and city apartments.',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ];

  dbData.agent_profiles = [
    {
      id: 1,
      user_id: 2,
      agency_name: 'DLF Luxury Homes',
      license_number: 'RERA-MH-400050-A1',
      experience_years: 10,
      specialization: 'Luxury Seafront Estates & Villas in Mumbai & Goa',
      rating: 4.9,
      review_count: 28
    },
    {
      id: 2,
      user_id: 3,
      agency_name: 'Sobha Prestige Realty',
      license_number: 'RERA-KA-560038-B2',
      experience_years: 12,
      specialization: 'Gated Villa Communities & High-Rise Penthouses in Bengaluru & Hyderabad',
      rating: 4.8,
      review_count: 19
    }
  ];

  dbData.amenities = [
    { id: 1, name: 'Swimming Pool', icon: 'Waves' },
    { id: 2, name: 'Private Garden', icon: 'Trees' },
    { id: 3, name: 'Gym / Fitness Center', icon: 'Dumbbell' },
    { id: 4, name: '24/7 Security & CCTV', icon: 'ShieldCheck' },
    { id: 5, name: 'Air Conditioning', icon: 'Wind' },
    { id: 6, name: 'Balcony / Terrace', icon: 'Sun' },
    { id: 7, name: 'Underground Parking', icon: 'Car' },
    { id: 8, name: 'Smart Home Automation', icon: 'Cpu' },
    { id: 9, name: 'High-Speed Wi-Fi', icon: 'Wifi' },
    { id: 10, name: 'Elevator / Lift', icon: 'ArrowUpCircle' },
    { id: 11, name: 'Fireplace', icon: 'Flame' },
    { id: 12, name: 'Solar Panels', icon: 'Zap' }
  ];

  dbData.properties = [
    {
      id: 1,
      title: 'Grand Horizon Luxury Villa with Ocean Views',
      ref_number: 'PROP-1001',
      description: 'An architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking coastal vistas, smart lighting systems, private wine cellar, and master suite with panoramic sea terrace.',
      property_type: 'Villa',
      listing_type: 'Sale',
      price: 2450000,
      address: '742 Coastal Ridge Blvd',
      city: 'Malibu',
      postcode: '90265',
      latitude: 34.0259,
      longitude: -118.7798,
      bedrooms: 5,
      bathrooms: 6,
      area_sqft: 6200,
      construction_year: 2023,
      furnishing: 'Furnished',
      parking_spaces: 3,
      status: 'active',
      is_featured: 1,
      view_count: 342,
      owner_id: 2,
      created_at: new Date('2026-07-01').toISOString(),
      updated_at: new Date('2026-07-01').toISOString()
    },
    {
      id: 2,
      title: 'Modern High-Rise Penthouse in City Center',
      ref_number: 'PROP-1002',
      description: 'Stunning downtown penthouse with private rooftop deck, gourmet Italian kitchen, customized walk-in closets, and 360-degree views of the metropolitan skyline.',
      property_type: 'Penthouse',
      listing_type: 'Sale',
      price: 1850000,
      address: '100 Metropolis Way, Penthouse B',
      city: 'New York',
      postcode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 3400,
      construction_year: 2022,
      furnishing: 'Semi-Furnished',
      parking_spaces: 2,
      status: 'active',
      is_featured: 1,
      view_count: 512,
      owner_id: 3,
      created_at: new Date('2026-07-05').toISOString(),
      updated_at: new Date('2026-07-05').toISOString()
    },
    {
      id: 3,
      title: 'Charming Craftsman Suburban Family Home',
      ref_number: 'PROP-1003',
      description: 'Beautifully maintained family home with open-concept living area, hardwood floors, large backyard garden with patio, updated chef kitchen, and top-rated school district location.',
      property_type: 'House',
      listing_type: 'Sale',
      price: 785000,
      address: '415 Maplewood Lane',
      city: 'Austin',
      postcode: '78704',
      latitude: 30.2672,
      longitude: -97.7431,
      bedrooms: 4,
      bathrooms: 3,
      area_sqft: 2850,
      construction_year: 2019,
      furnishing: 'Unfurnished',
      parking_spaces: 2,
      status: 'active',
      is_featured: 1,
      view_count: 218,
      owner_id: 4,
      created_at: new Date('2026-07-10').toISOString(),
      updated_at: new Date('2026-07-10').toISOString()
    },
    {
      id: 4,
      title: 'Sleek Modern Studio Apartment Downtown',
      ref_number: 'PROP-1004',
      description: 'Fully furnished minimalist studio apartment ideal for urban professionals. Features built-in storage solutions, high-speed fiber internet, gym access, and 24/7 concierge.',
      property_type: 'Apartment',
      listing_type: 'Rent',
      price: 2800,
      address: '88 Tech Boulevard, Unit 402',
      city: 'San Francisco',
      postcode: '94105',
      latitude: 37.7749,
      longitude: -122.4194,
      bedrooms: 1,
      bathrooms: 1,
      area_sqft: 750,
      construction_year: 2021,
      furnishing: 'Furnished',
      parking_spaces: 1,
      status: 'active',
      is_featured: 0,
      view_count: 145,
      owner_id: 2,
      created_at: new Date('2026-07-12').toISOString(),
      updated_at: new Date('2026-07-12').toISOString()
    },
    {
      id: 5,
      title: 'Prime Commercial Office Space in Business District',
      ref_number: 'PROP-1005',
      description: 'Grade A corporate office floor with customizable conference rooms, private executive suites, high-speed server room, employee lounge, and dedicated parking.',
      property_type: 'Office',
      listing_type: 'Rent',
      price: 12500,
      address: '500 Corporate Plaza, 12th Floor',
      city: 'Chicago',
      postcode: '60601',
      latitude: 41.8781,
      longitude: -87.6298,
      bedrooms: 0,
      bathrooms: 4,
      area_sqft: 5200,
      construction_year: 2020,
      furnishing: 'Semi-Furnished',
      parking_spaces: 6,
      status: 'active',
      is_featured: 0,
      view_count: 98,
      owner_id: 3,
      created_at: new Date('2026-07-15').toISOString(),
      updated_at: new Date('2026-07-15').toISOString()
    },
    {
      id: 6,
      title: 'Secluded Contemporary Hillside Residence',
      ref_number: 'PROP-1006',
      description: 'Nestled in peaceful oak woodlands, this eco-friendly smart home features solar roof installation, outdoor fire lounge, infinity spa, and heated marble flooring.',
      property_type: 'Villa',
      listing_type: 'Sale',
      price: 1950000,
      address: '1200 Pine Ridge Road',
      city: 'Denver',
      postcode: '80202',
      latitude: 39.7392,
      longitude: -104.9903,
      bedrooms: 4,
      bathrooms: 4,
      area_sqft: 4100,
      construction_year: 2024,
      furnishing: 'Unfurnished',
      parking_spaces: 3,
      status: 'active',
      is_featured: 1,
      view_count: 289,
      owner_id: 4,
      created_at: new Date('2026-07-18').toISOString(),
      updated_at: new Date('2026-07-18').toISOString()
    },
    {
      id: 7,
      title: 'Luxury Waterfront Condo with Private Yacht Slip',
      ref_number: 'PROP-1007',
      description: 'Exclusive resort-style waterfront condo with yacht slip included. Floor-to-ceiling windows, private elevator access, resort pool, and cabana privileges.',
      property_type: 'Apartment',
      listing_type: 'Sale',
      price: 1150000,
      address: '300 Ocean Drive, Suite 8A',
      city: 'Miami',
      postcode: '33139',
      latitude: 25.7617,
      longitude: -80.1918,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2200,
      construction_year: 2022,
      furnishing: 'Furnished',
      parking_spaces: 2,
      status: 'active',
      is_featured: 1,
      view_count: 176,
      owner_id: 2,
      created_at: new Date('2026-07-20').toISOString(),
      updated_at: new Date('2026-07-20').toISOString()
    },
    {
      id: 8,
      title: 'Suburban Green Eco Villa',
      ref_number: 'PROP-1008',
      description: 'Newly submitted modern green living villa with natural thermal insulation, zero-carbon footprint design, and organic vegetable garden space.',
      property_type: 'Villa',
      listing_type: 'Sale',
      price: 920000,
      address: '88 Green Valley Way',
      city: 'Portland',
      postcode: '97201',
      latitude: 45.5152,
      longitude: -122.6784,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2900,
      construction_year: 2024,
      furnishing: 'Unfurnished',
      parking_spaces: 2,
      status: 'active',
      is_featured: 1,
      view_count: 12,
      owner_id: 4,
      created_at: new Date('2026-07-25').toISOString(),
      updated_at: new Date('2026-07-25').toISOString()
    }
  ];

  dbData.property_images = [
    { id: 1, property_id: 1, image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 2, property_id: 1, image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },
    { id: 3, property_id: 1, image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },
    { id: 4, property_id: 1, image_url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 5, property_id: 2, image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 6, property_id: 2, image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },
    { id: 7, property_id: 2, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 8, property_id: 3, image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 9, property_id: 3, image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },
    { id: 10, property_id: 3, image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 11, property_id: 4, image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 12, property_id: 4, image_url: 'https://images.unsplash.com/photo-1502672016976-66f284e3e3b7?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 13, property_id: 5, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 14, property_id: 5, image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 15, property_id: 6, image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 16, property_id: 6, image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80', is_featured: 0 },

    { id: 17, property_id: 7, image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', is_featured: 1 },
    { id: 18, property_id: 8, image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', is_featured: 1 }
  ];

  dbData.property_amenities = [
    { property_id: 1, amenity_id: 1 },
    { property_id: 1, amenity_id: 2 },
    { property_id: 1, amenity_id: 4 },
    { property_id: 1, amenity_id: 5 },
    { property_id: 1, amenity_id: 8 },
    { property_id: 1, amenity_id: 9 },
    { property_id: 1, amenity_id: 11 },

    { property_id: 2, amenity_id: 3 },
    { property_id: 2, amenity_id: 5 },
    { property_id: 2, amenity_id: 6 },
    { property_id: 2, amenity_id: 7 },
    { property_id: 2, amenity_id: 8 },
    { property_id: 2, amenity_id: 10 },

    { property_id: 3, amenity_id: 2 },
    { property_id: 3, amenity_id: 5 },
    { property_id: 3, amenity_id: 7 },
    { property_id: 3, amenity_id: 11 },
    { property_id: 3, amenity_id: 4 }
  ];

  dbData.favourites = [
    { user_id: 5, property_id: 1, created_at: new Date().toISOString() },
    { user_id: 5, property_id: 2, created_at: new Date().toISOString() }
  ];

  dbData.enquiries = [
    {
      id: 1,
      property_id: 1,
      sender_name: 'Emily Blunt',
      sender_email: 'buyer@estate.com',
      sender_phone: '+1 (555) 987-6543',
      message: 'Hi Sarah, I am very interested in viewing the Grand Horizon Villa this coming weekend. Is Saturday afternoon available?',
      owner_id: 2,
      status: 'unread',
      created_at: new Date('2026-07-26T14:30:00Z').toISOString()
    },
    {
      id: 2,
      property_id: 2,
      sender_name: 'Marcus Vance',
      sender_email: 'marcus.vance@gmail.com',
      sender_phone: '+1 (555) 444-3322',
      message: 'Could you provide details on the building homeowners association fees and pet policies for Penthouse B?',
      owner_id: 3,
      status: 'read',
      created_at: new Date('2026-07-24T09:15:00Z').toISOString()
    }
  ];

  dbData.reviews = [
    {
      id: 1,
      property_id: 1,
      agent_id: 2,
      user_id: 5,
      rating: 5,
      comment: 'Sarah was exceptionally professional, guided us through every step of inspecting this luxury villa.',
      created_at: new Date('2026-07-20').toISOString()
    },
    {
      id: 2,
      property_id: 2,
      agent_id: 3,
      user_id: 5,
      rating: 5,
      comment: 'David was very knowledgeable about downtown Manhattan penthouses. Outstanding agent service!',
      created_at: new Date('2026-07-22').toISOString()
    }
  ];

  dbData.reports = [
    {
      id: 1,
      property_id: 8,
      reported_by: 5,
      reason: 'Please verify construction year and eco-friendly certification credentials.',
      status: 'pending',
      created_at: new Date('2026-07-26').toISOString()
    }
  ];

  dbData.notifications = [
    {
      id: 1,
      user_id: 2,
      title: 'New Property Enquiry',
      message: 'Emily Blunt submitted an enquiry for Grand Horizon Luxury Villa.',
      is_read: 0,
      created_at: new Date().toISOString()
    }
  ];

  saveDB();
}

// Load initial database
loadDB();

// Helper Data Access Functions
const dbHelper = {
  getDB: () => dbData,
  saveDB: () => saveDB(),

  // Users
  findUserByEmail: (email) => dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  findUserById: (id) => dbData.users.find(u => u.id === Number(id)),
  createUser: (userData) => {
    const newId = dbData.users.length ? Math.max(...dbData.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      ...userData,
      status: userData.status || 'active',
      created_at: new Date().toISOString()
    };
    dbData.users.push(newUser);
    saveDB();
    return newUser;
  },
  updateUser: (id, updates) => {
    const user = dbData.users.find(u => u.id === Number(id));
    if (!user) return null;
    Object.assign(user, updates);
    saveDB();
    return user;
  },
  deleteUser: (id) => {
    const numId = Number(id);
    const index = dbData.users.findIndex(u => u.id === numId);
    if (index === -1) return false;
    dbData.users.splice(index, 1);
    saveDB();
    return true;
  },

  getAgentProfileByUserId: (userId) => {
    const profile = dbData.agent_profiles.find(a => a.user_id === Number(userId)) || {};
    const user = dbData.users.find(u => u.id === Number(userId));
    if (!user) return null;
    return {
      ...profile,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      agency_name: profile.agency_name || 'Independent Luxury Brokerage',
      license_number: profile.license_number || 'RE-LIC-DEFAULT',
      experience_years: profile.experience_years || 5,
      specialization: profile.specialization || 'Residential & Commercial',
      rating: profile.rating || 4.9,
      review_count: profile.review_count || 15,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio
      }
    };
  },
  getAllAgents: () => {
    return dbData.users
      .filter(u => u.role === 'agent')
      .map(user => {
        const profile = dbData.agent_profiles.find(a => a.user_id === user.id) || {};
        const agentProperties = dbData.properties.filter(p => p.owner_id === user.id && p.status === 'active');
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          agency_name: profile.agency_name || 'Independent Luxury Brokerage',
          license_number: profile.license_number || 'RE-LIC-DEFAULT',
          experience_years: profile.experience_years || 5,
          specialization: profile.specialization || 'Residential & Commercial',
          rating: profile.rating || 4.9,
          review_count: profile.review_count || 15,
          active_listings_count: agentProperties.length
        };
      });
  },

  // Properties
  getProperties: (filters = {}, sort = 'newest', limit = 20, page = 1) => {
    let result = dbData.properties.map(p => {
      const owner = dbData.users.find(u => u.id === p.owner_id) || {};
      const agentProfile = dbData.agent_profiles.find(a => a.user_id === p.owner_id) || {};
      const images = dbData.property_images.filter(img => img.property_id === p.id);
      const featuredImage = images.find(img => img.is_featured) || images[0] || { image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80' };
      
      const propAmenityIds = dbData.property_amenities.filter(pa => pa.property_id === p.id).map(pa => pa.amenity_id);
      const amenities = dbData.amenities.filter(a => propAmenityIds.includes(a.id));

      return {
        ...p,
        featured_image: featuredImage.image_url,
        images: images.map(i => i.image_url),
        amenities: amenities.map(a => a.name),
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          avatar: owner.avatar,
          role: owner.role,
          agency_name: agentProfile.agency_name
        }
      };
    });

    // Apply Filter Parameters
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    } else {
      // Default to active for public queries unless status is specifically requested
      if (!filters.ignoreStatusDefault) {
        result = result.filter(p => p.status === 'active');
      }
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw) ||
        p.city.toLowerCase().includes(kw) ||
        p.address.toLowerCase().includes(kw) ||
        p.postcode.toLowerCase().includes(kw)
      );
    }

    if (filters.city) {
      result = result.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    if (filters.postcode) {
      result = result.filter(p => p.postcode.toLowerCase().includes(filters.postcode.toLowerCase()));
    }

    if (filters.property_type && filters.property_type !== 'All') {
      result = result.filter(p => p.property_type.toLowerCase() === filters.property_type.toLowerCase());
    }

    if (filters.listing_type && filters.listing_type !== 'All') {
      result = result.filter(p => p.listing_type.toLowerCase() === filters.listing_type.toLowerCase());
    }

    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      const beds = Number(filters.bedrooms);
      result = result.filter(p => p.bedrooms >= beds);
    }

    if (filters.bathrooms && filters.bathrooms !== 'Any') {
      const baths = Number(filters.bathrooms);
      result = result.filter(p => p.bathrooms >= baths);
    }

    if (filters.minArea) {
      result = result.filter(p => p.area_sqft >= Number(filters.minArea));
    }

    if (filters.maxArea) {
      result = result.filter(p => p.area_sqft <= Number(filters.maxArea));
    }

    if (filters.furnishing && filters.furnishing !== 'Any') {
      result = result.filter(p => p.furnishing.toLowerCase() === filters.furnishing.toLowerCase());
    }

    if (filters.parking && filters.parking === 'true') {
      result = result.filter(p => p.parking_spaces > 0);
    }

    if (filters.owner_id) {
      result = result.filter(p => p.owner_id === Number(filters.owner_id));
    }

    if (filters.is_featured) {
      result = result.filter(p => p.is_featured === 1);
    }

    // Apply Sorting
    switch (sort) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area_largest':
        result.sort((a, b) => b.area_sqft - a.area_sqft);
        break;
      case 'most_popular':
        result.sort((a, b) => b.view_count - a.view_count);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    const totalCount = result.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    return {
      properties: paginatedItems,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit)
    };
  },

  getPropertyById: (id) => {
    const p = dbData.properties.find(prop => prop.id === Number(id));
    if (!p) return null;

    // Increment view count
    p.view_count = (p.view_count || 0) + 1;
    saveDB();

    const owner = dbData.users.find(u => u.id === p.owner_id) || {};
    const agentProfile = dbData.agent_profiles.find(a => a.user_id === p.owner_id) || {};
    const images = dbData.property_images.filter(img => img.property_id === p.id);
    const propAmenityIds = dbData.property_amenities.filter(pa => pa.property_id === p.id).map(pa => pa.amenity_id);
    const amenities = dbData.amenities.filter(a => propAmenityIds.includes(a.id));
    const reviews = dbData.reviews.filter(r => r.property_id === p.id);

    return {
      ...p,
      images: images.length ? images.map(i => i.image_url) : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'],
      amenities: amenities,
      reviews: reviews,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        avatar: owner.avatar,
        role: owner.role,
        agency_name: agentProfile.agency_name,
        rating: agentProfile.rating || 4.9
      }
    };
  },

  createProperty: (propData, imageUrls = [], amenityIds = []) => {
    const newId = dbData.properties.length ? Math.max(...dbData.properties.map(p => p.id)) + 1 : 1;
    const refNum = `PROP-${1000 + newId}`;
    
    const newProp = {
      id: newId,
      title: propData.title,
      ref_number: refNum,
      description: propData.description || '',
      property_type: propData.property_type || 'House',
      listing_type: propData.listing_type || 'Sale',
      price: Number(propData.price) || 0,
      address: propData.address || '',
      city: propData.city || '',
      postcode: propData.postcode || '',
      latitude: Number(propData.latitude) || 34.0259,
      longitude: Number(propData.longitude) || -118.7798,
      bedrooms: Number(propData.bedrooms) || 0,
      bathrooms: Number(propData.bathrooms) || 0,
      area_sqft: Number(propData.area_sqft) || 0,
      construction_year: Number(propData.construction_year) || 2024,
      furnishing: propData.furnishing || 'Unfurnished',
      parking_spaces: Number(propData.parking_spaces) || 0,
      status: propData.status || 'pending', // default to pending for moderation if seller/agent
      is_featured: propData.is_featured ? 1 : 0,
      view_count: 0,
      owner_id: Number(propData.owner_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbData.properties.push(newProp);

    // Save Images
    if (imageUrls && imageUrls.length > 0) {
      imageUrls.forEach((url, idx) => {
        const imgId = dbData.property_images.length ? Math.max(...dbData.property_images.map(i => i.id)) + 1 : 1;
        dbData.property_images.push({
          id: imgId,
          property_id: newId,
          image_url: url,
          is_featured: idx === 0 ? 1 : 0
        });
      });
    } else {
      // Default placeholder
      const imgId = dbData.property_images.length ? Math.max(...dbData.property_images.map(i => i.id)) + 1 : 1;
      dbData.property_images.push({
        id: imgId,
        property_id: newId,
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
        is_featured: 1
      });
    }

    // Save Amenities
    if (amenityIds && amenityIds.length > 0) {
      amenityIds.forEach(amId => {
        dbData.property_amenities.push({
          property_id: newId,
          amenity_id: Number(amId)
        });
      });
    }

    saveDB();
    return dbHelper.getPropertyById(newId);
  },

  updateProperty: (id, propData, imageUrls = null, amenityIds = null) => {
    const prop = dbData.properties.find(p => p.id === Number(id));
    if (!prop) return null;

    Object.assign(prop, {
      ...propData,
      updated_at: new Date().toISOString()
    });

    if (imageUrls !== null && Array.isArray(imageUrls)) {
      // Replace images
      dbData.property_images = dbData.property_images.filter(i => i.property_id !== Number(id));
      imageUrls.forEach((url, idx) => {
        const imgId = dbData.property_images.length ? Math.max(...dbData.property_images.map(i => i.id)) + 1 : 1;
        dbData.property_images.push({
          id: imgId,
          property_id: Number(id),
          image_url: url,
          is_featured: idx === 0 ? 1 : 0
        });
      });
    }

    if (amenityIds !== null && Array.isArray(amenityIds)) {
      // Replace amenities
      dbData.property_amenities = dbData.property_amenities.filter(pa => pa.property_id !== Number(id));
      amenityIds.forEach(amId => {
        dbData.property_amenities.push({
          property_id: Number(id),
          amenity_id: Number(amId)
        });
      });
    }

    saveDB();
    return dbHelper.getPropertyById(id);
  },

  deleteProperty: (id) => {
    const index = dbData.properties.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    dbData.properties.splice(index, 1);
    dbData.property_images = dbData.property_images.filter(i => i.property_id !== Number(id));
    dbData.property_amenities = dbData.property_amenities.filter(pa => pa.property_id !== Number(id));
    dbData.favourites = dbData.favourites.filter(f => f.property_id !== Number(id));
    dbData.enquiries = dbData.enquiries.filter(e => e.property_id !== Number(id));
    saveDB();
    return true;
  },

  // Favourites
  getFavouritesByUser: (userId) => {
    const favPropIds = dbData.favourites.filter(f => f.user_id === Number(userId)).map(f => f.property_id);
    return dbData.properties
      .filter(p => favPropIds.includes(p.id))
      .map(p => dbHelper.getPropertyById(p.id));
  },
  toggleFavourite: (userId, propertyId) => {
    const uId = Number(userId);
    const pId = Number(propertyId);
    const index = dbData.favourites.findIndex(f => f.user_id === uId && f.property_id === pId);
    if (index > -1) {
      dbData.favourites.splice(index, 1);
      saveDB();
      return { saved: false };
    } else {
      dbData.favourites.push({ user_id: uId, property_id: pId, created_at: new Date().toISOString() });
      saveDB();
      return { saved: true };
    }
  },

  // Enquiries
  createEnquiry: (enquiryData) => {
    const newId = dbData.enquiries.length ? Math.max(...dbData.enquiries.map(e => e.id)) + 1 : 1;
    const newEnquiry = {
      id: newId,
      property_id: Number(enquiryData.property_id),
      sender_name: enquiryData.sender_name,
      sender_email: enquiryData.sender_email,
      sender_phone: enquiryData.sender_phone || '',
      message: enquiryData.message,
      owner_id: Number(enquiryData.owner_id),
      status: 'unread',
      created_at: new Date().toISOString()
    };
    dbData.enquiries.push(newEnquiry);
    saveDB();
    return newEnquiry;
  },
  getEnquiriesByOwner: (ownerId) => {
    return dbData.enquiries
      .filter(e => e.owner_id === Number(ownerId))
      .map(e => {
        const prop = dbData.properties.find(p => p.id === e.property_id) || {};
        return {
          ...e,
          property_title: prop.title || 'Property',
          property_ref: prop.ref_number || ''
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  updateEnquiryStatus: (id, status) => {
    const enquiry = dbData.enquiries.find(e => e.id === Number(id));
    if (!enquiry) return null;
    enquiry.status = status;
    saveDB();
    return enquiry;
  },

  // Admin Stats
  getAdminStats: () => {
    const totalUsers = dbData.users.length;
    const totalProperties = dbData.properties.length;
    const activeProperties = dbData.properties.filter(p => p.status === 'active').length;
    const pendingProperties = dbData.properties.filter(p => p.status === 'pending').length;
    const totalEnquiries = dbData.enquiries.length;
    const totalReports = dbData.reports.filter(r => r.status === 'pending').length;

    return {
      totalUsers,
      totalProperties,
      activeProperties,
      pendingProperties,
      totalEnquiries,
      totalReports,
      recentUsers: dbData.users.slice(-5).reverse(),
      recentProperties: dbData.properties.slice(-5).reverse()
    };
  }
};

module.exports = dbHelper;
