// StackedBarChartComponent.jsx

import React from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { useChartData } from '../../hooks/useChartData';
import { InfoMessage, chartConfig, sharedStyles } from '../chatComponents';

const screenWidth = Dimensions.get('window').width;

export default function StackedBarChartComponent() {
    const { data: chartData, loading, error } = useChartData('/api/dados-empilhados');
    
    // Criando uma cópia da configuração para poder modificar sem afetar outros gráficos
    const stackedBarChartConfig = {
      ...chartConfig,
      barPercentage: 0.7,
    };

    if (loading) {
        return <View style={sharedStyles.container}><ActivityIndicator size="large" color="#0f3460" /></View>;
    }

    if (error) {
        return <View style={sharedStyles.container}><InfoMessage icon="alert-circle-outline" title="Erro ao Carregar" message={error.message} /></View>;
    }

    if (!chartData || chartData.labels.length === 0) {
        return <View style={sharedStyles.container}><InfoMessage icon="information-outline" title="Sem Dados" message="Não há dados de vendas para exibir." /></View>;
    }

    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.chartTitle}>Vendas Empilhadas</Text>
            <StackedBarChart
                style={sharedStyles.chart}
                data={chartData}
                width={screenWidth - 40} // Largura ajustada
                height={250}
                chartConfig={stackedBarChartConfig}
                hideLegend={false}
            />
        </View>
    );
}