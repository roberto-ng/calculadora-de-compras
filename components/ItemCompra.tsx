import React, { useMemo } from "react";
import { ListRenderItem } from "react-native";
import { List } from "react-native-paper";
import { Item } from "../redux/itens";
import { getValorMonetario } from "../util";

const ItemCompra: ListRenderItem<Item> = ({item}) => {
    const descricao = useMemo(() => {
        const valor = getValorMonetario(item.valor);
        const valorFormatado = valor
            .toFormat('$0.00')
            .replace('.', ',');

        if (item.quantidade > 1) {
            const total = valor
                .multiply(item.quantidade)
                .toFormat('$0.00')
                .replace('.', ',');
    
            return `Valor: ${valorFormatado} x ${item.quantidade} = ${total}`;
        } else {
            return `Valor: ${valorFormatado}`;
        }
    }, []);

    return (
        <List.Item
            title={item.nome}
            description={descricao}
        />
    );
};

export default ItemCompra;