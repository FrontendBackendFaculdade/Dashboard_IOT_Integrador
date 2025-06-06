// SerieTemporalChart.jsx

import React from 'react';
import { View, ScrollView, Dimensions, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useChartData } from '../../hooks/useChartData';
import { InfoMessage, chartConfig, sharedStyles } from '../chatComponents';

const screenWidth = Dimensions.get('window').width;

export default function SerieTemporalChart() {
    const { data: chartData, loading, error } = useChartData('/api/dados-temporais');

    // UX: Centraliza o indicador de carregamento
    if (loading) {
        return <View style={sharedStyles.container}><ActivityIndicator size="large" color="#0f3460" /></View>;
    }

    if (error) {
        return <View style={sharedStyles.container}><InfoMessage icon="alert-circle-outline" title="Erro ao Carregar" message={error.message} /></View>;
    }

    if (!chartData || chartData.labels.length === 0) {
        return <View style={sharedStyles.container}><InfoMessage icon="information-outline" title="Sem Dados" message="Não há dados para exibir neste período." /></View>;
    }
    
    // Calcula a largura dinâmica para permitir scroll se houver muitos dados
    const chartWidth = chartData.labels.length > 5 ? screenWidth + (chartData.labels.length - 5) * 60 : screenWidth - 40;

    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.chartTitle}>Movimentações Mensais</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                    data={chartData}
                    width={chartWidth}
                    height={250}
                    chartConfig={chartConfig}
                    bezier
                    style={sharedStyles.chart}
                />
            </ScrollView>
        </View>
    );
}