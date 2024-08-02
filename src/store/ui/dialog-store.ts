import { create } from "zustand";

interface State {
  isDialogOpen: boolean;
  isSaving: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  dialogContent: React.ReactNode;
  dialogTitle: string;
  currentItemId: string | number | null;

  openDialogSaveMode: (title: string, content: React.ReactNode) => void;
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

  openDialogSaveMode (title: string, content: React.ReactNode, itemId: string | number) {
    set({ isDialogOpen: true, isEditing: false, dialogContent: content, dialogTitle: title, currentItemId: itemId });
  },
  openDialogEditMode (title: string, content: React.ReactNode) {
    set({ isDialogOpen: true, isEditing: true, dialogContent: content, dialogTitle: title });
  },
  closeDialog () {
    set({ isDialogOpen: false, isSaving: false, isEditing: false, isDeleting: false, dialogContent: null, dialogTitle: '', currentItemId: null });
  }
}));