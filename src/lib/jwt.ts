import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
const secret = new TextEncoder().encode(SECRET_KEY);

interface JwtPayload {
	userId: string;
	[key: string]: any;
}

export const signToken = async (
	payload: JwtPayload,
	expiresIn: string | number = '1h'
): Promise<string> => {
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(expiresIn)
		.sign(secret);
	return jwt;
};

// Función asíncrona para verificar un token JWT
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload as JwtPayload;
	} catch (err) {
		console.error('Token verification failed:', err);
		return null;
	}
};
