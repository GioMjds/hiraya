'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  accessibility,
  accountControls,
  activity,
  customizations,
  dataOwnership,
  notifications,
  privacy,
  security,
} from './api';
import type {
  SetLanguageData,
  SetTimezoneData,
  SetDateNumberFormatsData,
  SetCurrencyData,
  SetTimeFormatData,
  SetAccessibilityPreferencesData,
  SetHighContrastModeData,
  UpdateSecuritySettingsData,
  SelectMfaMethodData,
  AddTrustedDeviceData,
  ConfigureLoginAlertsData,
  ConfigureSuspiciousActivityAlertsData,
  SetPasswordRotationReminderData,
  SetSessionExpirationData,
  ConfigureIpRestrictionsData,
  UpdateComplianceSettingsData,
  SetProfileVisibilityData,
  SetActivityVisibilityData,
  SetOnlinePresenceData,
  SetFieldLevelVisibilityData,
  UpdateNotificationSettingsData,
  SetQuietHoursData,
  ManageMarketingOptInData,
  ConfigureEmailNotificationsByCategoryData,
  ConfigurePushNotificationsByCategoryData,
  ConfigureSmsAlertsData,
  SetThemeData,
  SetLayoutPreferencesData,
  SetDefaultViewsData,
  SetSortFilterDefaultsData,
  SetPaginationSizeData,
  ManageFeatureTogglesData,
  ManageBetaFeaturesOptInData,
  ManageAiFeaturesOptInData,
  SetContentSensitivityFiltersData,
  ExportPersonalDataData,
  ExportActivityHistoryData,
  RequestDataDeletionData,
  RequestDataCorrectionData,
  AnonymizeDataData,
  SetExportFormatData,
  ChangeEmailData,
  ChangeUsernameData,
  ManageRecoveryOptionsData,
  UpdateUiPreferencesData,
  ExportAuditLogsParams,
} from './types';

export const QUERY_KEYS = {
  securitySettings: ['preferences', 'security'],
  mfaSettings: ['preferences', 'security', 'mfa'],
  trustedDevices: ['preferences', 'security', 'trusted-devices'],
  privacyCompliance: ['preferences', 'privacy', 'compliance'],
  profileVisibility: ['preferences', 'privacy', 'profile-visibility'],
  activityVisibility: ['preferences', 'privacy', 'activity-visibility'],
  onlinePresence: ['preferences', 'privacy', 'online-presence'],
  fieldLevelVisibility: ['preferences', 'privacy', 'field-level-visibility'],
  notificationSettings: ['preferences', 'notifications'],
  loginHistory: ['preferences', 'activity', 'login-history'],
  securityEvents: ['preferences', 'activity', 'security-events'],
  activeSessions: ['preferences', 'activity', 'active-sessions'],
  uiPreferences: ['preferences', 'account-controls', 'ui-preferences'],
};

export function useSetLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetLanguageData) => accessibility.setLanguage(data),
    onSuccess: () => {
      toast.success('Language updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update language'),
  });
}

export function useSetTimezone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetTimezoneData) => accessibility.setTimezone(data),
    onSuccess: () => {
      toast.success('Timezone updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update timezone'),
  });
}

export function useSetDateNumberFormats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetDateNumberFormatsData) => accessibility.setDateNumberFormats(data),
    onSuccess: () => {
      toast.success('Date and number formats updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update formats'),
  });
}

export function useSetCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetCurrencyData) => accessibility.setCurrency(data),
    onSuccess: () => {
      toast.success('Currency updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update currency'),
  });
}

export function useSetTimeFormat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetTimeFormatData) => accessibility.setTimeFormat(data),
    onSuccess: () => {
      toast.success('Time format updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update time format'),
  });
}

export function useSetAccessibilityPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetAccessibilityPreferencesData) => accessibility.setPreferences(data),
    onSuccess: () => {
      toast.success('Accessibility preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update accessibility preferences'),
  });
}

export function useSetHighContrastMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetHighContrastModeData) => accessibility.setHighContrastMode(data),
    onSuccess: () => {
      toast.success('High contrast mode updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'accessibility'] });
    },
    onError: () => toast.error('Failed to update high contrast mode'),
  });
}

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSecuritySettingsData) => security.updateSettings(data),
    onSuccess: () => {
      toast.success('Security settings updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to update security settings'),
  });
}

export function useSelectMfaMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SelectMfaMethodData) => security.selectMfaMethod(data),
    onSuccess: () => {
      toast.success('MFA method updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mfaSettings });
    },
    onError: () => toast.error('Failed to update MFA method'),
  });
}

export function useRegenerateBackupCodes() {
  return useMutation({
    mutationFn: () => security.regenerateBackupCodes(),
    onSuccess: () => toast.success('Backup codes regenerated successfully'),
    onError: () => toast.error('Failed to regenerate backup codes'),
  });
}

export function useAddTrustedDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddTrustedDeviceData) => security.addTrustedDevice(data),
    onSuccess: () => {
      toast.success('Trusted device added successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trustedDevices });
    },
    onError: () => toast.error('Failed to add trusted device'),
  });
}

export function useRemoveTrustedDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => security.removeTrustedDevice(deviceId),
    onSuccess: () => {
      toast.success('Trusted device removed successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trustedDevices });
    },
    onError: () => toast.error('Failed to remove trusted device'),
  });
}

export function useConfigureLoginAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigureLoginAlertsData) => security.configureLoginAlerts(data),
    onSuccess: () => {
      toast.success('Login alerts configured successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to configure login alerts'),
  });
}

export function useConfigureSuspiciousActivityAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigureSuspiciousActivityAlertsData) => security.configureSuspiciousActivityAlerts(data),
    onSuccess: () => {
      toast.success('Suspicious activity alerts configured successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to configure suspicious activity alerts'),
  });
}

export function useSetPasswordRotationReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetPasswordRotationReminderData) => security.setPasswordRotationReminder(data),
    onSuccess: () => {
      toast.success('Password rotation reminder updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to update password rotation reminder'),
  });
}

export function useSetSessionExpiration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetSessionExpirationData) => security.setSessionExpiration(data),
    onSuccess: () => {
      toast.success('Session expiration updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to update session expiration'),
  });
}

export function useConfigureIpRestrictions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigureIpRestrictionsData) => security.configureIpRestrictions(data),
    onSuccess: () => {
      toast.success('IP restrictions configured successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings });
    },
    onError: () => toast.error('Failed to configure IP restrictions'),
  });
}

export function useUpdateComplianceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateComplianceSettingsData) => privacy.updateComplianceSettings(data),
    onSuccess: () => {
      toast.success('Compliance settings updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.privacyCompliance });
    },
    onError: () => toast.error('Failed to update compliance settings'),
  });
}

export function useUpdateProfileVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetProfileVisibilityData) => privacy.updateProfileVisibility(data),
    onSuccess: () => {
      toast.success('Profile visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profileVisibility });
    },
    onError: () => toast.error('Failed to update profile visibility'),
  });
}

export function useUpdateActivityVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetActivityVisibilityData) => privacy.updateActivityVisibility(data),
    onSuccess: () => {
      toast.success('Activity visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activityVisibility });
    },
    onError: () => toast.error('Failed to update activity visibility'),
  });
}

export function useUpdateOnlinePresenceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetOnlinePresenceData) => privacy.updateOnlinePresenceSettings(data),
    onSuccess: () => {
      toast.success('Online presence settings updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.onlinePresence });
    },
    onError: () => toast.error('Failed to update online presence settings'),
  });
}

export function useUpdateFieldLevelVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetFieldLevelVisibilityData) => privacy.updateFieldLevelVisibility(data),
    onSuccess: () => {
      toast.success('Field visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fieldLevelVisibility });
    },
    onError: () => toast.error('Failed to update field visibility'),
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNotificationSettingsData) => notifications.updateSettings(data),
    onSuccess: () => {
      toast.success('Notification settings updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to update notification settings'),
  });
}

export function useSetQuietHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetQuietHoursData) => notifications.setQuietHours(data),
    onSuccess: () => {
      toast.success('Quiet hours updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to update quiet hours'),
  });
}

export function useManageMarketingOptIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManageMarketingOptInData) => notifications.manageMarketingOptIn(data),
    onSuccess: () => {
      toast.success('Marketing preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to update marketing preferences'),
  });
}

export function useConfigureEmailNotificationsByCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigureEmailNotificationsByCategoryData) => notifications.configureEmailByCategory(data),
    onSuccess: () => {
      toast.success('Email notification category updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to update email notification category'),
  });
}

export function useConfigurePushNotificationsByCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigurePushNotificationsByCategoryData) => notifications.configurePushByCategory(data),
    onSuccess: () => {
      toast.success('Push notification category updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to update push notification category'),
  });
}

export function useConfigureSmsAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfigureSmsAlertsData) => notifications.configureSmsAlerts(data),
    onSuccess: () => {
      toast.success('SMS alerts configured successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
    },
    onError: () => toast.error('Failed to configure SMS alerts'),
  });
}

export function useSetTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetThemeData) => customizations.setTheme(data),
    onSuccess: () => {
      toast.success('Theme updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update theme'),
  });
}

export function useSetLayoutPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetLayoutPreferencesData) => customizations.setLayoutPreferences(data),
    onSuccess: () => {
      toast.success('Layout preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update layout preferences'),
  });
}

export function useSetDefaultViews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetDefaultViewsData) => customizations.setDefaultViews(data),
    onSuccess: () => {
      toast.success('Default views updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update default views'),
  });
}

export function useSetSortFilterDefaults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetSortFilterDefaultsData) => customizations.setSortFilterDefaults(data),
    onSuccess: () => {
      toast.success('Sort and filter defaults updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update sort and filter defaults'),
  });
}

export function useSetPaginationSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetPaginationSizeData) => customizations.setPaginationSize(data),
    onSuccess: () => {
      toast.success('Pagination size updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update pagination size'),
  });
}

export function useManageFeatureToggles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManageFeatureTogglesData) => customizations.manageFeatureToggles(data),
    onSuccess: () => {
      toast.success('Feature toggle updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update feature toggle'),
  });
}

export function useManageBetaFeaturesOptIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManageBetaFeaturesOptInData) => customizations.manageBetaFeaturesOptIn(data),
    onSuccess: () => {
      toast.success('Beta features opt-in updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update beta features opt-in'),
  });
}

export function useManageAiFeaturesOptIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManageAiFeaturesOptInData) => customizations.manageAiFeaturesOptIn(data),
    onSuccess: () => {
      toast.success('AI features opt-in updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update AI features opt-in'),
  });
}

export function useSetContentSensitivityFilters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetContentSensitivityFiltersData) => customizations.setContentSensitivityFilters(data),
    onSuccess: () => {
      toast.success('Content sensitivity filters updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'customizations'] });
    },
    onError: () => toast.error('Failed to update content sensitivity filters'),
  });
}

export function useExportAuditLogs() {
  return useMutation({
    mutationFn: (params: ExportAuditLogsParams) => activity.exportAuditLogs(params),
    onSuccess: () => toast.success('Audit logs export started'),
    onError: () => toast.error('Failed to export audit logs'),
  });
}

export function useExportPersonalData() {
  return useMutation({
    mutationFn: (data: ExportPersonalDataData) => dataOwnership.exportPersonalData(data),
    onSuccess: () => toast.success('Personal data export started'),
    onError: () => toast.error('Failed to export personal data'),
  });
}

export function useExportActivityHistory() {
  return useMutation({
    mutationFn: (data: ExportActivityHistoryData) => dataOwnership.exportActivityHistory(data),
    onSuccess: () => toast.success('Activity history export started'),
    onError: () => toast.error('Failed to export activity history'),
  });
}

export function useDownloadAccountArchive() {
  return useMutation({
    mutationFn: () => dataOwnership.downloadAccountArchive(),
    onSuccess: () => toast.success('Account archive download started'),
    onError: () => toast.error('Failed to download account archive'),
  });
}

export function useRequestDataDeletion() {
  return useMutation({
    mutationFn: (data: RequestDataDeletionData) => dataOwnership.requestDataDeletion(data),
    onSuccess: () => toast.success('Data deletion request submitted'),
    onError: () => toast.error('Failed to submit data deletion request'),
  });
}

export function useRequestDataCorrection() {
  return useMutation({
    mutationFn: (data: RequestDataCorrectionData) => dataOwnership.requestDataCorrection(data),
    onSuccess: () => toast.success('Data correction request submitted'),
    onError: () => toast.error('Failed to submit data correction request'),
  });
}

export function useAnonymizeData() {
  return useMutation({
    mutationFn: (data: AnonymizeDataData) => dataOwnership.anonymizeData(data),
    onSuccess: () => toast.success('Data anonymization started'),
    onError: () => toast.error('Failed to anonymize data'),
  });
}

export function useSetExportFormat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetExportFormatData) => dataOwnership.setExportFormat(data),
    onSuccess: () => {
      toast.success('Export format updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'data-ownership'] });
    },
    onError: () => toast.error('Failed to update export format'),
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeEmailData) => accountControls.changeEmail(data),
    onSuccess: () => {
      toast.success('Email change request sent');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => toast.error('Failed to change email'),
  });
}

export function useChangeUsername() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeUsernameData) => accountControls.changeUsername(data),
    onSuccess: () => {
      toast.success('Username changed successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => toast.error('Failed to change username'),
  });
}

export function useLogoutAllDevices() {
  return useMutation({
    mutationFn: () => accountControls.logoutAllDevices(),
    onSuccess: () => toast.success('Logged out from all devices'),
    onError: () => toast.error('Failed to logout from all devices'),
  });
}

export function useManageRecoveryOptions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ManageRecoveryOptionsData) => accountControls.manageRecoveryOptions(data),
    onSuccess: () => {
      toast.success('Recovery options updated successfully');
      queryClient.invalidateQueries({ queryKey: ['preferences', 'account-controls'] });
    },
    onError: () => toast.error('Failed to update recovery options'),
  });
}

export function useDeactivateAccount() {
  return useMutation({
    mutationFn: () => accountControls.deactivateAccount(),
    onSuccess: () => toast.success('Account deactivated'),
    onError: () => toast.error('Failed to deactivate account'),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => accountControls.deleteAccount(),
    onSuccess: () => toast.success('Account deletion requested'),
    onError: () => toast.error('Failed to request account deletion'),
  });
}

export function useRecoverAccount() {
  return useMutation({
    mutationFn: () => accountControls.recoverAccount(),
    onSuccess: () => toast.success('Account recovered successfully'),
    onError: () => toast.error('Failed to recover account'),
  });
}

export function useUpdateUiPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUiPreferencesData) => accountControls.updateUiPreferences(data),
    onSuccess: () => {
      toast.success('UI preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.uiPreferences });
    },
    onError: () => toast.error('Failed to update UI preferences'),
  });
}
