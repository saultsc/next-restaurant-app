import { Credentials, login } from '@/action';
import { logout } from '@/action/auth/logout.action';
import { verifyToken } from '@/lib/jwt';
import { create } from 'zustand';
import { useUiStore } from '../ui/ui-store';

interface Response {
	ok: boolean;
	message: string;
}

interface UserStore {
	userId: string;
	isAdmin: boolean;
	login(credentials: Credentials): Promise<Response>;
	logout(): void;
}

export const useUserStore = create<UserStore>((set) => ({
	userId: '',
	isAdmin: false,
	login: async (credentials: Credentials) => {
		try {
			const response = await login(credentials);
			if (!response.ok) return { ok: false, message: response.message };
			const data = await verifyToken(response.token);
			if (!data) return { ok: false, message: 'Token no valido' };

			set({ userId: data.userId, isAdmin: data.role === 'admin' });
			return {
				ok: true,
				message: response.message,
			};
		} catch (error) {
			set({  userId: '', isAdmin: false });
			return { ok: false, message: 'Error del servidor', };
		}
	},
	logout: () => {
		logout();
		set({ userId: '' });
	},
}));
