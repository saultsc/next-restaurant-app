import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getMesasBySalaId, postAssignMesa, getMesas } from '@/action';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
	salaId: number;
	salaNombre: string;
}

interface Mesa {
	id: number;
	nombre: string;
}

export const MesasAssign = ({ salaId, salaNombre }: Props) => {
	const [availableMesas, setAvailableMesas] = useState<Mesa[]>([]);
	const [assignedMesas, setAssignedMesas] = useState<number[]>([]);
	const [selectedMesas, setSelectedMesas] = useState<number[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		const fetchMesas = async () => {
			try {
				const mesas = await getMesasBySalaId(salaId);
				const assignedMesaIds = mesas.map((mesa: any) => mesa.mesaId);
				setAssignedMesas(assignedMesaIds);
			} catch (error) {
				console.error('Error fetching mesas:', error);
			}
		};
		fetchMesas();
	}, [salaId]);

	useEffect(() => {
		const fetchAvailableMesas = async () => {
			try {
				const { data } = await getMesas({});
				setAvailableMesas(data);
			} catch (error) {
				console.error('Error fetching available mesas:', error);
			}
		};
		fetchAvailableMesas();
	}, []);

	useEffect(() => {
		if (isDialogOpen) {
			setSelectedMesas(assignedMesas);
		}
	}, [isDialogOpen, assignedMesas]);

	const handleCheckboxChange = (mesaId: number) => {
		setSelectedMesas((prevSelected) => {
			const newSelected = prevSelected.includes(mesaId)
				? prevSelected.filter((id) => id !== mesaId)
				: [...prevSelected, mesaId];
			return newSelected;
		});
	};

	const handleSubmit = async () => {
		try {
			const result = await postAssignMesa(salaId, selectedMesas);
			if (!result.ok) {
				return toast.error('No se pudo asignar las mesas');
			}
			setAssignedMesas(selectedMesas);

			toast.success('Mesas asignadas correctamente', {
				style: { backgroundColor: 'green', color: 'white' },
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error assigning mesas:', error);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					className="bg-blue-500 hover:bg-blue-700 hover:text-white text-white"
					variant="outline"
					onClick={() => setIsDialogOpen(true)}
				>
					Asignar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Asignar mesas a sala {salaNombre}</DialogTitle>
					<div className="mt-2">
						<DialogDescription>
							Selecciona las mesas que deseas asignar a esta sala.
						</DialogDescription>
					</div>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-4">
						<span className="font-semibold">Mesas disponibles</span>
						<div className="grid grid-cols-3 gap-4">
							{availableMesas.map((mesa) => (
								<div key={mesa.id} className="flex items-center space-x-2">
									<label htmlFor={`mesa${mesa.id}`} className="text-gray-700">
										{mesa.nombre}
									</label>
									<input
										type="checkbox"
										id={`mesa${mesa.id}`}
										checked={selectedMesas.includes(mesa.id)}
										onChange={() => handleCheckboxChange(mesa.id)}
										className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
									/>
								</div>
							))}
						</div>
					</div>
					<div className="grid grid-cols-3 gap-4 mt-4">
						<span className="font-semibold">Mesas asignadas</span>
						<div className="col-span-2 flex flex-wrap gap-2">
							{assignedMesas.map((mesaId) => (
								<div
									key={mesaId}
									className="rounded-md px-2 py-1 text-sm bg-blue-500 text-white"
								>
									Mesa {mesaId}
								</div>
							))}
						</div>
					</div>
					<Button type="submit" className="w-full" onClick={handleSubmit}>
						Confirmar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
