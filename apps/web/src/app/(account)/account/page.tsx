'use client';

export default function AccountPage() {
  const stats = [
    { label: "Upcoming Events", value: "3", icon: "📅", color: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Total Orders", value: "12", icon: "📦", color: "bg-purple-50", textColor: "text-purple-600" },
    { label: "Saved Caterers", value: "8", icon: "❤️", color: "bg-red-50", textColor: "text-red-600" },
    { label: "Messages", value: "5", icon: "💬", color: "bg-green-50", textColor: "text-green-600" },
  ]

  const recentOrders = [
    { id: "#ORD-001", caterer: "Royal Bites", event: "Wedding", date: "Jun 21", status: "Confirmed", statusColor: "green" },
    { id: "#ORD-002", caterer: "Spice Kitchen", event: "Corporate", date: "Jun 15", status: "Delivered", statusColor: "blue" },
    { id: "#ORD-003", caterer: "Sweet Dreams", event: "Birthday", date: "Jun 10", status: "Pending", statusColor: "yellow" },
  ]

  const recommendations = [
    { name: "Royal Bites", rating: 4.9, reviews: 127, image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop", cuisine: "Indian" },
    { name: "Spice Kitchen", rating: 4.8, reviews: 98, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", cuisine: "Asian" },
    { name: "Sweet Dreams", rating: 4.7, reviews: 85, image: "https://images.unsplash.com/photo-1555939594-58d7cb561e1f?w=400&h=300&fit=crop", cuisine: "Desserts" },
    { name: "Garden Bistro", rating: 4.6, reviews: 112, image: "https://images.unsplash.com/photo-1504674900152-b8886b8100d0?w=400&h=300&fit=crop", cuisine: "Continental" },
  ]

  return (
    <>
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
                alt={caterer.name}
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
                          if (order.statusColor === "green") {
                            return {
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                            };
                          } else if (order.statusColor === "blue") {
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

        {/* Bottom padding for scroll space */}
        <div style={{ height: "24px" }} />
      </div>
    </>
  )
}