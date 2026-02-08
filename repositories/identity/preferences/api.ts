import { createEndpoint, FetchConfig } from '@/configs';
import type {
  AccessibilitySettings,
  SetLanguageData,
  SetTimezoneData,
  SetDateNumberFormatsData,
  SetCurrencyData,
  SetTimeFormatData,
  SetAccessibilityPreferencesData,
  SetHighContrastModeData,
  SecuritySettings,
  UpdateSecuritySettingsData,
  SelectMfaMethodData,
  AddTrustedDeviceData,
  ConfigureLoginAlertsData,
  ConfigureSuspiciousActivityAlertsData,
  SetPasswordRotationReminderData,
  SetSessionExpirationData,
  ConfigureIpRestrictionsData,
  TrustedDevicesResponse,
  BackupCodesResponse,
  PrivacySettings,
  ComplianceSettings,
  SetProfileVisibilityData,
  SetActivityVisibilityData,
  SetOnlinePresenceData,
  SetFieldLevelVisibilityData,
  UpdateComplianceSettingsData,
  NotificationSettings,
  UpdateNotificationSettingsData,
  SetQuietHoursData,
  ManageMarketingOptInData,
  ConfigureEmailNotificationsByCategoryData,
  ConfigurePushNotificationsByCategoryData,
  ConfigureSmsAlertsData,
  CustomizationSettings,
  SetThemeData,
  SetLayoutPreferencesData,
  SetDefaultViewsData,
  SetSortFilterDefaultsData,
  SetPaginationSizeData,
  ManageFeatureTogglesData,
  ManageBetaFeaturesOptInData,
  ManageAiFeaturesOptInData,
  SetContentSensitivityFiltersData,
  LoginHistoryItem,
  SecurityEvent,
  ActivityHistoryItem,
  ActiveSession,
  GetLoginHistoryParams,
  GetSecurityEventsParams,
  ExportAuditLogsParams,
  DataOwnershipSettings,
  ExportPersonalDataData,
  ExportActivityHistoryData,
  RequestDataDeletionData,
  RequestDataCorrectionData,
  AnonymizeDataData,
  SetExportFormatData,
  DownloadArchiveResponse,
  AccountControlsSettings,
  ChangeEmailData,
  ChangeUsernameData,
  ManageRecoveryOptionsData,
  UiPreferences,
  UpdateUiPreferencesData,
  BaseResponse,
} from './types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

function createPreferencesEndpoint<
  TSettings,
  TOperations extends Record<string, unknown>,
>(
  basePath: string,
  operationsFactory: (http: ReturnType<typeof createEndpoint>) => TOperations,
) {
  const http = createEndpoint(basePath);
  const operations = operationsFactory(http);

  return {
    ...operations,
    _http: http,
  };
}

const defaultAuthConfig: FetchConfig = { auth: true };

export const accessibility = createPreferencesEndpoint<
  AccessibilitySettings,
  {
    setLanguage: (data: SetLanguageData) => Promise<BaseResponse>;
    setTimezone: (data: SetTimezoneData) => Promise<BaseResponse>;
    setDateNumberFormats: (
      data: SetDateNumberFormatsData,
    ) => Promise<BaseResponse>;
    setCurrency: (data: SetCurrencyData) => Promise<BaseResponse>;
    setTimeFormat: (data: SetTimeFormatData) => Promise<BaseResponse>;
    setPreferences: (
      data: SetAccessibilityPreferencesData,
    ) => Promise<BaseResponse>;
    setHighContrastMode: (
      data: SetHighContrastModeData,
    ) => Promise<BaseResponse>;
  }
>('/preferences/accessibility', (http) => ({
  setLanguage: (data) =>
    http.put<BaseResponse>('/language', data, defaultAuthConfig),
  setTimezone: (data) =>
    http.put<BaseResponse>('/timezone', data, defaultAuthConfig),
  setDateNumberFormats: (data) =>
    http.put<BaseResponse>('/date-number-formats', data, defaultAuthConfig),
  setCurrency: (data) =>
    http.put<BaseResponse>('/currency', data, defaultAuthConfig),
  setTimeFormat: (data) =>
    http.put<BaseResponse>('/time-format', data, defaultAuthConfig),
  setPreferences: (data) =>
    http.put<BaseResponse>('/preferences', data, defaultAuthConfig),
  setHighContrastMode: (data) =>
    http.put<BaseResponse>('/high-contrast', data, defaultAuthConfig),
}));

export const security = createPreferencesEndpoint<
  SecuritySettings,
  {
    getSettings: () => Promise<SecuritySettings>;
    updateSettings: (data: UpdateSecuritySettingsData) => Promise<BaseResponse>;
    getMfaSettings: () => Promise<{ enabled: boolean; method: string | null }>;
    selectMfaMethod: (data: SelectMfaMethodData) => Promise<BaseResponse>;
    regenerateBackupCodes: () => Promise<BackupCodesResponse>;
    getTrustedDevices: () => Promise<TrustedDevicesResponse>;
    addTrustedDevice: (
      data: AddTrustedDeviceData,
    ) => Promise<TrustedDevicesResponse>;
    removeTrustedDevice: (deviceId: string) => Promise<void>;
    configureLoginAlerts: (
      data: ConfigureLoginAlertsData,
    ) => Promise<BaseResponse>;
    configureSuspiciousActivityAlerts: (
      data: ConfigureSuspiciousActivityAlertsData,
    ) => Promise<BaseResponse>;
    setPasswordRotationReminder: (
      data: SetPasswordRotationReminderData,
    ) => Promise<BaseResponse>;
    setSessionExpiration: (
      data: SetSessionExpirationData,
    ) => Promise<BaseResponse>;
    configureIpRestrictions: (
      data: ConfigureIpRestrictionsData,
    ) => Promise<BaseResponse>;
  }
>('/preferences/security', (http) => ({
  getSettings: () => http.get<SecuritySettings>('/', defaultAuthConfig),
  updateSettings: (data) =>
    http.put<BaseResponse>('/', data, defaultAuthConfig),
  getMfaSettings: () =>
    http.get<{ enabled: boolean; method: string | null }>(
      '/mfa',
      defaultAuthConfig,
    ),
  selectMfaMethod: (data) =>
    http.put<BaseResponse>('/mfa/method', data, defaultAuthConfig),
  regenerateBackupCodes: () =>
    http.post<BackupCodesResponse>(
      '/mfa/backup-codes/regenerate',
      undefined,
      defaultAuthConfig,
    ),
  getTrustedDevices: () =>
    http.get<TrustedDevicesResponse>('/trusted-devices', defaultAuthConfig),
  addTrustedDevice: (data) =>
    http.post<TrustedDevicesResponse>(
      '/trusted-devices',
      data,
      defaultAuthConfig,
    ),
  removeTrustedDevice: (deviceId) =>
    http.delete<void>(`/trusted-devices/${deviceId}`, defaultAuthConfig),
  configureLoginAlerts: (data) =>
    http.put<BaseResponse>('/login-alerts', data, defaultAuthConfig),
  configureSuspiciousActivityAlerts: (data) =>
    http.put<BaseResponse>(
      '/suspicious-activity-alerts',
      data,
      defaultAuthConfig,
    ),
  setPasswordRotationReminder: (data) =>
    http.put<BaseResponse>(
      '/password-rotation-reminder',
      data,
      defaultAuthConfig,
    ),
  setSessionExpiration: (data) =>
    http.put<BaseResponse>('/session-expiration', data, defaultAuthConfig),
  configureIpRestrictions: (data) =>
    http.put<BaseResponse>('/ip-restrictions', data, defaultAuthConfig),
}));

export const privacy = createPreferencesEndpoint<
  PrivacySettings,
  {
    getComplianceSettings: () => Promise<ComplianceSettings>;
    updateComplianceSettings: (
      data: UpdateComplianceSettingsData,
    ) => Promise<BaseResponse>;
    getProfileVisibility: () => Promise<{ visibility: string }>;
    updateProfileVisibility: (
      data: SetProfileVisibilityData,
    ) => Promise<BaseResponse>;
    getActivityVisibility: () => Promise<{ visibility: string }>;
    updateActivityVisibility: (
      data: SetActivityVisibilityData,
    ) => Promise<BaseResponse>;
    getOnlinePresenceSettings: () => Promise<{
      showOnlineStatus: boolean;
      allowSearchEngineIndexing: boolean;
    }>;
    updateOnlinePresenceSettings: (
      data: SetOnlinePresenceData,
    ) => Promise<BaseResponse>;
    getFieldLevelVisibility: () => Promise<Record<string, string>>;
    updateFieldLevelVisibility: (
      data: SetFieldLevelVisibilityData,
    ) => Promise<BaseResponse>;
  }
>('/preferences/privacy', (http) => ({
  getComplianceSettings: () =>
    http.get<ComplianceSettings>('/compliance', defaultAuthConfig),
  updateComplianceSettings: (data) =>
    http.put<BaseResponse>('/compliance', data, defaultAuthConfig),
  getProfileVisibility: () =>
    http.get<{ visibility: string }>('/profile-visibility', defaultAuthConfig),
  updateProfileVisibility: (data) =>
    http.put<BaseResponse>('/profile-visibility', data, defaultAuthConfig),
  getActivityVisibility: () =>
    http.get<{ visibility: string }>('/activity-visibility', defaultAuthConfig),
  updateActivityVisibility: (data) =>
    http.put<BaseResponse>('/activity-visibility', data, defaultAuthConfig),
  getOnlinePresenceSettings: () =>
    http.get<{ showOnlineStatus: boolean; allowSearchEngineIndexing: boolean }>(
      '/online-presence',
      defaultAuthConfig,
    ),
  updateOnlinePresenceSettings: (data) =>
    http.put<BaseResponse>('/online-presence', data, defaultAuthConfig),
  getFieldLevelVisibility: () =>
    http.get<Record<string, string>>(
      '/field-level-visibility',
      defaultAuthConfig,
    ),
  updateFieldLevelVisibility: (data) =>
    http.put<BaseResponse>('/field-level-visibility', data, defaultAuthConfig),
}));

export const notifications = createPreferencesEndpoint<
  NotificationSettings,
  {
    getSettings: () => Promise<NotificationSettings>;
    updateSettings: (
      data: UpdateNotificationSettingsData,
    ) => Promise<NotificationSettings>;
    setQuietHours: (data: SetQuietHoursData) => Promise<BaseResponse>;
    manageMarketingOptIn: (
      data: ManageMarketingOptInData,
    ) => Promise<BaseResponse>;
    configureEmailByCategory: (
      data: ConfigureEmailNotificationsByCategoryData,
    ) => Promise<BaseResponse>;
    configurePushByCategory: (
      data: ConfigurePushNotificationsByCategoryData,
    ) => Promise<BaseResponse>;
    configureSmsAlerts: (data: ConfigureSmsAlertsData) => Promise<BaseResponse>;
  }
>('/preferences/notifications', (http) => ({
  getSettings: () => http.get<NotificationSettings>('/', defaultAuthConfig),
  updateSettings: (data) =>
    http.put<NotificationSettings>('/', data, defaultAuthConfig),
  setQuietHours: (data) =>
    http.put<BaseResponse>('/quiet-hours', data, defaultAuthConfig),
  manageMarketingOptIn: (data) =>
    http.put<BaseResponse>('/marketing-opt-in', data, defaultAuthConfig),
  configureEmailByCategory: (data) =>
    http.put<BaseResponse>('/email-by-category', data, defaultAuthConfig),
  configurePushByCategory: (data) =>
    http.put<BaseResponse>('/push-by-category', data, defaultAuthConfig),
  configureSmsAlerts: (data) =>
    http.put<BaseResponse>('/sms-alerts', data, defaultAuthConfig),
}));

export const customizations = createPreferencesEndpoint<
  CustomizationSettings,
  {
    setTheme: (data: SetThemeData) => Promise<BaseResponse>;
    setLayoutPreferences: (
      data: SetLayoutPreferencesData,
    ) => Promise<BaseResponse>;
    setDefaultViews: (data: SetDefaultViewsData) => Promise<BaseResponse>;
    setSortFilterDefaults: (
      data: SetSortFilterDefaultsData,
    ) => Promise<BaseResponse>;
    setPaginationSize: (data: SetPaginationSizeData) => Promise<BaseResponse>;
    manageFeatureToggles: (
      data: ManageFeatureTogglesData,
    ) => Promise<BaseResponse>;
    manageBetaFeaturesOptIn: (
      data: ManageBetaFeaturesOptInData,
    ) => Promise<BaseResponse>;
    manageAiFeaturesOptIn: (
      data: ManageAiFeaturesOptInData,
    ) => Promise<BaseResponse>;
    setContentSensitivityFilters: (
      data: SetContentSensitivityFiltersData,
    ) => Promise<BaseResponse>;
  }
>('/preferences/customizations', (http) => ({
  setTheme: (data) => http.put<BaseResponse>('/theme', data, defaultAuthConfig),
  setLayoutPreferences: (data) =>
    http.put<BaseResponse>('/layout', data, defaultAuthConfig),
  setDefaultViews: (data) =>
    http.put<BaseResponse>('/default-views', data, defaultAuthConfig),
  setSortFilterDefaults: (data) =>
    http.put<BaseResponse>('/sort-filter-defaults', data, defaultAuthConfig),
  setPaginationSize: (data) =>
    http.put<BaseResponse>('/pagination-size', data, defaultAuthConfig),
  manageFeatureToggles: (data) =>
    http.put<BaseResponse>('/feature-toggles', data, defaultAuthConfig),
  manageBetaFeaturesOptIn: (data) =>
    http.put<BaseResponse>('/beta-features', data, defaultAuthConfig),
  manageAiFeaturesOptIn: (data) =>
    http.put<BaseResponse>('/ai-features', data, defaultAuthConfig),
  setContentSensitivityFilters: (data) =>
    http.put<BaseResponse>('/content-sensitivity', data, defaultAuthConfig),
}));

export const activity = createPreferencesEndpoint<
  never,
  {
    getLoginHistory: (
      params?: GetLoginHistoryParams,
    ) => Promise<PaginatedResponse<LoginHistoryItem>>;
    getSecurityEvents: (
      params?: GetSecurityEventsParams,
    ) => Promise<PaginatedResponse<SecurityEvent>>;
    getAccountChangeHistory: (params?: {
      page?: number;
      limit?: number;
    }) => Promise<PaginatedResponse<ActivityHistoryItem>>;
    getPermissionChangeHistory: (params?: {
      page?: number;
      limit?: number;
    }) => Promise<PaginatedResponse<ActivityHistoryItem>>;
    exportAuditLogs: (
      params: ExportAuditLogsParams,
    ) => Promise<{ downloadUrl: string }>;
    getDataAccessHistory: (params?: {
      page?: number;
      limit?: number;
    }) => Promise<PaginatedResponse<ActivityHistoryItem>>;
    getPreferenceAuditLogs: () => Promise<
      PaginatedResponse<ActivityHistoryItem>
    >;
    getActiveSessions: () => Promise<ActiveSession[]>;
  }
>('/preferences/activity', (http) => ({
  getLoginHistory: (params) =>
    http.get<PaginatedResponse<LoginHistoryItem>>('/login-history', {
      ...defaultAuthConfig,
      params: params as Record<string, string | number | boolean>,
    }),
  getSecurityEvents: (params) =>
    http.get<PaginatedResponse<SecurityEvent>>('/security-events', {
      ...defaultAuthConfig,
      params: params as Record<string, string | number | boolean>,
    }),
  getAccountChangeHistory: (params) =>
    http.get<PaginatedResponse<ActivityHistoryItem>>('/account-changes', {
      ...defaultAuthConfig,
      params: params as Record<string, string | number | boolean>,
    }),
  getPermissionChangeHistory: (params) =>
    http.get<PaginatedResponse<ActivityHistoryItem>>('/permission-changes', {
      ...defaultAuthConfig,
      params: params as Record<string, string | number | boolean>,
    }),
  exportAuditLogs: (params) =>
    http.post<{ downloadUrl: string }>('/export-audit-logs', undefined, {
      ...defaultAuthConfig,
      params: params as unknown as Record<string, string | number | boolean>,
    }),
  getDataAccessHistory: (params) =>
    http.get<PaginatedResponse<ActivityHistoryItem>>('/data-access-history', {
      ...defaultAuthConfig,
      params: params as Record<string, string | number | boolean>,
    }),
  getPreferenceAuditLogs: () =>
    http.get<PaginatedResponse<ActivityHistoryItem>>(
      '/preference-audit-logs',
      defaultAuthConfig,
    ),
  getActiveSessions: () =>
    http.get<ActiveSession[]>('/active-sessions', defaultAuthConfig),
}));

export const dataOwnership = createPreferencesEndpoint<
  DataOwnershipSettings,
  {
    exportPersonalData: (
      data: ExportPersonalDataData,
    ) => Promise<{ downloadUrl: string }>;
    exportActivityHistory: (
      data: ExportActivityHistoryData,
    ) => Promise<{ downloadUrl: string }>;
    downloadAccountArchive: () => Promise<DownloadArchiveResponse>;
    requestDataDeletion: (
      data: RequestDataDeletionData,
    ) => Promise<BaseResponse>;
    requestDataCorrection: (
      data: RequestDataCorrectionData,
    ) => Promise<BaseResponse>;
    anonymizeData: (data: AnonymizeDataData) => Promise<BaseResponse>;
    setExportFormat: (data: SetExportFormatData) => Promise<BaseResponse>;
  }
>('/preferences/data-ownership', (http) => ({
  exportPersonalData: (data) =>
    http.post<{ downloadUrl: string }>(
      '/export-personal-data',
      data,
      defaultAuthConfig,
    ),
  exportActivityHistory: (data) =>
    http.post<{ downloadUrl: string }>(
      '/export-activity-history',
      data,
      defaultAuthConfig,
    ),
  downloadAccountArchive: () =>
    http.get<DownloadArchiveResponse>('/download-archive', defaultAuthConfig),
  requestDataDeletion: (data) =>
    http.post<BaseResponse>('/request-deletion', data, defaultAuthConfig),
  requestDataCorrection: (data) =>
    http.post<BaseResponse>('/request-correction', data, defaultAuthConfig),
  anonymizeData: (data) =>
    http.post<BaseResponse>('/anonymize', data, defaultAuthConfig),
  setExportFormat: (data) =>
    http.put<BaseResponse>('/export-format', data, defaultAuthConfig),
}));

export const accountControls = createPreferencesEndpoint<
  AccountControlsSettings,
  {
    changeEmail: (data: ChangeEmailData) => Promise<BaseResponse>;
    changeUsername: (data: ChangeUsernameData) => Promise<BaseResponse>;
    logoutAllDevices: () => Promise<BaseResponse>;
    manageRecoveryOptions: (
      data: ManageRecoveryOptionsData,
    ) => Promise<BaseResponse>;
    deactivateAccount: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    recoverAccount: () => Promise<void>;
    getUiPreferences: () => Promise<UiPreferences>;
    updateUiPreferences: (
      data: UpdateUiPreferencesData,
    ) => Promise<UiPreferences>;
  }
>('/preferences/account-controls', (http) => ({
  changeEmail: (data) =>
    http.put<BaseResponse>('/email', data, defaultAuthConfig),
  changeUsername: (data) =>
    http.put<BaseResponse>('/username', data, defaultAuthConfig),
  logoutAllDevices: () =>
    http.post<BaseResponse>(
      '/logout-all-devices',
      undefined,
      defaultAuthConfig,
    ),
  manageRecoveryOptions: (data) =>
    http.put<BaseResponse>('/recovery-options', data, defaultAuthConfig),
  deactivateAccount: () =>
    http.post<void>('/deactivate', undefined, defaultAuthConfig),
  deleteAccount: () => http.delete<void>('/delete', defaultAuthConfig),
  recoverAccount: () =>
    http.post<void>('/recover', undefined, defaultAuthConfig),
  getUiPreferences: () =>
    http.get<UiPreferences>('/ui-preferences', defaultAuthConfig),
  updateUiPreferences: (data) =>
    http.put<UiPreferences>('/ui-preferences', data, defaultAuthConfig),
}));

export const preferencesApi = {
  accessibility,
  security,
  privacy,
  notifications,
  customizations,
  activity,
  dataOwnership,
  accountControls,
};
