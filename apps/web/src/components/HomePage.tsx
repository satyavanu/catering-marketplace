"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="bg-[#faf7fb] text-gray-900">

      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-lg">Droooly</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium">Login</button>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm shadow">
            Become Partner
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Discover Amazing <br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Food Experiences
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Book chefs, meal plans, and catering for every occasion —
            all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-pink-600 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition">
              Explore
            </button>
            <button className="border px-6 py-3 rounded-full hover:bg-gray-100 transition">
              Download App
            </button>
          </div>
        </div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[380px] rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
            Chef / Food Image
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <ServiceCard
            icon={<ChefIcon />}
            title="Book a Chef"
            desc="Private chefs for home dining, parties or recurring cooking."
          />

          <ServiceCard
            icon={<MealIcon />}
            title="Meal Plans"
            desc="Healthy weekly or monthly subscriptions from trusted kitchens."
          />

          <ServiceCard
            icon={<CateringIcon />}
            title="Catering"
            desc="Get quotes for events, weddings and corporate gatherings."
          />

        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

          <Feature title="Verified Vendors" />
          <Feature title="Transparent Pricing" />
          <Feature title="Seamless Booking" />

        </div>
      </section>

      {/* PARTNER CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-white p-10 text-center shadow-xl">
          <h3 className="text-3xl font-semibold">
            Grow Your Food Business
          </h3>
          <p className="mt-4 text-pink-100">
            Join Droooly as a chef, caterer or city partner.
          </p>

          <button className="mt-6 bg-white text-pink-600 px-6 py-3 rounded-full font-medium hover:scale-105 transition">
            Join Now
          </button>
        </div>
      </section>

      {/* APP */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        <div className="h-[320px] rounded-3xl bg-gradient-to-br from-purple-200 to-pink-200 shadow flex items-center justify-center">
          App Preview
        </div>

        <div>
          <h3 className="text-3xl font-semibold">
            Get the Droooly App
          </h3>

          <p className="mt-4 text-gray-600">
            Manage bookings, explore chefs and track orders on the go.
          </p>

          <div className="flex gap-4 mt-6">
            <button className="bg-black text-white px-5 py-3 rounded-lg">
              App Store
            </button>
            <button className="bg-black text-white px-5 py-3 rounded-lg">
              Play Store
            </button>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Droooly
      </footer>
    </main>
  );
}

/* COMPONENTS */

function ServiceCard({ icon, title, desc }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
    >
      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-gray-500 text-sm mt-2">{desc}</p>
    </motion.div>
  );
}

function Feature({ title }: { title: string }) {
  return (
    <div>
      <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center mb-3">
        ✓
      </div>
      <p className="font-medium">{title}</p>
    </div>
  );
}

/* SVG ICONS */

function Logo() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
  );
}

function ChefIcon() {
  return (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 16-4 16 0" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 10h16" />
    </svg>
  );
}

function CateringIcon() {
  return (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 16h16M8 16v4h8v-4" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  );
}