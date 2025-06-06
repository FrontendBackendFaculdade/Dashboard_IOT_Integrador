// CategoryChart.jsx

import React from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useChartData } from '../../hooks/useChartData';
import { InfoMessage, chartConfig, sharedStyles } from '../chatComponents';

const screenWidth = Dimensions.get('window').width;

export default function CategoryChart() {
    const { data: chartData, loading, error } = useChartData('/api/dados-categorias');

    if (loading) {
        return <View style={sharedStyles.container}><ActivityIndicator size="large" color="#0f3460" /></View>;
    }

    if (error) {
        return <View style={sharedStyles.container}><InfoMessage icon="alert-circle-outline" title="Erro ao Carregar" message={error.message} /></View>;
    }

    if (!chartData || chartData.length === 0) {
        return <View style={sharedStyles.container}><InfoMessage icon="information-outline" title="Sem Dados" message="Não há dados de categorias para exibir." /></View>;
    }

    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.chartTitle}>Distribuição por Categoria</Text>
            <PieChart
                data={chartData}
                width={screenWidth - 40} // Largura ajustada para o padding
                height={220}
                chartConfig={chartConfig}
                accessor={"quantidade"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]} // Ajusta o centro do gráfico
                absolute // Mostra os valores numéricos em vez de %
            />
        </View>
    );
}