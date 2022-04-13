import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Um item da lista de compras */
export type Item = {
    id: string,
    nome: string,
    valor: string,
    quantidade: number,
}

const initialState: Item[] = [];

export const itensSlice = createSlice({
    name: 'compraItens',
    initialState,
    reducers: {
        adicionarItem: (state, action: PayloadAction<Item>) => {
            const novoItem = action.payload;
            state.push(novoItem);
        },

        removerItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            return state.filter(item => item.id !== id);
        },

        alterarItem: (state, action: PayloadAction<Item>) => {
            const novoItem = action.payload;
            // Achar o índice do item
            const i = state.findIndex(item => item.id === novoItem.id);
            // Substituir item pela nova versão
            state[i] = novoItem;
        },

        limparLista: () => {
            return [];
        },
    },
});

export const { adicionarItem, removerItem, alterarItem, limparLista } = itensSlice.actions;

export default itensSlice.reducer;