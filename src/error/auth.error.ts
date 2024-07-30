export class InvalidCredentialsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidCredentialsError';
	}
}

export class ServerError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ServerError';
	}
}
