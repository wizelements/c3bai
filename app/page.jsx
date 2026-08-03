'use client';

import Nav from './sections/nav';
import Hero from './sections/hero';
import OfferLadder from './sections/offer-ladder';
import CaseStudy from './sections/case-study';
import AuditSection from './sections/audit';
import Footer from './sections/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Nav />
      <Hero />
      <OfferLadder />
      <CaseStudy />
      <AuditSection />
      <Footer />
    </div>
  );
}
