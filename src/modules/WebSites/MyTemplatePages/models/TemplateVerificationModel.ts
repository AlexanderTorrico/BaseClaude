export interface VerificationUser {
  id: number;
  name: string;
  email: string;
}

export interface TemplateVerification {
  id: number;
  user: VerificationUser;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationByUser {
  user: VerificationUser;
  verificationCount: number;
  lastVerification: string;
}

export interface VerificationStats {
  totalVerifications: number;
  uniqueUsers: number;
  verificationsByUser: VerificationByUser[];
}

export interface TemplateVerificationsResponse {
  verifications: TemplateVerification[];
  stats: VerificationStats;
}
