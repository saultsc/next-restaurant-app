import jwt, { SignOptions, JwtPayload as JwtPayloadBase } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

interface JwtPayload extends JwtPayloadBase {
	userId: string;
}
export const signToken = async (
	payload: JwtPayload,
	expiresIn: string | number = '1h'
): Promise<string> => {
	const options: SignOptions = { expiresIn };
	return new Promise((resolve, reject) => {
		jwt.sign(payload, SECRET_KEY, options, (err, token) => {
			if (err) {
				reject(err);
			} else {
				resolve(token as string);
			}
		});
	});
};

// Función asíncrona para verificar un token JWT
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
	return new Promise((resolve) => {
		jwt.verify(token, SECRET_KEY, (err, decoded) => {
			if (err) {
				console.error('Token verification failed:', err);
				resolve(null);
			} else {
				resolve(decoded as JwtPayload);
			}
		});
	});
};
