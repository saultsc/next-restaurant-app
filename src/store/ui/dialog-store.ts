import { create } from 'zustand';

interface State {
	isDialogOpen: boolean;
	isSaving: boolean;
	isEditing: boolean;
	isDeleting: boolean;
	dialogContent: React.ReactNode;
	dialogTitle: string;
	currentItemId: string | number | null;

	openDialog: () => void;
	openDialogEditMode: (title: string, content: React.ReactNode) => void;
	closeDialog: () => void;
}

export const useDialogStore = create<State>((set) => ({
	isDialogOpen: false,
	isSaving: false,
	isEditing: false,
	isDeleting: false,
	dialogContent: null,
	dialogTitle: '',
	currentItemId: null,

	openDialog() {
		set({
			isDialogOpen: true,
			isEditing: false,
			isDeleting: false,
		});
	},
	openDialogEditMode(title: string, content: React.ReactNode) {
		set({ isDialogOpen: true, isEditing: true, dialogContent: content, dialogTitle: title });
	},
	closeDialog() {
		set({
			isDialogOpen: false,
			isSaving: false,
			isEditing: false,
			isDeleting: false,
			dialogContent: null,
			dialogTitle: '',
			currentItemId: null,
		});
	},
}));
