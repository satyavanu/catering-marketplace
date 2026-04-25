"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon, ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function QuickBooking() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [step, setStep] = useState("service"); // service | form | review | results | checkout
  const [service, setService] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const detect = () => setIsMobile(window.innerWidth < 768);
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  const [form, setForm] = useState({
    people: 2,
    guests: 50,
    mealType: "",
    duration: "",
    cuisine: [],
    vegRatio: 50,
    serviceType: "",
    eventType: "",
    date: "",
    location: "",
  });

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Mock results data
  const mockResults = {
    meals: [
      { id: 1, name: "HomeMeals Daily", price: "₹299/day", rating: 4.8, people: 2 },
      { id: 2, name: "Chef's Table", price: "₹399/day", rating: 4.9, people: 2 },
      { id: 3, name: "Fit Meals Pro", price: "₹349/day", rating: 4.7, people: 2 },
    ],
    caterers: [
      { id: 1, name: "Grand Catering Co.", price: "₹8,000", rating: 4.9, guests: 50 },
      { id: 2, name: "Elite Events", price: "₹10,000", rating: 4.8, guests: 50 },
      { id: 3, name: "Budget Caterers", price: "₹5,500", rating: 4.6, guests: 50 },
    ],
    chef: [
      { id: 1, name: "Chef Rajesh", price: "₹2,500/hr", rating: 4.9, experience: "8 years" },
      { id: 2, name: "Chef Priya", price: "₹2,000/hr", rating: 4.8, experience: "6 years" },
      { id: 3, name: "Chef Vikram", price: "₹1,800/hr", rating: 4.7, experience: "5 years" },
    ],
  };

  const services = [
    { type: "meals", title: "🍱 Meal Plans", desc: "Daily/weekly home meals" },
    { type: "caterers", title: "🎉 Catering", desc: "Events, parties, weddings" },
    { type: "chef", title: "👨‍🍳 Private Chef", desc: "Cook at your home or event" },
  ];

  const CUISINES = [
    "North Indian",
    "South Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Continental",
  ];

  const toggleCuisine = (c) => {
    update(
      "cuisine",
      form.cuisine.includes(c)
        ? form.cuisine.filter((x) => x !== c)
        : [...form.cuisine, c]
    );
  };

  const handleServiceSelect = (serviceType) => {
    setService(serviceType);
    setStep("form");
  };

  const handleFormSubmit = () => {
    setStep("review");
  };

  const handleConfirmReview = () => {
    setStep("results");
  };

  const handleBackStep = () => {
    if (step === "form") {
      setService(null);
      setStep("service");
    } else if (step === "review") {
      setStep("form");
    } else if (step === "results") {
      setStep("review");
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setStep("service");
    setService(null);
    setForm({
      people: 2,
      guests: 50,
      mealType: "",
      duration: "",
      cuisine: [],
      vegRatio: 50,
      serviceType: "",
      eventType: "",
      date: "",
      location: "",
    });
  };

  // ============ RENDER STEPS ============

  const renderServiceSelection = () => (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>What do you need?</h2>
        <p style={styles.stepDesc}>Choose a service to get started</p>
      </div>

      <div style={styles.serviceGrid}>
        {services.map((svc) => (
          <div
            key={svc.type}
            onClick={() => handleServiceSelect(svc.type)}
            style={styles.serviceCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(99, 102, 241, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
            }}
          >
            <div style={styles.serviceEmoji}>{svc.title.split(" ")[0]}</div>
            <h3 style={styles.serviceTitle}>{svc.title.split(" ").slice(1).join(" ")}</h3>
            <p style={styles.serviceDesc}>{svc.desc}</p>
            <div style={styles.serviceArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormFields = () => {
    switch (service) {
      case "meals":
        return (
          <>
            <Grid>
              <Field label="Number of People">
                <input
                  type="number"
                  style={styles.input}
                  value={form.people}
                  onChange={(e) => update("people", Number(e.target.value))}
                  min="1"
                />
              </Field>

              <Field label="Meal Type">
                <select
                  style={styles.input}
                  value={form.mealType}
                  onChange={(e) => update("mealType", e.target.value)}
                >
                  <option value="">Select meal type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="fullday">Full Day</option>
                </select>
              </Field>
            </Grid>

            <Grid>
              <Field label="Duration">
                <select
                  style={styles.input}
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                >
                  <option value="">Select duration</option>
                  <option value="1day">1 Day</option>
                  <option value="3days">3 Days</option>
                  <option value="7days">7 Days</option>
                  <option value="15days">15 Days</option>
                  <option value="30days">30 Days</option>
                </select>
              </Field>

              <Field label="Cuisine Preference">
                <div style={styles.cuisineWrap}>
                  {CUISINES.map((c) => (
                    <div
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      style={{
                        ...styles.cuisineItem,
                        background: form.cuisine.includes(c)
                          ? "#6366f1"
                          : "rgba(0,0,0,0.06)",
                        color: form.cuisine.includes(c) ? "white" : "#334155",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </Field>
            </Grid>
          </>
        );

      case "caterers":
        return (
          <>
            <Grid>
              <Field label="Event Type">
                <select
                  style={styles.input}
                  value={form.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Number of Guests">
                <input
                  style={styles.input}
                  type="number"
                  value={form.guests}
                  onChange={(e) => update("guests", Number(e.target.value))}
                  min="10"
                />
              </Field>
            </Grid>

            <Grid>
              <Field label="Cuisine Preference">
                <div style={styles.cuisineWrap}>
                  {CUISINES.map((c) => (
                    <div
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      style={{
                        ...styles.cuisineItem,
                        background: form.cuisine.includes(c)
                          ? "#6366f1"
                          : "rgba(0,0,0,0.06)",
                        color: form.cuisine.includes(c) ? "white" : "#334155",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Veg / Non-Veg Ratio">
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: "100%", cursor: "pointer" }}
                  value={form.vegRatio}
                  onChange={(e) => update("vegRatio", Number(e.target.value))}
                />
                <div style={styles.subRow}>
                  <span>🥬 Veg {form.vegRatio}%</span>
                  <span>🍗 Non-Veg {100 - form.vegRatio}%</span>
                </div>
              </Field>
            </Grid>

            <Field label="Service Type">
              <select
                style={styles.input}
                value={form.serviceType}
                onChange={(e) => update("serviceType", e.target.value)}
              >
                <option value="">Select service type</option>
                <option value="foodonly">Food Only</option>
                <option value="foodstaff">Food + Staff</option>
              </select>
            </Field>
          </>
        );

      case "chef":
        return (
          <>
            <Grid>
              <Field label="Service Type">
                <select
                  style={styles.input}
                  value={form.serviceType}
                  onChange={(e) => update("serviceType", e.target.value)}
                >
                  <option value="">Select service type</option>
                  <option value="homecooking">Home Cooking</option>
                  <option value="eventchef">Event Chef</option>
                  <option value="weeklychef">Weekly Chef</option>
                </select>
              </Field>

              <Field label="Number of People">
                <input
                  type="number"
                  style={styles.input}
                  value={form.people}
                  onChange={(e) => update("people", Number(e.target.value))}
                  min="1"
                />
              </Field>
            </Grid>

            <Grid>
              <Field label="Meal Type">
                <select
                  style={styles.input}
                  value={form.mealType}
                  onChange={(e) => update("mealType", e.target.value)}
                >
                  <option value="">Select meal type</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </Field>

              <Field label="Cuisine Preference">
                <div style={styles.cuisineWrap}>
                  {CUISINES.map((c) => (
                    <div
                      key={c}
                      onClick={() => toggleCuisine(c)}
                      style={{
                        ...styles.cuisineItem,
                        background: form.cuisine.includes(c)
                          ? "#6366f1"
                          : "rgba(0,0,0,0.06)",
                        color: form.cuisine.includes(c) ? "white" : "#334155",
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </Field>
            </Grid>

            <Field label="Duration">
              <input
                type="text"
                style={styles.input}
                placeholder="E.g., 3 hours"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
              />
            </Field>
          </>
        );

      default:
        return null;
    }
  };

  const renderForm = () => (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Tell us more</h2>
        <p style={styles.stepDesc}>We'll find the perfect match for you</p>
      </div>

      {renderFormFields()}

      <Grid>
        <Field label="Date">
          <input
            type="date"
            style={styles.input}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </Field>

        <Field label="Location">
          <input
            type="text"
            placeholder="Enter your address"
            style={styles.input}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </Field>
      </Grid>

      <div style={styles.formActions}>
        <button style={styles.secondaryBtn} onClick={handleBackStep}>
          ← Back
        </button>
        <button style={styles.primaryBtn} onClick={handleFormSubmit}>
          Review Details →
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Review your details</h2>
        <p style={styles.stepDesc}>Make sure everything looks good</p>
      </div>

      <div style={styles.reviewCard}>
        <div style={styles.reviewRow}>
          <span style={styles.reviewLabel}>Service:</span>
          <span style={styles.reviewValue}>
            {services.find((s) => s.type === service)?.title}
          </span>
        </div>

        {form.people > 0 && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>People:</span>
            <span style={styles.reviewValue}>{form.people}</span>
          </div>
        )}

        {form.guests > 0 && service === "caterers" && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Guests:</span>
            <span style={styles.reviewValue}>{form.guests}</span>
          </div>
        )}

        {form.mealType && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Meal Type:</span>
            <span style={styles.reviewValue}>{form.mealType}</span>
          </div>
        )}

        {form.eventType && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Event Type:</span>
            <span style={styles.reviewValue}>{form.eventType}</span>
          </div>
        )}

        {form.duration && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Duration:</span>
            <span style={styles.reviewValue}>{form.duration}</span>
          </div>
        )}

        {form.cuisine.length > 0 && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Cuisines:</span>
            <span style={styles.reviewValue}>{form.cuisine.join(", ")}</span>
          </div>
        )}

        {form.date && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Date:</span>
            <span style={styles.reviewValue}>{form.date}</span>
          </div>
        )}

        {form.location && (
          <div style={styles.reviewRow}>
            <span style={styles.reviewLabel}>Location:</span>
            <span style={styles.reviewValue}>{form.location}</span>
          </div>
        )}
      </div>

      <div style={styles.formActions}>
        <button style={styles.secondaryBtn} onClick={handleBackStep}>
          ← Edit
        </button>
        <button style={styles.primaryBtn} onClick={handleConfirmReview}>
          Find Matches →
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    const results = mockResults[service] || [];

    return (
      <div style={styles.stepContent}>
        <div style={styles.stepHeader}>
          <h2 style={styles.stepTitle}>Perfect matches found! ✨</h2>
          <p style={styles.stepDesc}>{results.length} options available</p>
        </div>

        <div style={styles.resultsList}>
          {results.map((result, idx) => (
            <div key={result.id} style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div>
                  <h4 style={styles.resultName}>{result.name}</h4>
                  <p style={styles.resultMeta}>
                    ⭐ {result.rating} • {result.price}
                  </p>
                </div>
                <div style={styles.resultRating}>
                  <CheckCircleIcon style={{ width: "24px", height: "24px", color: "#10b981" }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.formActions}>
          <button style={styles.secondaryBtn} onClick={handleBackStep}>
            ← Modify Search
          </button>
          <button style={styles.ctaBtn} onClick={() => setStep("checkout")}>
            Book Now →
          </button>
        </div>
      </div>
    );
  };

  const renderCheckout = () => (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Complete Your Booking</h2>
        <p style={styles.stepDesc}>One more step to confirm</p>
      </div>

      <div style={styles.checkoutCard}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 0.5rem 0" }}>
            Selected Service
          </p>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            {services.find((s) => s.type === service)?.title}
          </h3>
        </div>

        <div style={styles.checkoutDivider} />

        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 0.5rem 0" }}>
            Estimated Price
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#667eea", margin: 0 }}>
            ₹{Math.floor(Math.random() * 10000) + 2000}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0.5rem 0 0 0" }}>
            Price may vary based on final selection
          </p>
        </div>

        <div style={styles.checkoutDivider} />

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={styles.checkoutFeature}>
            <CheckCircleIcon style={{ width: "20px", height: "20px", color: "#10b981", flexShrink: 0 }} />
            <span>Verified professionals only</span>
          </div>
          <div style={styles.checkoutFeature}>
            <CheckCircleIcon style={{ width: "20px", height: "20px", color: "#10b981", flexShrink: 0 }} />
            <span>Free cancellation up to 24 hours</span>
          </div>
          <div style={styles.checkoutFeature}>
            <CheckCircleIcon style={{ width: "20px", height: "20px", color: "#10b981", flexShrink: 0 }} />
            <span>24/7 customer support</span>
          </div>
        </div>
      </div>

      <div style={styles.formActions}>
        <button style={styles.secondaryBtn} onClick={handleBackStep}>
          ← Back
        </button>
        <button
          style={styles.ctaBtn}
          onClick={() => {
            alert("Booking confirmed! Check your email for confirmation.");
            closeDrawer();
          }}
        >
          Confirm Booking ✓
        </button>
      </div>
    </div>
  );

  // ============ MAIN RENDER ============

  return (
    <>
      {/* Quick Booking Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        style={styles.quickBookingBtn}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(255, 106, 46, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(255, 106, 46, 0.3)";
        }}
      >
        ⚡ Quick Booking
      </button>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          style={{
            ...styles.overlay,
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div
          style={{
            ...styles.drawer(isMobile),
            animation: isMobile ? "slideUp 0.3s ease-out" : "slideIn 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div style={styles.drawerHeader}>
            <div style={styles.drawerTitleRow}>
              {step !== "service" && (
                <button
                  onClick={handleBackStep}
                  style={styles.backBtn}
                  title="Go back"
                >
                  <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
                </button>
              )}
              <h2 style={styles.drawerTitle}>
                {step === "service" && "Quick Booking"}
                {step === "form" && "Service Details"}
                {step === "review" && "Review"}
                {step === "results" && "Results"}
                {step === "checkout" && "Checkout"}
              </h2>
            </div>

            {/* Progress Indicator */}
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${
                    step === "service"
                      ? "20%"
                      : step === "form"
                      ? "40%"
                      : step === "review"
                      ? "60%"
                      : step === "results"
                      ? "80%"
                      : "100%"
                  }`,
                }}
              />
            </div>

            <button
              onClick={closeDrawer}
              style={styles.closeBtn}
              title="Close"
            >
              <XMarkIcon style={{ width: "24px", height: "24px" }} />
            </button>
          </div>

          {/* Content */}
          <div style={styles.drawerContent}>
            {step === "service" && renderServiceSelection()}
            {step === "form" && renderForm()}
            {step === "review" && renderReview()}
            {step === "results" && renderResults()}
            {step === "checkout" && renderCheckout()}
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

/* ------ Field Wrapper ------ */

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1rem", flex: 1 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

/* ------ Grid Wrapper ------ */

function Grid({ children }) {
  return <div style={styles.grid}>{children}</div>;
}

/* ------ STYLES ------ */

const styles = {
  quickBookingBtn: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    padding: "1rem 1.5rem",
    backgroundColor: "#ff6a2e",
    color: "white",
    border: "none",
    borderRadius: "2rem",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(255, 106, 46, 0.3)",
    transition: "all 0.3s ease",
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
    backdropFilter: "blur(4px)",
  },

  drawer: (isMobile) => ({
    position: "fixed",
    ...(isMobile
      ? {
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "85vh",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }
      : {
          right: 0,
          top: 0,
          bottom: 0,
          width: "90%",
          maxWidth: "500px",
          borderRadius: 0,
        }),
    backgroundColor: "white",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
    zIndex: 51,
    display: "flex",
    flexDirection: "column",
  }),

  drawerHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  drawerTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    justifyContent: "space-between",
  },

  backBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    color: "#667eea",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.5rem",
  },

  drawerTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    flex: 1,
  },

  closeBtn: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  progressBar: {
    width: "100%",
    height: "4px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    transition: "width 0.3s ease",
  },

  drawerContent: {
    flex: 1,
    overflowY: "auto",
    padding: "1.5rem",
  },

  stepContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  stepHeader: {
    marginBottom: "1.5rem",
  },

  stepTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 0.5rem 0",
  },

  stepDesc: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: 0,
  },

  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
  },

  serviceCard: {
    padding: "1.5rem",
    border: "2px solid #e2e8f0",
    borderRadius: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "0.75rem",
    backgroundColor: "#f8fafc",
    position: "relative",
  },

  serviceEmoji: {
    fontSize: "2.5rem",
  },

  serviceTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },

  serviceDesc: {
    fontSize: "0.85rem",
    color: "#64748b",
    margin: 0,
  },

  serviceArrow: {
    fontSize: "1.5rem",
    color: "#667eea",
    marginTop: "0.5rem",
  },

  reviewCard: {
    backgroundColor: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
  },

  reviewRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },

  reviewRow_last: {
    borderBottom: "none",
  },

  reviewLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b",
  },

  reviewValue: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#1e293b",
  },

  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  resultCard: {
    padding: "1.25rem",
    border: "1px solid #e2e8f0",
    borderRadius: "0.75rem",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },

  resultName: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },

  resultMeta: {
    fontSize: "0.85rem",
    color: "#64748b",
    margin: "0.3rem 0 0 0",
  },

  resultRating: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  checkoutCard: {
    backgroundColor: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid #e2e8f0",
  },

  checkoutDivider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "1rem 0",
  },

  checkoutFeature: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.9rem",
    color: "#475569",
    marginBottom: "0.75rem",
  },

  formActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e2e8f0",
  },

  primaryBtn: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  secondaryBtn: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#e2e8f0",
    color: "#475569",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  ctaBtn: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#ff6a2e",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  grid: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#334155",
    fontSize: "0.9rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "2px solid #e5e7eb",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },

  cuisineWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },

  cuisineItem: {
    padding: "0.45rem 0.85rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  subRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    marginTop: "0.5rem",
    color: "#475569",
  },
};