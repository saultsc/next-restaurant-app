import { Credentials, login } from '@/action';
import { logout } from '@/action/auth/logout.action';
import { verifyToken } from '@/lib/jwt';
import { create } from 'zustand';

interface Response {
	ok: boolean;
	message: string;
	token?: string;
}

interface UserStore {
	userId: number | null;
	isAdmin: boolean;
	login(credentials: Credentials): Promise<Response>;
	logout(): void;
	rechargeInfo(): void;
	initialize(): void;
}

export const useUserStore = create<UserStore>((set) => ({
	userId: null,
	isAdmin: false,
	login: async (credentials: Credentials) => {
		try {
			const response: Response = await login(credentials);
			if (!response.ok) return { ok: false, message: response.message };
			if (!response.token) return { ok: false, message: 'Token no recibido' };

			const data = await verifyToken(response.token);
			if (!data) return { ok: false, message: 'Token no válido' };

			set({ userId: data.userId, isAdmin: data.role });
			return {
				ok: true,
				message: response.message,
			};
		} catch (error) {
			set({ userId: null });
			return { ok: false, message: 'Error del servidor' };
		}
	},
	logout: () => {
		logout();
		set({ userId: null, isAdmin: false });
	},
	rechargeInfo: async () => {
		const token = getCookie('token');
		if (!token) {
			set({ userId: null, isAdmin: false });
			return;
		}

		const data = await verifyToken(token);
		if (!data) {
			set({ userId: null, isAdmin: false });
			return;
		}

		set({ userId: data.userId, isAdmin: data.role });
	},
	initialize: () => {
		useUserStore.getState().rechargeInfo();
	},
}));

function getCookie(name: string): string | undefined {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`); // Ver partes divididas
	if (parts.length === 2) {
		const cookieValue = parts.pop()?.split(';').shift();
		return cookieValue;
	}
	return undefined;
}
