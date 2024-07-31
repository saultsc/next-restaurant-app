import create from 'zustand';
import { checkAuthAction } from './actions';
import { AuthStatus, User } from '@/interfaces';
import { login } from '@/app/auth/login/action/auth.action';

interface AuthState {
	authStatus: AuthStatus;
	user: User | null;
	token: string;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	checkAuthStatus: () => Promise<boolean>;
	isChecking: () => boolean;
	isAuthenticated: () => boolean;
	isAdmin: () => boolean;
	username: () => string | undefined;
}

const useAuthStore = create<AuthState>((set) => ({
	authStatus: AuthStatus.Checking,
	user: null,
	token: '',

	login: async (email, password) => {
		const loginResp = await login({ email, password });
		if (!loginResp.ok) {
			set({ authStatus: AuthStatus.Unauthenticated, user: null, token: '' });
			return false;
		}
		set({
			authStatus: AuthStatus.Authenticated,
			user: loginResp.user!,
			token: loginResp.token!,
		});
		return true;
	},

	logout: () => {
		localStorage.removeItem('token');
		set({ authStatus: AuthStatus.Unauthenticated, user: null, token: '' });
	},

	checkAuthStatus: async () => {
		const statusResp = await checkAuthAction();
		if (!statusResp.ok) {
			set({ authStatus: AuthStatus.Unauthenticated, user: null, token: '' });
			return false;
		}
		set({
			authStatus: AuthStatus.Authenticated,
			user: statusResp.user!,
			token: statusResp.token!,
		});
		return true;
	},

	isChecking: () => get().authStatus === AuthStatus.Checking,
	isAuthenticated: () => get().authStatus === AuthStatus.Authenticated,
	isAdmin: () => get().user?.roles.includes('admin') ?? false,
	username: () => get().user?.name,
}));

export default useAuthStore;
