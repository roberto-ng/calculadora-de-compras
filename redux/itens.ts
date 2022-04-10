import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
    id: string,
    nome: string,
    valor: string,
    quantidade: number,
}

const initialState: Item[] = [];

export const itemSlice = createSlice({
    name: 'compraItem',
    initialState,
    reducers: {
        adicionarItem: (state) => {
            const novoItem: Item = {
                id: gerarId(),
                nome: '',
                valor: '0',
                quantidade: 0,
            };

            return [...state, novoItem];
        },

        removerItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            return state.filter(item => item.id !== id);
        },

        alterarItem: (state, action: PayloadAction<Item>) => {
            const novoItem = action.payload;

            // Substituir item pela nova versão
            return state.map(item => {
                if (item.id === novoItem.id) {
                    return novoItem;
                } else {
                    return item;
                }
            });
        },

        limparLista: () => {
            return [];
        },
    },
});

/** Gera um ID usando a data e hora atual */
function gerarId() {
    return Date.now().toString();
}

export const { adicionarItem, removerItem, alterarItem, limparLista } = itemSlice.actions;

export default itemSlice.reducer;