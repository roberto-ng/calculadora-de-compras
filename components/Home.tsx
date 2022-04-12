import React, { FunctionComponent, memo, useCallback, useMemo, useRef, useState } from 'react'
import { ListRenderItem, StatusBar, StyleSheet, View } from 'react-native'
import { Button, FAB, Divider, Text, TextInput, List, IconButton } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'
import TextInputMask from 'react-native-text-input-mask'
import Dinero from 'dinero.js'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { gerarId, getValorMonetario } from '../util'
import { adicionarItem, Item } from '../redux/itens'
import { FlatList } from 'react-native-gesture-handler'
import ItemCompra from './ItemCompra'

const Home: FunctionComponent = () => {
    const itens = useAppSelector(store => store.itens);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [novoItemNome, setNovoItemNome] = useState('');
    const [novoItemValor, setNovoItemValor] = useState('R$ ');
    const [novoItemQtd, setNovoItemQtd] = useState('1');

    const dispatch = useAppDispatch();

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['55%', '80%'], []);
    
    const valorFinal = useAppSelector(store => {
        // Converter valores para valores monetários
        const valores = store.itens.map(item => getValorMonetario(item.valor));
        
        let valorFinal = Dinero({
            amount: 0,
            currency: 'BRL',
        });

        for (const valor of valores) {
            valorFinal = valorFinal.add(valor);
        }

        return valorFinal
            .toFormat('$0.00')
            .replace('.', ',');
    });

    const handleFabPress = () => {
        sheetRef.current?.snapToIndex(0);
        setIsSheetOpen(true);
    };

    const handleAdicionarItemPress = () => {
        const id = gerarId('itemCompra');
        const item: Item = {
            id,
            nome: novoItemNome,
            valor: novoItemValor,
            quantidade: Number.parseInt(novoItemQtd),
        };

        // Adicionar item
        dispatch(adicionarItem(item));

        // Resetar formulário
        setNovoItemNome('');
        setNovoItemValor('R$ ');
        setNovoItemQtd('1');

        // Fechar bottom sheet
        sheetRef.current?.close();
    };

    const fecharBottomSheet = () => {
        sheetRef.current?.close();
        setIsSheetOpen(false);
    };

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
                renderItem={(props) => <ItemCompra {...props} />}
                ListFooterComponent={() => (
                    <List.Item
                        title="Total"
                        description={`Valor: ${valorFinal}`}
                    />
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
                        <Button
                            mode="contained"
                            color="crimson"
                            style={{ marginTop: 12 }}
                            onPress={handleAdicionarItemPress}
                        >
                            Adicionar item
                        </Button>
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