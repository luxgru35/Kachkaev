import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isModalOpen: boolean;
  modalType: 'create' | 'edit' | 'participants' | null;
  selectedEventId: string | null;
}

const initialState: UIState = {
  isModalOpen: false,
  modalType: null,
  selectedEventId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: 'create' | 'edit' | 'participants'; eventId?: string }>
    ) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type;
      state.selectedEventId = action.payload.eventId || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.selectedEventId = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
