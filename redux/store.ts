import { configureStore } from '@reduxjs/toolkit'
import itensSlice from './itens'

const store = configureStore({
    reducer: {
        itens: itensSlice,
    },
});

export default store;