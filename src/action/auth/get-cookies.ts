'use server';

import { cookies } from 'next/headers';

export const getCookies = (cookieName: string): string => {
	const value = cookies().get(cookieName)?.value;

	if (!value) return '';

	return value;
};
