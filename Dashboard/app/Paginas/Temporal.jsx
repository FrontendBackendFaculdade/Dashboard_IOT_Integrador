// Dashboard/app/Paginas/Temporal.jsx
// Monitoramento em Tempo Real - Valores atuais e status dos sensores

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    StyleSheet, 
    Dimensions, 
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';
import { 
    CHART_THEME, 
    COMPONENT_STYLES, 
    getSensorColor
} from '../../constants/ChartTheme';

const screenWidth = Dimensions.get('window').width;

// Componente para card de status do sensor
const SensorStatusCard = ({ sensor, onPress }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'critico': return CHART_THEME.semantic.danger;
            case 'alerta': return CHART_THEME.semantic.warning;
            case 'normal': return CHART_THEME.semantic.success;
            default: return CHART_THEME.neutral.gray500;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'critico': return 'alert-circle';
            case 'alerta': return 'alert';
            case 'normal': return 'check-circle';
            default: return 'help-circle';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'critico': return 'Crítico';
            case 'alerta': return 'Alerta';
            case 'normal': return 'Normal';
            default: return 'Desconhecido';
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const agora = new Date().getTime();
        const diff = agora - timestamp;
        const minutos = Math.floor(diff / 60000);
        
        if (minutos < 1) return 'Agora';
        if (minutos < 60) return `${minutos} min atrás`;
        const horas = Math.floor(minutos / 60);
        if (horas < 24) return `${horas}h atrás`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <TouchableOpacity 
            style={[styles.sensorCard, !sensor.online && styles.sensorCardOffline]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.sensorCardHeader}>
                <View style={styles.sensorCardHeaderLeft}>
                    <View style={[styles.sensorIconContainer, { backgroundColor: getSensorColor(sensor.nome) + '20' }]}>
                        <MaterialCommunityIcons 
                            name="thermometer" 
                            size={24} 
                            color={getSensorColor(sensor.nome)} 
                        />
                    </View>
                    <View style={styles.sensorInfo}>
                        <Text style={styles.sensorName}>{sensor.nome}</Text>
                        <Text style={styles.sensorTime}>
                            {sensor.online ? '🟢 Online' : '🔴 Offline'} • {formatTime(sensor.timestamp)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sensor.status) + '20' }]}>
                    <MaterialCommunityIcons 
                        name={getStatusIcon(sensor.status)} 
                        size={20} 
                        color={getStatusColor(sensor.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(sensor.status) }]}>
                        {getStatusText(sensor.status)}
                    </Text>
                </View>
            </View>
            
            <View style={styles.sensorValueContainer}>
                <Text style={styles.sensorValue}>{sensor.valorAtual.toFixed(1)}</Text>
                <Text style={styles.sensorUnit}>{sensor.unidade}</Text>
            </View>
        </TouchableOpacity>
    );
};

// Componente para resumo de sistema
const SystemSummary = ({ sensors }) => {
    const total = sensors.length;
    const online = sensors.filter(s => s.online).length;
    const criticos = sensors.filter(s => s.status === 'critico').length;
    const alertas = sensors.filter(s => s.status === 'alerta').length;
    const normais = sensors.filter(s => s.status === 'normal').length;

    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Status do Sistema</Text>
            <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                    <MaterialCommunityIcons name="wifi" size={24} color={CHART_THEME.semantic.success} />
                    <Text style={styles.summaryValue}>{online}/{total}</Text>
                    <Text style={styles.summaryLabel}>Online</Text>
                </View>
                <View style={styles.summaryItem}>
                    <MaterialCommunityIcons name="check-circle" size={24} color={CHART_THEME.semantic.success} />
                    <Text style={styles.summaryValue}>{normais}</Text>
                    <Text style={styles.summaryLabel}>Normal</Text>
                </View>
                <View style={styles.summaryItem}>
                    <MaterialCommunityIcons name="alert" size={24} color={CHART_THEME.semantic.warning} />
                    <Text style={styles.summaryValue}>{alertas}</Text>
                    <Text style={styles.summaryLabel}>Alerta</Text>
                </View>
                <View style={styles.summaryItem}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={CHART_THEME.semantic.danger} />
                    <Text style={styles.summaryValue}>{criticos}</Text>
                    <Text style={styles.summaryLabel}>Crítico</Text>
                </View>
            </View>
        </View>
    );
};

export default function Temporal() {
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, error } = useChartData('/api/sensores-status');

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={CHART_THEME.primary.blue} />
                <Text style={styles.loadingText}>Carregando status dos sensores...</Text>
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
    
    if (!data || !data.sensors || data.sensors.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="information-outline" size={48} color={CHART_THEME.neutral.gray400} />
                <Text style={styles.errorTitle}>Sem Dados Disponíveis</Text>
                <Text style={styles.errorMessage}>Não há sensores para monitorar no momento.</Text>
            </View>
        );
    }

    const sensors = data.sensors.sort((a, b) => {
        // Ordenar: críticos primeiro, depois alertas, depois normais
        const statusOrder = { 'critico': 0, 'alerta': 1, 'normal': 2 };
        return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
    });

    return (
        <ScrollView 
            style={styles.scrollContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons name="chart-timeline-variant" size={32} color={CHART_THEME.primary.blue} />
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Monitoramento em Tempo Real</Text>
                    <Text style={styles.headerSubtitle}>Status atual de todos os sensores</Text>
                </View>
                <Text style={styles.lastUpdate}>
                    Atualizado: {new Date().toLocaleTimeString('pt-BR')}
                </Text>
            </View>

            {/* Resumo do sistema */}
            <SystemSummary sensors={sensors} />

            {/* Cards de sensores */}
            <View style={styles.sensorsContainer}>
                <Text style={styles.sectionTitle}>Sensores ({sensors.length})</Text>
                {sensors.map((sensor, index) => (
                    <SensorStatusCard 
                        key={index} 
                        sensor={sensor}
                        onPress={() => {
                            // Aqui pode abrir detalhes do sensor se necessário
                            console.log('Sensor clicado:', sensor.nome);
                        }}
                    />
                ))}
            </View>

            {/* Informações úteis */}
            <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="information-outline" size={20} color={CHART_THEME.semantic.info} />
                <Text style={styles.infoText}>
                    Arraste para baixo para atualizar. Os dados são atualizados automaticamente a cada atualização.
                </Text>
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
        marginBottom: 8,
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
    },
    lastUpdate: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
        fontStyle: 'italic',
    },
    
    // Summary styles
    summaryContainer: {
        backgroundColor: CHART_THEME.background.card,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 16,
        ...CHART_THEME.shadows.medium,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 16,
        textAlign: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    summaryItem: {
        alignItems: 'center',
        minWidth: 80,
        marginVertical: 8,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginTop: 4,
    },
    
    // Sensors container
    sensorsContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 12,
    },
    
    // Sensor card styles
    sensorCard: {
        backgroundColor: CHART_THEME.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...CHART_THEME.shadows.small,
    },
    sensorCardOffline: {
        opacity: 0.6,
    },
    sensorCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sensorCardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sensorIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sensorInfo: {
        flex: 1,
    },
    sensorName: {
        fontSize: 16,
        fontWeight: '600',
        color: CHART_THEME.neutral.gray800,
        marginBottom: 4,
    },
    sensorTime: {
        fontSize: 12,
        color: CHART_THEME.neutral.gray500,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    sensorValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
    },
    sensorValue: {
        fontSize: 32,
        fontWeight: '800',
        color: CHART_THEME.neutral.gray800,
    },
    sensorUnit: {
        fontSize: 16,
        fontWeight: '500',
        color: CHART_THEME.neutral.gray600,
        marginLeft: 8,
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
    infoText: {
        flex: 1,
        fontSize: 12,
        color: CHART_THEME.neutral.gray600,
        marginLeft: 8,
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

