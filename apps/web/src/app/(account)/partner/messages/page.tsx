'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Archive,
  Pin,
  X,
  Clock,
  CheckCheck,
  Check,
  Phone,
  MapPin,
  Wifi,
  Shield,
  AlertCircle,
  FileText,
  Download,
  Copy,
  ChevronDown,
  Star,
} from 'lucide-react';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(null);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'The Grand Banquet Hall',
      type: 'business',
      avatar: '🏛️',
      lastMessage: 'Your event is confirmed for March 30th. Please find the venue details below.',
      timestamp: '2 hours ago',
      unread: 2,
      isPinned: true,
      messages: [
        {
          id: 1,
          sender: 'business',
          text: 'Thank you for booking with us! Your event is confirmed for March 30th, 2026.',
          timestamp: '2 hours ago',
          read: true,
        },
        {
          id: 2,
          sender: 'business',
          type: 'template',
          templateType: 'venue_details',
          content: {
            address: '123 Grand Avenue, New York, NY 10001',
            parking: 'Free parking available for 50+ vehicles',
            wifi: 'Password: GrandBanquet2026',
            security: 'Security staff available 24/7',
            checkInTime: '3:00 PM',
            setupTime: '3:00 PM - 5:00 PM',
          },
          timestamp: '1 hour ago',
          read: true,
        },
        {
          id: 3,
          sender: 'business',
          text: 'Please let us know if you need any additional information or have any questions.',
          timestamp: '1 hour ago',
          read: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Chef Maria\'s Catering',
      type: 'business',
      avatar: '👨‍🍳',
      lastMessage: 'Menu confirmation: Please select your final menu by March 25th',
      timestamp: '5 hours ago',
      unread: 1,
      isPinned: false,
      messages: [
        {
          id: 1,
          sender: 'business',
          type: 'template',
          templateType: 'menu_confirmation',
          content: {
            eventDate: 'March 30, 2026',
            guestCount: 150,
            menuOptions: ['Italian Pasta Station', 'Mediterranean Mezze', 'Classic BBQ'],
            deadline: 'March 25, 2026',
            notes: 'Please confirm your final menu selection',
          },
          timestamp: '5 hours ago',
          read: true,
        },
      ],
    },
    {
      id: 3,
      name: 'Elegant Florist',
      type: 'business',
      avatar: '💐',
      lastMessage: 'Your flower arrangements are ready for collection',
      timestamp: '1 day ago',
      unread: 0,
      isPinned: false,
      messages: [
        {
          id: 1,
          sender: 'business',
          text: 'Hi! Your flower arrangements are ready for collection on March 28th.',
          timestamp: '1 day ago',
          read: true,
        },
        {
          id: 2,
          sender: 'user',
          text: 'Perfect! I\'ll arrange to pick them up. Thank you so much!',
          timestamp: '22 hours ago',
          read: true,
        },
      ],
    },
  ]);

  const [templates] = useState([
    {
      id: 'venue_details',
      name: 'Venue Details & Directions',
      category: 'venue',
      fields: ['Address', 'Parking', 'WiFi Password', 'Security Info', 'Check-in Time', 'Setup Time'],
      description: 'Share complete venue information with guests',
    },
    {
      id: 'menu_confirmation',
      name: 'Menu Confirmation',
      category: 'catering',
      fields: ['Event Date', 'Guest Count', 'Menu Options', 'Deadline', 'Special Notes'],
      description: 'Confirm menu selections with caterer',
    },
    {
      id: 'event_instructions',
      name: 'Event Instructions',
      category: 'general',
      fields: ['Start Time', 'Location', 'Dress Code', 'Parking Info', 'Contact Number'],
      description: 'Send event day instructions to guests',
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      category: 'payment',
      fields: ['Amount Due', 'Due Date', 'Payment Methods', 'Reference Number'],
      description: 'Remind customer about pending payments',
    },
    {
      id: 'booking_confirmation',
      name: 'Booking Confirmation',
      category: 'booking',
      fields: ['Event Date', 'Service Type', 'Confirmation Number', 'Special Requirements'],
      description: 'Confirm booking details with customer',
    },
    {
      id: 'delivery_instructions',
      name: 'Delivery Instructions',
      category: 'delivery',
      fields: ['Delivery Date & Time', 'Address', 'Contact Person', 'Special Instructions', 'Delivery Cost'],
      description: 'Provide delivery details to customer',
    },
  ]);

  const selectedConversation = conversations.find((c) => c.id === activeConversation);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'unread' && conv.unread > 0) || (filterType === 'pinned' && conv.isPinned);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageText.trim() && activeConversation) {
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: conv.messages.length + 1,
                sender: 'user',
                text: messageText,
                timestamp: 'now',
                read: false,
              },
            ],
            lastMessage: messageText,
            timestamp: 'now',
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      setMessageText('');
    }
  };

  const togglePin = (convId) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === convId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  const deleteConversation = (convId) => {
    setConversations(conversations.filter((conv) => conv.id !== convId));
    if (activeConversation === convId) {
      setActiveConversation(null);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    if (message.type === 'template') {
      return (
        <div style={{
          ...styles.messageBubble,
          ...(isUser ? styles.userBubble : styles.businessBubble),
        }}>
          {message.templateType === 'venue_details' && (
            <div style={styles.templateCard}>
              <div style={styles.templateHeader}>
                <MapPin size={18} />
                <span style={styles.templateTitle}>Venue Details & Directions</span>
              </div>
              <div style={styles.templateContent}>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>📍 Address</span>
                  <span style={styles.templateValue}>{message.content.address}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>🅿️ Parking</span>
                  <span style={styles.templateValue}>{message.content.parking}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>📶 WiFi</span>
                  <span style={styles.templateValue}>Password: {message.content.wifi}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>🛡️ Security</span>
                  <span style={styles.templateValue}>{message.content.security}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>⏰ Check-in Time</span>
                  <span style={styles.templateValue}>{message.content.checkInTime}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>🔧 Setup Time</span>
                  <span style={styles.templateValue}>{message.content.setupTime}</span>
                </div>
              </div>
            </div>
          )}
          {message.templateType === 'menu_confirmation' && (
            <div style={styles.templateCard}>
              <div style={styles.templateHeader}>
                <FileText size={18} />
                <span style={styles.templateTitle}>Menu Confirmation</span>
              </div>
              <div style={styles.templateContent}>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>📅 Event Date</span>
                  <span style={styles.templateValue}>{message.content.eventDate}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>👥 Guest Count</span>
                  <span style={styles.templateValue}>{message.content.guestCount}</span>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>🍽️ Menu Options</span>
                  <div style={styles.menuList}>
                    {message.content.menuOptions.map((option, idx) => (
                      <div key={idx} style={styles.menuItem}>✓ {option}</div>
                    ))}
                  </div>
                </div>
                <div style={styles.templateField}>
                  <span style={styles.templateLabel}>⏳ Deadline</span>
                  <span style={styles.templateValue}>{message.content.deadline}</span>
                </div>
              </div>
            </div>
          )}
          <p style={styles.messageTime}>{message.timestamp}</p>
        </div>
      );
    }

    return (
      <div style={{
        ...styles.messageBubble,
        ...(isUser ? styles.userBubble : styles.businessBubble),
      }}>
        <p style={styles.messageText}>{message.text}</p>
        <p style={styles.messageTime}>{message.timestamp}</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Sidebar - Conversations List */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h1 style={styles.sidebarTitle}>Messages</h1>
            <button style={styles.newMessageBtn}>
              <MessageCircle size={18} />
            </button>
          </div>

          <div style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterContainer}>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="pinned">Pinned</option>
            </select>
          </div>

          <div style={styles.conversationsList}>
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                style={{
                  ...styles.conversationItem,
                  ...(activeConversation === conv.id && styles.conversationItemActive),
                }}
              >
                <div style={styles.conversationAvatar}>{conv.avatar}</div>
                <div style={styles.conversationInfo}>
                  <div style={styles.conversationHeader}>
                    <p style={styles.conversationName}>
                      {conv.name}
                      {conv.isPinned && <Pin size={12} style={styles.pinIcon} />}
                    </p>
                    <p style={styles.conversationTime}>{conv.timestamp}</p>
                  </div>
                  <p style={styles.conversationPreview}>{conv.lastMessage.substring(0, 50)}...</p>
                </div>
                {conv.unread > 0 && <span style={styles.unreadBadge}>{conv.unread}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div style={styles.mainContent}>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderInfo}>
                <span style={styles.chatAvatar}>{selectedConversation.avatar}</span>
                <div>
                  <p style={styles.chatName}>{selectedConversation.name}</p>
                  <p style={styles.chatType}>{selectedConversation.type === 'business' ? 'Business Account' : 'User'}</p>
                </div>
              </div>
              <div style={styles.chatHeaderActions}>
                <button style={styles.headerActionBtn}>
                  <Phone size={18} />
                </button>
                <button
                  onClick={() => togglePin(selectedConversation.id)}
                  style={styles.headerActionBtn}
                >
                  <Pin size={18} />
                </button>
                <div style={styles.moreOptionsContainer}>
                  <button
                    onClick={() => setShowMoreOptions(showMoreOptions ? null : selectedConversation.id)}
                    style={styles.headerActionBtn}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {showMoreOptions === selectedConversation.id && (
                    <div style={styles.dropdownMenu}>
                      <button style={styles.dropdownItem}>
                        <Archive size={16} /> Archive
                      </button>
                      <button style={styles.dropdownItem}>
                        <Download size={16} /> Export
                      </button>
                      <button
                        onClick={() => {
                          deleteConversation(selectedConversation.id);
                          setShowMoreOptions(null);
                        }}
                        style={{ ...styles.dropdownItem, color: '#dc2626' }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.messagesArea}>
              {selectedConversation.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
              <div style={styles.inputContainer}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  style={styles.textInput}
                />
                <button
                  onClick={() => setShowTemplateModal(true)}
                  style={styles.templateBtn}
                  title="Use message template"
                >
                  <FileText size={18} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  style={{
                    ...styles.sendBtn,
                    opacity: messageText.trim() ? 1 : 0.5,
                    cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <MessageCircle size={48} style={styles.emptyIcon} />
            <h2 style={styles.emptyTitle}>No conversation selected</h2>
            <p style={styles.emptyText}>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Message Templates</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <p style={styles.modalDescription}>
              Select a template to send a formatted message to the business or customer.
            </p>
            <div style={styles.templatesGrid}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setShowTemplateModal(false);
                    setMessageText(`[Template: ${template.name}]\n\n`);
                  }}
                  style={styles.templateCard}
                >
                  <p style={styles.templateCardTitle}>{template.name}</p>
                  <p style={styles.templateCardDescription}>{template.description}</p>
                  <div style={styles.templateCardFields}>
                    {template.fields.map((field, idx) => (
                      <span key={idx} style={styles.templateCardField}>
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '24px',
    height: 'calc(100vh - 48px)',
  },
  sidebar: {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  newMessageBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  searchContainer: {
    position: 'relative',
    padding: '12px 16px',
  },
  searchIcon: {
    position: 'absolute',
    left: '24px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '36px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterContainer: {
    padding: '0 16px 12px 16px',
  },
  filterSelect: {
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  conversationsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  },
  conversationItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '4px',
    alignItems: 'flex-start',
  },
  conversationItemActive: {
    backgroundColor: '#eff6ff',
  },
  conversationAvatar: {
    fontSize: '28px',
    minWidth: '40px',
    textAlign: 'center',
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  conversationName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  pinIcon: {
    color: '#fbbf24',
  },
  conversationTime: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  conversationPreview: {
    fontSize: '12px',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  unreadBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  chatHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatAvatar: {
    fontSize: '32px',
  },
  chatName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  chatType: {
    fontSize: '12px',
    color: '#6b7280',
  },
  chatHeaderActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
  },
  headerActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  moreOptionsContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    zIndex: 10,
    minWidth: '160px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.2s',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#ffffff',
  },
  messageBubble: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '65%',
    padding: '12px 16px',
    borderRadius: '12px',
    wordWrap: 'break-word',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  businessBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  messageTime: {
    margin: 0,
    fontSize: '11px',
    opacity: 0.7,
  },
  templateCard: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #dcfce7',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  templateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: '#166534',
  },
  templateTitle: {
    fontSize: '14px',
    fontWeight: '700',
  },
  templateContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  templateField: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  templateLabel: {
    fontWeight: '600',
    color: '#374151',
  },
  templateValue: {
    color: '#111827',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  menuItem: {
    fontSize: '13px',
    color: '#111827',
  },
  inputArea: {
    padding: '16px 20px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'none',
    maxHeight: '100px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  templateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sendBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  emptyIcon: {
    color: '#d1d5db',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  emptyText: {
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%',
    padding: '32px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  templateCard: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  templateCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  templateCardDescription: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '12px',
  },
  templateCardFields: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  templateCardField: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
};