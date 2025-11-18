// Dashboard/app/Paginas/Empilhado.jsx
// Análise de Correlação entre Sensores - Identificação de padrões e relações

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';
import { 
    CHART_THEME, 
    CHART_CONFIGS, 
    COMPONENT_STYLES, 
    getSensorColor
} from '../../constants/ChartTheme';

const screenWidth = Dimensions.get('window').width;

// Componente para card de correlação
const CorrelationCard = ({ correlation }) => {
    const getCorrelationColor = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 0.7) return CHART_THEME.semantic.danger;
        if (absValue > 0.4) return CHART_THEME.semantic.warning;
        return CHART_THEME.semantic.info;
    };

    const getCorrelationStrength = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 0.7) return 'Forte';
        if (absValue > 0.4) return 'Moderada';
        if (absValue > 0.2) return 'Fraca';
        return 'Muito Fraca';
    };

    const getCorrelationDirection = (value) => {
        if (value > 0) return 'Positiva';
        return 'Negativa';
    };

    const correlationValue = correlation.correlation;
    const absCorrelation = Math.abs(correlationValue);
    const strength = getCorrelationStrength(correlationValue);
    const direction = getCorrelationDirection(correlationValue);
    const color = getCorrelationColor(correlationValue);

    return (
        <View style={styles.correlationCard}>
            <View style={styles.correlationHeader}>
                <View style={styles.correlationSensors}>
                    <View style={styles.sensorTag}>
                        <MaterialCommunityIcons name="thermometer" size={16} color={getSensorColor(correlation.sensor1)} />
                        <Text style={styles.sensorTagText} numberOfLines={1}>{correlation.sensor1}</Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={CHART_THEME.neutral.gray400} />
                    <View style={styles.sensorTag}>
                        <MaterialCommunityIcons name="thermometer" size={16} color={getSensorColor(correlation.sensor2)} />
                        <Text style={styles.sensorTagText} numberOfLines={1}>{correlation.sensor2}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.correlationBody}>
                <View style={styles.correlationValueContainer}>
                    <Text style={[styles.correlationValue, { color }]}>
                        {correlationValue.toFixed(3)}
                    </Text>
                    <Text style={styles.correlationLabel}>Correlação de Pearson</Text>
    </View>
                
                <View style={styles.correlationInfo}>
                    <View style={[styles.infoBadge, { backgroundColor: color + '20' }]}>
                        <Text style={[styles.infoText, { color }]}>
                            {strength} • {direction}
                        </Text>
                    </View>
                    <Text style={styles.samplesText}>
                        {correlation.pairedCount} amostras pareadas
                    </Text>
                </View>
            </View>
    </View>
);
};

// Componente para visualização temporal comparativa
const TemporalComparisonChart = ({ temporalData, periodInfo }) => {
    if (!temporalData || !temporalData.datasets || temporalData.datasets.length === 0) {
        return null;
    }

    // Limitar a 3 sensores para melhor visualização
    const limitedDatasets = temporalData.datasets.slice(0, 3);
    
    const sensorColors = [
        CHART_THEME.sensorColors.temperature,
        CHART_THEME.sensorColors.humidity,
        CHART_THEME.sensorColors.ph,
    ];

    // Garantir que as labels mostrem apenas horário (remover qualquer data que possa ter vindo)
    const cleanLabels = temporalData.labels.map(label => {
        if (!label || label === '') return '';
        // Se a label tiver formato de data/hora (contém /), extrair apenas o horário
        const hasDate = label.includes('/');
        if (hasDate) {
            // Formato pode ser "DD/MM HH:MM" ou "DD/MM/YYYY HH:MM"
            const parts = label.split(' ');
            if (parts.length > 1) {
                return parts[parts.length - 1]; // Pega a última parte que é o horário
            }
        }
        // Se já é apenas horário, retornar como está
        return label;
    });

    const chartDataWithColors = {
        labels: cleanLabels,
        datasets: limitedDatasets.map((dataset, index) => ({
            ...dataset,
            color: (opacity = 1) => sensorColors[index % sensorColors.length].replace('rgb', 'rgba').replace(')', `, ${opacity})`),
            strokeWidth: 2
        }))
    };

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Comparação Temporal de Sensores</Text>
            <Text style={styles.chartSubtitle}>Primeiros 3 sensores para análise comparativa</Text>
            <Text style={styles.chartSubtitle}>Dia: {new Date().toLocaleDateString('pt-BR')}</Text>
            
            
            {/* Informações do período acima do gráfico */}
            {periodInfo && (
                <View style={styles.periodInfoContainer}>
                    <MaterialCommunityIcons name="calendar-clock" size={18} color={CHART_THEME.semantic.info} />
                    <Text style={styles.periodInfoText}>
                        Período: {periodInfo.startDate} {periodInfo.startTime} até {periodInfo.endDate} {periodInfo.endTime}
                        {' • '}{periodInfo.totalPoints} pontos de dados
                    </Text>
            </View>
            )}
            
            <LineChart
                data={chartDataWithColors}
                width={screenWidth - 80}
                height={320}
                chartConfig={{
                    ...CHART_CONFIGS.line,
                    propsForLabels: {
                        fontSize: 9,
                        rotation: -45,
                        dx: -15,
                        dy: 5,
                    }
                }}
                bezier
                withShadow={false}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                segments={4}
                fromZero={false}
                xLabelsOffset={-10}
                yLabelsOffset={5}
            />
        </View>
    );
};

export default function Empilhado() {
    const [showAll, setShowAll] = useState(false);
    const { data, loading, error } = useChartData('/api/sensores-correlacao');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={CHART_THEME.primary.blue} />
                <Text style={styles.loadingText}>Analisando correlações entre sensores...</Text>
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
    
    if (!data || !data.correlations || data.correlations.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="information-outline" size={48} color={CHART_THEME.neutral.gray400} />
                <Text style={styles.errorTitle}>Sem Dados Disponíveis</Text>
                <Text style={styles.errorMessage}>Não há dados suficientes para análise de correlação.</Text>
            </View>
        );
    }

    const correlations = data.correlations;
    const displayedCorrelations = showAll ? correlations : correlations.slice(0, 5);
    const strongCorrelations = correlations.filter(c => Math.abs(c.correlation) > 0.7);

    return (
        <ScrollView style={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons name="chart-scatter-plot" size={32} color={CHART_THEME.primary.blue} />
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Análise de Correlação</Text>
                    <Text style={styles.headerSubtitle}>Identificação de padrões e relações entre sensores</Text>
                </View>
            </View>

            {/* Gráfico temporal comparativo */}
            {data.temporalData && (
                <TemporalComparisonChart 
                    temporalData={data.temporalData} 
                    periodInfo={data.periodInfo}
                />
            )}

            {/* Resumo de correlações fortes */}
            {strongCorrelations.length > 0 && (
                <View style={styles.alertContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={CHART_THEME.semantic.warning} />
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>Correlações Fortes Detectadas</Text>
                        <Text style={styles.alertText}>
                            {strongCorrelations.length} par(es) de sensores apresentam correlação forte (|r| {'>'} 0.7).
                            Isso pode indicar dependência ou comportamento similar.
                        </Text>
                    </View>
                </View>
            )}

            {/* Lista de correlações */}
            <View style={styles.correlationsContainer}>
                <View style={styles.correlationsHeader}>
                    <Text style={styles.sectionTitle}>
                        Correlações Encontradas ({correlations.length})
                    </Text>
                    {correlations.length > 5 && (
                        <TouchableOpacity 
                            onPress={() => setShowAll(!showAll)}
                            style={styles.toggleButton}
                        >
                            <Text style={styles.toggleButtonText}>
                                {showAll ? 'Ver Menos' : 'Ver Todas'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                {displayedCorrelations.map((correlation, index) => (
                    <CorrelationCard key={index} correlation={correlation} />
                ))}
            </View>

            {/* Informações sobre correlação */}
            <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="information-outline" size={20} color={CHART_THEME.semantic.info} />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Sobre Correlação de Pearson</Text>
                    <Text style={styles.infoText}>
                        O coeficiente de correlação varia de -1 a +1:
                        {'\n'}• |r| {'>'} 0.7: Correlação forte
                        {'\n'}• 0.4 {'<'} |r| ≤ 0.7: Correlação moderada
                        {'\n'}• 0.2 {'<'} |r| ≤ 0.4: Correlação fraca
                        {'\n'}• |r| ≤ 0.2: Muito fraca ou inexistente
                        {'\n\n'}Valores positivos indicam que os sensores variam na mesma direção. 
                        Valores negativos indicam variação em direções opostas.
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
        marginBottom: 4,
        textAlign: 'center',
    },
    chartSubtitle: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
        marginBottom: 12,
        textAlign: 'center',
    },
    periodInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CHART_THEME.background.secondary,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        marginHorizontal: 20,
    },
    periodInfoText: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray700,
        marginLeft: 8,
        flex: 1,
        fontWeight: '500',
    },
    
    // Alert container
    alertContainer: {
        flexDirection: 'row',
        backgroundColor: CHART_THEME.semantic.warning + '20',
        borderLeftWidth: 4,
        borderLeftColor: CHART_THEME.semantic.warning,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    alertContent: {
        flex: 1,
        marginLeft: 12,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 4,
    },
    alertText: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray600,
        lineHeight: 18,
    },
    
    // Correlations container
    correlationsContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    correlationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        flex: 1,
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: CHART_THEME.primary.blue + '20',
        borderRadius: 8,
    },
    toggleButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: CHART_THEME.primary.blue,
    },
    
    // Correlation card styles
    correlationCard: {
        backgroundColor: CHART_THEME.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...CHART_THEME.shadows.small,
    },
    correlationHeader: {
        marginBottom: 12,
    },
    correlationSensors: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sensorTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CHART_THEME.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    sensorTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
        marginLeft: 6,
        flex: 1,
    },
    correlationBody: {
        borderTopWidth: 1,
        borderTopColor: CHART_THEME.neutral.gray200,
        paddingTop: 12,
    },
    correlationValueContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    correlationValue: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    correlationLabel: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
    },
    correlationInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '600',
    },
    samplesText: {
        fontSize: 11,
        color: CHART_THEME.neutral.gray500,
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