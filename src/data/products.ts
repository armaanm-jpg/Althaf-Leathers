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
    id: 'classic-derby-shoes',
    name: 'Classic Leather Derby Shoes',
    tagline: 'Handcrafted lace-up derby shoes with cushioned insole and non-slip sole',
    category: 'Shoes',
    price: 4999,
    originalPrice: 5999,
    rating: 4.9,
    reviewCount: 48,
    badge: 'Atelier Signature',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['UK 6 (EU 40)', 'UK 7 (EU 41)', 'UK 8 (EU 42)', 'UK 9 (EU 43)', 'UK 10 (EU 44)', 'UK 11 (EU 45)'],
    dimensions: 'Standard Men\'s Width (D/Medium)',
    weight: '780 g (pair)',
    hardware: 'Waxed Cotton Laces with Brass Eyelets',
    lining: 'Breathable full-grain sheepskin leather lining',
    description: 'A handsome, versatile derby shoe handcrafted in Proddatur for long office days and formal evenings. Built with an open-lacing system that accommodates different instep heights, complemented by high-density padded latex footbeds.',
    features: [
      'Supple full-grain leather upper that softens to your foot contour',
      'Dual-layer high-density memory foam insole for all-day comfort',
      'Durable rubber composite outsole with anti-slip tread pattern',
      'Reinforced heel counter prevents slipping and blisters'
    ],
    craftsmanshipNotes: [
      'Hand-lasted and hand-stitched welt construction',
      'Hand-finished edge stained with organic dyes in Proddatur'
    ],
    careInstructions: [
      'Use cedar shoe trees when not in use to maintain shape',
      'Condition with cream polish every 4–6 weeks'
    ],
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'artisan-leather-loafers',
    name: 'Artisan Penny Loafers',
    tagline: 'Slip-on luxury loafers tailored for effortless smart-casual daily wear',
    category: 'Shoes',
    price: 4499,
    originalPrice: 5299,
    rating: 4.8,
    reviewCount: 39,
    badge: 'New Arrival',
    leatherType: 'Top-Grain',
    colors: [
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['UK 6 (EU 40)', 'UK 7 (EU 41)', 'UK 8 (EU 42)', 'UK 9 (EU 43)', 'UK 10 (EU 44)'],
    dimensions: 'Standard Comfort Width',
    weight: '690 g (pair)',
    hardware: 'Reinforced hand-stitched saddle bridge',
    lining: 'Soft glove-tanned leather inner lining',
    description: 'Effortless slip-on style meets artisanal leather work. The moc-toe construction provides natural toe freedom, while the flexible stacked heel and padded footbed make it perfect for barefoot or sock wear.',
    features: [
      'Classic penny strap cutout with hand-crimped apron seam',
      'Cushioned arch support built into the inner sole',
      'Flexible lightweight sole for natural stride flexibility',
      'Waxed hand-stitched perimeter'
    ],
    craftsmanshipNotes: [
      'Hand-stitched moccasin apron on shoe lasts'
    ],
    careInstructions: [
      'Wipe with soft cloth; use neutral leather lotion'
    ],
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: false
  },
  {
    id: 'proddatur-slide-slippers',
    name: 'Proddatur Leather Slide Slippers',
    tagline: 'Everyday slip-on leather slides with contoured cushioned footbed',
    category: 'Slippers',
    price: 1699,
    originalPrice: 2199,
    rating: 4.9,
    reviewCount: 62,
    badge: 'Bestseller',
    leatherType: 'Vegetable-Tanned',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Midnight Black',
        hex: '#1a1a1a',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    dimensions: 'Wide Ergonomic Comfort Fit',
    weight: '380 g (pair)',
    hardware: 'Brass accent rivets',
    lining: 'Cushioned microfiber padded strap lining',
    description: 'Designed for daily comfort in warm climates. Crafted from supple vegetable-tanned straps with padded underside that prevents chafing, over a contoured footbed that molds to your arch.',
    features: [
      'Wide supportive leather band with smooth burnished edges',
      'Ergonomic footbed with heel cup and toe bar for natural grip',
      'Flexible, high-traction rubber outsole for indoor and outdoor wear',
      'Water-resistant treated footbed finish'
    ],
    craftsmanshipNotes: [
      'Hand-assembled in our Proddatur workshop with reinforced side stitching'
    ],
    careInstructions: [
      'Wipe with a damp cloth; avoid complete soaking'
    ],
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
  },
  {
    id: 'artisan-kolhapuri-slippers',
    name: 'Artisan Leather Kolhapuri Slippers',
    tagline: 'Hand-braided traditional toe-ring slippers with thick pressed leather sole',
    category: 'Slippers',
    price: 1999,
    originalPrice: 2499,
    rating: 4.8,
    reviewCount: 45,
    badge: 'Atelier Signature',
    leatherType: 'Full-Grain',
    colors: [
      {
        name: 'Heritage Tan',
        hex: '#c19a6b',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Espresso Brown',
        hex: '#3b2f2f',
        image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop'
      }
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    dimensions: 'Traditional Regular Fit',
    weight: '340 g (pair)',
    hardware: 'Hand-braided leather cords and brass bead accents',
    lining: 'Unlined pure buffalo hide bottom sole',
    description: 'Traditional craftsmanship celebrating timeless Indian footwear. Hand-cut and braided with precision, these slippers soften with wear to create an unmatched bespoke fit that breathes naturally.',
    features: [
      'Hand-woven intricate lattice strap and comfortable toe ring',
      'Multi-layer compacted leather sole with durable yellow stitching',
      'Vegetable-tanned with tree barks for natural organic feel',
      'Lightweight and naturally cooling for tropical climates'
    ],
    craftsmanshipNotes: [
      'Each pair takes over 10 hours of hand braiding and hand stitching'
    ],
    careInstructions: [
      'Apply coconut or castor oil periodically to maintain suppleness'
    ],
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1000&auto=format&fit=crop'
    ],
    isFeatured: true
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
    comment: 'Have been using the Classic Bifold Wallet for 3 months now. It has darkened into a rich warm honey shade and softened up beautifully. The edge creasing and finish was crisp and elegant.',
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
