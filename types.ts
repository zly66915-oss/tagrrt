
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  VISITOR = 'VISITOR'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  subscriptionEndDate?: string;
  joinedAt: string;
  isTrial?: boolean;
  trialStartDate?: string;
  isGuest?: boolean;
  isAnonymousTrial?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  pdfUrl?: string;
  category: string;
  level: string;
  duration: string;
  uploadDate: string;
  isFree?: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  walletType: 'ZainCash' | 'AsiaCell' | 'QiCard';
  transactionId: string;
  status: PaymentStatus;
  date: string;
  planName: string;
  rejectReason?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceUSD: number;
  priceIQD: number;
  durationMonths: number;
  description: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'subscription' | 'lesson' | 'payment';
}
