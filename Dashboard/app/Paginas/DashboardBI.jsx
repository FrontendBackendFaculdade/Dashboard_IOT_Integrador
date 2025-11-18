// Dashboard/app/Paginas/DashboardBI.jsx
// Dashboard BI integrado com narrativa visual coerente

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';
import { 
    CHART_THEME, 
    COMPONENT_STYLES, 
    calculatePercentageChange,
    formatPercentageChange,
    getChangeColor,
    getSensorColor,
    getValueRangeColor
} from '../../constants/ChartTheme';

const screenWidth = Dimensions.get('window').width;

// Componente para card de KPI principal
const MainKPICard = ({ title, value, unit, change, icon, color, subtitle }) => (
    <View style={styles.mainKpiCard}>
        <View style={styles.kpiHeader}>
            <View style={[styles.kpiIconContainer, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
            <View style={styles.kpiInfo}>
                <Text style={styles.kpiTitle}>{title}</Text>
                {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
            </View>
        </View>
        <View style={styles.kpiValueContainer}>
            <Text style={styles.kpiValue}>{value}</Text>
            <Text style={styles.kpiUnit}>{unit}</Text>
        </View>
        {change !== undefined && (
            <View style={styles.kpiChangeContainer}>
                <MaterialCommunityIcons 
                    name={change > 0 ? 'trending-up' : change < 0 ? 'trending-down' : 'trending-neutral'} 
                    size={16} 
                    color={getChangeColor(change)} 
                />
                <Text style={[styles.kpiChange, { color: getChangeColor(change) }]}>
                    {formatPercentageChange(change)}
                </Text>
                <Text style={styles.kpiChangeLabel}>vs período anterior</Text>
            </View>
        )}
    </View>
);

// Componente para alertas e insights
const AlertCard = ({ type, title, message, icon, action }) => (
    <View style={[styles.alertCard, { borderLeftColor: getAlertColor(type) }]}>
        <View style={styles.alertHeader}>
            <MaterialCommunityIcons name={icon} size={20} color={getAlertColor(type)} />
            <Text style={styles.alertTitle}>{title}</Text>
        </View>
        <Text style={styles.alertMessage}>{message}</Text>
        {action && (
            <TouchableOpacity style={styles.alertAction}>
                <Text style={styles.alertActionText}>{action}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const getAlertColor = (type) => {
    switch (type) {
        case 'warning': return CHART_THEME.semantic.warning;
        case 'danger': return CHART_THEME.semantic.danger;
        case 'success': return CHART_THEME.semantic.success;
        case 'info': return CHART_THEME.semantic.info;
        default: return CHART_THEME.neutral.gray500;
    }
};

// Componente para resumo executivo
const ExecutiveSummary = ({ insights }) => {
    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo Executivo</Text>
            <Text style={styles.summarySubtitle}>Principais insights e alertas do sistema</Text>
            
            {insights && insights.length > 0 ? (
                insights.map((insight, index) => (
                    <AlertCard key={index} {...insight} />
                ))
            ) : (
                <View style={styles.noAlertsContainer}>
                    <MaterialCommunityIcons name="check-circle" size={48} color={CHART_THEME.semantic.success} />
                    <Text style={styles.noAlertsTitle}>Sistema Operando Normalmente</Text>
                    <Text style={styles.noAlertsMessage}>Todos os sensores estão dentro dos parâmetros esperados</Text>
                </View>
            )}
        </View>
    );
};

export default function DashboardBI() {
    const [refreshing, setRefreshing] = useState(false);
    
    // Buscar dados do endpoint consolidado do Dashboard BI
    const { data: dashboardData, loading, error } = useChartData('/api/dashboard-bi');
    
    const onRefresh = async () => {
        setRefreshing(true);
        // O hook useChartData já gerencia o refresh automaticamente
        setTimeout(() => setRefreshing(false), 1000);
    };
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={CHART_THEME.primary.blue} />
                <Text style={styles.loadingText}>Carregando dashboard BI...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color={CHART_THEME.semantic.danger} />
                <Text style={styles.errorTitle}>Erro ao Carregar Dashboard</Text>
                <Text style={styles.errorMessage}>{error.message}</Text>
            </View>
        );
    }
    
    if (!dashboardData || !dashboardData.kpis) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="database-off" size={48} color={CHART_THEME.semantic.warning} />
                <Text style={styles.errorTitle}>Nenhum Dado Disponível</Text>
                <Text style={styles.errorMessage}>Não há dados suficientes para exibir o dashboard BI</Text>
            </View>
        );
    }
    
    // Extrair dados do endpoint consolidado
    const { kpis, insights, qualityMetrics, systemStatus, lastUpdate } = dashboardData;
    
    return (
        <ScrollView 
            style={styles.scrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header do Dashboard */}
            <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                    <MaterialCommunityIcons name="chart-box" size={32} color={CHART_THEME.primary.blue} />
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Dashboard BI IoT</Text>
                        <Text style={styles.headerSubtitle}>Monitoramento Inteligente de Sensores</Text>
                    </View>
                </View>
                <Text style={styles.lastUpdate}>
                    Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleString('pt-BR') : 'Carregando...'}
                </Text>
            </View>
            
            {/* KPIs Principais */}
            <View style={styles.kpisContainer}>
                <Text style={styles.sectionTitle}>Indicadores Principais</Text>
                <View style={styles.kpisGrid}>
                    <MainKPICard 
                        title="Sensores Ativos" 
                        value={kpis.totalSensors || 0} 
                        unit="tipos"
                        icon="thermometer"
                        color={CHART_THEME.primary.blue}
                        subtitle="Monitoramento ativo"
                    />
                    <MainKPICard 
                        title="Período de Dados" 
                        value={kpis.dataPeriodDays || 0} 
                        unit="dias"
                        icon="calendar"
                        color={CHART_THEME.semantic.info}
                        subtitle="Histórico disponível"
                    />
                    <MainKPICard 
                        title="Total de Leituras" 
                        value={kpis.totalReadings || 0} 
                        unit="registros"
                        icon="chart-line"
                        color={CHART_THEME.semantic.success}
                        subtitle="Dados coletados"
                    />
                    <MainKPICard 
                        title="Saúde do Sistema" 
                        value={kpis.systemHealth || 0} 
                        unit="%"
                        icon="heart-pulse"
                        color={kpis.systemHealth > 90 ? CHART_THEME.semantic.success : 
                               kpis.systemHealth > 75 ? CHART_THEME.semantic.warning : CHART_THEME.semantic.danger}
                        subtitle="Status operacional"
                    />
                </View>
            </View>
            
            {/* Resumo Executivo */}
            <ExecutiveSummary insights={insights} />
            
            {/* Indicadores de Qualidade */}
            <View style={styles.qualityContainer}>
                <Text style={styles.sectionTitle}>Qualidade dos Dados</Text>
                <View style={styles.qualityGrid}>
                    <View style={styles.qualityCard}>
                        <MaterialCommunityIcons name="database-check" size={24} color={CHART_THEME.semantic.success} />
                        <Text style={styles.qualityValue}>{qualityMetrics?.dataIntegrity || 0}%</Text>
                        <Text style={styles.qualityLabel}>Integridade</Text>
                    </View>
                    <View style={styles.qualityCard}>
                        <MaterialCommunityIcons name="clock-fast" size={24} color={CHART_THEME.semantic.info} />
                        <Text style={styles.qualityValue}>{qualityMetrics?.responseTime?.toFixed(1) || 0}s</Text>
                        <Text style={styles.qualityLabel}>Tempo Resposta</Text>
                    </View>
                    <View style={styles.qualityCard}>
                        <MaterialCommunityIcons name="wifi" size={24} color={CHART_THEME.semantic.success} />
                        <Text style={styles.qualityValue}>{qualityMetrics?.connectivity || 0}%</Text>
                        <Text style={styles.qualityLabel}>Conectividade</Text>
                    </View>
                </View>
            </View>
            
            {/* Status do Sistema */}
            <View style={styles.statusContainer}>
                <Text style={styles.sectionTitle}>Status do Sistema</Text>
                <View style={styles.statusGrid}>
                    <View style={styles.statusCard}>
                        <MaterialCommunityIcons 
                            name={systemStatus?.overall === 'excellent' ? 'check-circle' : 
                                  systemStatus?.overall === 'good' ? 'check-circle-outline' :
                                  systemStatus?.overall === 'warning' ? 'alert-circle' : 'alert-circle-outline'} 
                            size={24} 
                            color={systemStatus?.overall === 'excellent' ? CHART_THEME.semantic.success :
                                   systemStatus?.overall === 'good' ? CHART_THEME.semantic.info :
                                   systemStatus?.overall === 'warning' ? CHART_THEME.semantic.warning : CHART_THEME.semantic.danger} 
                        />
                        <Text style={styles.statusValue}>
                            {systemStatus?.overall === 'excellent' ? 'Excelente' :
                             systemStatus?.overall === 'good' ? 'Bom' :
                             systemStatus?.overall === 'warning' ? 'Atenção' : 'Crítico'}
                        </Text>
                        <Text style={styles.statusLabel}>Status Geral</Text>
                    </View>
                    <View style={styles.statusCard}>
                        <MaterialCommunityIcons name="thermometer" size={24} color={CHART_THEME.primary.blue} />
                        <Text style={styles.statusValue}>{systemStatus?.sensors?.active || 0}</Text>
                        <Text style={styles.statusLabel}>Sensores Ativos</Text>
                    </View>
                    <View style={styles.statusCard}>
                        <MaterialCommunityIcons name="chart-line" size={24} color={CHART_THEME.semantic.info} />
                        <Text style={styles.statusValue}>{systemStatus?.data?.frequency?.toFixed(1) || 0}</Text>
                        <Text style={styles.statusLabel}>Leituras/Dia</Text>
                    </View>
                </View>
            </View>
            
            {/* Navegação para Gráficos Detalhados */}
            <View style={styles.navigationContainer}>
                <Text style={styles.sectionTitle}>Análises Detalhadas</Text>
                <Text style={styles.navigationSubtitle}>Acesse visualizações específicas para análise aprofundada</Text>
                
                <View style={styles.navigationGrid}>
                    <TouchableOpacity style={styles.navCard}>
                        <MaterialCommunityIcons name="chart-pie" size={32} color={CHART_THEME.sensorColors.temperature} />
                        <Text style={styles.navTitle}>Distribuição</Text>
                        <Text style={styles.navSubtitle}>Análise por categorias</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.navCard}>
                        <MaterialCommunityIcons name="chart-timeline-variant" size={32} color={CHART_THEME.sensorColors.humidity} />
                        <Text style={styles.navTitle}>Temporal</Text>
                        <Text style={styles.navSubtitle}>Evolução no tempo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.navCard}>
                        <MaterialCommunityIcons name="chart-bar-stacked" size={32} color={CHART_THEME.sensorColors.ph} />
                        <Text style={styles.navTitle}>Faixas</Text>
                        <Text style={styles.navSubtitle}>Distribuição por ranges</Text>
                    </TouchableOpacity>
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
        ...CHART_THEME.shadows.medium,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 2,
    },
    lastUpdate: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
        fontStyle: 'italic',
    },
    
    // Section styles
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 8,
    },
    
    // KPIs styles
    kpisContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        ...CHART_THEME.shadows.medium,
    },
    kpisGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    mainKpiCard: {
        backgroundColor: CHART_THEME.background.secondary,
        borderRadius: 12,
        padding: 16,
        width: (screenWidth - 56) / 2,
        marginBottom: 12,
        ...CHART_THEME.shadows.small,
    },
    kpiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    kpiIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    kpiInfo: {
        flex: 1,
    },
    kpiTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
    },
    kpiSubtitle: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
        marginTop: 2,
    },
    kpiValueContainer: {
        marginBottom: 8,
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
    },
    kpiUnit: {
        fontSize: 12,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray500,
    },
    kpiChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    kpiChange: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    kpiChangeLabel: {
        fontSize: 10,
        color: CHART_THEME.neutral.gray500,
        marginLeft: 4,
    },
    
    // Summary styles
    summaryContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        ...CHART_THEME.shadows.medium,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 4,
    },
    summarySubtitle: {
        fontSize: 14,
        color: CHART_THEME.neutral.gray600,
        marginBottom: 16,
    },
    
    // Alert styles
    alertCard: {
        backgroundColor: CHART_THEME.background.secondary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
        marginLeft: 8,
    },
    alertMessage: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray600,
        marginBottom: 8,
    },
    alertAction: {
        alignSelf: 'flex-start',
    },
    alertActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: CHART_THEME.primary.blue,
    },
    
    // No alerts styles
    noAlertsContainer: {
        alignItems: 'center',
        padding: 20,
    },
    noAlertsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: CHART_THEME.semantic.success,
        marginTop: 8,
    },
    noAlertsMessage: {
        fontSize: 14,
        color: CHART_THEME.neutral.gray600,
        textAlign: 'center',
        marginTop: 4,
    },
    
    // Quality styles
    qualityContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        ...CHART_THEME.shadows.medium,
    },
    qualityGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    qualityCard: {
        alignItems: 'center',
        flex: 1,
    },
    qualityValue: {
        fontSize: 20,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
        marginTop: 8,
    },
    qualityLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 4,
    },
    
    // Status styles
    statusContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        ...CHART_THEME.shadows.medium,
    },
    statusGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statusCard: {
        alignItems: 'center',
        flex: 1,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginTop: 8,
        textAlign: 'center',
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 4,
        textAlign: 'center',
    },
    
    // Navigation styles
    navigationContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 20,
        ...CHART_THEME.shadows.medium,
    },
    navigationSubtitle: {
        fontSize: 14,
        color: CHART_THEME.neutral.gray600,
        marginBottom: 16,
    },
    navigationGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    navCard: {
        alignItems: 'center',
        backgroundColor: CHART_THEME.background.secondary,
        borderRadius: 12,
        padding: 16,
        width: (screenWidth - 80) / 3,
        ...CHART_THEME.shadows.small,
    },
    navTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray700,
        marginTop: 8,
    },
    navSubtitle: {
        fontSize: 10,
        color: CHART_THEME.neutral.gray500,
        marginTop: 2,
        textAlign: 'center',
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
