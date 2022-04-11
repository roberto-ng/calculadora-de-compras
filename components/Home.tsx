import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import BottomSheet from '@gorhom/bottom-sheet'

const Home: FunctionComponent = () => {
    const [isSheetOpen, setisSheetOpen] = useState(false);
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const handleFabPress = () => {
        sheetRef.current?.snapToIndex(0);
        setisSheetOpen(true);
    };

    return (
        <View style={styles.container}>
            <Text>Olá mundo</Text>

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                index={-1}
            >
                <View style={styles.bottomSheetContainer}>
                    <Text>Exemplo de texto</Text>
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
        alignItems: 'center',
    },
});

export default Home;