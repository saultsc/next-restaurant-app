'use server';

import { cookies } from 'next/headers';

export const logout = (): void => {
    cookies().set('token', '', { 
        expires: new Date(0), 
        httpOnly: true, 
        maxAge: 0,
    });
};