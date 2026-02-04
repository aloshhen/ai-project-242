import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Dog, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Star, 
  Shield, 
  Award, 
  Send,
  Menu,
  X,
  ChevronDown,
  PawPrint
} from 'lucide-react';

// SafeIcon component to handle all Lucide icons
const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const iconMap = {
    'dog': Dog,
    'heart': Heart,
    'map-pin': MapPin,
    'phone': Phone,
    'mail': Mail,
    'clock': Clock,
    'check-circle': CheckCircle,
    'star': Star,
    'shield': Shield,
    'award': Award,
    'send': Send,
    'menu': Menu,
    'x': X,
    'chevron-down': ChevronDown,
    'paw-print': PawPrint
  };
  
  const IconComponent = iconMap[name] || Dog;
  return <IconComponent size={size} className={className} color={color} />;
};

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    const formData = new FormData(e.target);
    formData.append('access_key', accessKey);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        e.target.reset();
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Что-то пошло не так');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ошибка сети. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  };
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm };
};

// Animated Section Component
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Puppy Card Component
const PuppyCard = ({ name, age, price, image, gender }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
  >
    <div className="relative h-64 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
        {gender === 'male' ? 'Мальчик' : 'Девочка'}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{age}</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-black text-spitz-accent">{price}</span>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2">
          <SafeIcon name="heart" size={18} />
          Узнать больше
        </button>
      </div>
    </div>
  </motion.div>
);

// Contact Form Component
const ContactForm = () => {
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler();
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY'; // Replace with your Web3Forms Access Key

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                required
                className="w-full px-6 py-4 bg-white/5 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-spitz-accent transition-colors"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                required
                className="w-full px-6 py-4 bg-white/5 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-spitz-accent transition-colors"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-6 py-4 bg-white/5 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-spitz-accent transition-colors"
            />
            <textarea
              name="message"
              placeholder="Расскажите о себе и какого щенка вы ищете"
              rows="4"
              required
              className="w-full px-6 py-4 bg-white/5 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-spitz-accent transition-colors resize-none"
            ></textarea>
            
            {isError && (
              <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl">
                {errorMessage}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-spitz-accent to-spitz-brown hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Отправить заявку
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center py-12"
          >
            <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Заявка отправлена!
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Спасибо за интерес к нашим щенкам! Мы свяжемся с вами в ближайшее время.
            </p>
            <button
              onClick={resetForm}
              className="text-spitz-accent hover:text-spitz-brown font-semibold transition-colors"
            >
              Отправить ещё одну заявку
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePuppy, setActivePuppy] = useState(null);

  const puppies = [
    {
      name: 'Юки',
      age: '2 месяца',
      price: '45 000 ₽',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
      gender: 'female',
      description: 'Игривая и ласковая девочка. Любит играть с мячиком.'
    },
    {
      name: 'Ханами',
      age: '3 месяца',
      price: '52 000 ₽',
      image: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&q=80',
      gender: 'female',
      description: 'Спокойная и умная девочка. Отлично подходит для семьи с детьми.'
    },
    {
      name: 'Сора',
      age: '2.5 месяца',
      price: '48 000 ₽',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
      gender: 'male',
      description: 'Активный и смелый мальчик. Будет отличным компаньоном.'
    }
  ];

  const features = [
    {
      icon: 'award',
      title: 'Чистокровные щенки',
      description: 'Все щенки с родословной и документами РКФ. Гарантия породности.'
    },
    {
      icon: 'shield',
      title: 'Прививки и обработка',
      description: 'Щенки привиты по возрасту, обработаны от паразитов. Ветпаспорт в подарок.'
    },
    {
      icon: 'heart',
      title: 'Социализированы',
      description: 'Щенки растут в семье, приучены к пеленке и когтеточке. Любят детей.'
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-spitz-cream overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-spitz-cream shadow-sm">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-spitz-accent to-spitz-brown rounded-full flex items-center justify-center">
              <SafeIcon name="dog" size={24} className="text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-spitz-dark">WhitePaw</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-spitz-dark/70 hover:text-spitz-brown font-medium transition-colors">
              О породе
            </button>
            <button onClick={() => scrollToSection('puppies')} className="text-spitz-dark/70 hover:text-spitz-brown font-medium transition-colors">
              Щенки
            </button>
            <button onClick={() => scrollToSection('features')} className="text-spitz-dark/70 hover:text-spitz-brown font-medium transition-colors">
              Преимущества
            </button>
            <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-spitz-accent to-spitz-brown hover:opacity-90 text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105">
              Связаться
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-spitz-dark"
          >
            <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-spitz-cream overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <button onClick={() => scrollToSection('about')} className="block w-full text-left text-spitz-dark font-medium py-2">
                  О породе
                </button>
                <button onClick={() => scrollToSection('puppies')} className="block w-full text-left text-spitz-dark font-medium py-2">
                  Щенки
                </button>
                <button onClick={() => scrollToSection('features')} className="block w-full text-left text-spitz-dark font-medium py-2">
                  Преимущества
                </button>
                <button onClick={() => scrollToSection('contact')} className="w-full bg-gradient-to-r from-spitz-accent to-spitz-brown text-white py-3 rounded-full font-semibold">
                  Связаться
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-spitz-cream via-white to-spitz-cream z-0" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-spitz-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-spitz-brown/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-spitz-accent/20 mb-6">
                <SafeIcon name="award" size={16} className="text-spitz-accent" />
                <span className="text-sm font-medium text-spitz-dark">Премиум питомник</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-spitz-dark leading-tight mb-6">
                Японский <br />
                <span className="text-gradient">Шпиц</span>
              </h1>
              
              <p className="text-lg md:text-xl text-spitz-dark/70 mb-8 leading-relaxed max-w-lg">
                Идеальный компаньон для вашей семьи. Чистокровные щенки с родословной, привиты и социализированы.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('puppies')}
                  className="bg-gradient-to-r from-spitz-accent to-spitz-brown hover:opacity-90 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-spitz-accent/30"
                >
                  Выбрать щенка
                  <SafeIcon name="chevron-down" size={20} />
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-white hover:bg-spitz-cream text-spitz-dark px-8 py-4 rounded-full font-bold transition-all border-2 border-spitz-dark/10 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="phone" size={20} />
                  Связаться
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-spitz-dark/10">
                <div>
                  <div className="text-3xl font-black text-spitz-dark">150+</div>
                  <div className="text-sm text-spitz-dark/60">Щенков нашли дом</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-spitz-dark">8 лет</div>
                  <div className="text-sm text-spitz-dark/60">Опыт разведения</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-spitz-dark">100%</div>
                  <div className="text-sm text-spitz-dark/60">Здоровые щенки</div>
                </div>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                  alt="Японский шпиц" 
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="check-circle" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Вакцинирован</div>
                    <div className="text-sm text-gray-500">Все прививки по возрасту</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-4 bottom-1/4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <SafeIcon name="star" size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">5.0 Рейтинг</div>
                    <div className="text-sm text-gray-500">150+ довольных семей</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Breed Section */}
      <section id="about" className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block text-spitz-accent font-semibold tracking-wider uppercase text-sm mb-4">
                О породе
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-spitz-dark mb-6">
                Японский Шпиц
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Идеальная порода для семейного содержания. Компактный размер, пушистая белая шерсть и дружелюбный характер делают японского шпица прекрасным компаньоном.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'heart',
                title: 'Дружелюбный характер',
                desc: 'Любят детей и ладят с другими животными. Идеальны для семьи.'
              },
              {
                icon: 'shield',
                title: 'Здоровье и долголетие',
                desc: 'Продолжительность жизни 12-16 лет. Минимум генетических заболеваний.'
              },
              {
                icon: 'award',
                title: 'Легкий уход',
                desc: 'Несмотря на пушистую шерсть, линяют умеренно. Достаточно расчесывать 2-3 раза в неделю.'
              }
            ].map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <div className="bg-spitz-cream/50 rounded-3xl p-8 h-full hover:bg-spitz-cream transition-colors">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <SafeIcon name={feature.icon} size={32} className="text-spitz-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-spitz-dark mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Puppies Section */}
      <section id="puppies" className="py-20 md:py-32 bg-gradient-to-b from-spitz-cream to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block text-spitz-accent font-semibold tracking-wider uppercase text-sm mb-4">
                Доступны для резервирования
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-spitz-dark mb-6">
                Наши малыши
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Каждый щенок проходит полное ветеринарное обследование и готов к переезду в новую семью.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {puppies.map((puppy, index) => (
              <AnimatedSection key={puppy.name} delay={index * 0.15}>
                <PuppyCard {...puppy} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-gray-500 mb-4">Цена включает: родословную, прививки, ветпаспорт, консультацию по уходу</p>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-spitz-accent hover:text-spitz-brown font-semibold transition-colors inline-flex items-center gap-2"
              >
                Задать вопрос о щенках
                <SafeIcon name="chevron-down" size={16} />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features / Why Us Section */}
      <section id="features" className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                    alt="Японский шпиц" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-spitz-accent/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-spitz-brown/20 rounded-full blur-2xl" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="inline-block text-spitz-accent font-semibold tracking-wider uppercase text-sm mb-4">
                Почему выбирают нас
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-spitz-dark mb-6">
                Мы заботимся о каждом щенке
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Наш питомник специализируется на разведении японских шпицев более 8 лет. Мы гарантируем здоровье, чистопородность и отличный характер каждого щенка.
              </p>

              <div className="space-y-4">
                {[
                  'Полный пакет документов (родословная, ветпаспорт)',
                  'Консультация по уходу и воспитанию 24/7',
                  'Договор купли-продажи с гарантией здоровья',
                  'Доставка по всей России'
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="check-circle" size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-b from-spitz-cream to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block text-spitz-accent font-semibold tracking-wider uppercase text-sm mb-4">
                Свяжитесь с нами
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-spitz-dark mb-6">
                Заберите друга домой
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Оставьте заявку, и мы свяжемся с вами для консультации и бронирования щенка.
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto">
            <AnimatedSection delay={0.2}>
              <div className="bg-spitz-dark rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { icon: 'phone', title: 'Телефон', value: '+7 (999) 123-45-67' },
              { icon: 'mail', title: 'Email', value: 'info@whitepaw.ru' },
              { icon: 'map-pin', title: 'Адрес', value: 'Москва, ул. Пушистая, 1' }
            ].map((contact, index) => (
              <AnimatedSection key={contact.title} delay={0.3 + index * 0.1}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-spitz-cream hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-spitz-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon name={contact.icon} size={24} className="text-spitz-accent" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">{contact.title}</div>
                  <div className="font-semibold text-spitz-dark">{contact.value}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-spitz-dark py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-spitz-accent to-spitz-brown rounded-full flex items-center justify-center">
                  <SafeIcon name="dog" size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">WhitePaw</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Профессиональный питомник японских шпицев. Мы предлагаем здоровых, социализированных щенков с отличной родословной.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Навигация</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">О породе</button></li>
                <li><button onClick={() => scrollToSection('puppies')} className="text-gray-400 hover:text-white transition-colors">Щенки</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Преимущества</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Контакты</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <SafeIcon name="phone" size={16} />
                  <span>+7 (999) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <SafeIcon name="mail" size={16} />
                  <span>info@whitepaw.ru</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <SafeIcon name="map-pin" size={16} />
                  <span>Москва, ул. Пушистая, 1</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 WhitePaw. Все права защищены.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <SafeIcon name="heart" size={16} className="text-red-500" />
              <span>Сделано с любовью к собакам</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;