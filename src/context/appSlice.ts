import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveUserOrganization } from '../db';
import { UserOrganizationProps, PageStatus, OrganizationProps } from '../interfaces/interfaces';
import { RootState } from './store';

interface AppState {
  userId: string;
  createOrgName: string;
  organization:UserOrganizationProps;
  saveCreateOrganization: number;
  navigateTo: string;
}

const initialState: AppState = {
  createOrgName: "",
  userId: "",
  organization:null,
  saveCreateOrganization: 0,
  navigateTo: "",
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    saveUserOrganization: (state, action: PayloadAction<UserOrganizationProps>) => {
      state.organization = action.payload;
    },
    setCreateOrgName: (state, action) => {
      console.log(action.payload);
      state.createOrgName = action.payload;
    },
    saveUserId: (state,action:PayloadAction<string>) => {
      console.log(action.payload);
      state.userId = action.payload
    },
    saveCreateOrganization: (state, action: PayloadAction<number>) => {
      state.saveCreateOrganization +=1
    },
    setNavigateTo: (state, action: PayloadAction<string>) => {
      state.navigateTo =action.payload;
    },
  }
});

export const { setNavigateTo,saveCreateOrganization, setCreateOrgName, saveUserId } = appSlice.actions;
export default appSlice.reducer;