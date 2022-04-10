import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { gerarId } from "../util";

export interface Lista {
    id: string,
    nome: string,
}

const initialState: Lista[] = [];

const listaSlice = createSlice({
    name: 'listas',
    initialState,
    reducers: {
        adicionarItem: (state) => {
            const dataAtual = new Date();
            const nome = dataAtual.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
            });

            const novaLista: Lista = {
                id: gerarId('lista'),
                nome,
            };

            state.push(novaLista);
        },

        removerItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            return state.filter(item => item.id !== id);
        },

        alterarItem: (state, action: PayloadAction<Lista>) => {
            const novaLista = action.payload;

            // Substituir item pela nova versão
            return state.map(lista => {
                if (lista.id === novaLista.id) {
                    return novaLista;
                } else {
                    return lista;
                }
            });
        },
    },
});

export const { adicionarItem, removerItem, alterarItem } = listaSlice.actions;

export default listaSlice.reducer;