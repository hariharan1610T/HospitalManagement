import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { apiFetch } from '../../lib/api';
import { Bell, Mail, MessageCircle } from 'lucide-react';

const typeIcon = {
  email: Mail,
  whatsapp: MessageCircle,
};

const statusStyles = {
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export default function NotificationInbox({ refreshKey = 0 }) {
  const [notifications, setNotifications] = useState([]);
  const [config, setConfig] = useState({ email: false, whatsapp: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('User not logged in.');

        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [items, channelConfig] = await Promise.all([
          apiFetch('/api/notifications', { headers }),
          apiFetch('/api/notifications/config', { headers }),
        ]);

        setNotifications(items);
        setConfig(channelConfig);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [refreshKey]);

  if (loading) return <div className="p-4 text-gray-500">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="flex gap-2 text-xs">
          <span className={`rounded-full px-2 py-1 ${config.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            Email {config.email ? 'enabled' : 'off'}
          </span>
          <span className={`rounded-full px-2 py-1 ${config.whatsapp ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            WhatsApp {config.whatsapp ? 'enabled' : 'off'}
          </span>
        </div>
      </div>

      {!config.email && !config.whatsapp && (
        <p className="mb-4 rounded bg-amber-50 p-3 text-sm text-amber-900">
          Notification credentials are not configured on the server. Add email and Twilio settings in `backend/.env`.
        </p>
      )}

      {config.whatsapp && (
        <p className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-900">
          Twilio WhatsApp Sandbox: join the sandbox from your phone (send the join code to the Twilio sandbox number in your Twilio console) before WhatsApp messages can arrive.
        </p>
      )}

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet. Book an appointment to receive email and WhatsApp confirmations.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = typeIcon[notification.type] || Bell;

            return (
              <article key={notification.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium capitalize text-gray-900">{notification.type}</p>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      {notification.error_log && (
                        <p className="mt-1 text-sm text-red-600">{notification.error_log}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        {notification.sent_at
                          ? `Sent ${new Date(notification.sent_at).toLocaleString()}`
                          : `Created ${new Date(notification.created_at).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusStyles[notification.status] || 'bg-gray-100 text-gray-700'}`}>
                    {notification.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
