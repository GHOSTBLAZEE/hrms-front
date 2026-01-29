import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from './apiClient'; // ✅ Import your axios client

let echoInstance = null;

export const initializeEcho = () => {
  if (typeof window !== 'undefined' && !echoInstance) {
    window.Pusher = Pusher;

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? 80),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? 443),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      // ✅ Use apiClient for authorization
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          apiClient
            .post('/api/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name,
            })
            .then((response) => callback(null, response.data))
            .catch((error) => callback(error));
        },
      }),
    });
  }

  return echoInstance;
};

export const getEcho = () => echoInstance;

export default { initializeEcho, getEcho };