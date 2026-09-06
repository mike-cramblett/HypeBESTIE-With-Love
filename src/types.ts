export interface ScanResult {
  styleName: string;
  'MCE%': string;
  biometricSpecs: string[];
  hypeText: string;
  targetType?: 'self' | 'friend';
  friendName?: string;
}

export interface CreditsResponse {
  userId: string;
  creditsRemaining: number;
  maxCredits?: number;
}

export interface ScanApiResponse {
  success: boolean;
  scanResult?: ScanResult;
  creditsRemaining?: number;
  error?: string;
}
