import { Product, BlogPost, FAQItem, CPDModule, Workshop } from './types';

// All 47 counties of Kenya
export const KENYA_COUNTIES = [
  'Mombasa County', 'Kwale County', 'Kilifi County', 'Tana River County', 'Lamu County',
  'Taita-Taveta County', 'Garissa County', 'Wajir County', 'Mandera County', 'Marsabit County',
  'Isiolo County', 'Meru County', 'Tharaka-Nithi County', 'Embu County', 'Kitui County',
  'Machakos County', 'Makueni County', 'Nyandarua County', 'Nyeri County', 'Kirinyaga County',
  "Murang'a County", 'Kiambu County', 'Turkana County', 'West Pokot County', 'Samburu County',
  'Trans Nzoia County', 'Uasin Gishu County', 'Elgeyo-Marakwet County', 'Nandi County', 'Baringo County',
  'Laikipia County', 'Nakuru County', 'Narok County', 'Kajiado County', 'Kericho County',
  'Bomet County', 'Kakamega County', 'Vihiga County', 'Bungoma County', 'Busia County',
  'Siaya County', 'Kisumu County', 'Homa Bay County', 'Migori County', 'Kisii County',
  'Nyamira County', 'Nairobi County',
];

export const PRODUCTS: Product[] = [
  // Crop Health
  {
    id: 'crop-1',
    name: 'Duduthrin 500ml Insecticide',
    category: 'crop-health',
    price: 1600,
    rating: 4.8,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller',
    description: 'Fast-acting, broad-spectrum insecticide for controlling aphids, thrips, caterpillars, and fall armyworms in vegetables, maize, and flowers.',
    stockStatus: 'In Stock',
  },
  {
    id: 'crop-2',
    name: 'NPK Fertilizer 50kg (17:17:17)',
    category: 'crop-health',
    price: 4800,
    rating: 4.6,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80',
    tag: 'Recommended',
    description: 'Balanced fertilizer ideal for basal or top-dressing application. Provides equal ratios of Nitrogen, Phosphorus, and Potassium for robust vegetative and root development.',
    stockStatus: 'In Stock',
  },
  {
    id: 'crop-3',
    name: 'Bio-Cure F Fungicide 1L',
    category: 'crop-health',
    price: 2695,
    rating: 4.4,
    reviewsCount: 15,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    tag: '10% OFF',
    description: 'Organic biological fungicide powered by Trichoderma viride. Excellent for controlling soil-borne diseases such as root rot, wilt, and damping-off.',
    stockStatus: 'In Stock',
  },
  {
    id: 'crop-4',
    name: 'Master Glyphosate Herbicide 1L',
    category: 'crop-health',
    price: 1200,
    rating: 4.5,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    description: 'Non-selective, post-emergence systemic herbicide for controlling annual and perennial weeds in farming blocks, orchards, and clearings.',
    stockStatus: 'In Stock',
  },

  // Animal Health
  {
    id: 'anim-1',
    name: 'AMIN TOTAL Poultry Supplement 1kg',
    category: 'animal-health',
    price: 1450,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80',
    tag: 'Highly Rated',
    description: 'Premium water-soluble supplement enriched with essential amino acids, vitamins, and minerals. Boosts egg laying capacity, weight gain, and immune health in chickens.',
    stockStatus: 'In Stock',
  },
  {
    id: 'anim-2',
    name: 'Triatix Cattle Dip Tick Control 1L',
    category: 'animal-health',
    price: 2200,
    rating: 4.7,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller',
    description: 'Effective amitraz-based ectoparasiticide for cattle, sheep, and goats. Clears ticks, lice, and mange mites reliably on application.',
    stockStatus: 'In Stock',
  },
  {
    id: 'anim-3',
    name: 'Lactating Cow Minerals 5kg',
    category: 'animal-health',
    price: 950,
    rating: 4.6,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    description: 'Mineral salt block specifically formulated to supplement calcium, phosphorus, and zinc in dairy cows, optimizing daily milk production and avoiding milk fever.',
    stockStatus: 'In Stock',
  },
  {
    id: 'anim-4',
    name: 'Cattle Vaccine Protection Pack',
    category: 'animal-health',
    price: 5500,
    rating: 4.8,
    reviewsCount: 9,
    image: 'https://images.unsplash.com/photo-1543590538-1e48f1873458?w=600&auto=format&fit=crop&q=80',
    tag: 'Low Stock',
    description: 'Multi-dose safety vaccination vials targeting common viral and bacterial livestock outbreaks, including foot-and-mouth disease and blackquarter.',
    stockStatus: 'Low Stock',
  },

  // Equipment
  {
    id: 'equip-1',
    name: 'Amiran Professional 16L Knapsack',
    category: 'equipment',
    price: 3800,
    rating: 4.7,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
    tag: 'Popular',
    description: 'Heavy-duty agricultural sprayer with ergonomically designed straps, custom brass nozzle options, and high-density leakproof polyethylene tank.',
    stockStatus: 'In Stock',
  },
  {
    id: 'equip-2',
    name: '96V Wireless pressure Spray & Washer',
    category: 'equipment',
    price: 7500,
    rating: 4.5,
    reviewsCount: 11,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    tag: '15% OFF',
    description: 'Lithium battery-powered portable cleaning kit. Perfect for washing cowsheds, machinery, farm equipment, and spraying large vegetable beds.',
    stockStatus: 'In Stock',
  },
  {
    id: 'equip-3',
    name: 'Precision Digital Soil Meter',
    category: 'equipment',
    price: 2400,
    rating: 4.3,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1464207687583-a82f637d5c66?w=600&auto=format&fit=crop&q=80',
    tag: 'Farmer Choice',
    description: '3-in-1 tool measuring soil pH, moisture level, and sunlight intensity. Helps optimize growing conditions to guarantee high crop yields.',
    stockStatus: 'Low Stock',
  },

  // Seeds
  {
    id: 'seeds-1',
    name: 'Pioneer Hybrid Maize Seeds 2kg',
    category: 'seeds',
    price: 980,
    rating: 4.9,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    tag: 'Best Seller',
    description: 'High-altitude hybrid maize seeds boasting excellent drought tolerance, disease resistance (MLS, rust), and high multi-cob yield potentials.',
    stockStatus: 'In Stock',
  },
  {
    id: 'seeds-2',
    name: 'Monica Hybrid Tomato F1 Seeds',
    category: 'seeds',
    price: 1850,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
    tag: 'New Crop',
    description: 'Premium hybrid tomato variety producing uniform, oval, and firm fruits. Highly resistant to bacterial wilt and blossom-end rot.',
    stockStatus: 'In Stock',
  },
  {
    id: 'seeds-3',
    name: 'Safari Sukuma Wiki Seeds 500g',
    category: 'seeds',
    price: 450,
    rating: 4.6,
    reviewsCount: 14,
    image: 'https://images.unsplash.com/photo-1524486364534-974fb009f511?w=600&auto=format&fit=crop&q=80',
    description: 'Hardy local collard greens seeds. Produces broad, tender dark green leaves with high regeneration properties for continuous picking.',
    stockStatus: 'In Stock',
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Correctly Apply NPK Fertilizer for Maximum Maize Yield',
    excerpt: 'Maize requires specific plant nutrients at various stages. Learn when to carry out basal application versus top-dressing with CAN for optimum weight.',
    date: 'June 18, 2026',
    readTime: '5 min read',
    category: 'Agronomy Guides',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    content:
      'Maize is one of Kenya\u2019s most important staple crops, but yields are often limited by poor nutrient timing rather than poor soil. Understanding how NPK fertilizers work at each growth stage is the first step to a heavier harvest.\n\n' +
      'At planting, apply a balanced basal fertilizer such as NPK 17:17:17 directly into the planting hole and mix it lightly with soil before dropping the seed. This gives young roots immediate access to phosphorus for strong establishment.\n\n' +
      'Around three to four weeks after germination, top-dress with CAN (Calcium Ammonium Nitrate) to supply the nitrogen the crop needs during rapid vegetative growth. A second top-dressing just before tasseling helps the plant fill out cobs fully.\n\n' +
      'Always base your rates on a recent soil test. Over-application wastes money and acidifies the soil over time, while under-application leaves yield on the table.',
  },
  {
    id: 'blog-2',
    title: 'Recognizing Fall Armyworm Outbreaks & Treating Them Immediately',
    excerpt: 'An armyworm invasion can wipe out entire acres within days. We outline visual detection tips and recommend effective chemical treatments like Duduthrin.',
    date: 'June 10, 2026',
    readTime: '4 min read',
    category: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80',
    content:
      'The fall armyworm has become one of the most destructive pests in East African maize fields. An untreated outbreak can devastate an entire acre within days, so early detection is critical.\n\n' +
      'Scout your fields regularly. Look for window-pane damage on young leaves, moist sawdust-like droppings (frass) in the leaf funnel, and the worms themselves hiding deep in the whorl during the day.\n\n' +
      'Once confirmed, treat immediately. Apply a recommended insecticide such as Duduthrin directly into the funnel in the early morning or late evening when larvae are most active. Rotate chemical classes between sprays to slow resistance.\n\n' +
      'Combine spraying with good field hygiene \u2014 destroy crop residues after harvest and avoid staggered planting, which gives the pest a continuous food supply.',
  },
  {
    id: 'blog-3',
    title: 'Essential Livestock Vaccination Schedules for Smallholder Farmers',
    excerpt: 'Protect your dairy herd and goats from seasonal diseases. A full checklist of required veterinary vaccine schedules, storage conditions, and timing.',
    date: 'May 28, 2026',
    readTime: '7 min read',
    category: 'Animal Health',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop&q=80',
    content:
      'A well-planned vaccination schedule is the cheapest insurance a smallholder farmer can buy. Most devastating livestock losses come from preventable diseases that a timely vaccine would have stopped.\n\n' +
      'For dairy cattle, prioritise Foot and Mouth Disease, Lumpy Skin Disease, and Anthrax/Blackquarter vaccinations, repeating them according to your veterinarian\u2019s seasonal calendar.\n\n' +
      'For goats and sheep, ensure protection against PPR (goat plague) and Contagious Caprine Pleuropneumonia, which spread rapidly in mixed flocks.\n\n' +
      'Vaccines are fragile. Keep them in a cool box at 2\u20138\u00b0C from the agrovet to the farm, and use them within the day they are opened. Always record the date, batch number, and animal treated so booster timing is never missed.',
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Do you offer agrochemical delivery outside Nairobi?',
    answer: 'Yes! We deliver nation-wide across Kenya, including major hubs like Nakuru, Eldoret, Kisumu, Kitale, Nyeri, and Mombasa. Deliveries are made via trusted agrodealer partners or secure courier directly to your farm within 24 to 48 hours.',
  },
  {
    question: 'Are your products fully certified by the government?',
    answer: 'Absolutely. Every single product we distribute is fully approved and certified by KEBS (Kenya Bureau of Standards) and PCPB (Pest Control Products Board). We enforce strict quality control to guarantee genuine, non-diluted agrochemicals.',
  },
  {
    question: 'How do I schedule a certified Veterinarian visit?',
    answer: 'You can book directly using our "Vet Consultation" form on this website. Simply pick your location, describe your herd symptoms, choose a date, and we will dispatch a licensed veterinary officer to perform on-farm inspection.',
  },
  {
    question: 'Do you offer bulk purchase discounts for large farms or agrovets?',
    answer: 'Yes. We offer wholesale prices and tiered bulk discounts for cooperative societies, community farming groups, and local agrovet retail merchants. Contact our sales department directly using the form below.',
  },
];

// Vet Academy CPD modules (admin-manageable)
export const DEFAULT_CPD_MODULES: CPDModule[] = [
  {
    id: 'cpd-1',
    title: 'Advanced Ruminant Mastitis Management',
    code: 'KVB-CPD-2026-08',
    ratePerDay: 500,
    duration: '3 hours',
    fromDate: '14 July 2026',
    toDate: '16 July 2026',
    difficulty: 'Intermediate',
    description: 'Reviewing clinical vs sub-clinical mastitis detection protocols using CMT kits, hygienic milking pathways, and targeted intramammary antibiotic infusions.'
  },
  {
    id: 'cpd-2',
    title: 'Acaricide Resistance and Vector Control Protocols',
    code: 'KVB-CPD-2026-11',
    ratePerDay: 600,
    duration: '4 hours',
    fromDate: '21 July 2026',
    toDate: '24 July 2026',
    difficulty: 'Advanced',
    description: 'Empirical approaches to managing tick resistance in East Africa, rotation of organophosphates vs pyrethroids, and community spray schedule setups.'
  },
  {
    id: 'cpd-3',
    title: 'Vaccine Cold-Chain Maintenance in Semi-Arid Counties',
    code: 'KVB-CPD-2026-02',
    ratePerDay: 400,
    duration: '2 hours',
    fromDate: '4 August 2026',
    toDate: '5 August 2026',
    difficulty: 'Foundational',
    description: 'Practical training on keeping Contagious Bovine Pleuropneumonia (CBPP) and Lumpy Skin Disease (LSD) vaccines stable at 2-8°C during field distribution.'
  }
];

// Farmers Academy field workshops (admin-manageable)
export const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: 'ws-1',
    title: 'Maximizing Maize Yield with Certified NPK and Selective Boosters',
    county: 'Nakuru County',
    venue: 'Nakuru Town Agricultural Hall',
    date: 'July 05, 2026',
    time: '9:00 AM - 1:00 PM',
    agronomist: 'Dr. Julius Rotich, Senior Crop Protection Lead'
  },
  {
    id: 'ws-2',
    title: 'Clinical Tick Control & Vaccine Calendars for Smallholder Dairy Cows',
    county: 'Kiambu County',
    venue: 'Githunguri Cooperative Grounds',
    date: 'July 12, 2026',
    time: '10:00 AM - 3:00 PM',
    agronomist: 'Dr. Evelyn Wanjiku, Licensed Vet Practitioner'
  },
  {
    id: 'ws-3',
    title: 'Eco-Friendly Biological Soil Fungicides & Seed Treatment Pathways',
    county: 'Nairobi County',
    venue: 'Industrial Area Training Hub',
    date: 'July 18, 2026',
    time: '2:00 PM - 5:00 PM',
    agronomist: 'Agnes Mwelu, Senior Agronomist'
  }
];
