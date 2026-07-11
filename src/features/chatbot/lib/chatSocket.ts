import { io, Socket } from 'socket.io-client';
import { aiApi } from '../api/aiApi';

let socket: Socket | null = null;

// VITE_API_URL apunta a .../api; el gateway vive en la raíz del mismo host,
// bajo el namespace /chat (backend/src/modules/chatbot/chat.gateway.ts).
const getSocketOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  return apiUrl ? apiUrl.replace(/\/api\/?$/, '') : undefined;
};

/** Singleton — una sola conexión /chat compartida por todos los hooks. */
export function getChatSocket(): Socket {
  if (socket) return socket;

  socket = io(`${getSocketOrigin() ?? ''}/chat`, {
    withCredentials: true,
    autoConnect: false,
    auth: async (cb) => {
      try {
        const { token } = await aiApi.getSocketToken();
        cb({ token });
      } catch {
        cb({});
      }
    },
  });
  socket.connect();
  return socket;
}
