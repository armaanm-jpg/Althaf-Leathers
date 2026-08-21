import { Product, Review } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'heritage-satchel',
    name: 'The Heritage Satchel',
    tagline: 'Timeless silhouette crafted for daily commute and timeless elegance',
    category: 'Bags',
    price: 12499,
    originalPrice: 14999,
    rating: 4.9,
    reviewCount: 142,
    badge: 'Bestseller',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['Standard (13" Laptop)', 'Large (15" Laptop)'],
    dimensions: '38 cm × 28 cm × 10 cm (15" × 11" × 4")',
    weight: '1.25 kg',
    hardware: 'Solid Antiqued Brass Buckles & YKK Excella Zippers',
    lining: 'Durable 100% Natural Cotton Twill in Olive Khaki',
    description: 'The Heritage Satchel is our premier atelier piece, handcrafted in our Proddatur workshop using 2.2mm thick vegetable-tanned full-grain cowhide. Structured yet supple, it develops an enviable, lustrous amber patina with every journey. Features dedicated padded laptop storage, internal pen holders, passport sleeve, and a reinforced top handle.',
    features: [
      'Dedicated padded compartment fits up to a 15-inch laptop',
      'Hand-burnished, beeswax-sealed raw edges for extreme durability',
      'Heavy-gauge nylon-bonded saddle stitching with 6 stitches per inch',
      'Detachable, padded shoulder strap adjustable up to 54 inches',
      'Dual quick-release magnetic closures hidden beneath traditional brass roller buckles',
      'Pass-through rear trolley strap for seamless luggage pairing'
    ],
    craftsmanshipNotes: [
      'Hand-cut from single hide sections to preserve grain continuity',
      'Edges beveled by hand and burnished with natural organic beeswax',
      'Over 18 individual hours of meticulous artisan handwork in Proddatur'
    ],
    careInstructions: [
      'Wipe down with a dry or lightly damp cotton cloth to remove dust',
      'Condition every 3–6 months with organic beeswax leather balm',
      'Store in the provided breathable cotton dust bag away from direct heat sources'
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'classic-bifold-wallet',
    name: 'Classic Bifold Wallet',
    tagline: 'Slimline pocket companion with 8 card slots and dual cash dividers',
    category: 'Wallets',
    price: 2899,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 96,
    badge: 'New Arrival',
    leatherType: 'Vegetable-Tanned',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '11 cm × 9 cm × 1.2 cm folded',
    weight: '75 g',
    hardware: 'RFID-blocking metallic shielding mesh',
    lining: 'Unlined raw suede interior for ultra-slim profile',
    description: 'Designed to slide effortlessly into tailored trousers or coat pockets without bulge. Handcrafted from supple vegetable-tanned leather, each card slot is individually hand-skived down to 0.6mm thickness to minimize bulk while retaining immense tear strength.',
    features: [
      '8 precision-cut card slots with easy thumb access',
      'Dual full-length billfold compartments for multi-currency management',
      'Integrated RFID protective lining shielding contactless cards',
      'Hand-stitched perimeter with waxed thread'
    ],
    craftsmanshipNotes: [
      'Skived edge construction prevents bulky pocket stacking',
      'Beeswax burnished edges to prevent fraying and delamination'
    ],
    careInstructions: [
      'Condition lightly twice a year to preserve natural oils and flexibility'
    ],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'artisan-dress-belt',
    name: 'Artisan Dress Belt',
    tagline: 'Single cut 4mm bridle leather with forged solid brass hardware',
    category: 'Belts',
    price: 3499,
    originalPrice: 3999,
    rating: 5.0,
    reviewCount: 78,
    badge: 'Atelier Signature',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1585856484137-975549040995?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['32', '34', '36', '38', '40', '42'],
    dimensions: '3.5 cm (1.38") width × custom length',
    weight: '210 g',
    hardware: 'Sandcast Solid Brass Roller Buckle with hand-brushed satin finish',
    lining: 'Natural English bridle back, non-dyed',
    description: 'Cut from sturdy vegetable-tanned steer hide, this belt is constructed with a clean, classic finish that molds to your waistline with regular wear.',
    features: [
      'Single solid piece of 4.0mm full-grain leather hide',
      'Solid brass buckle secured with removable Chicago screws for easy buckle swapping',
      'Hand-burnished beveled edges sealed with carnauba and beeswax',
      '5 teardrop holes spaced 1 inch apart for micro adjustments'
    ],
    craftsmanshipNotes: [
      'Edge creased using heated hand irons in our Proddatur atelier'
    ],
    careInstructions: [
      'Apply high-grade leather balm once a year'
    ],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585856484137-975549040995?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'weekender-duffel',
    name: 'The Weekender Duffel',
    tagline: 'Expansive 42-liter travel companion designed for 3-5 day getaways',
    category: 'Bags',
    price: 18999,
    originalPrice: 22500,
    rating: 4.9,
    reviewCount: 64,
    badge: 'Limited Edition',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['42 Liters (Carry-On Approved)'],
    dimensions: '52 cm × 29 cm × 26 cm',
    weight: '1.8 kg',
    hardware: 'Heavy Duty Solid Antiqued Brass & #10 Dual YKK Zippers',
    lining: 'Water-resistant reinforced cotton canvas',
    description: 'Engineered for the discerning voyager, The Weekender Duffel meets all international airline cabin luggage specifications. Crafted with reinforced double-stitched leather panels and metal protective base studs.',
    features: [
      'Separate side-access zippered footwear / laundry compartment',
      'Inner zippered valuables pocket and twin slip organizers',
      'Reinforced rolled leather handles and wide detachable shoulder strap',
      'Solid brass bottom feet to protect leather on airport tarmac and floors'
    ],
    craftsmanshipNotes: [
      'Reinforced with interior river rivets at all structural load points'
    ],
    careInstructions: [
      'Air dry naturally if exposed to rain; condition seasonally'
    ],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'traveler-folio',
    name: 'The Architect Folio',
    tagline: 'Padfolio organizer for 13" laptops, A4 notepads, and stylus pens',
    category: 'Folios',
    price: 5499,
    originalPrice: 6200,
    rating: 4.9,
    reviewCount: 51,
    badge: 'Atelier Signature',
    leatherType: 'Vegetable-Tanned',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '33 cm × 24 cm × 2.5 cm',
    weight: '480 g',
    hardware: 'YKK Brass wrap-around zipper with leather pull tab',
    lining: 'Plush velvet microfiber inner liner',
    description: 'An executive portfolio built for high-stakes presentations and daily productivity. Holds an iPad Pro 12.9" or 13" MacBook, A4 legal notepad, business cards, cables, and pen loops.',
    features: [
      'Full perimeter zip for 180-degree lay-flat opening',
      'Dual business card slots & passport holder',
      'Dedicated Apple Pencil / fountain pen sleeve',
      'Secure magnetic cable loop'
    ],
    craftsmanshipNotes: [
      'Hand-creased edges and tailored gussets'
    ],
    careInstructions: [
      'Store flat in dust sleeve when not in use'
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'minimal-cardholder',
    name: 'The Minimalist Cardholder',
    tagline: 'Ultralight 5-pocket card sleeve crafted from smooth Italian pull-up leather',
    category: 'Wallets',
    price: 1850,
    originalPrice: 2200,
    rating: 4.8,
    reviewCount: 110,
    badge: 'Bestseller',
    leatherType: 'Top-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Oxblood Burgundy',
        hex: '#592329',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '10 cm × 7 cm × 0.4 cm',
    weight: '35 g',
    hardware: 'None',
    lining: 'Unlined leather interior',
    description: 'Created for true minimalists. Features four outer card slots with angled easy-extraction curves and a central compartment for folded currency bills.',
    features: [
      'Holds 6-8 cards plus folded cash securely',
      'Zero synthetic lining for lifelong durability',
      'Waxed edge burnish in signature Proddatur atelier style'
    ],
    craftsmanshipNotes: [
      'Hand-stitched with durable bonded poly-core thread'
    ],
    careInstructions: [
      'Requires minimal maintenance; develops rich sheen naturally'
    ],
    images: [
      'https://images.unsplash.com/photo-1606503829068-d0107297e68e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false
  },
  {
    id: 'signature-tote',
    name: 'The Artisan Signature Tote',
    tagline: 'Spacious unstructured luxury tote with solid brass snap closure',
    category: 'Bags',
    price: 9999,
    originalPrice: 11999,
    rating: 4.9,
    reviewCount: 89,
    badge: 'Bestseller',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '42 cm × 32 cm × 14 cm (Handle drop: 26 cm)',
    weight: '890 g',
    hardware: 'Solid Brass Magnetic Snaps & Key D-Ring',
    lining: 'Natural Unlined Full-Grain Suede interior with zippered hanging pocket',
    description: 'An effortless companion from morning boardroom meetings to weekend farmer markets. Large enough to house a 16-inch laptop, water bottle, planner, and daily essentials with graceful drape.',
    features: [
      'Generous 10.5" shoulder drop fits comfortably over winter coats',
      'Removable interior zippered leather pouch for keys and phone',
      'Solid brass interior key clip lanyard',
      'Reinforced base with double-layer leather footing'
    ],
    craftsmanshipNotes: [
      'Constructed with full single hide continuous gusset panels'
    ],
    careInstructions: [
      'Condition when dry with natural beeswax balm'
    ],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'artisan-coaster-set',
    name: 'Artisan Coaster Set (Pack of 6)',
    tagline: 'Hand-stamped 5mm thick bridle leather tabletop coasters with holder',
    category: 'Accessories',
    price: 1499,
    originalPrice: 1799,
    rating: 4.8,
    reviewCount: 43,
    badge: 'New Arrival',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '10 cm diameter × 0.5 cm thickness',
    weight: '320 g (set)',
    hardware: 'Solid brass riveted leather holder tray',
    lining: 'Natural roughout non-slip underside',
    description: 'Elevate your living room or study desk with this set of 6 thick bridle leather drink coasters. Water-resistant wax treatment protects against moisture rings while aging with character.',
    features: [
      'Includes dedicated matching leather tray with brass corner rivets',
      'Naturally heat and moisture absorbent',
      'Debossed with Althaf Leathers crest'
    ],
    craftsmanshipNotes: [
      'Cut from heavy harness leather remnants to ensure zero hide waste'
    ],
    careInstructions: [
      'Wipe dry with clean cloth after condensation exposure'
    ],
    images: [
      'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false
  },
  {
    id: 'tech-organizer-roll',
    name: 'Artisan Tech & Cable Roll',
    tagline: 'Compact rollup organizer for chargers, stylus, power banks, and cords',
    category: 'Accessories',
    price: 2199,
    originalPrice: 2600,
    rating: 4.9,
    reviewCount: 37,
    badge: 'Atelier Signature',
    leatherType: 'Vegetable-Tanned',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    dimensions: '40 cm × 18 cm unrolled (Rolls to 8 cm diameter)',
    weight: '190 g',
    hardware: 'Brass stud and leather strap closure',
    lining: 'Natural suede interior',
    description: 'Keep your digital life organized in timeless analog leather. 5 elasticated loops hold cords securely, with a zippered pouch for USB dongles, SD cards, and earbuds.',
    features: [
      '5 versatile cable loops',
      'Zippered stash pouch for small tech adapters',
      'Adjustable wrap strap with brass prong collar'
    ],
    craftsmanshipNotes: [
      'Hand-stitched elastic webbing onto vegetable-tanned hide'
    ],
    careInstructions: [
      'Dust with soft horsehair brush'
    ],
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Vikramaditya Rao',
    location: 'Hyderabad, Telangana',
    rating: 5,
    date: '2 weeks ago',
    title: 'Unbelievable craftsmanship and leather smell!',
    comment: 'I bought The Heritage Satchel for my daily commute to the office. The quality of leather and solid brass hardware is on par with luxury brands charging 4x the price. Living in South India, I feel proud knowing this was made right here in Proddatur.',
    verified: true,
    productName: 'The Heritage Satchel'
  },
  {
    id: 'rev-2',
    author: 'Ananya Sharma',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '1 month ago',
    title: 'The patina development is gorgeous',
    comment: 'Have been using the Classic Bifold Wallet for 3 months now. It has darkened into a rich warm honey shade and softened up beautifully. The monogram embossing was crisp and elegant.',
    verified: true,
    productName: 'Classic Bifold Wallet'
  },
  {
    id: 'rev-3',
    author: 'Rajesh K. Reddy',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    date: '1 month ago',
    title: 'A true heirloom belt',
    comment: 'The 4mm thickness on the Artisan Dress Belt is no joke—single piece of thick leather that will probably outlive me. The sandcast brass buckle has a lovely weight to it.',
    verified: true,
    productName: 'Artisan Dress Belt'
  },
  {
    id: 'rev-4',
    author: 'Siddharth Iyer',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '2 months ago',
    title: 'Perfect companion for 4-day trips',
    comment: 'The Weekender Duffel fit into the IndiGo overhead bin with ease. The shoe compartment kept my leather oxfords isolated from my shirts. Supreme stitching!',
    verified: true,
    productName: 'The Weekender Duffel'
  }
];
