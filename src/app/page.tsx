"use client"
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from './components/Navbar';

// A custom hook for observing when an element enters the viewport
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Update state when observer callback fires
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Unobserve after it's visible once to prevent re-triggering
        if (ref.current) {
            observer.unobserve(ref.current);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};


// Animated number counter component using requestAnimationFrame for smooth counting
const CountUp = ({ end, duration = 1500, prefix = '', suffix = '' }: { end: string | number, duration?: number, prefix?: string, suffix?: string }) => {
    const [count, setCount] = useState(0);
    // Use the ref returned by the hook
    const [ref, isVisible] = useOnScreen({ threshold: 0.5 });
    const animationFrameRef = useRef<number>();

    const endValue = typeof end === 'string' ? parseInt(end.replace(/,/g, '')) : end;

    useEffect(() => {
        if (isVisible) {
            let startTimestamp: number | null = null;
            const step = (timestamp: number) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentCount = Math.floor(progress * endValue);
                setCount(currentCount);
                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(step);
                }
            };
            animationFrameRef.current = requestAnimationFrame(step);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isVisible, endValue, duration]);

    return <div ref={ref}>{prefix}{new Intl.NumberFormat().format(count)}{suffix}</div>;
};


const HomePage = () => {
  const [email, setEmail] = useState('');
  
  // Form state
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [destination, setDestination] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Animation states
  const [heroTitle, setHeroTitle] = useState('');
  const [isTitleComplete, setIsTitleComplete] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const fullTitle = "Your Journey to Studying Abroad Starts Here";

  // Typing animation for the hero title - with looping
  useEffect(() => {
    let i = 0;
    let typingInterval: NodeJS.Timeout;

    const startTyping = () => {
        typingInterval = setInterval(() => {
            if (i <= fullTitle.length) {
                setHeroTitle(fullTitle.substring(0, i));
                i++;
            } else {
                clearInterval(typingInterval);
                if (!isTitleComplete) {
                    setIsTitleComplete(true);
                }
                setTimeout(() => {
                    i = 0;
                    setHeroTitle('');
                    startTyping();
                }, 2500); // Wait 2.5 seconds before restarting
            }
        }, 75); // Slower typing speed
    }

    startTyping();

    return () => clearInterval(typingInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animations for buttons and form after title completes for the first time
  useEffect(() => {
    if (isTitleComplete) {
      const timer1 = setTimeout(() => setShowButtons(true), 100);
      const timer2 = setTimeout(() => setShowForm(true), 200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isTitleComplete]);

  // 3D Tilt Effect for the form
  useEffect(() => {
    const card = formRef.current;
    if (!card) return;

    // FIX: Explicitly typed the 'e' parameter as a MouseEvent.
    // This resolves the "e is not defined" error by ensuring the event object
    // and its properties (like clientX and clientY) are correctly recognized.
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = -8 * ((y - height / 2) / height);
      const rotateY = 8 * ((x - width / 2) / width);
      
      card.style.transition = 'transform 0.1s';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      card.style.transition = 'transform 0.5s';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showForm]);
  
  const handleProgramSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: 'Submitting...', type: 'info' });

    const formData = {
        fieldOfStudy,
        destination,
        educationLevel,
    };

    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            setFormStatus({ message: result.message, type: 'success' });
            // Reset form fields
            setFieldOfStudy('');
            setDestination('');
            setEducationLevel('');
        } else {
            throw new Error(result.message || 'An unknown error occurred.');
        }
    } catch (error: any) {
        setFormStatus({ message: error.message, type: 'error' });
    } finally {
        setIsSubmitting(false);
        // Hide the message after 5 seconds
        setTimeout(() => setFormStatus({ message: '', type: '' }), 5000);
    }
  };

  // Restored handleSubmit function for the email subscription form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the email subscription logic
    console.log(`Email submitted: ${email}`);
    alert(`Thank you! We'll send updates to ${email}`);
    setEmail('');
  };

  // Correctly use the useOnScreen hook for each section
  const [statsRef, statsVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [servicesRef, servicesVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [destinationsRef, destinationsVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [programsRef, programsVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [testimonialsRef, testimonialsVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [partnersRef, partnersVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });
  const [ctaRef, ctaVisible] = useOnScreen({ rootMargin: '-100px', threshold: 0.1 });


  // Mock data for programs
  const programs = [
    { id: 1, title: "Business Administration", university: "University of Toronto", location: "Toronto, Canada", duration: "4 years", tuition: "$32,000 CAD/year", popular: true },
    { id: 2, title: "Computer Science", university: "University of British Columbia", location: "Vancouver, Canada", duration: "4 years", tuition: "$35,000 CAD/year", popular: true },
    { id: 3, title: "Mechanical Engineering", university: "University of Melbourne", location: "Melbourne, Australia", duration: "4 years", tuition: "$38,000 AUD/year" },
    { id: 4, title: "International Relations", university: "London School of Economics", location: "London, UK", duration: "3 years", tuition: "£24,000/year" },
    { id: 5, title: "Biomedical Sciences", university: "University of California", location: "San Francisco, USA", duration: "4 years", tuition: "$42,000 USD/year" },
    { id: 6, title: "Hospitality Management", university: "Les Roches Global", location: "Crans-Montana, Switzerland", duration: "3 years", tuition: "CHF 36,000/year", popular: true }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Head>
        <title>ApplyBoard - Study Abroad Simplified</title>
        <meta name="description" content="Find and apply to educational programs around the world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="https://images.pexels.com/photos/220201/pexels-photo-220201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
            <source src="/videos/study-abroad.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 h-32 md:h-40 lg:h-48">
                {heroTitle}
                <span className="animate-pulse">|</span>
              </h1>
              <p className={`text-xl md:text-2xl mb-12 mt-10 max-w-2xl text-blue-200 transition-all duration-500 delay-200 ${isTitleComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                ApplyBoard simplifies the study abroad process. Discover programs, get matched with schools, and apply with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className={`bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-500 ease-out ${showButtons ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                  Find Your Program
                </button>
                <button className={`bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-500 ease-out ${showButtons ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    How It Works
                  </span>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div 
                ref={formRef} 
                className={`relative w-full max-w-lg transition-all duration-500 ease-in-out ${showForm ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-white rounded-xl shadow-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Your Perfect Program</h3>
                  <form onSubmit={handleProgramSearch}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                        <select 
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" disabled>Select a field</option>
                          <option value="Business & Management">Business & Management</option>
                          <option value="Computer Science & IT">Computer Science & IT</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Health Sciences">Health Sciences</option>
                          <option value="Arts & Design">Arts & Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Study Destination</label>
                        <select 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" disabled>Select a country</option>
                          <option value="Canada">Canada</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                        <select 
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="" disabled>Select education level</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Doctorate">Doctorate</option>
                          <option value="Diploma/Certificate">Diploma/Certificate</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        {isSubmitting ? 'Searching...' : 'Search Programs'}
                      </button>
                      {formStatus.message && (
                        <p className={`text-center mt-2 text-sm ${formStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                          {formStatus.message}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg transform rotate-[-3deg] transition-transform duration-500 hover:rotate-0">
                  Free Application Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { value: '750000', label: 'Students Helped', suffix: '+' },
                { value: '1500', label: 'Institution Partners', suffix: '+' },
                { value: '95', label: 'Countries Represented', suffix: '+' },
                { value: '0', label: 'Cost to Apply', prefix: '$' }
            ].map((stat, index) => (
              <div key={index} className={`p-6 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 75}ms`}}>
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-16 md:py-24">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Comprehensive Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From program search to visa support, we're with you every step of the way
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Program Matching", description: "Find programs that match your academic background, interests, and budget", icon: "🔍" },
              { title: "Application Support", description: "Expert guidance through the entire application process", icon: "📝" },
              { title: "Visa Assistance", description: "Comprehensive support for your student visa application", icon: "🛂" },
              { title: "Scholarship Matching", description: "Access to thousands of scholarship opportunities", icon: "🎓" },
              { title: "Accommodation Help", description: "Find safe and comfortable housing options", icon: "🏠" },
              { title: "Pre-Departure Support", description: "Everything you need to know before you leave", icon: "✈️" },
              { title: "Career Services", description: "Job search support and career development resources", icon: "💼" },
              { title: "Alumni Network", description: "Connect with our global community of graduates", icon: "🌐" }
            ].map((service, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 75}ms`}}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section ref={destinationsRef} className="py-16 bg-gray-50">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${destinationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Study Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most popular countries for international students
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { name: "Canada", students: "642,000+", color: "from-red-500 to-red-700", highlights: ["Post-Graduation Work Permit", "Affordable Education", "Multicultural Society"] },
                { name: "United States", students: "1,075,000+", color: "from-blue-500 to-blue-700", highlights: ["World-Class Universities", "Diverse Program Options", "Research Opportunities"] },
                { name: "United Kingdom", students: "605,000+", color: "from-purple-500 to-purple-700", highlights: ["Shorter Degree Programs", "Rich History & Culture", "Global Recognition"] },
                { name: "Australia", students: "710,000+", color: "from-green-500 to-green-700", highlights: ["High Quality of Life", "Work While Studying", "Beautiful Natural Environment"] }
            ].map((country, index) => (
              <div key={index} className={`group overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-2 ${destinationsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 75}ms`}}>
                <div className={`bg-gradient-to-br ${country.color} h-48 relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white">{country.name}</h3>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {country.students} students
                  </div>
                </div>
                <div className="bg-white p-6">
                  <h4 className="font-bold text-lg mb-3">Why choose {country.name}?</h4>
                  <ul className="space-y-2 mb-6">
                    {country.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Explore Programs in {country.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section ref={programsRef} className="py-16 md:py-24">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Top programs chosen by our international students
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={program.id} className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ${programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 75}ms`}}>
                {program.popular && (
                  <div className="bg-blue-600 text-white py-1 px-4 text-center font-bold text-sm">
                    POPULAR CHOICE
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{program.title}</h3>
                      <p className="text-blue-600 font-medium">{program.university}</p>
                    </div>
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0" />
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {program.location}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{program.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tuition Fees</p>
                      <p className="font-medium">{program.tuition}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                      Apply Now
                    </button>
                    <button className="py-2 px-4 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
                      Program Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="py-3 px-8 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              View All Programs
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-16 bg-blue-600 text-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Hear from students who achieved their study abroad dreams with ApplyBoard
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Maria Rodriguez", program: "MBA at University of Toronto", country: "From Mexico", quote: "ApplyBoard made the application process so smooth. Their advisors were with me every step of the way, from program selection to visa approval.", rating: 5 },
              { name: "Ahmed Hassan", program: "Computer Science at University of British Columbia", country: "From Egypt", quote: "I received multiple scholarship offers thanks to ApplyBoard's matching system. They helped me find the perfect program within my budget.", rating: 5 },
              { name: "Wei Chen", program: "Mechanical Engineering at University of Melbourne", country: "From China", quote: "The visa application support was invaluable. I would have been overwhelmed without their guidance and document checklist.", rating: 4 }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-blue-700 p-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: `${index * 75}ms`}}>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex-shrink-0" />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-blue-100">{testimonial.program}</p>
                    <p className="text-blue-200 text-sm">{testimonial.country}</p>
                  </div>
                </div>
                <p className="italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Partners */}
      <section ref={partnersRef} className="py-16 bg-gray-50">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${partnersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Partner Institutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with top universities and colleges around the world
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "University of Toronto", "University of British Columbia", "McGill University",
              "University of Melbourne", "University of Sydney", "University College London",
              "King's College London", "University of Manchester", "University of California",
              "New York University", "Boston University", "University of Amsterdam"
            ].map((university, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-32 transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${partnersVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{transitionDelay: `${index * 50}ms`}}>
                <div className="text-center font-bold text-gray-700">{university}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-500 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Study Abroad Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have achieved their dreams with ApplyBoard
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-transform duration-300 hover:scale-105 shadow-lg">
              Create Free Account
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
              Book a Free Consultation
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Updated with Study Abroad News</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-grow px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-600 text-sm mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">ApplyBoard</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                We make the study abroad journey simple by connecting international students, recruitment partners, and academic institutions.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                  <a key={platform} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{platform}</span>
                    <div className="bg-gray-700 hover:bg-gray-600 border-2 border-dashed rounded-full w-10 h-10" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">For Students</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Program Search</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Scholarships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Student Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">For Partners</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Recruitment Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partner Portal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Become a Partner</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partner Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h5 className="font-bold mb-2">Global Offices</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Canada</p>
                    <p className="text-gray-400 text-sm">Kitchener, ON</p>
                  </div>
                  <div>
                    <p className="font-medium">United States</p>
                    <p className="text-gray-400 text-sm">San Francisco, CA</p>
                  </div>
                  <div>
                    <p className="font-medium">United Kingdom</p>
                    <p className="text-gray-400 text-sm">London, UK</p>
                  </div>
                  <div>
                    <p className="font-medium">India</p>
                    <p className="text-gray-400 text-sm">New Delhi</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-bold mb-2">Download Our App</h5>
                <div className="flex space-x-3 mb-4">
                  <a href="#" className="block">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-10" />
                  </a>
                  <a href="#" className="block">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-10" />
                  </a>
                </div>
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} ApplyBoard Inc. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
