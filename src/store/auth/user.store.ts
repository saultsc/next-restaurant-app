import { Credentials, login } from '@/action';
import { logout } from '@/action/auth/logout.action';
import { verifyToken } from '@/lib/jwt';
import { create } from 'zustand';

interface Response {
	ok: boolean;
	message: string;
}

interface UserStore {
	isAuthorized: boolean;
	userId: string;
	isAdmin: boolean;
	login(credentials: Credentials): Promise<Response>;
	logout(): void;
}

export const useUserStore = create<UserStore>((set) => ({
	isAuthorized: false,
	userId: '',
	isAdmin: false,
	login: async (credentials: Credentials) => {
		try {
			const response = await login(credentials);
			if (!response.ok) return { ok: false, message: response.message };
			const data = await verifyToken(response.token);
			if (!data) return { ok: false, message: 'Token no valido' };

			set({ isAuthorized: true, userId: data.userId, isAdmin: data.role === 'admin' });
			return {
				ok: true,
				message: response.message,
			};
		} catch (error) {
			set({ isAuthorized: false, userId: '', isAdmin: false });
			return { ok: false, message: 'Error del servidor', nextRoute: '/auth/login' };
		}
	},
	logout: () => {
		logout();
		set({ isAuthorized: false, userId: '', isAdmin: false });
	},
}));
