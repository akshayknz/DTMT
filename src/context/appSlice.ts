import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveUserOrganization } from '../db';
import { UserOrganizationProps, PageStatus, OrganizationProps } from '../interfaces/interfaces';
import { RootState } from './store';

interface AppState {
  userId: string;
  createOrgName: string;
  organizationCreated: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateUserProfileStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  organization:UserOrganizationProps;
}

const initialState: AppState = {
  createOrgName: "",
  userId: "",
  organizationCreated: 'idle',
  updateUserProfileStatus: 'idle',
  organization:null
  
};
export const saveUserOrganizationThunk = createAsyncThunk(
  'app/saveUserOrganization',
  async (v,thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    console.log("before");
    let organization:UserOrganizationProps={
      name: '',
      id: '',
      status: PageStatus.ACTIVE,
      selected: true
    }
    try {
      organization = await saveUserOrganization({
        orgData: {
          name: state.app.createOrgName,
          id: state.app.userId,
          selected: true,
          status: PageStatus.ACTIVE,
        },
        userId:state.app.userId,
      });
    } catch (error) {
      console.log(error,state.app.userId);
      
    }
    
    console.log(organization,state.app.createOrgName);
    // navigate(`/dashboard/org/${organization.slug}`);

  }
);
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
    incrementByAmount: (state, action: PayloadAction<number>) => {
    },
  },extraReducers: (builder) => {
    builder
      .addCase(saveUserOrganizationThunk.pending, (state) => {
        state.organizationCreated = 'loading';
      })
      .addCase(saveUserOrganizationThunk.fulfilled, (state, action) => {
        state.organizationCreated = 'succeeded';
      })
      .addCase(saveUserOrganizationThunk.rejected, (state) => {
        state.organizationCreated = 'failed';
      });
  },
});

export const { incrementByAmount, setCreateOrgName, saveUserId } = appSlice.actions;
export default appSlice.reducer;