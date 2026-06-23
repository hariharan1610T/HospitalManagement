export function formatNotificationSummary(notifications = []) {
  if (!notifications.length) return 'No notifications were sent.';

  return notifications.map((item) => {
    const label = item.type === 'email' ? 'Email' : 'WhatsApp';
    if (item.status === 'sent') return `${label} sent`;
    return `${label} failed: ${item.error_log || item.message}`;
  }).join(' · ');
}
