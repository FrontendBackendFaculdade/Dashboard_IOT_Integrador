// app/Paginas/MixPorMaterialChart.jsx

import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
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



export default function MixPorMaterialChart() {
    const { data: chartData, loading, error } = useChartData('/api/mix-por-material');
    
    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#0f3460" /></View>;
    }
    if (error) {
        return <View style={styles.container}><InfoMessage icon="alert-circle-outline" title="Erro ao Carregar" message={error.message} /></View>;
    }
    if (!chartData || Object.keys(chartData).length === 0) {
        return <View style={styles.container}><InfoMessage icon="information-outline" title="Sem Dados" message="Não há dados de materiais para exibir." /></View>;
    }

    return (
        <ScrollView>
            {/* Cria um card de gráfico de pizza para cada material retornado pela API */}
            {Object.keys(chartData).map(materialNome => (
                <View key={materialNome} style={styles.container}>
                    <Text style={styles.chartTitle}>Mix de Tamanhos: {materialNome}</Text>
                    <PieChart
                        data={chartData[materialNome]}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"quantidade"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        absolute
                    />
                </View>
            ))}
        </ScrollView>
    );
}