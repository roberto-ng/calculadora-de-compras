import React, { FunctionComponent, memo, useCallback, useMemo, useRef, useState } from 'react'
import { Alert, ListRenderItem, StatusBar, StyleSheet, View } from 'react-native'
import { Button, FAB, Divider, Text, TextInput, List, IconButton } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'
import TextInputMask from 'react-native-text-input-mask'
import Dinero from 'dinero.js'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { gerarId, getValorMonetario } from '../util'
import { adicionarItem, alterarItem, Item, limparLista, removerItem } from '../redux/itens'
import { FlatList } from 'react-native-gesture-handler'
import ItemCompra from './ItemCompra'

type Modo = 'editar' | 'adicionar';

const Home: FunctionComponent = () => {
    const itens = useAppSelector(store => store.itens);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [novoItemNome, setNovoItemNome] = useState('');
    const [novoItemValor, setNovoItemValor] = useState('R$ ');
    const [novoItemQtd, setNovoItemQtd] = useState('1');
    // Decide se a bottom sheet deve editar ou adicionar um item
    const [modo, setModo] = useState<Modo>('adicionar');
    // Item que vai ser editado
    const [itemEditado, setItemEditado] = useState<Item | null>(null);

    const dispatch = useAppDispatch();

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['55%', '80%'], []);
    
    const valorFinal = useAppSelector(({itens}) => {
        // Converter valores para valores monetários
        let valor = Dinero({
            amount: 0,
            currency: 'BRL',
        });

        for (const item of itens) {
            const valorUnidade = getValorMonetario(item.valor);
            const valorTotalItem = valorUnidade.multiply(item.quantidade);
            valor = valor.add(valorTotalItem);
        }

        return valor
            .toFormat('$0.00')
            .replace('.', ',');
    });

    const handleFabPress = () => {
        sheetRef.current?.snapToIndex(0);
        setIsSheetOpen(true);
        setModo('adicionar');
        setItemEditado(null);

        // Resetar formulário
        setNovoItemNome('');
        setNovoItemValor('R$ ');
        setNovoItemQtd('1');
    };

    const handleIconeAlterarPress = useCallback((item: Item) => {
        sheetRef.current?.snapToIndex(0);
        setIsSheetOpen(true);
        setModo('editar');
        setItemEditado(item);

        setNovoItemNome(item.nome);
        setNovoItemValor(item.valor);
        setNovoItemQtd(item.quantidade.toString());
    }, []);

    const handleIconeDeletarPress = useCallback((id: string) => {
        const aoConfirmar = () => {
            // Remover item
            dispatch(removerItem(id));

            setItemEditado(null);
            // Fechar bottom sheet
            sheetRef.current?.close();
        };

        // Pedir confirmação do usuário
        Alert.alert(
            'Remover item',
            'Tem certeza?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                { 
                    text: 'Tenho certeza', 
                    onPress: aoConfirmar,
                },
            ]
        );
    }, []);

    const handleAdicionarItemPress = () => {
        const id = gerarId('itemCompra');
        let quantidade = Number.parseInt(novoItemQtd);
        if (isNaN(quantidade) || quantidade < 0 || novoItemQtd.length < 1) {
            quantidade = 1;
        }

        const item: Item = {
            id,
            nome: novoItemNome,
            valor: novoItemValor,
            quantidade,
        };

        // Adicionar item
        dispatch(adicionarItem(item));

        // Fechar bottom sheet
        sheetRef.current?.close();
    };

    const handleAlterarItemPress = () => {
        if (itemEditado == null) {
            return;
        }

        const novoItem: Item = {
            ...itemEditado,
            nome: novoItemNome,
            valor: novoItemValor,
            quantidade: Number.parseInt(novoItemQtd),
        }

        // Alterar item
        dispatch(alterarItem(novoItem));

        setItemEditado(null);

        // Fechar bottom sheet
        sheetRef.current?.close();
    };

    const fecharBottomSheet = () => {
        sheetRef.current?.close();
        setIsSheetOpen(false);
    };

    const handleLimparListaPress = () => {
        const aoConfirmar = () => {
            dispatch(limparLista());
            
            setItemEditado(null);
            // Fechar bottom sheet
            sheetRef.current?.close();
        };

        // Pedir confirmação do usuário
        Alert.alert(
            "Limpar lista",
            "Tem certeza?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                { 
                    text: "Tenho certeza", 
                    onPress: aoConfirmar,
                },
            ]
        );
    }

    const handleSheetChange = useCallback((index) => {
        if (index >= 0) {
            setIsSheetOpen(true);
        } else {
            setIsSheetOpen(false);
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="crimson" 
            />

            <FlatList
                data={itens}
                renderItem={(props) => (
                    <ItemCompra 
                        onIconeEditarPress={handleIconeAlterarPress}
                        onIconeDeletarPress={handleIconeDeletarPress}
                        {...props} 
                    />
                )}
                ListFooterComponent={() => (
                    <>
                        {(itens.length != 0) && (
                            <>
                                <Divider/>
                                <List.Item
                                    title="Total"
                                    description={`Valor: ${valorFinal}`}
                                />

                                <Button
                                    color="crimson"
                                    onPress={handleLimparListaPress}
                                >
                                    Limpar Lista
                                </Button>
                            </>
                        )}
                    </>
                )}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center' }}>
                        <Text>Nenhum item na lista</Text>
                    </View>
                )}
                ItemSeparatorComponent={Divider}
            />

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                index={-1}
                onChange={handleSheetChange}
            >
                <View style={styles.bottomSheetContainer}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <IconButton 
                            icon="close"
                            onPress={fecharBottomSheet}
                        />
                    </View>

                    <TextInput 
                        label="Nome"
                        mode="outlined"
                        activeOutlineColor="crimson"
                        style={styles.textInput}
                        value={novoItemNome}
                        onChangeText={(texto) => setNovoItemNome(texto)}
                    />

                    <TextInput 
                        label="Valor"
                        mode="outlined"
                        activeOutlineColor="crimson"
                        style={styles.textInput}
                        keyboardType="number-pad"
                        value={novoItemValor}
                        onChangeText={(texto) => setNovoItemValor(texto)}
                        render={(props: any) => (
                            <TextInputMask
                                {...props}
                                mask="R$ [9999990],[00]"
                            />
                        )}
                    />

                    <TextInput 
                        label="Quantidade"
                        mode="outlined"
                        activeOutlineColor="crimson"
                        style={styles.textInput}
                        keyboardType="number-pad"
                        value={novoItemQtd}
                        onChangeText={(texto) => setNovoItemQtd(texto)}
                        render={(props: any) => (
                            <TextInputMask
                                {...props}
                                mask="[9999990]"
                            />
                        )}
                    />

                    <View style={{ alignItems: 'center' }}>
                        {(modo === 'adicionar') && (
                            <Button
                                mode="contained"
                                color="crimson"
                                style={{ marginTop: 12 }}
                                onPress={handleAdicionarItemPress}
                            >
                                Adicionar item
                            </Button>
                        )}

                        {(modo === 'editar') && (
                            <Button
                                mode="contained"
                                color="crimson"
                                style={{ marginTop: 12 }}
                                onPress={handleAlterarItemPress}
                            >
                                Alterar item
                            </Button>
                        )}
                    </View>
                </View>
            </BottomSheet>

            {(!isSheetOpen) && (
                <FAB 
                    style={styles.fab}
                    icon="plus"
                    onPress={handleFabPress}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: 'crimson',
    },

    bottomSheetContainer: {
        flex: 1,
    },

    textInput: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 5,
    },
});

export default Home;