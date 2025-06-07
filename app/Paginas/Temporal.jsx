// app/Paginas/ProducaoTempoChart.jsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';

// --- INÍCIO DOS COMPONENTES, CONSTANTES E ESTILOS INTEGRADOS ---

const screenWidth = Dimensions.get('window').width;

const InfoMessage = ({ icon, title, message }) => (
    <View style={styles.messageContainer}>
        <MaterialCommunityIcons name={icon} size={48} color="#9aa5b1" />
        <Text style={styles.messageTitle}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
    </View>
);

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(15, 52, 96, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginVertical: 10,
        marginHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
    },
    chartTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#1a2536',
        marginBottom: 15, textAlign: 'center',
    },
    messageContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        padding: 20, minHeight: 280,
    },
    messageTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10,
    },
    messageText: {
        fontSize: 14, color: '#6e7a8a', textAlign: 'center', marginTop: 5,
    },
});

// --- FIM DOS COMPONENTES, CONSTANTES E ESTILOS INTEGRADOS ---


export default function ProducaoTempoChart() {
    const { data: chartData, loading, error } = useChartData('/api/producao-materiais-tempo');
    
    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0f3460" /></View>;
    }
    if (error) {
        return <View style={styles.container}><InfoMessage icon="alert-circle-outline" title="Erro ao Carregar" message={error.message} /></View>;
    }
    if (!chartData || chartData.labels.length === 0) {
        return <View style={styles.container}><InfoMessage icon="information-outline" title="Sem Dados" message="Não há dados de produção para exibir." /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.chartTitle}>Produção: Plástico vs. Metal</Text>
            <LineChart
                data={chartData}
                width={screenWidth - 32} // padding horizontal (16*2)
                height={250}
                chartConfig={{...chartConfig, strokeWidth: 3}}
                bezier
                withShadow={true}
            />
        </View>
    );
}