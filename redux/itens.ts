import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { gerarId } from '../util'

export interface Item {
    id: string,
    nome: string,
    valor: string,
    quantidade: number,
}

const initialState: Item[] = [];

export const itemSlice = createSlice({
    name: 'compraItens',
    initialState,
    reducers: {
        adicionarItem: (state) => {
            const novoItem: Item = {
                id: gerarId('itemCompra'),
                nome: '',
                valor: '0',
                quantidade: 0,
            };

            state.push(novoItem);
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

export const { adicionarItem, removerItem, alterarItem, limparLista } = itemSlice.actions;

export default itemSlice.reducer;