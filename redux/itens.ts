import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/** Um item da lista de compras */
export interface Item {
    id: string,
    nome: string,
    valor: string,
    quantidade: string,
}

const initialState: Item[] = [];

export const itensSlice = createSlice({
    name: 'compraItens',
    initialState,
    reducers: {
        adicionarItem: (state, action: PayloadAction<Item>) => {
            /*
            const novoItem: Item = {
                id: gerarId('itemCompra'),
                nome: '',
                valor: '0',
                quantidade: '0',
            };
            */

            const novoItem = action.payload;
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

        carregarLista: (_state, action: PayloadAction<Item[]>) => {
            const novaLista = [...action.payload];
            return novaLista;
        },
    },
});

export const { adicionarItem, removerItem, alterarItem, limparLista } = itensSlice.actions;

export default itensSlice.reducer;