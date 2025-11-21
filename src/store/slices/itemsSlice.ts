import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Item {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  status: string
}

interface ItemsState {
  items: Item[]
  visibleColumns: string[]
  searchTerm: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
}

const allColumns = ['id', 'name', 'description', 'createdAt', 'updatedAt', 'status']

const initialState: ItemsState = {
  items: [],
  visibleColumns: allColumns,
  searchTerm: '',
  sortColumn: null,
  sortDirection: 'asc',
}

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload
    },
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setSortColumn: (state, action: PayloadAction<{ column: string | null; direction: 'asc' | 'desc' }>) => {
      state.sortColumn = action.payload.column
      state.sortDirection = action.payload.direction
    },
    reorderColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload
    },
  },
})

export const { setItems, setVisibleColumns, setSearchTerm, setSortColumn, reorderColumns } = itemsSlice.actions
export default itemsSlice.reducer

