import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveUserOrganization } from '../db';
import { UserOrganizationProps, PageStatus, OrganizationProps, PageBodyProps } from '../interfaces/interfaces';
import { RootState } from './store';

interface AppState {
  userId: string;
  createOrgName: string;
  organization:UserOrganizationProps;
  saveCreateOrganization: number;
  navigateTo: string;
  editMode:boolean;
  unsaved:boolean;
  history:string[];
  timetravelIndex: number;
}

const initialState: AppState = {
  createOrgName: "",
  userId: "",
  organization:null,
  saveCreateOrganization: 0,
  navigateTo: "",
  editMode:false,
  unsaved:false,
  history:[],
  timetravelIndex: -1,
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    saveUserOrganization: (state, action: PayloadAction<UserOrganizationProps>) => {
      state.organization = action.payload;
    },
    setCreateOrgName: (state, action) => {
      state.createOrgName = action.payload;
    },
    saveUserId: (state,action:PayloadAction<string>) => {
      state.userId = action.payload
    },
    saveCreateOrganization: (state, action: PayloadAction<number>) => {
      state.saveCreateOrganization +=1
    },
    setNavigateTo: (state, action: PayloadAction<string>) => {
      state.navigateTo =action.payload;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload)
      state.editMode = action.payload;
    },
    setUnsaved: (state, action: PayloadAction<boolean>) => {
      state.unsaved = action.payload;
    },
    setHistory: (state, action: PayloadAction<string>) => {
      state.history.push(action.payload)
    },
    setTimetravelIndex: (state, action: PayloadAction<number>) => {
      state.timetravelIndex = action.payload;
    }
  }
});

export const { setNavigateTo,saveCreateOrganization, setCreateOrgName, saveUserId, setEditMode, setUnsaved, setHistory, setTimetravelIndex } = appSlice.actions;
export default appSlice.reducer;

