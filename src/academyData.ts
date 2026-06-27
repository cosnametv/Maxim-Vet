import { Home, Bird, Milk, PawPrint, Wheat, Leaf, Sprout } from 'lucide-react';

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  price: number; // 0 = free, > 0 = paid (KSh)
  videoUrl: string; // blank uses the default sample video
}

export interface AcademyCategory {
  id: string;
  title: string;
  iconKey: string;
  blurb: string;
  lessons: AcademyLesson[];
}

// Default sample video used when a lesson has no explicit video link.
export const SAMPLE_VIDEO_URL = 'https://www.youtube.com/watch?v=u8XOGg1pch0';
export const PAID_LESSON_PRICE = 200;

// Icon options admins can pick from when creating a category.
export const ACADEMY_ICON_MAP: Record<string, typeof Home> = {
  Bird,
  Home,
  Milk,
  PawPrint,
  Wheat,
  Leaf,
  Sprout,
};
export const ACADEMY_ICON_OPTIONS = Object.keys(ACADEMY_ICON_MAP);

export const getLessonVideoUrl = (l: AcademyLesson) => l.videoUrl || SAMPLE_VIDEO_URL;

export const DEFAULT_ACADEMY_CATEGORIES: AcademyCategory[] = [
  {
    id: 'poultry',
    title: 'Hens & Chicks',
    iconKey: 'Bird',
    blurb: 'Raise healthy poultry from day-old chicks to productive layers and broilers.',
    lessons: [
      {
        id: 'poultry-intro',
        title: 'Introduction to Poultry Keeping',
        duration: '6 min read',
        summary: 'Understand the basics of starting a profitable poultry unit.',
        price: 0,
        videoUrl: '',
        content: [
          'Poultry keeping is one of the fastest ways for smallholder farmers to earn a steady income from eggs and meat. Before buying birds, decide whether you want layers (for eggs), broilers (for meat), or dual-purpose breeds such as Kienyeji improved kuku.',
          'Start small with a number of birds you can comfortably feed and house. Source day-old chicks from certified hatcheries only, and ensure you have a clean, warm brooder ready before the chicks arrive.',
        ],
      },
      {
        id: 'poultry-brooding',
        title: 'Brooding & Chick Care',
        duration: '7 min read',
        summary: 'Keep chicks warm, fed, and disease-free in the first weeks.',
        price: 200,
        videoUrl: '',
        content: [
          'Chicks cannot regulate their own body temperature for the first 3-4 weeks, so provide a brooder at about 32-35°C in week one, reducing by roughly 3°C each week. Watch the chicks: if they huddle under the heat source they are cold, if they move to the edges they are too hot.',
          'Provide clean water with a vitamin/glucose supplement on arrival, followed by chick starter mash. Keep litter dry and vaccinate against Marek’s, Gumboro, and Newcastle disease on schedule.',
        ],
      },
      {
        id: 'poultry-feeding',
        title: 'Feeding & Nutrition',
        duration: '5 min read',
        summary: 'Match feed type and quantity to each growth stage.',
        price: 200,
        videoUrl: '',
        content: [
          'Feed chick starter (high protein) for the first 8 weeks, then growers mash, and finally layers mash once birds begin laying at around 18-20 weeks. Broilers stay on starter then finisher rations for fast weight gain.',
          'Always provide clean water and add calcium (such as crushed limestone or oyster shell) for strong egg shells. Avoid sudden feed changes, which stress birds and reduce production.',
        ],
      },
      {
        id: 'poultry-health',
        title: 'Disease Control & Vaccination',
        duration: '6 min read',
        summary: 'Prevent the diseases that wipe out flocks.',
        price: 200,
        videoUrl: '',
        content: [
          'Newcastle disease is the biggest killer of village chickens — vaccinate routinely. Practice strict biosecurity: limit visitors, disinfect footwear, and isolate new or sick birds.',
          'Watch for warning signs such as drooping wings, greenish droppings, coughing, or sudden deaths, and consult a vet early. Deworm regularly and control external parasites like mites and lice.',
        ],
      },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    iconKey: 'Home',
    blurb: 'Design clean, well-ventilated structures that protect livestock and boost output.',
    lessons: [
      {
        id: 'housing-intro',
        title: 'Introduction to Animal Housing',
        duration: '5 min read',
        summary: 'Why good housing is the foundation of healthy livestock.',
        price: 0,
        videoUrl: '',
        content: [
          'Good housing protects animals from harsh weather, predators, and disease while making feeding and cleaning easier. A well-designed structure improves comfort, which directly increases milk, egg, and meat production.',
          'Always build on well-drained ground, orient the building to capture morning sun, and allow enough space per animal to avoid overcrowding and stress.',
        ],
      },
      {
        id: 'housing-poultry',
        title: 'Poultry House Design',
        duration: '6 min read',
        summary: 'Build a secure, airy chicken house.',
        price: 200,
        videoUrl: '',
        content: [
          'A good poultry house is dry, well-ventilated, and predator-proof. Allow about 1 square metre for every 3-4 adult birds, and raise the floor or use deep litter to keep it dry.',
          'Include nesting boxes for layers, perches for roosting, and wire mesh for airflow while keeping out wild birds and rodents that spread disease.',
        ],
      },
      {
        id: 'housing-cattle',
        title: 'Cattle Sheds & Zero-Grazing Units',
        duration: '7 min read',
        summary: 'Set up a practical zero-grazing dairy unit.',
        price: 200,
        videoUrl: '',
        content: [
          'A zero-grazing unit keeps dairy cows in one place where feed and water are brought to them. It should have a feeding trough, a resting cubicle with soft bedding, a milking area, and a sloped concrete floor for easy cleaning.',
          'Good drainage and a slurry channel keep the unit hygienic and reduce mastitis and hoof problems. Provide shade and constant clean water to maintain high milk yields.',
        ],
      },
    ],
  },
  {
    id: 'cattle',
    title: 'Cattle',
    iconKey: 'Milk',
    blurb: 'Manage dairy and beef cattle for higher milk yields and healthy herds.',
    lessons: [
      {
        id: 'cattle-intro',
        title: 'Introduction to Cattle Farming',
        duration: '6 min read',
        summary: 'Choose between dairy, beef, and dual-purpose systems.',
        price: 0,
        videoUrl: '',
        content: [
          'Cattle farming can focus on milk (dairy), meat (beef), or both. Your choice depends on your land, capital, market, and climate. Dairy breeds like Friesian and Ayrshire suit high-rainfall areas, while hardy breeds like Boran do well in drier regions.',
          'Begin with a few quality animals rather than many poor ones. Healthy, well-fed cattle from good genetics will always outperform a large, poorly managed herd.',
        ],
      },
      {
        id: 'cattle-feeding',
        title: 'Feeding & Pasture Management',
        duration: '7 min read',
        summary: 'Feed for maximum milk and weight gain.',
        price: 200,
        videoUrl: '',
        content: [
          'A dairy cow needs energy, protein, minerals, and plenty of clean water. Grow quality fodder such as Napier grass, lucerne, and desmodium, and conserve excess as silage or hay for the dry season.',
          'Supplement with dairy meal during milking and provide mineral licks. Sudden feed shortages cause sharp drops in milk, so plan feed budgets ahead of each season.',
        ],
      },
      {
        id: 'cattle-milk',
        title: 'Milk Production & Hygiene',
        duration: '5 min read',
        summary: 'Produce clean, high-quality milk buyers trust.',
        price: 200,
        videoUrl: '',
        content: [
          'Milk at consistent times each day, wash your hands and the udder before milking, and use clean, food-grade containers. Practice full milking to prevent mastitis and maintain yield.',
          'Cool milk quickly and deliver it fast to keep quality high. Test regularly for mastitis using a strip cup or California Mastitis Test and treat affected cows promptly.',
        ],
      },
      {
        id: 'cattle-health',
        title: 'Common Diseases & Treatment',
        duration: '6 min read',
        summary: 'Spot and prevent the major cattle diseases.',
        price: 200,
        videoUrl: '',
        content: [
          'Control ticks through regular spraying or dipping to prevent East Coast Fever, anaplasmosis, and other tick-borne diseases. Vaccinate against Foot and Mouth Disease, Lumpy Skin Disease, and Anthrax as advised by your vet.',
          'Deworm routinely and watch for signs like loss of appetite, reduced milk, lameness, or diarrhoea. Call a licensed veterinary officer early rather than waiting for the condition to worsen.',
        ],
      },
    ],
  },
  {
    id: 'shoats',
    title: 'Sheep & Goats',
    iconKey: 'PawPrint',
    blurb: 'Keep productive sheep and goats (shoats) for milk, meat, and quick income.',
    lessons: [
      {
        id: 'shoats-intro',
        title: 'Introduction to Sheep & Goats',
        duration: '5 min read',
        summary: 'Why shoats are ideal for smallholder farmers.',
        price: 0,
        videoUrl: '',
        content: [
          'Sheep and goats — often called shoats — are affordable, reproduce quickly, and thrive on small pieces of land. Goats can be kept for milk (e.g. dairy breeds like Saanen and Toggenburg) or meat (e.g. Galla), while sheep are mainly kept for meat and wool.',
          'They are a great entry point into livestock farming because they need less feed and capital than cattle while still giving steady returns.',
        ],
      },
      {
        id: 'shoats-housing',
        title: 'Breeds, Housing & Selection',
        duration: '6 min read',
        summary: 'Pick the right breed and shelter your shoats well.',
        price: 200,
        videoUrl: '',
        content: [
          'Choose breeds based on your goal and climate. Provide a raised, slatted-floor house that stays dry and protects animals from cold, rain, and predators.',
          'Select breeding stock that is healthy, well-formed, and from productive lines. Avoid inbreeding by rotating or sourcing unrelated bucks and rams.',
        ],
      },
      {
        id: 'shoats-feeding',
        title: 'Feeding & Grazing',
        duration: '5 min read',
        summary: 'Balance grazing with supplementary feed.',
        price: 200,
        videoUrl: '',
        content: [
          'Shoats are browsers and grazers — they enjoy shrubs, leaves, and pasture. Supplement with hay, crop residues, and mineral licks, especially during the dry season and for pregnant or lactating animals.',
          'Always provide clean water. Rotate grazing areas to reduce worm build-up and maintain good pasture.',
        ],
      },
      {
        id: 'shoats-health',
        title: 'Health, Deworming & Breeding',
        duration: '6 min read',
        summary: 'Keep shoats healthy and breeding well.',
        price: 200,
        videoUrl: '',
        content: [
          'Internal worms are the biggest health challenge for shoats, so deworm regularly and practice pasture rotation. Vaccinate against diseases such as PPR (goat plague) and CCPP as advised by your vet, and control external parasites.',
          'A doe or ewe can produce young twice a year with good management. Keep breeding records, provide extra feed during pregnancy, and ensure newborns get colostrum within the first hours of life.',
        ],
      },
    ],
  },
];
