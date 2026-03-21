'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Trash2,
  Edit,
  Plus,
  Check,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ChevronDown,
  Calendar,
  DollarSign,
  Lock,
  Smartphone,
  Wallet,
  Search,
  Download,
  QrCode,
} from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  maxWidth: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#111827',
  },
  pageSubtitle: {
    color: '#4b5563',
    marginTop: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: '13px',
    color: '#4b5563',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '4px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    paddingTop: '16px',
    paddingBottom: '16px',
    fontWeight: '600',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderBottom: '3px solid #1d4ed8',
  },
  tabInactive: {
    backgroundColor: '#f9fafb',
    color: '#4b5563',
    borderBottom: '3px solid transparent',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
  },
  cardBoxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  cardBrandSection: {
    display: 'flex',
    gap: '12px',
  },
  cardBrandEmoji: {
    fontSize: '32px',
  },
  cardBrandName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  cardMasked: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
    letterSpacing: '2px',
  },
  cardBoxActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  defaultBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  inactiveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  cardBoxContent: {
    marginBottom: '16px',
  },
  cardInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  cardInfoLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#4b5563',
    textTransform: 'uppercase',
    margin: '0 0 4px 0',
  },
  cardInfoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  cardBoxFooter: {
    display: 'flex',
    gap: '8px',
  },
  buttonSmallEdit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSmallSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSmallDelete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
  },
  methodsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  methodCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  methodIcon: {
    width: '56px',
    height: '56px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4b5563',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  methodDetails: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '4px 0 0 0',
  },
  methodDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '4px 0 0 0',
  },
  methodActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '200px',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  filterContainer: {
    position: 'relative',
  },
  filterSelect: {
    paddingLeft: '12px',
    paddingRight: '32px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
  },
  filterIcon: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionService: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  transactionDate: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  transactionAmount: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  transactionMethod: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  transactionStatus: {
    marginLeft: '16px',
  },
  statusBadge: {
    display: 'inline-block',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
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
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '512px',
    width: '100%',
    padding: '32px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  modalDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  closeButton: {
    backgroundColor: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  buttonPrimary: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    paddingTop: '10px',
    paddingBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    flex: 1,
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
  },
  inputHint: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '6px',
    margin: '6px 0 0 0',
  },
  securityInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '24px',
    fontSize: '13px',
    color: '#0c4a6e',
  },
};

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false);
  const [visibleCardId, setVisibleCardId] = useState(null);

  const [savedCards, setSavedCards] = useState([
    {
      id: 'CARD-001',
      cardNumber: '4532123456789010',
      cardholderName: 'John Doe',
      expiryDate: '12/26',
      cvv: '123',
      cardBrand: 'Visa',
      last4: '9010',
      isDefault: true,
      isActive: true,
      addedDate: '2025-06-15',
      expiresDate: '2026-12-31',
    },
    {
      id: 'CARD-002',
      cardNumber: '5425233010103010',
      cardholderName: 'John Doe',
      expiryDate: '08/27',
      cvv: '456',
      cardBrand: 'Mastercard',
      last4: '3010',
      isDefault: false,
      isActive: true,
      addedDate: '2025-03-10',
      expiresDate: '2027-08-31',
    },
    {
      id: 'CARD-003',
      cardNumber: '378282246310005',
      cardholderName: 'John Doe',
      expiryDate: '03/25',
      cvv: '789',
      cardBrand: 'American Express',
      last4: '0005',
      isDefault: false,
      isActive: false,
      addedDate: '2024-12-20',
      expiresDate: '2025-03-31',
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'PM-001',
      type: 'wallet',
      name: 'Digital Wallet',
      details: 'PayPal',
      isActive: true,
      isDefault: false,
      addedDate: '2026-01-05',
    },
    {
      id: 'PM-002',
      type: 'bank',
      name: 'Bank Transfer',
      details: 'Chase Bank - ****5678',
      isActive: true,
      isDefault: false,
      addedDate: '2025-11-12',
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-001',
      orderId: 'ORD-001',
      serviceName: 'Bella Italia',
      amount: 45.99,
      paymentMethod: 'Visa ****9010',
      date: '2026-03-16',
      status: 'completed',
      type: 'charge',
    },
    {
      id: 'TXN-002',
      orderId: 'ORD-002',
      serviceName: 'Dragon Palace',
      amount: 62.50,
      paymentMethod: 'Mastercard ****3010',
      date: '2026-03-18',
      status: 'completed',
      type: 'charge',
    },
    {
      id: 'TXN-003',
      orderId: 'ORD-003',
      serviceName: 'Burger Bliss',
      amount: 38.75,
      paymentMethod: 'Visa ****9010',
      date: '2026-03-20',
      status: 'pending',
      type: 'charge',
    },
    {
      id: 'TXN-004',
      orderId: 'ORD-004',
      serviceName: 'Grand Ballroom',
      amount: 78.99,
      paymentMethod: 'Visa ****9010',
      date: '2026-03-10',
      status: 'completed',
      type: 'charge',
    },
    {
      id: 'TXN-005',
      orderId: 'REFUND-001',
      serviceName: 'Pizza Paradise',
      amount: -52.00,
      paymentMethod: 'Visa ****9010',
      date: '2026-03-08',
      status: 'completed',
      type: 'refund',
    },
  ]);

  const [newCardData, setNewCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false,
  });

  const [editCardData, setEditCardData] = useState({
    cardholderName: '',
    isDefault: false,
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'wallet',
    details: '',
    upiId: '',
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || txn.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, transactions]);

  const handleAddCard = () => {
    if (
      newCardData.cardNumber &&
      newCardData.cardholderName &&
      newCardData.expiryDate &&
      newCardData.cvv
    ) {
      const cardBrand = getCardBrand(newCardData.cardNumber);
      const newCard = {
        id: `CARD-${Date.now()}`,
        cardNumber: newCardData.cardNumber,
        cardholderName: newCardData.cardholderName,
        expiryDate: newCardData.expiryDate,
        cvv: newCardData.cvv,
        cardBrand: cardBrand,
        last4: newCardData.cardNumber.slice(-4),
        isDefault: newCardData.isDefault,
        isActive: true,
        addedDate: new Date().toISOString().split('T')[0],
        expiresDate: calculateExpiryDate(newCardData.expiryDate),
      };

      if (newCardData.isDefault) {
        setSavedCards(
          savedCards.map((card) => ({
            ...card,
            isDefault: false,
          }))
        );
      }

      setSavedCards([...savedCards, newCard]);
      setShowAddCardModal(false);
      setNewCardData({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvv: '',
        isDefault: false,
      });
    }
  };

  const handleEditCard = () => {
    if (selectedCard) {
      setSavedCards(
        savedCards.map((card) =>
          card.id === selectedCard.id
            ? {
                ...card,
                cardholderName: editCardData.cardholderName,
                isDefault: editCardData.isDefault,
              }
            : editCardData.isDefault
            ? { ...card, isDefault: false }
            : card
        )
      );
      setSelectedCard(null);
      setShowEditModal(false);
      setEditCardData({ cardholderName: '', isDefault: false });
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      setSavedCards(savedCards.filter((card) => card.id !== selectedCard.id));
      setSelectedCard(null);
      setShowDeleteModal(false);
    }
  };

  const handleAddPaymentMethod = () => {
    let details = '';
    
    if (newPaymentMethod.type === 'upi' && newPaymentMethod.upiId) {
      details = newPaymentMethod.upiId;
    } else if (newPaymentMethod.details) {
      details = newPaymentMethod.details;
    } else {
      return;
    }

    setPaymentMethods([
      ...paymentMethods,
      {
        id: `PM-${Date.now()}`,
        type: newPaymentMethod.type,
        name:
          newPaymentMethod.type === 'wallet'
            ? 'Digital Wallet'
            : newPaymentMethod.type === 'upi'
            ? 'UPI'
            : 'Bank Transfer',
        details: details,
        isActive: true,
        isDefault: false,
        addedDate: new Date().toISOString().split('T')[0],
      },
    ]);
    setShowAddPaymentMethodModal(false);
    setNewPaymentMethod({ type: 'wallet', details: '', upiId: '' });
  };

  const handleSetDefault = (cardId) => {
    setSavedCards(
      savedCards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const handleToggleCardStatus = (cardId) => {
    setSavedCards(
      savedCards.map((card) =>
        card.id === cardId
          ? { ...card, isActive: !card.isActive }
          : card
      )
    );
  };

  const getCardBrand = (cardNumber) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    if (cardNumber.startsWith('6')) return 'Discover';
    return 'Card';
  };

  const calculateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    return `20${year}-${month}-28`;
  };

  const maskCardNumber = (cardNumber) => {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'Visa':
        return '💳';
      case 'Mastercard':
        return '💳';
      case 'American Express':
        return '💳';
      default:
        return '💳';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { color: '#10b981', bg: '#dcfce7', label: 'Completed' };
      case 'pending':
        return { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' };
      case 'failed':
        return { color: '#ef4444', bg: '#fee2e2', label: 'Failed' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', label: status };
    }
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'wallet':
        return <Smartphone size={24} />;
      case 'bank':
        return <Wallet size={24} />;
      case 'upi':
        return <QrCode size={24} />;
      default:
        return <Wallet size={24} />;
    }
  };

  const getPaymentMethodLabel = (type) => {
    switch (type) {
      case 'wallet':
        return 'Digital Wallet';
      case 'bank':
        return 'Bank Transfer';
      case 'upi':
        return 'UPI';
      default:
        return 'Payment Method';
    }
  };

  const totalSpent = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'charge')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalRefunded = useMemo(() => {
    return Math.abs(
      transactions
        .filter((t) => t.type === 'refund')
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }, [transactions]);

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Payment Methods</h1>
          <p style={styles.pageSubtitle}>Manage your payment options and transaction history</p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: '#eff6ff' }}>
              <DollarSign size={24} color="#0c4a6e" />
            </div>
            <div>
              <p style={styles.statLabel}>Total Spent</p>
              <p style={styles.statValue}>${totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
              <Wallet size={24} color="#166534" />
            </div>
            <div>
              <p style={styles.statLabel}>Total Refunded</p>
              <p style={styles.statValue}>${totalRefunded.toFixed(2)}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon} style={{ backgroundColor: '#f3e8ff' }}>
              <CreditCard size={24} color="#5b21b6" />
            </div>
            <div>
              <p style={styles.statLabel}>Saved Cards</p>
              <p style={styles.statValue}>{savedCards.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('cards')}
            style={{
              ...styles.tab,
              ...(activeTab === 'cards' ? styles.tabActive : styles.tabInactive),
            }}
          >
            <CreditCard size={18} />
            Saved Cards
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            style={{
              ...styles.tab,
              ...(activeTab === 'methods' ? styles.tabActive : styles.tabInactive),
            }}
          >
            <Wallet size={18} />
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              ...styles.tab,
              ...(activeTab === 'transactions' ? styles.tabActive : styles.tabInactive),
            }}
          >
            <DollarSign size={18} />
            Transactions
          </button>
        </div>

        {/* Saved Cards Tab */}
        {activeTab === 'cards' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Your Saved Cards</h2>
              <button
                onClick={() => setShowAddCardModal(true)}
                style={styles.buttonAdd}
              >
                <Plus size={18} />
                Add Card
              </button>
            </div>

            {savedCards.length > 0 ? (
              <div style={styles.cardsGrid}>
                {savedCards.map((card) => (
                  <div key={card.id} style={styles.cardBox}>
                    <div style={styles.cardBoxHeader}>
                      <div style={styles.cardBrandSection}>
                        <span style={styles.cardBrandEmoji}>{getCardIcon(card.cardBrand)}</span>
                        <div>
                          <p style={styles.cardBrandName}>{card.cardBrand}</p>
                          <p style={styles.cardMasked}>{maskCardNumber(card.cardNumber)}</p>
                        </div>
                      </div>
                      <div style={styles.cardBoxActions}>
                        {card.isDefault && (
                          <span style={styles.defaultBadge}>
                            <Check size={12} />
                            Default
                          </span>
                        )}
                        {!card.isActive && (
                          <span style={styles.inactiveBadge}>
                            <AlertCircle size={12} />
                            Expired
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardBoxContent}>
                      <div style={styles.cardInfo}>
                        <div>
                          <p style={styles.cardInfoLabel}>Cardholder</p>
                          <p style={styles.cardInfoValue}>{card.cardholderName}</p>
                        </div>
                        <div>
                          <p style={styles.cardInfoLabel}>Expires</p>
                          <p style={styles.cardInfoValue}>{card.expiryDate}</p>
                        </div>
                      </div>

                      <div style={styles.cardBoxFooter}>
                        <button
                          onClick={() => {
                            setSelectedCard(card);
                            setEditCardData({
                              cardholderName: card.cardholderName,
                              isDefault: card.isDefault,
                            });
                            setShowEditModal(true);
                          }}
                          style={styles.buttonSmallEdit}
                        >
                          <Edit size={16} />
                        </button>
                        {!card.isDefault && (
                          <button
                            onClick={() => handleSetDefault(card.id)}
                            style={styles.buttonSmallSecondary}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCard(card);
                            setShowDeleteModal(true);
                          }}
                          style={styles.buttonSmallDelete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <CreditCard size={48} style={styles.emptyIcon} />
                <h3 style={styles.emptyTitle}>No saved cards</h3>
                <p style={styles.emptyText}>Add a card to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Additional Payment Methods</h2>
              <button
                onClick={() => setShowAddPaymentMethodModal(true)}
                style={styles.buttonAdd}
              >
                <Plus size={18} />
                Add Method
              </button>
            </div>

            {paymentMethods.length > 0 ? (
              <div style={styles.methodsList}>
                {paymentMethods.map((method) => (
                  <div key={method.id} style={styles.methodCard}>
                    <div
                      style={{
                        ...styles.methodIcon,
                        backgroundColor:
                          method.type === 'upi' ? '#9333ea20' : '#f3f4f6',
                        color: method.type === 'upi' ? '#7c3aed' : '#4b5563',
                      }}
                    >
                      {getPaymentMethodIcon(method.type)}
                    </div>
                    <div style={styles.methodInfo}>
                      <p style={styles.methodName}>{getPaymentMethodLabel(method.type)}</p>
                      <p style={styles.methodDetails}>{method.details}</p>
                      <p style={styles.methodDate}>Added on {method.addedDate}</p>
                    </div>
                    <div style={styles.methodActions}>
                      {method.isActive && (
                        <span style={styles.activeBadge}>
                          <Check size={14} />
                          Active
                        </span>
                      )}
                      <button style={styles.buttonSmallDelete}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Wallet size={48} style={styles.emptyIcon} />
                <h3 style={styles.emptyTitle}>No payment methods</h3>
                <p style={styles.emptyText}>Add a payment method to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Transaction History</h2>
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search transactions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <Search size={18} style={styles.searchIcon} />
              </div>
              <div style={styles.filterContainer}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <ChevronDown size={18} style={styles.filterIcon} />
              </div>
            </div>

            {filteredTransactions.length > 0 ? (
              <div style={styles.transactionsList}>
                {filteredTransactions.map((txn) => (
                  <div key={txn.id} style={styles.transactionCard}>
                    <div style={styles.transactionInfo}>
                      <p style={styles.transactionService}>{txn.serviceName}</p>
                      <p style={styles.transactionDate}>{txn.date}</p>
                      <p style={styles.transactionAmount}>${txn.amount.toFixed(2)}</p>
                      <p style={styles.transactionMethod}>{txn.paymentMethod}</p>
                    </div>
                    <div style={styles.transactionStatus}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          color: getStatusBadge(txn.status).color,
                          backgroundColor: getStatusBadge(txn.status).bg,
                        }}
                      >
                        {getStatusBadge(txn.status).label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <DollarSign size={48} style={styles.emptyIcon} />
                <h3 style={styles.emptyTitle}>No transactions</h3>
                <p style={styles.emptyText}>No transactions found</p>
              </div>
            )}
          </div>
        )}

        {/* Add Card Modal */}
        {showAddCardModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add New Card</h2>
                <button
                  onClick={() => setShowAddCardModal(false)}
                  style={styles.closeButton}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  value={newCardData.cardNumber}
                  onChange={(e) =>
                    setNewCardData({
                      ...newCardData,
                      cardNumber: e.target.value.replace(/\s/g, ''),
                    })
                  }
                  style={styles.input}
                />
                <p style={styles.inputHint}>Your card details are encrypted and secure</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newCardData.cardholderName}
                  onChange={(e) =>
                    setNewCardData({
                      ...newCardData,
                      cardholderName: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={newCardData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setNewCardData({
                        ...newCardData,
                        expiryDate: value,
                      });
                    }}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="4"
                    value={newCardData.cvv}
                    onChange={(e) =>
                      setNewCardData({
                        ...newCardData,
                        cvv: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    style={styles.input}
                  />
                </div>
              </div>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newCardData.isDefault}
                  onChange={(e) =>
                    setNewCardData({
                      ...newCardData,
                      isDefault: e.target.checked,
                    })
                  }
                  style={styles.checkbox}
                />
                <span>Set as default payment method</span>
              </label>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowAddCardModal(false)}
                  style={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={
                    !newCardData.cardNumber ||
                    !newCardData.cardholderName ||
                    !newCardData.expiryDate ||
                    !newCardData.cvv
                  }
                  style={{
                    ...styles.buttonPrimary,
                    opacity:
                      !newCardData.cardNumber ||
                      !newCardData.cardholderName ||
                      !newCardData.expiryDate ||
                      !newCardData.cvv
                        ? 0.5
                        : 1,
                    cursor:
                      !newCardData.cardNumber ||
                      !newCardData.cardholderName ||
                      !newCardData.expiryDate ||
                      !newCardData.cvv
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  <Lock size={18} />
                  Add Card Securely
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Card Modal */}
        {showEditModal && selectedCard && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Edit Card</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={styles.closeButton}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={styles.modalDescription}>
                Card: {maskCardNumber(selectedCard.cardNumber)}
              </p>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Cardholder Name</label>
                <input
                  type="text"
                  value={editCardData.cardholderName}
                  onChange={(e) =>
                    setEditCardData({
                      ...editCardData,
                      cardholderName: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editCardData.isDefault}
                  onChange={(e) =>
                    setEditCardData({
                      ...editCardData,
                      isDefault: e.target.checked,
                    })
                  }
                  style={styles.checkbox}
                />
                <span>Set as default payment method</span>
              </label>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCard}
                  style={styles.buttonPrimary}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Card Modal */}
        {showDeleteModal && selectedCard && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Delete Card</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={styles.closeButton}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={styles.modalDescription}>
                Are you sure you want to delete {maskCardNumber(selectedCard.cardNumber)}?
                This action cannot be undone.
              </p>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCard}
                  style={{
                    ...styles.buttonPrimary,
                    ...styles.buttonDanger,
                  }}
                >
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddPaymentMethodModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPaymentMethodModal(false)}
                  style={styles.closeButton}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Payment Method Type</label>
                <select
                  value={newPaymentMethod.type}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      type: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  <option value="wallet">Digital Wallet (PayPal, Apple Pay, Google Pay)</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI (Google Pay, PhonePe, Paytm)</option>
                </select>
              </div>

              {newPaymentMethod.type === 'upi' ? (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={newPaymentMethod.upiId}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        upiId: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                  <p style={styles.inputHint}>
                    Format: username@bankname (e.g., john.doe@okhdfcbank)
                  </p>
                </div>
              ) : (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    {newPaymentMethod.type === 'wallet'
                      ? 'Wallet Provider'
                      : 'Bank Details'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      newPaymentMethod.type === 'wallet'
                        ? 'e.g., PayPal, Apple Pay, Google Pay'
                        : 'e.g., Chase Bank - ****5678'
                    }
                    value={newPaymentMethod.details}
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        details: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.securityInfo}>
                <AlertCircle size={16} color="#0c4a6e" />
                <p>Your payment information is encrypted and secure</p>
              </div>

              <div style={styles.modalButtons}>
                <button
                  onClick={() => {
                    setShowAddPaymentMethodModal(false);
                    setNewPaymentMethod({ type: 'wallet', details: '', upiId: '' });
                  }}
                  style={styles.buttonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPaymentMethod}
                  disabled={
                    (newPaymentMethod.type === 'upi' && !newPaymentMethod.upiId) ||
                    (newPaymentMethod.type !== 'upi' && !newPaymentMethod.details)
                  }
                  style={{
                    ...styles.buttonPrimary,
                    opacity:
                      (newPaymentMethod.type === 'upi' && !newPaymentMethod.upiId) ||
                      (newPaymentMethod.type !== 'upi' && !newPaymentMethod.details)
                        ? 0.5
                        : 1,
                    cursor:
                      (newPaymentMethod.type === 'upi' && !newPaymentMethod.upiId) ||
                      (newPaymentMethod.type !== 'upi' && !newPaymentMethod.details)
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}