import { useState, useEffect, Suspense } from 'react';
import { 
  Utensils, 
  Phone, 
  Clock, 
  MapPin, 
  Star, 
  ChevronRight, 
  Instagram, 
  MessageCircle, 
  Menu as MenuIcon, 
  X,
  ChefHat,
  Leaf,
  DollarSign,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FoodScene from './components/FoodScene';

const MENU_CATEGORIES = [
  {
    id: 'rice',
    name: 'Rice Dishes',
    items: [
      { 
        name: 'Smoky Jollof Rice', 
        price: '₦2,500', 
        description: 'Our signature firewood-smoked jollof served with fried plantain and choice of protein.',
        image: '/input_file_2.png'
      },
      { 
        name: 'Fried Rice', 
        price: '₦2,500', 
        description: 'Savory rice stir-fried with fresh vegetables and liver chunks.',
        image: '/input_file_1.png'
      },
      { 
        name: 'White Rice & Stew', 
        price: '₦2,000', 
        description: 'Fluffy white rice served with our special tomato and pepper blend stew.',
        image: '/input_file_0.png'
      },
    ]
  },
  {
    id: 'soups',
    name: 'Soups & Swallows',
    items: [
      { 
        name: 'Egusi Soup', 
        price: '₦3,000', 
        description: 'Rich melon seed soup with spinach and assorted meats.',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop'
      },
      { name: 'Okra Soup', price: '₦3,000', description: 'Freshly chopped okra soup with seafood and local spices.' },
      { 
        name: 'Pounded Yam', 
        price: '₦800', 
        description: 'Smooth, stretchy pounded yam made from fresh local tubers.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=800&auto=format&fit=crop'
      },
      { name: 'Eba (Garri)', price: '₦500', description: 'Yellow or white garri prepared to perfection.' },
    ]
  },
  {
    id: 'proteins',
    name: 'Proteins',
    items: [
      { name: 'Grilled Chicken', price: '₦1,500', description: 'Spiced and grilled to tender perfection.' },
      { 
        name: 'Beef Suya', 
        price: '₦1,200', 
        description: 'Thinly sliced beef seasoned with our secret yaji spice blend.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
      },
      { name: 'Fried Fish', price: '₦1,800', description: 'Crispy fried croaker fish seasoned with local herbs.' },
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks & Snacks',
    items: [
      { 
        name: 'Chapman', 
        price: '₦1,500', 
        description: 'The classic Nigerian cocktail with a Siya\'s Kitchen twist.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop'
      },
      { name: 'Zobo Drink', price: '₦800', description: 'Refreshing hibiscus tea infused with ginger and pineapple.' },
      { name: 'Meat Pie', price: '₦1,000', description: 'Flaky pastry filled with seasoned minced meat and vegetables.' },
    ]
  }
];

const REVIEWS = [
  { name: 'Amina Bello', rating: 5, text: 'The jollof rice is actually smoky! Best I\'ve had in Lafia. Highly recommend.', date: '2 weeks ago' },
  { name: 'Chidi Okafor', rating: 5, text: 'Warm atmosphere and the staff are so friendly. The Egusi soup tastes like home.', date: '1 month ago' },
  { name: 'Samuel T.', rating: 4, text: 'Great food at affordable prices. The Chapman is a must-try!', date: '3 days ago' },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('rice');
  const [scrolled, setScrolled] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: string } | null>(null);
  const [pendingItem, setPendingItem] = useState<{ name: string; price: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    specialInstructions: '',
    quantity: 1
  });

  const calculateTotal = () => {
    if (!selectedItem) return '';
    const priceValue = parseInt(selectedItem.price.replace(/[^\d]/g, '')) || 0;
    const total = priceValue * orderForm.quantity;
    return `₦${total.toLocaleString()}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const { fullName, phone, address, specialInstructions, quantity } = orderForm;
    
    // Validation
    if (!fullName || !phone || !address) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormError(null);

    const time = new Date().toLocaleString('en-NG', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const message = `🍽️ *NEW ORDER — Siya's Kitchen*

👤 *Customer Name:* ${fullName}
📞 *Phone:* ${phone}
📍 *Delivery Address:* ${address}
🛒 *Order:* ${selectedItem.name} (x${quantity})
📝 *Special Instructions:* ${specialInstructions || "None"}

⏰ *Time:* ${time}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348103800930?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSelectedItem(null);
    setOrderForm({
      fullName: '',
      phone: '',
      address: '',
      specialInstructions: '',
      quantity: 1
    });
    setShowSuccess(`Order for ${selectedItem.name} sent!`);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')} aria-label="Siya's Kitchen Home">
            <div className="bg-brand-green p-2 rounded-lg">
              <Utensils className="text-brand-gold w-6 h-6" />
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-brand-green' : 'text-white'}`}>Siya's Kitchen</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['About', 'Menu', 'Why Us', 'Reviews', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className={`font-medium hover:text-brand-gold transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
                aria-label={`Scroll to ${item} section`}
              >
                {item}
              </button>
            ))}
            <a 
              href="tel:08103800930"
              className="bg-brand-gold text-brand-green px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
              aria-label="Call to order now"
            >
              Order Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className={scrolled ? 'text-brand-green' : 'text-white'} />
            ) : (
              <MenuIcon className={scrolled ? 'text-brand-green' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-xl md:hidden py-6 px-4 flex flex-col gap-4"
            >
              {['About', 'Menu', 'Why Us', 'Reviews', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-left text-lg font-medium text-gray-800 py-2 border-b border-gray-100"
                  aria-label={`Scroll to ${item} section`}
                >
                  {item}
                </button>
              ))}
              <a 
                href="tel:08103800930"
                className="bg-brand-green text-white text-center py-3 rounded-lg font-bold mt-2"
                aria-label="Call to order"
              >
                Call to Order
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <Suspense fallback={<div className="absolute inset-0 bg-gray-900" />}>
          <FoodScene />
        </Suspense>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-brand-gold text-brand-green px-4 py-1 rounded-full text-sm font-bold mb-4 tracking-wider uppercase">
              Now Open in Lafia
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Authentic Nigerian Flavours, <br />
              <span className="text-brand-gold">Made with Love</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Experience the true taste of home with our signature smoky jollof rice 
              and traditional dishes prepared with the freshest local ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('menu')}
                className="bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                aria-label="View our menu"
              >
                View Our Menu <ChevronRight className="w-5 h-5" />
              </button>
              <a 
                href="tel:08103800930"
                className="bg-white text-brand-green px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                aria-label="Call to order"
              >
                <Phone className="w-5 h-5" /> Call to Order
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-white opacity-70 hover:opacity-100"
            aria-label="Scroll down to about section"
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1000&auto=format&fit=crop" 
                  alt="Our Kitchen" 
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -right-6 bg-brand-gold p-8 rounded-2xl shadow-xl hidden lg:block">
                  <p className="text-4xl font-bold text-brand-green">4.8/5</p>
                  <p className="text-brand-green font-medium">Google Rating</p>
                </div>
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-brand-green text-lg font-bold mb-2 uppercase tracking-widest">Our Story</h2>
                <h3 className="text-4xl font-bold mb-6 text-gray-900">A Local Gem in the Heart of Lafia</h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Siya's Kitchen started with a simple mission: to bring the authentic, 
                  heart-warming taste of Nigerian home-style cooking to the vibrant community of Lafia. 
                  Recently opened on Doma Road, we've quickly become a local favorite for our 
                  uncompromising quality and warm hospitality.
                </p>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Whether you're craving our legendary smoky jollof rice or a rich, 
                  nutritious bowl of Egusi soup, every dish is prepared with love and 
                  the finest ingredients sourced from our local farmers.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ChefHat className="text-brand-green w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">Expert Chefs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Leaf className="text-brand-green w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800">Fresh Produce</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-brand-green text-lg font-bold mb-2 uppercase tracking-widest">Our Menu</h2>
            <h3 className="text-4xl font-bold text-gray-900">Deliciously Crafted Dishes</h3>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-brand-green text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Show ${cat.name} menu`}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {MENU_CATEGORIES.find(c => c.id === activeCategory)?.items.map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all group border border-gray-100 cursor-pointer perspective-1000 overflow-hidden"
              >
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-brand-green transition-colors">{item.name}</h4>
                    <span className="text-brand-green font-bold text-lg">{item.price}</span>
                  </div>
                  <p className="text-gray-500 mb-6">{item.description}</p>
                  <button 
                    onClick={() => setPendingItem({ name: item.name, price: item.price })}
                    className="text-brand-gold font-bold flex items-center gap-2 hover:gap-3 transition-all"
                    aria-label={`Select ${item.name} for ${item.price}`}
                  >
                    Order Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 bg-brand-green text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-brand-gold text-lg font-bold mb-2 uppercase tracking-widest">Why Siya's Kitchen</h2>
            <h3 className="text-4xl font-bold">The Secret to Our Success</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: 'Fresh Ingredients', desc: 'Sourced daily from local farmers to ensure peak flavor.' },
              { icon: ChefHat, title: 'Homestyle Cooking', desc: 'Traditional recipes passed down through generations.' },
              { icon: DollarSign, title: 'Affordable Prices', desc: 'Premium quality food that doesn\'t break the bank.' },
              { icon: Zap, title: 'Fast Service', desc: 'Quick preparation without compromising on taste.' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center hover:bg-white/20 transition-all border border-white/10"
              >
                <div className="bg-brand-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-brand-green w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-brand-green text-lg font-bold mb-2 uppercase tracking-widest">Testimonials</h2>
            <h3 className="text-4xl font-bold text-gray-900">What Our Customers Say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{review.name}</span>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-brand-green text-lg font-bold mb-2 uppercase tracking-widest">Contact Us</h2>
              <h3 className="text-4xl font-bold text-gray-900 mb-8">Visit Us Today</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-green p-3 rounded-lg">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Location</h4>
                    <p className="text-gray-600">Doma Road, Kilima Junction, Lafia 900107, Nasarawa State, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-green p-3 rounded-lg">
                    <Phone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Phone Number</h4>
                    <p className="text-gray-600">0810 380 0930</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-brand-green p-3 rounded-lg">
                    <Clock className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Opening Hours</h4>
                    <p className="text-gray-600">Open Daily: 8:00 AM - 9:30 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <a 
                  href="https://wa.me/2348103800930" 
                  className="bg-green-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-green-600 transition-all"
                  aria-label="Order via WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Order
                </a>
                <a 
                  href="https://instagram.com" 
                  className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-pink-700 transition-all"
                  aria-label="Visit our Instagram"
                >
                  <Instagram className="w-5 h-5" /> Instagram
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-[450px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              {/* Placeholder for Google Maps */}
              <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop" 
                  alt="Map Placeholder" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <MapPin className="w-12 h-12 mb-4 relative z-10" />
                <p className="font-bold text-lg relative z-10">Siya's Kitchen, Lafia</p>
                <p className="relative z-10">Doma Road, Kilima Junction</p>
                <a 
                  href="https://www.google.com/maps/search/Doma+Road,+Kilima+Junction,+Lafia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 bg-brand-green text-white px-6 py-2 rounded-full font-bold relative z-10 hover:bg-green-800 transition-all"
                  aria-label="Get directions on Google Maps"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-brand-green p-2 rounded-lg">
                  <Utensils className="text-brand-gold w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">Siya's Kitchen</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Bringing the authentic taste of Nigeria to your table. 
                Experience the warmth of home-style cooking in the heart of Lafia.
              </p>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="bg-white/10 p-3 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all"
                  aria-label="Visit our Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-white/10 p-3 rounded-full hover:bg-brand-gold hover:text-brand-green transition-all"
                  aria-label="Message us on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-brand-gold transition-colors" aria-label="Scroll to About Us section">About Us</button></li>
                <li><button onClick={() => scrollToSection('menu')} className="hover:text-brand-gold transition-colors" aria-label="Scroll to Our Menu section">Our Menu</button></li>
                <li><button onClick={() => scrollToSection('why-us')} className="hover:text-brand-gold transition-colors" aria-label="Scroll to Why Choose Us section">Why Choose Us</button></li>
                <li><button onClick={() => scrollToSection('reviews')} className="hover:text-brand-gold transition-colors" aria-label="Scroll to Reviews section">Reviews</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-brand-gold transition-colors" aria-label="View Privacy Policy">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors" aria-label="View Terms of Service">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors" aria-label="View Cookie Policy">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Siya's Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/2348103800930" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 group"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Order on WhatsApp
        </span>
      </a>

      {/* Selection Toast (Subtle Confirmation) */}
      <AnimatePresence>
        {pendingItem && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[90] bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex items-center gap-6 min-w-[320px] md:min-w-[400px]"
          >
            <div className="bg-green-100 p-2 rounded-lg">
              <Utensils className="text-brand-green w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Item Selected</p>
              <p className="text-gray-900 font-bold">{pendingItem.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setPendingItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setSelectedItem(pendingItem);
                  setPendingItem(null);
                }}
                className="bg-brand-green text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-800 transition-all shadow-md"
              >
                Complete Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl my-8"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close order form"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-green p-3 rounded-xl">
                  <Utensils className="text-brand-gold w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Complete Your Order</h3>
                  <p className="text-gray-500">Ordering: <span className="text-brand-green font-bold">{selectedItem.name}</span></p>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={orderForm.fullName}
                    onChange={(e) => setOrderForm({...orderForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    placeholder="e.g. 0810 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address *</label>
                  <textarea 
                    required
                    rows={3}
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
                    placeholder="Enter your detailed delivery location"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                    />
                  </div>
                  <div className="w-2/3">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Price Total</label>
                    <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 font-bold text-brand-green">
                      {calculateTotal()}
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-red-500 text-sm font-bold text-center">{formError}</p>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Special Instructions (Optional)</label>
                  <textarea 
                    rows={2}
                    value={orderForm.specialInstructions}
                    onChange={(e) => setOrderForm({...orderForm, specialInstructions: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-none"
                    placeholder="Any allergies or delivery notes?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <MessageCircle className="w-6 h-6" />
                  Send Order via WhatsApp
                </button>
                
                <p className="text-center text-xs text-gray-400">
                  Clicking "Send Order" will open WhatsApp on your device.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-brand-green text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2"
          >
            <Utensils className="w-5 h-5 text-brand-gold" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
