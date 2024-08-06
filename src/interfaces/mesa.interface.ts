export interface Mesa {
	id: number;
	nombre: string;
	estado: 'disponible' | 'ocupado' | 'reservado'; // Ajusta los valores según los posibles estados
	capacidad: number;
}
