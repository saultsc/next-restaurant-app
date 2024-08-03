import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

interface JwtPayload extends JWTPayload {
	userId: string;
	[key: string]: any;
}

export const signToken = async (payload: JwtPayload, expiresIn: string = '1h'): Promise<string> => {
	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(expiresIn)
		.sign(SECRET_KEY);
	return token;
};

export const verifyToken = async (token: string | undefined): Promise<JwtPayload | null> => {
	if (!token) {
		console.log('Token is undefined');
		return null;
	}

	try {
		const { payload } = await jwtVerify(token, SECRET_KEY);
		return payload as JwtPayload;
	} catch (err) {
		console.log('Token verification failed:', err);
		return null;
	}
};
