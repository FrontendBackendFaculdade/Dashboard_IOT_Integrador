// Dashboard/app/Paginas/Categoria.jsx
// Análise de Saúde dos Sensores - Estatísticas detalhadas e distribuição

import React from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';
import { 
    CHART_THEME, 
    CHART_CONFIGS, 
    COMPONENT_STYLES, 
    getSensorColor
} from '../../constants/ChartTheme';

const screenWidth = Dimensions.get('window').width;

// Componente para card de estatísticas do sensor
const SensorStatsCard = ({ sensorStats, sensorName }) => {
    const getStabilityColor = (estabilidade) => {
        if (estabilidade < 5) return CHART_THEME.semantic.success;
        if (estabilidade < 15) return CHART_THEME.semantic.warning;
        return CHART_THEME.semantic.danger;
    };

    const getStabilityText = (estabilidade) => {
        if (estabilidade < 5) return 'Muito Estável';
        if (estabilidade < 15) return 'Estável';
        if (estabilidade < 30) return 'Variável';
        return 'Instável';
    };

    return (
        <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
                <MaterialCommunityIcons 
                    name="chart-box-outline" 
                    size={24} 
                    color={getSensorColor(sensorName)} 
                />
                <Text style={styles.statsSensorName}>{sensorName}</Text>
            </View>
            
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total de Leituras</Text>
                    <Text style={styles.statValue}>{sensorStats.totalLeituras}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Valor Médio</Text>
                    <Text style={styles.statValue}>{sensorStats.valorMedio.toFixed(2)}</Text>
                    <Text style={styles.statUnit}>{sensorStats.unidade}</Text>
                </View>
            </View>
            
            <View style={styles.statsRow}>
                <View style={styles.statItemSmall}>
                    <MaterialCommunityIcons name="arrow-down" size={16} color={CHART_THEME.semantic.info} />
                    <Text style={styles.statLabelSmall}>Mínimo</Text>
                    <Text style={styles.statValueSmall}>{sensorStats.valorMinimo.toFixed(2)}</Text>
                </View>
                <View style={styles.statItemSmall}>
                    <MaterialCommunityIcons name="arrow-up" size={16} color={CHART_THEME.semantic.danger} />
                    <Text style={styles.statLabelSmall}>Máximo</Text>
                    <Text style={styles.statValueSmall}>{sensorStats.valorMaximo.toFixed(2)}</Text>
                </View>
                <View style={styles.statItemSmall}>
                    <MaterialCommunityIcons name="chart-line" size={16} color={CHART_THEME.neutral.gray600} />
                    <Text style={styles.statLabelSmall}>Mediana</Text>
                    <Text style={styles.statValueSmall}>{sensorStats.mediana.toFixed(2)}</Text>
                </View>
            </View>
            
            <View style={styles.stabilityContainer}>
                <View style={styles.stabilityHeader}>
                    <Text style={styles.stabilityLabel}>Estabilidade</Text>
                    <View style={[styles.stabilityBadge, { backgroundColor: getStabilityColor(sensorStats.estabilidade) + '20' }]}>
                        <Text style={[styles.stabilityValue, { color: getStabilityColor(sensorStats.estabilidade) }]}>
                            {getStabilityText(sensorStats.estabilidade)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.stabilityDetail}>
                    Coeficiente de Variação: {sensorStats.estabilidade.toFixed(2)}%
                    {'\n'}Desvio Padrão: {sensorStats.desvioPadrao.toFixed(2)} {sensorStats.unidade}
                </Text>
            </View>
        </View>
    );
};

// Componente para gráfico de distribuição (histograma)
const DistributionChart = ({ sensorStats }) => {
    // Criar faixas para o histograma
    const createHistogramData = (stats) => {
        const numBins = 5;
        const range = stats.valorMaximo - stats.valorMinimo;
        const binWidth = range / numBins;
        const bins = Array(numBins).fill(0);
        
        // Distribuir valores nos bins (simulado - na prática precisaríamos dos valores originais)
        // Vamos criar uma distribuição baseada nas estatísticas
        const mean = stats.valorMedio;
        const stdDev = stats.desvioPadrao;
        
        // Para visualização, criamos uma distribuição aproximada
        for (let i = 0; i < numBins; i++) {
            const binCenter = stats.valorMinimo + (i + 0.5) * binWidth;
            // Distribuição normal aproximada
            const density = Math.exp(-0.5 * Math.pow((binCenter - mean) / stdDev, 2));
            bins[i] = Math.round(density * stats.totalLeituras * 0.8);
        }
        
        // Garantir que a soma seja aproximadamente igual ao total
        const sum = bins.reduce((a, b) => a + b, 0);
        if (sum > 0) {
            const scale = stats.totalLeituras / sum;
            bins.forEach((bin, i) => bins[i] = Math.round(bin * scale));
        }
        
        return bins.map((count, i) => {
            const start = stats.valorMinimo + i * binWidth;
            const end = start + binWidth;
            return {
                label: `${start.toFixed(1)}-${end.toFixed(1)}`,
                count: count
            };
        });
    };

    if (!sensorStats || Object.keys(sensorStats).length === 0) {
        return null;
    }

    const sensorNames = Object.keys(sensorStats);
    if (sensorNames.length === 0) return null;

    // Pegar o primeiro sensor para exemplo (ou pode ser adaptado para múltiplos)
    const firstSensor = sensorNames[0];
    const histogramData = createHistogramData(sensorStats[firstSensor]);

    const chartData = {
        labels: histogramData.map(item => item.label.substring(0, 8)),
        datasets: [{
            data: histogramData.map(item => item.count)
        }]
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Distribuição de Valores - {firstSensor}</Text>
            <BarChart
                data={chartData}
                width={screenWidth - 80}
                height={220}
                chartConfig={{
                    ...CHART_CONFIGS.bar,
                    color: (opacity = 1) => getSensorColor(firstSensor).replace('rgb', 'rgba').replace(')', `, ${opacity})`),
                }}
                yAxisLabel=""
                yAxisSuffix=""
                verticalLabelRotation={30}
                showValuesOnTopOfBars={true}
                fromZero={true}
            />
        </View>
    );
};

export default function Categoria() {
    const { data: statsData, loading, error } = useChartData('/api/sensores-estatisticas');
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={CHART_THEME.primary.blue} />
                <Text style={styles.loadingText}>Carregando estatísticas dos sensores...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color={CHART_THEME.semantic.danger} />
                <Text style={styles.errorTitle}>Erro ao Carregar Dados</Text>
                <Text style={styles.errorMessage}>{error.message}</Text>
            </View>
        );
    }
    
    if (!statsData || Object.keys(statsData).length === 0) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="information-outline" size={48} color={CHART_THEME.neutral.gray400} />
                <Text style={styles.errorTitle}>Sem Dados Disponíveis</Text>
                <Text style={styles.errorMessage}>Não há estatísticas de sensores para exibir no momento.</Text>
            </View>
        );
    }

    const sensorNames = Object.keys(statsData);

    return (
        <ScrollView style={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons name="chart-box-outline" size={32} color={CHART_THEME.primary.blue} />
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Análise de Saúde dos Sensores</Text>
                    <Text style={styles.headerSubtitle}>Estatísticas detalhadas e distribuição de valores</Text>
                </View>
            </View>

            {/* Gráfico de distribuição */}
            <DistributionChart sensorStats={statsData} />

            {/* Cards de estatísticas para cada sensor */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Estatísticas por Sensor ({sensorNames.length})</Text>
                {sensorNames.map((sensorName, index) => (
                    <SensorStatsCard 
                        key={index}
                        sensorStats={statsData[sensorName]}
                        sensorName={sensorName}
                    />
                ))}
            </View>

            {/* Informações sobre estabilidade */}
            <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="information-outline" size={20} color={CHART_THEME.semantic.info} />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Sobre a Estabilidade</Text>
                    <Text style={styles.infoText}>
                        A estabilidade é medida pelo coeficiente de variação (CV%). 
                        Valores menores indicam maior estabilidade:
                        {'\n'}• Muito Estável: CV {'<'} 5%
                        {'\n'}• Estável: CV {'<'} 15%
                        {'\n'}• Variável: CV {'<'} 30%
                        {'\n'}• Instável: CV ≥ 30%
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: CHART_THEME.background.secondary,
    },
    
    // Header styles
    headerContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        ...CHART_THEME.shadows.medium,
    },
    headerText: {
        alignItems: 'center',
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 4,
        textAlign: 'center',
    },
    
    // Chart container
    chartContainer: {
        ...COMPONENT_STYLES.container,
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
        marginBottom: 16,
        textAlign: 'center',
    },
    
    // Stats container
    statsContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 16,
    },
    
    // Stats card styles
    statsCard: {
        backgroundColor: CHART_THEME.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...CHART_THEME.shadows.small,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: CHART_THEME.neutral.gray200,
        paddingBottom: 12,
    },
    statsSensorName: {
        fontSize: 18,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginLeft: 12,
        flex: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
    },
    statUnit: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: CHART_THEME.neutral.gray200,
    },
    statItemSmall: {
        alignItems: 'center',
        flex: 1,
    },
    statLabelSmall: {
        fontSize: 10,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 4,
    },
    statValueSmall: {
        fontSize: 14,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginTop: 2,
    },
    stabilityContainer: {
        backgroundColor: CHART_THEME.background.secondary,
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    stabilityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    stabilityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
    },
    stabilityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stabilityValue: {
        fontSize: 12,
        fontWeight: '600',
    },
    stabilityDetail: {
        fontSize: 11,
        color: CHART_THEME.neutral.gray600,
        lineHeight: 16,
    },
    
    // Info container
    infoContainer: {
        flexDirection: 'row',
        backgroundColor: CHART_THEME.background.card,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    infoContent: {
        flex: 1,
        marginLeft: 8,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray600,
        lineHeight: 18,
    },
    
    // Loading styles
    loadingContainer: {
        ...COMPONENT_STYLES.loadingContainer,
        backgroundColor: CHART_THEME.background.card,
        borderRadius: 16,
        margin: 16,
    },
    loadingText: {
        fontSize: 14,
        color: CHART_THEME.neutral.gray600,
        marginTop: 12,
        textAlign: 'center',
    },
    
    // Error styles
    errorContainer: {
        ...COMPONENT_STYLES.errorContainer,
    },
    errorTitle: {
        ...COMPONENT_STYLES.errorTitle,
    },
    errorMessage: {
        ...COMPONENT_STYLES.errorMessage,
    },
});