'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useDialogStore } from '@/store';
import { IoTrashOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ReconfirmModalProps {
	deleteEntity: (id: number) => void;
	entityName: string;
}

export const ReconfirmModal = ({ deleteEntity, entityName }: ReconfirmModalProps) => {
	const isOpen = useDialogStore((store) => store.isDialogOpen && store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const handleConfirm = () => {
		if (currentItemId !== null) {
			deleteEntity(currentItemId);
			toast.success(`${entityName} eliminado con éxito`);
			closeDialog();
		}
	};

	const handleClose = () => {
		closeDialog();
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle>Confirmar eliminación</DialogTitle>
						<DialogDescription>
							¿Estás seguro de que deseas eliminar este {entityName}?
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<Button onClick={handleConfirm} className="w-full" variant="destructive">
							<IoTrashOutline className="mr-2" />
							Eliminar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
