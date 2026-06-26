import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Tractor, HelpCircle, Sprout, Users } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  bgGradient: string;
  bgImage: string;
  icon: any;
  tag: string;
  primaryAction: string;
  secondaryAction: string;
}

const SLIDES: Slide[] = [
  {
    tag: 'Premium Agrochemicals & Crop Protection',
    title: 'Grow Stronger Crops, Maximize Your Harvest',
    subtitle: 'Direct Agro Input Solutions in Kenya',
    description: 'We supply high-efficiency fertilizers, selective herbicides, pesticides, and seeds approved by KEBS and PCPB to ensure food security across East Africa.',
    bgGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
    bgImage: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1600',
    icon: Tractor,
    primaryAction: 'Shop Catalog',
    secondaryAction: 'Request Agronomist',
  },
  {
    tag: 'Certified Veterinary Medicines & Care',
    title: 'Maintain Healthy Livestock, Enhance Milk Yield',
    subtitle: 'Expert Veterinarian Support & Products',
    description: 'Providing genuine livestock vaccines, dewormers, premium feeds, and direct dairy cattle multivitamin supplements with on-farm veterinary consultation services.',
    bgGradient: 'from-emerald-900 via-sky-950 to-teal-950',
    bgImage: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1600',
    icon: ShieldCheck,
    primaryAction: 'Livestock Care',
    secondaryAction: 'Book Vet Doctor',
  },
  {
    tag: 'Farm-to-Door Nationwide Logistics',
    title: 'Fast Agrochemical Farm Delivery to Your Doorstep',
    subtitle: 'Reliable Shipping & Agricultural Advice',
    description: 'Order planting fertilizers, spray pumps, and hybrid seeds online. We deliver directly to farms, cooperative societies, and agrovets in Nakuru, Eldoret, and more.',
    bgGradient: 'from-emerald-950 via-slate-900 to-emerald-950',
    bgImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600',
    icon: ShoppingBag,
    primaryAction: 'Order Online',
    secondaryAction: 'Delivery Routes',
  },
  {
    tag: 'Scientific Soil Lab & Analysis',
    title: 'Unlock Your Soil Potential with Accurate Testing',
    subtitle: 'Customized Farm Nutrient Management',
    description: 'Test your soil for macro and micronutrients. Receive detailed lab insights, custom lime applications, and tailored fertilizer formulations to boost crop yields.',
    bgGradient: 'from-emerald-950 via-emerald-900 to-teal-950',
    bgImage: 'https://images.unsplash.com/photo-1463123081488-729f60c1926d?auto=format&fit=crop&q=80&w=1600',
    icon: Sprout,
    primaryAction: 'Book Soil Test',
    secondaryAction: 'View Lab Packages',
  },
  {
    tag: 'Cooperative Support & Farmer Forums',
    title: 'Grow Together with Shared Resources & Training',
    subtitle: 'Aggregated Purchasing & Agronomy Workshops',
    description: 'Connect with local farmer cooperative societies to buy inputs in bulk, access cold chain storage facilities, and attend weekly group extension service events.',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600',
    icon: Users,
    primaryAction: 'Join Cooperative',
    secondaryAction: 'Upcoming Training',
  }
];

interface HeroSliderProps {
  onShopClick: () => void;
  onConsultClick: () => void;
}

export default function HeroSlider({ onShopClick, onConsultClick }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [current]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const ActiveSlide = SLIDES[current];
  const IconComponent = ActiveSlide.icon;

  return (
    <section id="hero-slider-container" className="relative h-[650px] md:h-[700px] w-full overflow-hidden bg-emerald-950 text-white flex items-center">
      {/* Dynamic Background Image with Smooth Cross-Fade Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={ActiveSlide.bgImage}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Rich gradient overlays for premium depth and impeccable typography readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-950/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent opacity-70" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mesh Overlay Layer on top of background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_40%_60%_at_10%_80%,rgba(212,168,67,0.06),transparent_50%)] pointer-events-none" />

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-16 md:h-24 fill-emerald-50">
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 h-full flex items-center justify-between">
        {/* Animated Slide Content */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-4xl flex flex-col items-center md:items-start text-center md:text-left space-y-6"
          >


            <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-white leading-tight">
              {ActiveSlide.title}
            </h1>

            <p className="text-emerald-100/90 font-sans text-base md:text-xl font-normal max-w-2xl leading-relaxed">
              {ActiveSlide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start w-full sm:w-auto">
              <button
                id={`hero-primary-btn-${current}`}
                onClick={onShopClick}
                className="btn text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-semibold px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition transform hover:-translate-y-0.5"
              >
                {ActiveSlide.primaryAction}
              </button>
              <button
                id={`hero-secondary-btn-${current}`}
                onClick={onConsultClick}
                className="btn border border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40 text-white font-medium px-8 py-4 rounded-full backdrop-blur-sm transition transform hover:-translate-y-0.5"
              >
                {ActiveSlide.secondaryAction}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right side graphic or abstract detail */}
        <div className="hidden lg:block w-72 h-72 bg-emerald-800/20 border border-emerald-500/20 rounded-3xl relative backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-800/40" />
          <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Standard Certified</span>
            <div className="space-y-2">
              <p className="font-serif text-2xl text-white font-medium leading-snug">Empowering Kenyan Farmers Since 1996</p>
              <p className="text-xs text-emerald-200/80">KEBS & PCPB fully verified products with 100% genuine guarantees.</p>
            </div>
            <div className="flex items-center text-xs text-yellow-400 space-x-1 font-semibold">
              <span>★★★★★</span>
              <span className="text-white ml-2">(4.9 out of 5)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <button
        id="hero-prev-btn"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/10 bg-black/15 hover:bg-black/30 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        id="hero-next-btn"
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/10 bg-black/15 hover:bg-black/30 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators & Progress Bar */}
      <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
        <div className="flex space-x-2">
          {SLIDES.map((_, idx) => (
            <button
              id={`hero-dot-${idx}`}
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-1 rounded-full transition-all duration-350 ${
                idx === current ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
