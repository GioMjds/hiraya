export interface AccessibilitySettings {
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  timeFormat: '12h' | '24h';
  highContrastMode: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface SetLanguageData {
  language: string;
}

export interface SetTimezoneData {
  timezone: string;
}

export interface SetDateNumberFormatsData {
  dateFormat: string;
  numberFormat: string;
}

export interface SetCurrencyData {
  currency: string;
}

export interface SetTimeFormatData {
  timeFormat: '12h' | '24h';
}

export interface SetAccessibilityPreferencesData {
  reduceMotion?: boolean;
  screenReaderOptimized?: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface SetHighContrastModeData {
  enabled: boolean;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod: 'authenticator' | 'sms' | 'email' | null;
  trustedDevices: TrustedDevice[];
  loginAlertsEnabled: boolean;
  suspiciousActivityAlertsEnabled: boolean;
  passwordRotationDays: number | null;
  sessionExpirationMinutes: number;
  ipRestrictions: string[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: string;
  browser: string;
  os: string;
}

export interface UpdateSecuritySettingsData {
  mfaEnabled?: boolean;
  loginAlertsEnabled?: boolean;
  suspiciousActivityAlertsEnabled?: boolean;
  passwordRotationDays?: number | null;
  sessionExpirationMinutes?: number;
}

export interface SelectMfaMethodData {
  method: 'authenticator' | 'sms' | 'email';
}

export interface AddTrustedDeviceData {
  name: string;
}

export interface ConfigureLoginAlertsData {
  enabled: boolean;
  channels: ('email' | 'sms' | 'push')[];
}

export interface ConfigureSuspiciousActivityAlertsData {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
}

export interface SetPasswordRotationReminderData {
  days: number | null;
}

export interface SetSessionExpirationData {
  minutes: number;
}

export interface ConfigureIpRestrictionsData {
  allowedIps: string[];
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  activityVisibility: 'public' | 'private' | 'friends';
  showOnlineStatus: boolean;
  allowSearchEngineIndexing: boolean;
  fieldLevelVisibility: Record<string, 'public' | 'private' | 'friends'>;
}

export interface ComplianceSettings {
  gdprConsent: boolean;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  analyticsConsent: boolean;
}

export interface SetProfileVisibilityData {
  visibility: 'public' | 'private' | 'friends';
}

export interface SetActivityVisibilityData {
  visibility: 'public' | 'private' | 'friends';
}

export interface SetOnlinePresenceData {
  showOnlineStatus: boolean;
  allowSearchEngineIndexing: boolean;
}

export interface SetFieldLevelVisibilityData {
  field: string;
  visibility: 'public' | 'private' | 'friends';
}

export interface UpdateComplianceSettingsData {
  gdprConsent?: boolean;
  dataProcessingConsent?: boolean;
  marketingConsent?: boolean;
  analyticsConsent?: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  marketingOptIn: boolean;
  emailCategories: NotificationCategory[];
  pushCategories: NotificationCategory[];
}

export interface NotificationCategory {
  id: string;
  name: string;
  enabled: boolean;
}

export interface UpdateNotificationSettingsData {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface SetQuietHoursData {
  enabled: boolean;
  start: string;
  end: string;
}

export interface ManageMarketingOptInData {
  optIn: boolean;
}

export interface ConfigureEmailNotificationsByCategoryData {
  categoryId: string;
  enabled: boolean;
}

export interface ConfigurePushNotificationsByCategoryData {
  categoryId: string;
  enabled: boolean;
}

export interface ConfigureSmsAlertsData {
  enabled: boolean;
  phoneNumber?: string;
}

export interface CustomizationSettings {
  theme: 'light' | 'dark' | 'system';
  layout: 'default' | 'compact' | 'comfortable';
  defaultView: string;
  sortDefaults: Record<string, 'asc' | 'desc'>;
  filterDefaults: Record<string, string>;
  paginationSize: number;
  featureToggles: Record<string, boolean>;
  betaFeaturesOptIn: boolean;
  aiFeaturesOptIn: boolean;
  contentSensitivityLevel: 'low' | 'medium' | 'high';
}

export interface SetThemeData {
  theme: 'light' | 'dark' | 'system';
}

export interface SetLayoutPreferencesData {
  layout: 'default' | 'compact' | 'comfortable';
}

export interface SetDefaultViewsData {
  view: string;
}

export interface SetSortFilterDefaultsData {
  sortDefaults?: Record<string, 'asc' | 'desc'>;
  filterDefaults?: Record<string, string>;
}

export interface SetPaginationSizeData {
  size: number;
}

export interface ManageFeatureTogglesData {
  feature: string;
  enabled: boolean;
}

export interface ManageBetaFeaturesOptInData {
  optIn: boolean;
}

export interface ManageAiFeaturesOptInData {
  optIn: boolean;
}

export interface SetContentSensitivityFiltersData {
  level: 'low' | 'medium' | 'high';
}

export interface ActivityHistoryItem {
  id: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  location: string;
}

export interface LoginHistoryItem extends ActivityHistoryItem {
  success: boolean;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  details: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface GetLoginHistoryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetSecurityEventsParams {
  page?: number;
  limit?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ExportAuditLogsParams {
  format: 'csv' | 'json' | 'pdf';
  startDate?: string;
  endDate?: string;
}

export interface DataOwnershipSettings {
  exportFormat: 'json' | 'csv' | 'xml';
}

export interface ExportPersonalDataData {
  includeProfile: boolean;
  includeActivity: boolean;
  includePreferences: boolean;
}

export interface ExportActivityHistoryData {
  startDate?: string;
  endDate?: string;
  format: 'json' | 'csv';
}

export interface RequestDataDeletionData {
  reason?: string;
  confirmEmail: string;
}

export interface RequestDataCorrectionData {
  field: string;
  currentValue: string;
  correctedValue: string;
  reason?: string;
}

export interface AnonymizeDataData {
  fields: string[];
}

export interface SetExportFormatData {
  format: 'json' | 'csv' | 'xml';
}

export interface AccountControlsSettings {
  email: string;
  username: string;
  recoveryEmail: string | null;
  recoveryPhone: string | null;
}

export interface ChangeEmailData {
  newEmail: string;
  password: string;
}

export interface ChangeUsernameData {
  newUsername: string;
  password: string;
}

export interface ManageRecoveryOptionsData {
  recoveryEmail?: string;
  recoveryPhone?: string;
}

export interface UiPreferences {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showTooltips: boolean;
}

export interface UpdateUiPreferencesData {
  sidebarCollapsed?: boolean;
  compactMode?: boolean;
  showTooltips?: boolean;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface BackupCodesResponse extends BaseResponse {
  codes: string[];
}

export interface TrustedDevicesResponse extends BaseResponse {
  devices: TrustedDevice[];
}

export interface DownloadArchiveResponse extends BaseResponse {
  downloadUrl: string;
  expiresAt: string;
}
