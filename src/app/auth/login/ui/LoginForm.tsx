'use client';

import { useUserStore } from '@/store/auth/user.store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useUiStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

export const LoginForm = () => {
    const { toast } = useToast()
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const closeSideMenu = useUiStore((state) => state.closeSideMenu);
    const login = useUserStore((state) => state.login);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setEmail(localStorage.getItem('email') || '');
            setRememberMe(localStorage.getItem('rememberMe') === 'true');
        }
        closeSideMenu();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        const response = await login({ email, password, rememberMe });
        if (!response.ok) {
            setTimeout(() => {
                setIsSubmitting(false);
                toast({
                    variant: "destructive",
                    description: response.message === 'Credenciales Incorrectas' ? 'Credenciales Incorrectas' : 'Mantenimiento del servidor',
                    duration: 1000,
                });
            }, 500);
    
            return;
        }

        rememberMe
            ? (localStorage.setItem('email', email), localStorage.setItem('rememberMe', 'true'))
            : (localStorage.removeItem('email'), localStorage.removeItem('rememberMe'));

        setTimeout(() => {
            router.push('');
        }, 500);
    };

    return (
        <div className="w-96">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleSubmit} method="POST">
                {/* Username Input */}
                <div className="mb-4">
                    <label className="block text-gray-600">Correo</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autoComplete="off"
                    />
                </div>
                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-gray-600">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autoComplete="off"
                    />
                </div>
                {/* Remember Me Checkbox */}
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="text-blue-500"
                    />
                    <label className="text-gray-600 ml-2">Recordar usuario</label>
                </div>
                {/* Login Button */}
                <LoginButton isSubmitting={isSubmitting} />
            </form>
        </div>
    );
};

function LoginButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={clsx('font-semibold rounded-md py-2 px-4 w-full', {
                'bg-blue-500 hover:bg-blue-600 text-white': !isSubmitting,
                'bg-gray-400 text-gray-700': isSubmitting,
            })}
        >
            {isSubmitting ? 'Enviando...' : 'Ingresar'}
        </button>
    );
}