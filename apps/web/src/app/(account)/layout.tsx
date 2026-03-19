"use client"

import { useState } from "react"
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CreditCardIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  SparklesIcon,
  Bars3Icon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline"

export default function AccountDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menu = [
    { name: "Dashboard", icon: HomeIcon, color: "from-blue-500 to-cyan-500" },
    { name: "My Orders", icon: ClipboardDocumentListIcon, color: "from-purple-500 to-pink-500" },
    { name: "Saved Caterers", icon: HeartIcon, color: "from-red-500 to-orange-500" },
    { name: "Event Planner", icon: CalendarDaysIcon, color: "from-green-500 to-emerald-500" },
    { name: "Messages", icon: ChatBubbleLeftRightIcon, color: "from-yellow-500 to-amber-500" },
    { name: "Reviews", icon: StarIcon, color: "from-indigo-500 to-purple-500" },
    { name: "Payments", icon: CreditCardIcon, color: "from-cyan-500 to-blue-500" },
    { name: "Profile", icon: UserCircleIcon, color: "from-pink-500 to-rose-500" },
  ]

  const stats = [
    { label: "Upcoming Events", value: "3", icon: "📅", color: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Total Orders", value: "12", icon: "📦", color: "bg-purple-50", textColor: "text-purple-600" },
    { label: "Saved Caterers", value: "8", icon: "❤️", color: "bg-red-50", textColor: "text-red-600" },
    { label: "Messages", value: "5", icon: "💬", color: "bg-green-50", textColor: "text-green-600" },
  ]

  const recentOrders = [
    { id: "#ORD-001", caterer: "Royal Bites", event: "Wedding", date: "Jun 21", status: "Confirmed", statusColor: "bg-green-100 text-green-800" },
    { id: "#ORD-002", caterer: "Spice Kitchen", event: "Corporate", date: "Jun 15", status: "Delivered", statusColor: "bg-blue-100 text-blue-800" },
    { id: "#ORD-003", caterer: "Sweet Dreams", event: "Birthday", date: "Jun 10", status: "Pending", statusColor: "bg-yellow-100 text-yellow-800" },
  ]

  const recommendations = [
    { name: "Royal Bites", rating: 4.9, reviews: 127, image: "https://images.unsplash.com/photo-1555244162-803834f70033", cuisine: "Indian" },
    { name: "Spice Kitchen", rating: 4.8, reviews: 98, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", cuisine: "Asian" },
    { name: "Sweet Dreams", rating: 4.7, reviews: 85, image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f", cuisine: "Desserts" },
    { name: "Garden Bistro", rating: 4.6, reviews: 112, image: "https://images.unsplash.com/photo-1504674900152-b8886b8100d0", cuisine: "Continental" },
  ]

  // Breadcrumb paths
  const breadcrumbs = {
    "Dashboard": ["Home"],
    "My Orders": ["Home", "Orders"],
    "Saved Caterers": ["Home", "Saved"],
    "Event Planner": ["Home", "Events"],
    "Messages": ["Home", "Messages"],
    "Reviews": ["Home", "Reviews"],
    "Payments": ["Home", "Payments"],
    "Profile": ["Home", "Settings"],
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8fafc" }}>
      {/* SIDEBAR - Fixed Height No Scroll */}
      <aside
        style={{
          width: sidebarOpen ? "280px" : "80px",
          backgroundColor: "white",
          borderRight: "1px solid #e2e8f0",
          padding: "24px 16px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
          position: "relative",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Logo & Brand */}
        <div style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          gap: "10px",
          paddingBottom: "16px",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            flexShrink: 0,
          }}>
            🍽️
          </div>
          {sidebarOpen && (
            <div>
              <h1 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1e293b",
                margin: 0,
                whiteSpace: "nowrap",
              }}>
                CateringHub
              </h1>
              <p style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: "2px 0 0 0",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}>
                Your Events
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "#94a3b8",
              display: sidebarOpen ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#667eea";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Navigation Menu - Fixed Height */}
        <nav style={{
          flex: 1,
          overflow: "hidden",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                gap: "12px",
                padding: sidebarOpen ? "10px 12px" : "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeMenu === item.name ? "#f0f4ff" : "transparent",
                borderLeft: activeMenu === item.name ? "4px solid #667eea" : "4px solid transparent",
                transition: "all 0.2s ease",
                paddingLeft: activeMenu === item.name ? (sidebarOpen ? "8px" : "10px") : sidebarOpen ? "12px" : "10px",
                position: "relative",
                minHeight: "40px",
                fontSize: "14px",
              }}
              title={!sidebarOpen ? item.name : undefined}
              onMouseEnter={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <item.icon style={{
                width: "18px",
                height: "18px",
                color: activeMenu === item.name ? "#667eea" : "#94a3b8",
                transition: "color 0.2s ease",
                flexShrink: 0,
              }} />
              {sidebarOpen && (
                <>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: activeMenu === item.name ? "600" : "500",
                    color: activeMenu === item.name ? "#667eea" : "#475569",
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                  }}>
                    {item.name}
                  </span>
                  {activeMenu === item.name && (
                    <ChevronRightIcon style={{
                      width: "14px",
                      height: "14px",
                      marginLeft: "auto",
                      color: "#667eea",
                      flexShrink: 0,
                    }} />
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Help Card */}
        <div style={{
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "10px",
          padding: sidebarOpen ? "14px" : "10px",
          color: "white",
          marginBottom: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: sidebarOpen ? "flex-start" : "center",
          transition: "all 0.3s ease",
          flexShrink: 0,
        }}>
          {sidebarOpen ? (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}>
                <SparklesIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", fontWeight: "700", margin: 0 }}>
                  Need Help?
                </p>
              </div>
              <p style={{
                fontSize: "11px",
                opacity: 0.9,
                margin: 0,
                lineHeight: "1.4",
                marginBottom: "10px",
              }}>
                24/7 Support Available
              </p>
              <button style={{
                width: "100%",
                padding: "6px 10px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
              >
                Contact Support
              </button>
            </>
          ) : (
            <SparklesIcon style={{ width: "20px", height: "20px", flexShrink: 0 }} title="Need Help?" />
          )}
        </div>

        {/* Logout */}
        <button style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "flex-start" : "center",
          gap: "12px",
          padding: sidebarOpen ? "10px 12px" : "10px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontSize: "13px",
          fontWeight: "500",
          color: "#64748b",
          minHeight: "40px",
          flexShrink: 0,
        }}
        title={!sidebarOpen ? "Sign Out" : undefined}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#fee2e2";
          e.currentTarget.style.color = "#dc2626";
          e.currentTarget.style.borderColor = "#fca5a5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#f8fafc";
          e.currentTarget.style.color = "#64748b";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }}
        >
          <ArrowLeftOnRectangleIcon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          {sidebarOpen && "Sign Out"}
        </button>
      </aside>

      {/* MAIN CONTENT - No Scroll */}
      <main style={{
        flex: 1,
        overflow: "hidden",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
        {/* TOP BAR WITH BREADCRUMBS */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          gap: "24px",
          flexShrink: 0,
        }}>
          {/* Left: Breadcrumbs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: 1,
          }}>
            {breadcrumbs[activeMenu]?.map((crumb, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: idx === breadcrumbs[activeMenu].length - 1 ? "#667eea" : "#94a3b8",
                  fontSize: "13px",
                  fontWeight: idx === breadcrumbs[activeMenu].length - 1 ? "600" : "500",
                  transition: "all 0.2s ease",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => {
                  if (idx !== breadcrumbs[activeMenu].length - 1) {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                    e.currentTarget.style.color = "#667eea";
                  }
                }}
                onMouseLeave={(e) => {
                  if (idx !== breadcrumbs[activeMenu].length - 1) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
                >
                  {crumb}
                </button>
                {idx < breadcrumbs[activeMenu].length - 1 && (
                  <ChevronRightIcon style={{ width: "16px", height: "16px", color: "#cbd5e1" }} />
                )}
              </div>
            ))}
          </div>

          {/* Center: Current Page Title */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}>
            <span style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
              textTransform: "capitalize",
            }}>
              {activeMenu}
            </span>
          </div>

          {/* Right: Search & Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
            justifyContent: "flex-end",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "10px",
              paddingLeft: "14px",
              paddingRight: "14px",
              width: "100%",
              maxWidth: "280px",
              backgroundColor: "white",
              border: "2px solid #e2e8f0",
              transition: "all 0.2s ease",
              height: "40px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#667eea";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
            >
              <MagnifyingGlassIcon style={{ width: "18px", height: "18px", color: "#94a3b8" }} />
              <input
                placeholder="Search..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "13px",
                  color: "#1e293b",
                }}
              />
            </div>

            <button style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            >
              <BellIcon style={{ width: "20px", height: "20px", color: "#64748b" }} />
              <span style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                border: "1.5px solid white",
              }} />
            </button>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingLeft: "12px",
              paddingRight: "12px",
              height: "40px",
              backgroundColor: "white",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              <img
                src="https://i.pravatar.cc/40"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "2px solid #e2e8f0",
                }}
              />
              <span style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "#1e293b",
              }}>
                John
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT AREA - NOT Scrollable */}
        <div style={{
          flex: 1,
          paddingRight: "0px",
        }}>
          {/* HEADER SECTION */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}>
            <div>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 6px 0",
              }}>
                Hi John 👋
              </h2>
              <p style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
              }}>
                Plan your next amazing event with our top caterers
              </p>
            </div>

            <div style={{
              display: "flex",
              gap: "10px",
              flexShrink: 0,
            }}>
              <button style={{
                backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
              >
                Book Caterer
              </button>

              <button style={{
                backgroundColor: "white",
                color: "#667eea",
                border: "2px solid #667eea",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
              >
                Create Event
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}>
                  <span style={{ fontSize: "24px" }}>{stat.icon}</span>
                  <span style={{
                    display: "inline-block",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}>
                    {stat.value}
                  </span>
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "500",
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* RECOMMENDED CATERERS */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}>
              ⭐ Recommended Caterers
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "14px",
            }}>
              {recommendations.map((caterer, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <img
                    src={caterer.image}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <h4 style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#1e293b",
                      margin: "0 0 6px 0",
                    }}>
                      {caterer.name}
                    </h4>
                    <p style={{
                      fontSize: "11px",
                      color: "#64748b",
                      margin: "0 0 8px 0",
                    }}>
                      {caterer.cuisine}
                    </p>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#f59e0b",
                      }}>
                        ⭐ {caterer.rating}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                      }}>
                        ({caterer.reviews})
                      </span>
                    </div>
                    <button style={{
                      width: "100%",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#764ba2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#667eea";
                    }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}>
              📋 Recent Orders
            </h3>

            <div style={{
              backgroundColor: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{
                overflowX: "auto",
              }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "500px",
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}>
                      <th style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        Order ID
                      </th>
                      <th style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        Caterer
                      </th>
                      <th style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        Event
                      </th>
                      <th style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: idx < recentOrders.length - 1 ? "1px solid #e2e8f0" : "none",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <td style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}>
                          {order.id}
                        </td>
                        <td style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          {order.caterer}
                        </td>
                        <td style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          {order.event}
                        </td>
                        <td style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#475569",
                        }}>
                          {order.date}
                        </td>
                        <td style={{
                          padding: "12px 16px",
                        }}>
                          <span style={{
                            display: "inline-block",
                            paddingTop: "3px",
                            paddingBottom: "3px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            fontWeight: "600",
                            ...(() => {
                              if (order.statusColor.includes("green")) {
                                return {
                                  backgroundColor: "#dcfce7",
                                  color: "#15803d",
                                };
                              } else if (order.statusColor.includes("blue")) {
                                return {
                                  backgroundColor: "#dbeafe",
                                  color: "#0369a1",
                                };
                              } else {
                                return {
                                  backgroundColor: "#fef3c7",
                                  color: "#92400e",
                                };
                              }
                            })(),
                          }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}