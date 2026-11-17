import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertyService } from '../../services/propertyService';
import { Property, CreatePropertyRequest } from '../../types';

interface PropertyState {
  items: Property[];
  selectedProperty: Property | null;
  myProperties: Property[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  items: [],
  selectedProperty: null,
  myProperties: [],
  isLoading: false,
  error: null,
};

export const fetchAll = createAsyncThunk('property/fetchAll', async () => {
  return await propertyService.getAll();
});

export const fetchById = createAsyncThunk('property/fetchById', async (id: string) => {
  return await propertyService.getById(id);
});

export const fetchMyProperties = createAsyncThunk('property/fetchMyProperties', async () => {
  return await propertyService.getMyProperties();
});

export const create = createAsyncThunk('property/create', async (payload: CreatePropertyRequest) => {
  return await propertyService.create(payload);
});

export const update = createAsyncThunk('property/update', async ({ id, payload }: { id: string; payload: Partial<CreatePropertyRequest> }) => {
  return await propertyService.update(id, payload);
});

export const deleteProperty = createAsyncThunk('property/delete', async (id: string) => {
  await propertyService.delete(id);
  return id;
});

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.selectedProperty = action.payload;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myProperties = action.payload;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.myProperties.push(action.payload);
      });
  },
});

export default propertySlice.reducer;
