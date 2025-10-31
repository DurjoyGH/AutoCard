import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { showToast } from '../../components/Toast/CustomToast';
import { submitContactForm } from '../../services/contactApi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitContactForm(formData);
      showToast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      showToast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Address',
      value: 'autocard.just.edu.bd@example.com',
      description: 'Send us an email anytime',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      value: '017********',
      description: 'Mon-Fri from 9am to 5pm',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'JUST Library',
      description: 'Jashore University of Science & Technology',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'We respond within 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Friendly Support',
      description: 'Our team is here to help'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Reach us via email anytime'
    }
  ];

  return (
    <div className="min-h-screen py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get in <span className="bg-gradient-to-r from-[#598392] to-[#124559] bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-[#598392]/80 text-lg max-w-2xl mx-auto">
            Have questions about AutoCard? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className={`${info.bgColor} backdrop-blur-xl border ${info.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{info.title}</h3>
                <p className={`${info.iconColor} font-medium mb-1`}>{info.value}</p>
                <p className="text-[#598392]/60 text-sm">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200"
                  placeholder="How can we help?"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us more about your question or concern..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-xl font-medium hover:from-[#124559] hover:to-[#598392] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#598392]/50 transition-all duration-200 shadow-lg hover:shadow-[#598392]/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            
            {/* Why Contact Us */}
            <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Why Contact Us?</h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#598392]/20 flex items-center justify-center group-hover:bg-[#598392]/30 transition-colors duration-200">
                        <Icon className="w-5 h-5 text-[#598392]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                        <p className="text-[#598392]/70 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-[#598392]/20 to-[#124559]/20 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Office Hours</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#598392]/20">
                  <span className="text-[#598392]/80">Saturday - Wednesday</span>
                  <span className="text-white font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#598392]/80">Thursday</span>
                   <span className="text-[#598392]/80">Friday</span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#598392]/10 rounded-lg border border-[#598392]/20">
                <p className="text-[#598392]/80 text-sm">
                  <span className="font-semibold text-white">Note:</span> Email support is available 24/7. We'll respond to your queries within 24 hours.
                </p>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Looking for quick answers?</h3>
                  <p className="text-blue-400/70 text-sm">Check out our FAQ section for common questions</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
            <p className="text-[#598392]/80 mb-6 max-w-2xl mx-auto">
              For urgent matters related to your library card application or account issues, please contact us directly via phone during office hours. Our support team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:autocard.just.edu.bd@example.com"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
              <a
                href="tel:017********"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
