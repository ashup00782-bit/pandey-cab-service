import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import {
  Phone,
  MapPin,
  Calendar,
  Users,
  Star,
  Shield,
  Clock,
  Award,
  Car,
  MessageCircle,
  X,
  ArrowRight,
  CheckCircle,
  Navigation,
  Building,
  Mountain,
  ChevronDown,
  ChevronUp,
  Mail,
  ThumbsUp,
  Headphones,
  CreditCard,
  Fuel,
  Settings,
  User,
  Heart,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import type {
  Inquiry,
  ServiceType,
  LocalTravelFormData,
  CharDhamFormData,
  OutstationFormData,
  LeadStatus,
} from './types';

type FormMode = 'none' | 'local_travel' | 'char_dham_yatra' | 'outstation_trip';
type ViewMode = 'home' | 'admin';

interface FAQItem {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  image: string;
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form states
  const [localTravelForm, setLocalTravelForm] = useState<LocalTravelFormData>({
    name: '',
    phone_number: '',
    pickup_location: '',
    destination: '',
    travel_date: '',
    message: '',
  });

  const [charDhamForm, setCharDhamForm] = useState<CharDhamFormData>({
    name: '',
    phone_number: '',
    number_of_travelers: 1,
    travel_date: '',
    city: '',
    special_requirements: '',
  });

  const [outstationForm, setOutstationForm] = useState<OutstationFormData>({
    name: '',
    phone_number: '',
    pickup_city: '',
    destination_city: '',
    travel_date: '',
    trip_type: 'one_way',
  });

  const whatsappNumber = '917838578735';
  const phoneNumbers = ['+91 7838578735', '+91 9873553172'];

  const faqs: FAQItem[] = [
    {
      question: 'How can I book a cab with Pandey Cab Service?',
      answer:
        'You can book a cab by filling out our inquiry form for the specific service you need, calling us directly at +91 7838578735 or +91 9873553172, or messaging us on WhatsApp. We will confirm your booking within 30 minutes.',
    },
    {
      question: 'What are your service areas?',
      answer:
        'We provide services across Delhi NCR for local travel and all major cities across India for outstation trips. Our Char Dham Yatra covers Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept cash payment after the trip, UPI payments (Google Pay, PhonePe, Paytm), bank transfers, and online payment gateways. Payment is collected after service completion.',
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer:
        'Yes, you can cancel or modify your booking up to 24 hours before the scheduled pickup time without any charges. Please contact us directly for any changes.',
    },
    {
      question: 'Are your drivers experienced and verified?',
      answer:
        'Absolutely! All our drivers have minimum 5 years of driving experience, complete background verification, valid commercial licenses, and are trained in customer service and safety protocols.',
    },
    {
      question: 'What safety measures do you follow?',
      answer:
        'We sanitize all vehicles before each trip, provide hand sanitizers, our vehicles have GPS tracking, 24/7 roadside assistance, and all drivers wear masks. Your safety is our top priority.',
    },
    {
      question: 'Do you provide AC vehicles?',
      answer:
        'Yes, all our vehicles come with fully functional AC. We maintain our fleet regularly to ensure maximum comfort during your journey.',
    },
    {
      question: 'What is the best time for Char Dham Yatra?',
      answer:
        'The best time for Char Dham Yatra is from May to June and September to October. The temples remain open from April/May to November. We recommend booking in advance during peak season.',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Rajesh Kumar',
      location: 'Delhi',
      rating: 5,
      text: 'Excellent service! We used Pandey Cab for our Char Dham Yatra. Driver was very experienced and knowledgeable about the routes. Highly recommended!',
      service: 'Char Dham Yatra',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      name: 'Priya Sharma',
      location: 'Gurgaon',
      rating: 5,
      text: 'Used their airport pickup service multiple times. Always on time, clean cars, and professional drivers. Great value for money!',
      service: 'Local Travel',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      name: 'Amit Verma',
      location: 'Noida',
      rating: 5,
      text: 'Traveled with family to Jaipur. The Innova was very comfortable and the driver was courteous. Price was reasonable too. Will use again!',
      service: 'Outstation Trip',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      name: 'Sunita Devi',
      location: 'Faridabad',
      rating: 5,
      text: 'Best cab service in Delhi NCR! Used for Kedarnath trip. Driver knew all the routes and helped us throughout the journey.',
      service: 'Char Dham Yatra',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const popularRoutes = [
    { from: 'Delhi', to: 'Jaipur', distance: '280 km', time: '5 hrs' },
    { from: 'Delhi', to: 'Agra', distance: '230 km', time: '4 hrs' },
    { from: 'Delhi', to: 'Haridwar', distance: '220 km', time: '5 hrs' },
    { from: 'Delhi', to: 'Rishikesh', distance: '240 km', time: '5.5 hrs' },
    { from: 'Delhi', to: 'Mathura', distance: '160 km', time: '3 hrs' },
    { from: 'Delhi', to: 'Dehradun', distance: '250 km', time: '6 hrs' },
  ];

  useEffect(() => {
    if (viewMode === 'admin') {
      fetchInquiries();
    }
  }, [viewMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const handleLocalTravelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('inquiries').insert({
      service_type: 'local_travel',
      name: localTravelForm.name,
      phone_number: localTravelForm.phone_number,
      pickup_location: localTravelForm.pickup_location,
      destination: localTravelForm.destination,
      travel_date: localTravelForm.travel_date,
      message: localTravelForm.message,
    });
    if (!error) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormMode('none');
        setSubmitSuccess(false);
        setLocalTravelForm({
          name: '',
          phone_number: '',
          pickup_location: '',
          destination: '',
          travel_date: '',
          message: '',
        });
      }, 2000);
    }
    setLoading(false);
  };

  const handleCharDhamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('inquiries').insert({
      service_type: 'char_dham_yatra',
      name: charDhamForm.name,
      phone_number: charDhamForm.phone_number,
      number_of_travelers: charDhamForm.number_of_travelers,
      travel_date: charDhamForm.travel_date,
      city: charDhamForm.city,
      special_requirements: charDhamForm.special_requirements,
    });
    if (!error) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormMode('none');
        setSubmitSuccess(false);
        setCharDhamForm({
          name: '',
          phone_number: '',
          number_of_travelers: 1,
          travel_date: '',
          city: '',
          special_requirements: '',
        });
      }, 2000);
    }
    setLoading(false);
  };

  const handleOutstationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('inquiries').insert({
      service_type: 'outstation_trip',
      name: outstationForm.name,
      phone_number: outstationForm.phone_number,
      pickup_city: outstationForm.pickup_city,
      destination_city: outstationForm.destination_city,
      travel_date: outstationForm.travel_date,
      trip_type: outstationForm.trip_type,
    });
    if (!error) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormMode('none');
        setSubmitSuccess(false);
        setOutstationForm({
          name: '',
          phone_number: '',
          pickup_city: '',
          destination_city: '',
          travel_date: '',
          trip_type: 'one_way',
        });
      }, 2000);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    await supabase.from('inquiries').update({ lead_status: status }).eq('id', id);
    fetchInquiries();
  };

  const getServiceDisplayName = (type: ServiceType) => {
    const names: Record<ServiceType, string> = {
      local_travel: 'Local Travel',
      char_dham_yatra: 'Char Dham Yatra',
      outstation_trip: 'Outstation Trip',
    };
    return names[type];
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-amber-100 text-amber-800 border-amber-200',
      converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      lost: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
  };

  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">Pandey Cab Service</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                  className="bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-lg transition flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Support</span>
                </a>
                <button
                  onClick={() => setViewMode('home')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                >
                  View Website
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Total Inquiries</span>
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{inquiries.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">New Leads</span>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {inquiries.filter((i) => i.lead_status === 'new').length}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Contacted</span>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-600">
                {inquiries.filter((i) => i.lead_status === 'contacted').length}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 text-sm font-medium">Converted</span>
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {inquiries.filter((i) => i.lead_status === 'converted').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Inquiries</h2>
              <p className="text-gray-500 text-sm mt-1">Manage and track customer inquiries</p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading inquiries...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Travel Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {inquiry.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-gray-900">{inquiry.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${inquiry.phone_number}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {inquiry.phone_number}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {getServiceDisplayName(inquiry.service_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(inquiry.travel_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.lead_status)}`}
                          >
                            {inquiry.lead_status.charAt(0).toUpperCase() + inquiry.lead_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={inquiry.lead_status}
                            onChange={(e) => updateLeadStatus(inquiry.id, e.target.value as LeadStatus)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No inquiries yet</p>
                            <p className="text-gray-400 text-sm mt-1">Inquiries will appear here when submitted</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span className="text-slate-400">Call us:</span>
                <a href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`} className="hover:text-brand-400 transition font-semibold">
                  {phoneNumbers[0]}
                </a>
                <span className="text-slate-600 mx-1">|</span>
                <a href={`tel:${phoneNumbers[1].replace(/\s/g, '')}`} className="hover:text-brand-400 transition font-semibold">
                  {phoneNumbers[1]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span className="text-slate-300">pandeycabservice@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
                <span className="font-bold">4.9/5 Rating</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">10,000+ Happy Customers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Pandey Cab Service</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  Trusted & Reliable
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              <a href="#services" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                Services
              </a>
              <a href="#routes" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                Popular Routes
              </a>
              <a href="#vehicles" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                Our Fleet
              </a>
              <a href="#testimonials" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                Reviews
              </a>
              <a href="#faq" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                FAQ
              </a>
              <a href="#contact" className="text-slate-700 hover:text-brand-600 transition font-semibold">
                Contact
              </a>
              <button
                onClick={() => setViewMode('admin')}
                className="text-slate-400 hover:text-brand-600 transition text-sm font-medium"
              >
                Admin
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                className="bg-brand-600 hover:bg-brand-700 text-white px-7 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                <span>Book Now</span>
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-slate-100 py-5 space-y-1">
              <a
                href="#services"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#routes"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Popular Routes
              </a>
              <a
                href="#vehicles"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Fleet
              </a>
              <a
                href="#testimonials"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-5 border-t border-slate-100 mt-5 space-y-3">
                <a
                  href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                  className="block bg-brand-600 text-white text-center py-3.5 rounded-xl font-semibold shadow-lg"
                >
                  <Phone className="w-5 h-5 inline mr-2" />
                  Book Now
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-emerald-600 text-white text-center py-3.5 rounded-xl font-semibold"
                >
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-50 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 mb-8">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700 text-sm font-semibold tracking-wide">TRUSTED BY 10,000+ TRAVELERS</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Your Journey<br />
                <span className="text-brand-600">Our Priority</span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium cab service for Delhi NCR and beyond. Safe, reliable, and comfortable travel
                for local trips, outstation journeys, and sacred pilgrimages.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <a
                  href="#services"
                  className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center gap-3"
                >
                  <span className="text-lg">Book Your Trip</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                  className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl transition-all border-2 border-slate-200 hover:border-slate-300 font-bold flex items-center justify-center gap-3"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">Call Now</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-brand-300 transition">
                  <div className="text-3xl font-black text-slate-900 mb-1">10K+</div>
                  <div className="text-slate-500 text-sm font-medium">Happy Customers</div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-brand-300 transition">
                  <div className="text-3xl font-black text-slate-900 mb-1">5+</div>
                  <div className="text-slate-500 text-sm font-medium">Years Experience</div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-brand-300 transition">
                  <div className="text-3xl font-black text-slate-900 mb-1">50+</div>
                  <div className="text-slate-500 text-sm font-medium">Premium Vehicles</div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-brand-300 transition">
                  <div className="text-3xl font-black text-slate-900 mb-1">4.9</div>
                  <div className="text-slate-500 text-sm font-medium flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-brand-500 fill-brand-500" />
                    Rating
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Quick Booking</h3>
                  <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">
                    24/7 Available
                  </span>
                </div>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">Select your service and submit an inquiry. Our team will contact you within 30 minutes!</p>
                <div className="space-y-4">
                  <button
                    onClick={() => setFormMode('local_travel')}
                    className="w-full bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-5 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3.5 rounded-xl group-hover:bg-blue-200 transition">
                          <Building className="w-6 h-6 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">Local Travel</div>
                          <div className="text-sm text-slate-500">Delhi & NCR</div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </button>
                  <button
                    onClick={() => setFormMode('char_dham_yatra')}
                    className="w-full bg-slate-50 hover:bg-brand-50 border-2 border-slate-200 hover:border-brand-400 rounded-2xl p-5 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-brand-100 p-3.5 rounded-xl group-hover:bg-brand-200 transition">
                          <Mountain className="w-6 h-6 text-brand-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">Char Dham Yatra</div>
                          <div className="text-sm text-slate-500">Pilgrimage Tours</div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-brand-600 transition" />
                    </div>
                  </button>
                  <button
                    onClick={() => setFormMode('outstation_trip')}
                    className="w-full bg-slate-50 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-3.5 rounded-xl group-hover:bg-emerald-200 transition">
                          <Navigation className="w-6 h-6 text-emerald-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">Outstation Trip</div>
                          <div className="text-sm text-slate-500">All India</div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition" />
                    </div>
                  </button>
                </div>
                <div className="mt-8 pt-8 border-t-2 border-slate-100 flex items-center justify-center gap-6">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                  <span className="text-slate-300 text-xl">|</span>
                  <a
                    href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            <div className="flex items-center gap-3 text-slate-700">
              <Shield className="w-7 h-7 text-emerald-600" />
              <span className="font-bold text-base">100% Safe</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-base">24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CreditCard className="w-7 h-7 text-brand-600" />
              <span className="font-bold text-base">Easy Payment</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <ThumbsUp className="w-7 h-7 text-emerald-600" />
              <span className="font-bold text-base">Best Rates</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Fuel className="w-7 h-7 text-amber-600" />
              <span className="font-bold text-base">No Hidden Charges</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Settings className="w-7 h-7 text-slate-600" />
              <span className="font-bold text-base">Well Maintained</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">Choose Your Travel Service</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of travel services to meet all your transportation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Local Travel Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2199384/pexels-photo-2199384.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Delhi Taxi Service"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium">
                    Starting Rs. 10/km
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">Local Travel Near Delhi</h3>
                  <p className="text-gray-300 text-sm">Airport, Railway, City Tours</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Airport Pickup & Drop Service</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Railway Station Transfer</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Delhi Sightseeing Tours</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Hourly Rental Available</span>
                  </li>
                </ul>
                <button
                  onClick={() => setFormMode('local_travel')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Char Dham Yatra Card */}
            <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group relative">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                Popular
              </div>
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3228780/pexels-photo-3228780.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Kedarnath Temple"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Complete Package
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">Char Dham Yatra</h3>
                  <p className="text-gray-300 text-sm">Sacred Pilgrimage Tour</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Yamunotri & Gangotri Darshan</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Kedarnath & Badrinath Visit</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Experienced Hill Drivers</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>All Inclusive Packages</span>
                  </li>
                </ul>
                <button
                  onClick={() => setFormMode('char_dham_yatra')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <span>Book Yatra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Outstation Trip Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2537463/pexels-photo-2537463.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Indian Highway Road Trip"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium">
                    One Way & Round Trip
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">Outstation Trip</h3>
                  <p className="text-gray-300 text-sm">All India Coverage</p>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>One Way & Round Trip Options</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>All Major Cities Covered</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Highway Experienced Drivers</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>AC Vehicles Guaranteed</span>
                  </li>
                </ul>
                <button
                  onClick={() => setFormMode('outstation_trip')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <span>Book Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="routes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Popular Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">Top Travel Routes from Delhi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the most popular destinations with our reliable cab service
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                onClick={() => setFormMode('outstation_trip')}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-lg transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {route.from} to {route.to}
                </div>
                <div className="text-sm text-gray-500">
                  {route.distance} | {route.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Our Fleet
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">Wide Range of Vehicles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our well-maintained fleet of vehicles for a comfortable journey
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Dzire */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all group">
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Maruti Dzire"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AC
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-gray-900 mb-1">Maruti Dzire</h4>
                <p className="text-sm text-gray-500 mb-2">4 Seater Sedan</p>
                <div className="flex items-center justify-center space-x-1 text-orange-600 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">4 Passengers</span>
                </div>
              </div>
            </div>

            {/* Ertiga */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all group">
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Maruti Ertiga"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AC
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-gray-900 mb-1">Maruti Ertiga</h4>
                <p className="text-sm text-gray-500 mb-2">7 Seater SUV</p>
                <div className="flex items-center justify-center space-x-1 text-orange-600 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">7 Passengers</span>
                </div>
              </div>
            </div>

            {/* Innova */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-300 hover:shadow-xl transition-all group">
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Toyota Innova"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AC
                </div>
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-gray-900 mb-1">Toyota Innova</h4>
                <p className="text-sm text-gray-500 mb-2">7 Seater Premium</p>
                <div className="flex items-center justify-center space-x-1 text-orange-600 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">7 Passengers</span>
                </div>
              </div>
            </div>

            {/* Fortuner */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all group">
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Toyota Fortuner"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AC
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-gray-900 mb-1">Toyota Fortuner</h4>
                <p className="text-sm text-gray-500 mb-2">7 Seater Luxury</p>
                <div className="flex items-center justify-center space-x-1 text-orange-600 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">7 Passengers</span>
                </div>
              </div>
            </div>

            {/* Tempo Traveller */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-xl transition-all group">
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Tempo Traveller"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  AC
                </div>
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-gray-900 mb-1">Tempo Traveller</h4>
                <p className="text-sm text-gray-500 mb-2">12-26 Seater</p>
                <div className="flex items-center justify-center space-x-1 text-orange-600 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Groups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">Why Travelers Trust Us</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We are committed to providing the best travel experience with professional services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition text-center">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Safe & Secure</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                All vehicles regularly serviced & sanitized. Professional drivers with verified backgrounds & clean
                records.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition text-center">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">24/7 Support</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Round the clock customer support. Book your ride anytime with instant confirmation and assistance.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition text-center">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Best Rates</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Competitive pricing with no hidden charges. Transparent billing and best value for your money.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition text-center">
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Trusted Service</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Over 10,000 satisfied customers. 5+ years of experience in the travel industry with excellent track
                record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real reviews from real travelers who chose Pandey Cab Service</p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">"{testimonials[activeTestimonial].text}"</p>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-500">
                      {testimonials[activeTestimonial].location} - {testimonials[activeTestimonial].service}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeTestimonial ? 'bg-primary-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about our services</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-orange-50 rounded-2xl border border-primary-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">Our team is here to help you 24/7</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                Contact Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Have a question or need assistance? Our team is available 24/7 to help you with your travel needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white rounded-xl p-5 border border-gray-200">
                  <div className="bg-primary-100 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Phone Numbers</h4>
                    <div className="space-y-2">
                      <a href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`} className="block text-primary-600 hover:text-primary-700 font-medium">
                        {phoneNumbers[0]}
                      </a>
                      <a href={`tel:${phoneNumbers[1].replace(/\s/g, '')}`} className="block text-primary-600 hover:text-primary-700 font-medium">
                        {phoneNumbers[1]}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white rounded-xl p-5 border border-gray-200">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">WhatsApp</h4>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      +91 7838578735
                    </a>
                    <p className="text-gray-500 text-sm mt-1">Click to chat directly</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white rounded-xl p-5 border border-gray-200">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Our Location</h4>
                    <p className="text-gray-600">Delhi NCR, India</p>
                    <p className="text-gray-500 text-sm">Serving all over North India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white rounded-xl p-5 border border-gray-200">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Working Hours</h4>
                    <p className="text-gray-600">24/7 Available</p>
                    <p className="text-gray-500 text-sm">Always ready to serve you</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Quick Inquiry</h3>
              <p className="text-gray-600 mb-6">
                Select your service and we'll get back to you within 30 minutes.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Service</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setFormMode('local_travel')}
                      className="bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl p-4 text-left transition"
                    >
                      <Building className="w-6 h-6 text-primary-600 mb-2" />
                      <div className="font-semibold text-gray-900">Local Travel</div>
                      <div className="text-xs text-gray-500">Delhi & NCR</div>
                    </button>
                    <button
                      onClick={() => setFormMode('char_dham_yatra')}
                      className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl p-4 text-left transition"
                    >
                      <Mountain className="w-6 h-6 text-orange-600 mb-2" />
                      <div className="font-semibold text-gray-900">Char Dham</div>
                      <div className="text-xs text-gray-500">Yatra Package</div>
                    </button>
                    <button
                      onClick={() => setFormMode('outstation_trip')}
                      className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl p-4 text-left transition"
                    >
                      <Navigation className="w-6 h-6 text-emerald-600 mb-2" />
                      <div className="font-semibold text-gray-900">Outstation</div>
                      <div className="text-xs text-gray-500">All India</div>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-orange-50 rounded-xl p-6 border border-primary-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <Headphones className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">Need Instant Response?</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    For immediate assistance, call or WhatsApp us directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`}
                      className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Pandey Cab Service</h3>
                  <p className="text-gray-400 text-sm">Safe & Reliable Travel</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted partner for safe, reliable, and comfortable travel services across Delhi NCR and all over
                India.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-pink-600 p-3 rounded-lg transition group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 p-3 rounded-lg transition group">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Our Services</span>
                  </a>
                </li>
                <li>
                  <a href="#routes" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Popular Routes</span>
                  </a>
                </li>
                <li>
                  <a href="#vehicles" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Our Fleet</span>
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Customer Reviews</span>
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>FAQs</span>
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Contact Us</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Our Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-primary-400" />
                  <span>Local Travel Near Delhi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mountain className="w-4 h-4 text-orange-400" />
                  <span>Char Dham Yatra</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Outstation Trips</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Airport Pickup/Drop</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Group Tours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-pink-400" />
                  <span>Luxury Vehicles</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone Numbers</p>
                    <a href={`tel:${phoneNumbers[0].replace(/\s/g, '')}`} className="block text-white hover:text-orange-400 transition">
                      {phoneNumbers[0]}
                    </a>
                    <a href={`tel:${phoneNumbers[1].replace(/\s/g, '')}`} className="block text-white hover:text-orange-400 transition">
                      {phoneNumbers[1]}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm mb-1">WhatsApp</p>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-green-400 transition"
                    >
                      +91 7838578735
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Location</p>
                    <p className="text-white">Delhi NCR, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Pandey Cab Service. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="hidden group-hover:inline-block whitespace-nowrap ml-3 font-medium pr-1">Chat with us</span>
      </a>

      {/* Modal Forms */}
      {formMode !== 'none' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formMode === 'local_travel' && 'Local Travel Inquiry'}
                  {formMode === 'char_dham_yatra' && 'Char Dham Yatra Inquiry'}
                  {formMode === 'outstation_trip' && 'Outstation Trip Inquiry'}
                </h3>
                <p className="text-sm text-gray-500">Fill the form and we'll contact you shortly</p>
              </div>
              <button
                onClick={() => setFormMode('none')}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Inquiry Submitted Successfully!</h4>
                <p className="text-gray-600 mb-4">Thank you for choosing Pandey Cab Service.</p>
                <p className="text-primary-600 font-medium">We will contact you within 30 minutes.</p>
              </div>
            ) : (
              <div className="p-6">
                {/* Local Travel Form */}
                {formMode === 'local_travel' && (
                  <form onSubmit={handleLocalTravelSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={localTravelForm.name}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={localTravelForm.phone_number}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, phone_number: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" /> Pickup Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={localTravelForm.pickup_location}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, pickup_location: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter pickup address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" /> Destination *
                      </label>
                      <input
                        type="text"
                        required
                        value={localTravelForm.destination}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, destination: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Where do you want to go?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" /> Travel Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={localTravelForm.travel_date}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, travel_date: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                      <textarea
                        value={localTravelForm.message}
                        onChange={(e) => setLocalTravelForm({ ...localTravelForm, message: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                        placeholder="Any special requirements..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Char Dham Form */}
                {formMode === 'char_dham_yatra' && (
                  <form onSubmit={handleCharDhamSubmit} className="space-y-5">
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 mb-4">
                      <h4 className="font-bold text-orange-800 mb-1">Char Dham Yatra Package</h4>
                      <p className="text-sm text-orange-700">Complete pilgrimage with experienced driver & guide</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={charDhamForm.name}
                        onChange={(e) => setCharDhamForm({ ...charDhamForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={charDhamForm.phone_number}
                        onChange={(e) => setCharDhamForm({ ...charDhamForm, phone_number: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" /> Number of Travelers *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={20}
                        value={charDhamForm.number_of_travelers}
                        onChange={(e) =>
                          setCharDhamForm({ ...charDhamForm, number_of_travelers: parseInt(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" /> Travel Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={charDhamForm.travel_date}
                        onChange={(e) => setCharDhamForm({ ...charDhamForm, travel_date: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Building className="w-4 h-4 inline mr-1" /> Your City *
                      </label>
                      <input
                        type="text"
                        required
                        value={charDhamForm.city}
                        onChange={(e) => setCharDhamForm({ ...charDhamForm, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requirements</label>
                      <textarea
                        value={charDhamForm.special_requirements}
                        onChange={(e) => setCharDhamForm({ ...charDhamForm, special_requirements: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={3}
                        placeholder="Any special requirements..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Book Yatra</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Outstation Form */}
                {formMode === 'outstation_trip' && (
                  <form onSubmit={handleOutstationSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={outstationForm.name}
                        onChange={(e) => setOutstationForm({ ...outstationForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={outstationForm.phone_number}
                        onChange={(e) => setOutstationForm({ ...outstationForm, phone_number: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" /> Pickup City *
                      </label>
                      <input
                        type="text"
                        required
                        value={outstationForm.pickup_city}
                        onChange={(e) => setOutstationForm({ ...outstationForm, pickup_city: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter pickup city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" /> Destination City *
                      </label>
                      <input
                        type="text"
                        required
                        value={outstationForm.destination_city}
                        onChange={(e) => setOutstationForm({ ...outstationForm, destination_city: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter destination city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" /> Travel Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={outstationForm.travel_date}
                        onChange={(e) => setOutstationForm({ ...outstationForm, travel_date: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Trip Type *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl px-4 py-3 cursor-pointer transition">
                          <input
                            type="radio"
                            name="trip_type"
                            value="one_way"
                            checked={outstationForm.trip_type === 'one_way'}
                            onChange={() => setOutstationForm({ ...outstationForm, trip_type: 'one_way' })}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="font-medium text-gray-700">One Way</span>
                        </label>
                        <label className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl px-4 py-3 cursor-pointer transition">
                          <input
                            type="radio"
                            name="trip_type"
                            value="round_trip"
                            checked={outstationForm.trip_type === 'round_trip'}
                            onChange={() => setOutstationForm({ ...outstationForm, trip_type: 'round_trip' })}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="font-medium text-gray-700">Round Trip</span>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Book Trip</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}