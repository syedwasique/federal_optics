import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { FEDERAL_OPTICAL_PHONE, FEDERAL_OPTICAL_PHONE_INTL, FEDERAL_OPTICAL_WHATSAPP_NUMBER } from '../context/CartContext';
import { InstagramIcon } from './Icons';
import { CLINIC_HOURS, SHOP_HOURS } from '../data/hours';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Truck,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, openCategory } = useNavigation();

  return (
    <footer data-theme="dark" className="bg-[#121316] text-[#E8E3D8] border-t border-white/10 pt-16 pb-10">
      <div className="site-container">
        {/* Brand Showcase Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logos/logo_white_tm.png"
                alt="Federal Optical — Computerized Eye Clinic"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Founded in 1975 as a small neighborhood optician in Karachi, Federal Optical has grown over 50 years into one of Pakistan’s most trusted family eyewear institutions and computerized eye clinics.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C5A880]" />
                <span>50 Years of Excellence (1975–2025)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Certified Optometrists</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#C5A880]" />
                <span>Pakistan Nationwide & Worldwide (USA/UK/Canada)</span>
              </span>
            </div>
          </div>

          {/* Direct Consultation / WhatsApp Callout */}
          <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">
                Direct Optical Consultation
              </span>
              <h4 className="font-heading text-xl font-semibold text-white mt-1">
                Have a prescription or frame inquiry?
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Send a photograph of your optometrist prescription or ask about custom frame sizing directly to our Karachi optical team on WhatsApp.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${FEDERAL_OPTICAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Federal Optical! I have a question about my prescription / frame options.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#C5A880] hover:bg-[#b09165] text-black font-semibold text-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Chat on WhatsApp ({FEDERAL_OPTICAL_PHONE})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => navigateTo('federal-care')}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
              >
                Book In-Store Eye Test
              </button>
            </div>
          </div>
        </div>

        {/* 4 Columns (Mirrors Gaba Optical’s architecture) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs">
          {/* Column 1: Find Out More */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Find Out More
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#C5A880] transition-colors text-left">
                  About Us & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#C5A880] transition-colors text-left">
                  Our Story Since 1975
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('stores')} className="hover:text-[#C5A880] transition-colors text-left font-medium text-stone-300">
                  Our Stores (Karachi Flagship)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-[#C5A880] transition-colors text-left">
                  Frequently Asked Questions (FAQs)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Policies
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'shipping' })}
                  className="hover:text-[#C5A880] transition-colors text-left"
                >
                  Shipping Policy (Pakistan & Overseas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'refund' })}
                  className="hover:text-[#C5A880] transition-colors text-left"
                >
                  Refund & Frame Exchange Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'prescription-guarantee' })}
                  className="hover:text-[#C5A880] transition-colors text-left"
                >
                  Prescription Lens Accuracy Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'privacy' })}
                  className="hover:text-[#C5A880] transition-colors text-left"
                >
                  Privacy Policy & Confidentiality
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'terms' })}
                  className="hover:text-[#C5A880] transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (full row on phones, list in two columns) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-heading text-base font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:block md:space-y-2.5 text-stone-400">
              <li>
                <button onClick={() => openCategory('eyeglasses')} className="hover:text-[#C5A880] transition-colors text-left">
                  Men’s & Women’s Eyeglasses
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('sunglasses')} className="hover:text-[#C5A880] transition-colors text-left">
                  Polarized Sunglasses
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('clear-contacts')} className="hover:text-[#C5A880] transition-colors text-left">
                  Clear Contact Lenses (Acuvue & more)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('federal-care')} className="hover:text-[#C5A880] transition-colors text-left">
                  Computerized Eye Test Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us (full width on phones so the email/Instagram fit) */}
          <div className="col-span-2 md:col-span-1 min-w-0">
            <h4 className="font-heading text-base font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Federal Optical — Computerized Eye Clinic, Karachi, Sindh, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:03002265650" className="hover:text-white">
                  {FEDERAL_OPTICAL_PHONE} / {FEDERAL_OPTICAL_PHONE_INTL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:federaloptical1975@gmail.com" className="hover:text-white break-all">
                  federaloptical1975@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href="https://instagram.com/federaloptical"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white break-all"
                >
                  instagram.com/federaloptical
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>
                  <span className="block">Shop: {SHOP_HOURS.short}</span>
                  <span className="block mt-1">Eye Clinic: {CLINIC_HOURS.short}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and payment methods */}
        <div className="pt-8 pb-20 sm:pb-0 flex flex-col lg:flex-row items-center justify-between gap-4 text-stone-500 text-xs text-center lg:text-left">
          <p>
            © {new Date().getFullYear()} Federal Optical. All rights reserved. “Since 1975 — Your Family Optician”.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="w-full sm:w-auto text-[11px] text-stone-400">Accepted:</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 whitespace-nowrap">
              Cash on Delivery (COD)
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 whitespace-nowrap">
              Direct Bank IBFT
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300 whitespace-nowrap">
              Visa / MasterCard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
