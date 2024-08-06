'use client';

import { Button } from '@/components/ui/button';
import { IoCloseOutline, IoTrashOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { useDialogStore } from '@/store';

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
            closeDialog();
        }
    };

    return (
        <div>
            {/* Background */}
            {isOpen && (
                <div
                    onClick={closeDialog}
                    className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
                />
            )}

            {/* Blur */}
            {isOpen && (
                <div
                    onClick={closeDialog}
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                />
            )}

            {/* Dialog */}
            <div
                className={clsx(
                    'fixed top-1/2 left-1/2 w-[400px] h-[200px] rounded-sm bg-white z-20 shadow-2xl transform transition-all duration-200',
                    {
                        'opacity-0 scale-50': !isOpen,
                        'opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2': isOpen,
                    }
                )}
            >
                <header className="flex justify-between w-full h-16 border-b-2 bg-red-500 rounded-t-sm text-white p-4">
                    <h1 className="font-bold text-xl">Confirmar Eliminación</h1>
                    <IoCloseOutline
                        onClick={closeDialog}
                        size={30}
                        className="cursor-pointer hover:text-black/80"
                    />
                </header>
                <div className="p-4">
                    <p>¿Estás seguro de que deseas eliminar el {entityName} con ID {currentItemId}?</p>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="destructive" onClick={handleConfirm}>
                            <IoTrashOutline size={20} className="mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};