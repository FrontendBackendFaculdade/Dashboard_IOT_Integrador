// app/components/ChartComponents.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componente para exibir mensagens de erro, loading ou "sem dados"
export const InfoMessage = ({ icon, title, message }) => (
    <View style={styles.messageContainer}>
        <MaterialCommunityIcons name={icon} size={48} color="#9aa5b1" />
        <Text style={styles.messageTitle}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
    </View>
);

// Configuração de cores e aparência base para todos os gráficos
export const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(15, 52, 96, ${opacity})`, // Azul escuro SENAI
    labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#0f3460',
    },
};

// Estilos compartilhados para os containers e textos
export const sharedStyles = StyleSheet.create({
    // Estilo principal para o "card" que segura o gráfico
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
        marginHorizontal: 10,
        // Sombra para dar um efeito de elevação (UX)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Sombra para Android
    },
    // Estilo para o título de cada gráfico
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a2536',
        marginBottom: 15,
        textAlign: 'center',
    },
    // Estilo para o gráfico em si, para garantir espaçamento
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

// Estilos específicos para o componente InfoMessage
const styles = StyleSheet.create({
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 250, // Garante uma altura mínima mesmo sem dados
    },
    messageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    messageText: {
        fontSize: 14,
        color: '#6e7a8a',
        textAlign: 'center',
        marginTop: 5,
    },
});