import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";

const Home: FunctionComponent = () => {
    return (
        <View style={styles.container}>
            <Text>Olá mundo</Text>

            <FAB 
                style={styles.fab}
                icon="plus"
            />
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
});

export default Home;