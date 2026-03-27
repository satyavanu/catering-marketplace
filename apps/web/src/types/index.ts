export interface Caterer {
  id: string;
  name: string;
  services: string[];
  description: string;
  rating: number;
  imageUrl: string;
}

export interface Menu {
  id: string;
  catererId: string;
  title: string;
  description: string;
  price: number;
  available: boolean;
}




export interface Cater {
  id: number;
  name: string;
  cuisine: string;
  pricePerPerson: number;
  reviews: number;
  rating: number;
}


// ==============================
// ENUMS (with clear meaning)
// ==============================

// 🔹 Order Types
export enum OrderType {
  ONE_TIME = "ONE_TIME", // direct order by user
  BULK = "BULK",         // created from approved quote
}

// 🔹 Quote Status
export enum QuoteStatus {
  PENDING = "PENDING",       // user submitted, waiting for caterer
  REVIEWED = "REVIEWED",     // caterer reviewed & updated pricing
  APPROVED = "APPROVED",     // customer accepted → will create order
  REJECTED = "REJECTED",     // declined by either side
  EXPIRED = "EXPIRED",       // not acted upon in time
}

// 🔹 Payment Status (for Orders)
export enum PaymentStatus {
  PENDING = "PENDING",   // not paid yet
  PARTIAL = "PARTIAL",   // partially paid (advance)
  PAID = "PAID",         // fully paid
  FAILED = "FAILED",     // payment attempt failed
  REFUNDED = "REFUNDED", // money returned
}

// 🔹 Delivery Status (Execution Layer)
export enum DeliveryStatus {
  PENDING = "PENDING",                 // scheduled but not started
  PREPARING = "PREPARING",             // food is being prepared
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY", // dispatched
  DELIVERED = "DELIVERED",             // completed successfully
  CANCELLED = "CANCELLED",             // cancelled before delivery
}

// 🔹 Transaction Status (Payment Logs)
export enum TransactionStatus {
  INITIATED = "INITIATED", // payment started
  SUCCESS = "SUCCESS",     // payment completed
  FAILED = "FAILED",       // failed attempt
  REFUNDED = "REFUNDED",   // refunded to customer
}

export interface Quote {
  id: string;

  customer_id: string;
  caterer_id: string;

  event_date: string;
  guest_count: number;

  requirements?: string; // custom notes from user

  proposed_amount?: number; // set by caterer

  status: QuoteStatus;

  created_at: string;
  updated_at: string;
}


export interface Quote {
  id: string;

  customer_id: string;
  caterer_id: string;

  event_date: string;
  guest_count: number;

  requirements?: string; // custom notes from user

  proposed_amount?: number; // set by caterer

  status: QuoteStatus;

  created_at: string;
  updated_at: string;
}


export interface Order {
  id: string;

  type: OrderType;

  customer_id: string;
  caterer_id: string;

  quote_id?: string; // only for BULK

  total_amount: number;

  payment_status: PaymentStatus;

  event_date?: string; // useful for bulk

  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;

  order_id?: string;
  subscription_id?: string;

  amount: number;

  status: TransactionStatus;

  payment_method: "CARD" | "UPI" | "CASH";

  external_payment_id?: string;

  paid_at?: string;

  created_at: string;
}


export const DELIVERY_STATE_MATRIX = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
} as const;

export const DELIVERY_RULES = {
  PENDING: {
    can_cancel: true,
    refund: "FULL",
    description: "Order placed, not started",
  },
  PREPARING: {
    can_cancel: true,
    refund: "PARTIAL_OR_NONE",
    description: "Food preparation started",
  },
  OUT_FOR_DELIVERY: {
    can_cancel: false,
    refund: "NONE",
    description: "Delivery in progress",
  },
  DELIVERED: {
    can_cancel: false,
    refund: "NONE",
    description: "Completed successfully",
  },
  CANCELLED: {
    can_cancel: false,
    refund: "N/A",
    description: "Already cancelled",
  },
} as const;

export const PAYMENT_CANCELLATION_MATRIX = [
  {
    delivery_status: "PENDING",
    payment_status: "PAID",
    action: "CANCEL",
    refund: "FULL",
  },
  {
    delivery_status: "PREPARING",
    payment_status: "PAID",
    action: "CANCEL",
    refund: "PARTIAL_OR_NONE",
  },
  {
    delivery_status: "OUT_FOR_DELIVERY",
    payment_status: "PAID",
    action: "BLOCK",
    refund: "NONE",
  },
  {
    delivery_status: "DELIVERED",
    payment_status: "PAID",
    action: "BLOCK",
    refund: "NONE",
  },
];


export const MUTATIONS = {
  UPDATE_DELIVERY_STATUS: "updateDeliveryStatus",
  CANCEL_DELIVERY: "cancelDelivery",
  CANCEL_ORDER: "cancelOrder",
  UPDATE_PAYMENT: "updatePaymentStatus",
};


export const SYSTEM_RULES = {
  DELIVERY_IS_SOURCE_OF_TRUTH: true,

  ORDER_IS_DERIVED: true,

  CANCEL_NOT_ALLOWED_IF_DELIVERED: true,

  REFUND_REQUIRED_IF_PAID_AND_CANCELLED: true,

  NO_ORDER_FOR_SUBSCRIPTION: true,
};






