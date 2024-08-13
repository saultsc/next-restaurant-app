import { create } from 'zustand';

interface State {
	isDialogOpen: boolean;
	isSaving: boolean;
	isEditing: boolean;
	isDeleting: boolean;
	dialogTitle: string;
	currentItemId: number | null;

	openDialog: () => void;
	openDialogUpdateMode: (title: string, itemId: number) => void;
	openDialogDeleteMode: (title: string, itemId: number) => void;
	closeDialog: () => void;
}

export const useDialogStore = create<State>((set) => ({
	isDialogOpen: false,
	isSaving: false,
	isEditing: false,
	isDeleting: false,
	dialogTitle: '',
	currentItemId: null,

	openDialog() {
		set({
			isDialogOpen: true,
			isEditing: false,
			isDeleting: false,
		});
	},
	openDialogUpdateMode(title: string, itemId: number) {
		set({
			isDialogOpen: true,
			isEditing: true,
			dialogTitle: title,
			currentItemId: itemId,
		});
	},
	openDialogDeleteMode(title: string, itemId: number) {
		set({ isDialogOpen: true, isDeleting: true, dialogTitle: title, currentItemId: itemId });
	},
	closeDialog() {
		set({
			isDialogOpen: false,
			isSaving: false,
			isEditing: false,
			isDeleting: false,
			dialogTitle: '',
		});
	},
}));
