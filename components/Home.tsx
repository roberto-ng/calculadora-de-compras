import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, FAB, Text, TextInput } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'
import TextInputMask from 'react-native-text-input-mask'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { gerarId } from '../util'
import { adicionarItem, Item } from '../redux/itens'

const Home: FunctionComponent = () => {
    const itens = useAppSelector(store => store.itens);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [novoItemNome, setNovoItemNome] = useState('');
    const [novoItemValor, setNovoItemValor] = useState('R$ ');
    const [novoItemQtd, setNovoItemQtd] = useState('1');

    const dispatch = useAppDispatch();

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['55%', '80%'], []);

    const handleFabPress = () => {
        sheetRef.current?.snapToIndex(0);
    };

    const handleAdicionarItemPress = () => {
        const id = gerarId('itemCompra');
        // Transformar valor em um número válido
        const valor = novoItemValor
            .replace('R$', '')
            .replace(',', '.')
            .trim();

        const item: Item = {
            id,
            valor,
            nome: novoItemNome,
            quantidade: novoItemQtd,
        };

        dispatch(adicionarItem(item));

        // Resetar formulário
        setNovoItemNome('');
        setNovoItemValor('R$ ');
        setNovoItemQtd('1');

        // Fechar bottom sheet
        sheetRef.current?.close();
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
            <Text>Olá mundo</Text>

            {itens.map(item => (
                <View key={item.id}>
                    <Text>{item.nome}</Text>
                </View>
            ))}

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                index={-1}
                onChange={handleSheetChange}
            >
                <View style={styles.bottomSheetContainer}>
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