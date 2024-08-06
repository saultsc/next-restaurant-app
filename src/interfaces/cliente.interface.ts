export interface Cliente {
	id: any;
	tipoCliente: string;
	documento: number;
	rnc?: string;
	nombre?: string;
	telefonno?: string;
	dirrecion?: string;
	email?: string;
	limiteCredito: number;
}
