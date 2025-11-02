import React, { useState, useEffect } from 'react';
import { MapPin, Book, Users, Clock, Award, Globe, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import libraryImage from '../../assets/library.jpg';
import libraryIndoor from '../../assets/library_indoor.jpg';
import readingRoom from '../../assets/reading_room.jpg';
import librarianOffice from '../../assets/librarian_office_room.jpg';
import scanner from '../../assets/scanner.jpg';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { 
      image: libraryImage, 
      title: 'JUST Central Library', 
      description: 'Welcome to our state-of-the-art library facility'
    },
    { 
      image: libraryIndoor, 
      title: 'Library Collections', 
      description: 'Extensive collection of books and resources'
    },
    { 
      image: readingRoom, 
      title: 'Reading Rooms', 
      description: 'Quiet and comfortable study spaces'
    },
    { 
      image: librarianOffice, 
      title: 'Library Administration', 
      description: 'Professional staff ready to assist you'
    },
    { 
      image: scanner, 
      title: 'Digital Services', 
      description: 'Modern technology for research and study'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  return (
    <div className="min-h-screen py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-[#598392] to-[#124559] bg-clip-text text-transparent">JUST Central Library</span>
          </h1>
          <p className="text-[#598392]/80 text-lg max-w-2xl mx-auto">
            Empowering Knowledge, Inspiring Research, Building Future
          </p>
        </div>

        {/* Image Slideshow */}
        <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl border border-[#598392]/20 group">
          {/* Slides */}
          <div className="relative h-[400px] md:h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                {/* Overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <div className="p-8 w-full">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                    <p className="text-white/90 text-base md:text-lg">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* About Library Section */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#598392] to-[#124559] flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">About Our Library</h2>
          </div>
          <div className="space-y-4 text-[#598392]/80 text-base md:text-lg leading-relaxed">
            <p>
              Welcome to the <span className="text-white font-semibold">Jashore University of Science and Technology (JUST) Central Library</span>. 
               The basic objective of library is to implement, enrich, and support the educational programs of 
              Jashore University of Science and Technology (JUST).
            </p>
            <p>
              JUST has already been declared a research university that aims at generating and advancing knowledge. The JUST Library is playing its 
              role as the foundation of the research and development activities. It is an inherent part of the University and designed to meet the 
              information, research, and curriculum needs of its students, faculty and staff members. It has broad collections to meet the needs of 
              its users. The library's holdings include a diverse collection of printed, non-printed, and online resources for all to use.
            </p>
          </div>
        </div>

        {/* About AutoCard Website */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">About AutoCard</h2>
          </div>
          <div className="space-y-4 text-[#598392]/80 text-base md:text-lg leading-relaxed">
            <p>
              <span className="text-white font-semibold">AutoCard</span> is the official digital library card management system for JUST Central Library. 
              Our platform streamlines the process of applying for, managing, and renewing library cards, making it easier than ever for students, 
              faculty, and staff to access the wealth of resources available at our library.
            </p>
            <p>
              With AutoCard, you can apply for your library card online, track your application status in real-time, and receive your digital card 
              instantly upon approval. Our system is designed with user experience in mind, featuring an intuitive interface, secure authentication, 
              and seamless integration with the library's existing systems.
            </p>
            <p>
              We believe in the power of technology to enhance education and research. AutoCard represents our commitment to providing modern, 
              efficient services that support the academic journey of every member of the JUST community.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#01161e]/50 backdrop-blur-xl rounded-2xl p-6 border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
            <p className="text-[#598392]/70">Serving students, faculty, and staff with dedication and excellence</p>
          </div>
          <div className="bg-[#01161e]/50 backdrop-blur-xl rounded-2xl p-6 border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Excellence</h3>
            <p className="text-[#598392]/70">Committed to providing world-class library services and resources</p>
          </div>
          <div className="bg-[#01161e]/50 backdrop-blur-xl rounded-2xl p-6 border border-[#598392]/20 hover:border-[#598392]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#598392] to-[#124559] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
            <p className="text-[#598392]/70">Open and accessible resources for all members of the JUST community</p>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-[#598392]/20 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Visit Us</h2>
          </div>
          <p className="text-[#598392]/80 text-lg mb-6">
            Find us at the heart of JUST campus. We welcome you to explore our facilities and resources.
          </p>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-[#598392]/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.8931776895377!2d89.120729!3d23.2331376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff1856e3019a93%3A0xbfbbacff1638af60!2sCentral%20Library%20of%20JUST!5e0!3m2!1sen!2sbd!4v1699000000000!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="JUST Central Library Location"
            />
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://maps.app.goo.gl/eDcLP3j2Jk9Zg1zY6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Need More Information?</h3>
            <p className="text-[#598392]/80 mb-6 max-w-2xl mx-auto">
              Feel free to reach out to us for any queries or assistance. Our support team is ready to help you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-xl font-medium hover:from-[#124559] hover:to-[#598392] transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
