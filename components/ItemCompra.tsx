import React, { FunctionComponent, useMemo } from "react";
import { ListRenderItem } from "react-native";
import { IconButton, List } from "react-native-paper";
import { Item } from "../redux/itens";
import { getValorMonetario } from "../util";

type Props = {
    item: Item,
    index: number,
    onIconeEditarPress: (item: Item) => void,
    onIconeDeletarPress: (id: string) => void,
};

const ItemCompra: FunctionComponent<Props> = ({
    item, 
    onIconeEditarPress,
    onIconeDeletarPress,
}) => {
    const descricao = useMemo(() => {
        const valor = getValorMonetario(item.valor);
        const valorFormatado = valor
            .toFormat('$0.00')
            .replace('.', ',');

        if (item.quantidade != 1) {
            const total = valor
                .multiply(item.quantidade)
                .toFormat('$0.00')
                .replace('.', ',');
    
            return `Valor: ${valorFormatado} x ${item.quantidade} = ${total}`;
        } else {
            return `Valor: ${valorFormatado}`;
        }
    }, [item]);

    return (
        <List.Item
            title={item.nome}
            description={descricao}
            right={() => (
                <>
                    <IconButton 
                        icon="pencil"
                        onPress={() => onIconeEditarPress(item)}
                    />

                    <IconButton
                        icon="delete"
                        onPress={() => onIconeDeletarPress(item.id)}
                    />
                </>
            )}
        />
    );
};

export default ItemCompra;