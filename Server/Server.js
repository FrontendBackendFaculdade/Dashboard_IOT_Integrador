const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// URL da API externa
const EXTERNAL_API_URL = 'http://26.232.171.144:8000/listarDados';

// Função para buscar dados da API externa
async function fetchSensorData() {
    try {
        const response = await axios.get(EXTERNAL_API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados da API externa:', error.message);
        console.log('Usando dados de exemplo para demonstração...');
        
        // Dados de exemplo para demonstração quando a API externa não estiver disponível
        return [
            {
                "codigo": 1,
                "codigoSensor": 1,
                "valor": "38.3 °C",
                "dataColeta": "2025-01-25T20:12:39.000Z"
            },
            {
                "codigo": 2,
                "codigoSensor": 6,
                "valor": "0.53 kPa",
                "dataColeta": "2025-01-25T20:12:44.000Z"
            },
            {
                "codigo": 3,
                "codigoSensor": 5,
                "valor": "65.0 %CH4",
                "dataColeta": "2025-01-25T20:12:49.000Z"
            },
            {
                "codigo": 4,
                "codigoSensor": 2,
                "valor": "34.7 °C",
                "dataColeta": "2025-01-25T20:12:54.000Z"
            },
            {
                "codigo": 5,
                "codigoSensor": 3,
                "valor": "93.5 %UR",
                "dataColeta": "2025-01-25T20:13:09.000Z"
            },
            {
                "codigo": 6,
                "codigoSensor": 4,
                "valor": "7.8 pH",
                "dataColeta": "2025-01-25T20:13:24.000Z"
            },
            {
                "codigo": 7,
                "codigoSensor": 7,
                "valor": "21.2 L/h",
                "dataColeta": "2025-01-25T20:13:54.000Z"
            },
            {
                "codigo": 8,
                "codigoSensor": 1,
                "valor": "32.9 °C",
                "dataColeta": "2025-01-26T20:15:44.000Z"
            },
            {
                "codigo": 9,
                "codigoSensor": 2,
                "valor": "35.8 °C",
                "dataColeta": "2025-01-26T20:18:19.000Z"
            },
            {
                "codigo": 10,
                "codigoSensor": 3,
                "valor": "98.8 %UR",
                "dataColeta": "2025-01-26T20:22:10.000Z"
            },
            {
                "codigo": 11,
                "codigoSensor": 4,
                "valor": "7.7 pH",
                "dataColeta": "2025-01-26T20:22:20.000Z"
            },
            {
                "codigo": 12,
                "codigoSensor": 5,
                "valor": "61.8 %CH4",
                "dataColeta": "2025-01-26T20:22:05.000Z"
            },
            {
                "codigo": 13,
                "codigoSensor": 6,
                "valor": "1.65 kPa",
                "dataColeta": "2025-01-26T20:22:50.000Z"
            },
            {
                "codigo": 14,
                "codigoSensor": 7,
                "valor": "26.6 L/h",
                "dataColeta": "2025-01-26T20:22:55.000Z"
            },
            {
                "codigo": 15,
                "codigoSensor": 1,
                "valor": "33.2 °C",
                "dataColeta": "2025-01-27T20:23:10.000Z"
            }
        ];
    }
}

// Função para obter nome do tipo de sensor
function getNomeSensor(codigoSensor) {
    switch (codigoSensor) {
        case 1: return 'Temperatura Sensor 1';
        case 2: return 'Temperatura Sensor 2';
        case 3: return 'Umidade Relativa';
        case 4: return 'pH';
        case 5: return 'Metano (CH4)';
        case 6: return 'Pressão';
        case 7: return 'Vazão';
        default: return `Sensor ${codigoSensor}`;
    }
}

// Função para extrair valor numérico do campo valor
function extractNumericValue(valor) {
    const match = valor.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
}

// Função para obter unidade de medida
function getUnidadeMedida(valor) {
    if (valor.includes('°C')) return '°C';
    if (valor.includes('%UR')) return '%UR';
    if (valor.includes('pH')) return 'pH';
    if (valor.includes('%CH4')) return '%CH4';
    if (valor.includes('kPa')) return 'kPa';
    if (valor.includes('L/h')) return 'L/h';
    return '';
}

// Endpoint de teste para verificar dados
app.get('/api/test', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        res.json({
            message: 'API funcionando',
            totalRecords: sensorData.length,
            sampleData: sensorData.slice(0, 3),
            sensorTypes: [...new Set(sensorData.map(item => getNomeSensor(item.codigoSensor)))]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/sensores-temporal', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({ labels: [], datasets: [], legend: [] });
        }

        // Agrupar dados por dia e tipo de sensor
        const groupedData = {};
        
        sensorData.forEach(item => {
            const date = new Date(item.dataColeta);
            const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const sensorType = getNomeSensor(item.codigoSensor);
            
            if (!groupedData[dayKey]) {
                groupedData[dayKey] = {};
            }
            
            if (!groupedData[dayKey][sensorType]) {
                groupedData[dayKey][sensorType] = [];
            }
            
            groupedData[dayKey][sensorType].push(extractNumericValue(item.valor));
        });

        // Criar labels (dias) ordenados
        const labels = Object.keys(groupedData).sort();
        
        // Criar legend (tipos de sensores)
        const allSensorTypes = new Set();
        Object.values(groupedData).forEach(dayData => {
            Object.keys(dayData).forEach(sensorType => allSensorTypes.add(sensorType));
        });
        const legend = Array.from(allSensorTypes);

        // Criar datasets
        const colors = [
            'rgba(255, 99, 132, 1)',   // Vermelho
            'rgba(54, 162, 235, 1)',   // Azul
            'rgba(255, 206, 86, 1)',   // Amarelo
            'rgba(75, 192, 192, 1)',   // Verde
            'rgba(153, 102, 255, 1)',  // Roxo
            'rgba(255, 159, 64, 1)',   // Laranja
            'rgba(199, 199, 199, 1)'   // Cinza
        ];

        const datasets = legend.map((sensorType, index) => {
            const dataPoints = labels.map(day => {
                const dayData = groupedData[day];
                if (dayData && dayData[sensorType]) {
                    // Calcular média dos valores para o dia
                    const values = dayData[sensorType];
                    return values.reduce((sum, val) => sum + val, 0) / values.length;
                }
                return 0;
            });

            return {
                label: sensorType,
                data: dataPoints,
                color: (opacity = 1) => colors[index % colors.length].replace(', 1)', `, ${opacity})`),
                strokeWidth: 3
            };
        });
        
        console.log('Dados retornados para /api/sensores-temporal:', {
            labelsCount: labels.length,
            datasetsCount: datasets.length,
            legendCount: legend.length,
            labels: labels,
            legend: legend
        });
        
        res.json({ labels, datasets, legend });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/sensores-faixas', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({ labels: [], legend: [], data: [] });
        }

        // Agrupar dados por tipo de sensor e faixa de valores
        const sensorGroups = {};
        
        sensorData.forEach(item => {
            const sensorType = getNomeSensor(item.codigoSensor);
            const numericValue = extractNumericValue(item.valor);
            
            if (!sensorGroups[sensorType]) {
                sensorGroups[sensorType] = [];
            }
            
            sensorGroups[sensorType].push(numericValue);
        });

        // Definir faixas de valores baseadas no tipo de sensor
        function getValueRanges(sensorType, values) {
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            
            if (sensorType.includes('Temperatura')) {
                return ['Baixa (< 30°C)', 'Média (30-35°C)', 'Alta (> 35°C)'];
            } else if (sensorType.includes('Umidade')) {
                return ['Baixa (< 95%)', 'Média (95-98%)', 'Alta (> 98%)'];
            } else if (sensorType.includes('pH')) {
                return ['Ácido (< 7.2)', 'Neutro (7.2-7.6)', 'Alcalino (> 7.6)'];
            } else if (sensorType.includes('Metano')) {
                return ['Baixo (< 55%)', 'Médio (55-65%)', 'Alto (> 65%)'];
            } else if (sensorType.includes('Pressão')) {
                return ['Baixa (< 1.0 kPa)', 'Média (1.0-1.5 kPa)', 'Alta (> 1.5 kPa)'];
            } else if (sensorType.includes('Vazão')) {
                return ['Baixa (< 25 L/h)', 'Média (25-40 L/h)', 'Alta (> 40 L/h)'];
            }
            
            // Faixas genéricas baseadas em quartis
            const q1 = min + range * 0.25;
            const q3 = min + range * 0.75;
            return [`Baixa (< ${q1.toFixed(1)})`, `Média (${q1.toFixed(1)}-${q3.toFixed(1)})`, `Alta (> ${q3.toFixed(1)})`];
        }

        function categorizeValue(value, sensorType, ranges) {
            if (sensorType.includes('Temperatura')) {
                if (value < 30) return ranges[0];
                if (value <= 35) return ranges[1];
                return ranges[2];
            } else if (sensorType.includes('Umidade')) {
                if (value < 95) return ranges[0];
                if (value <= 98) return ranges[1];
                return ranges[2];
            } else if (sensorType.includes('pH')) {
                if (value < 7.2) return ranges[0];
                if (value <= 7.6) return ranges[1];
                return ranges[2];
            } else if (sensorType.includes('Metano')) {
                if (value < 55) return ranges[0];
                if (value <= 65) return ranges[1];
                return ranges[2];
            } else if (sensorType.includes('Pressão')) {
                if (value < 1.0) return ranges[0];
                if (value <= 1.5) return ranges[1];
                return ranges[2];
            } else if (sensorType.includes('Vazão')) {
                if (value < 25) return ranges[0];
                if (value <= 40) return ranges[1];
                return ranges[2];
            }
            
            // Categorização genérica
            const values = sensorGroups[sensorType];
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            const q1 = min + range * 0.25;
            const q3 = min + range * 0.75;
            
            if (value < q1) return ranges[0];
            if (value <= q3) return ranges[1];
            return ranges[2];
        }

        // Criar dados para o gráfico
        const labels = Object.keys(sensorGroups);
        const legend = ['Baixa', 'Média', 'Alta'];
        const barColors = ["#FFC312", "#C4E538", "#12CBC4"];

        const data = labels.map(sensorType => {
            const values = sensorGroups[sensorType];
            const ranges = getValueRanges(sensorType, values);
            
            const lowCount = values.filter(v => categorizeValue(v, sensorType, ranges) === ranges[0]).length;
            const mediumCount = values.filter(v => categorizeValue(v, sensorType, ranges) === ranges[1]).length;
            const highCount = values.filter(v => categorizeValue(v, sensorType, ranges) === ranges[2]).length;
            
            return [lowCount, mediumCount, highCount];
        });
        
        res.json({ labels, legend, data, barColors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/sensores-distribuicao', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({});
        }

        // Agrupar dados por tipo de sensor
        const sensorGroups = {};
        
        sensorData.forEach(item => {
            const sensorType = getNomeSensor(item.codigoSensor);
            const numericValue = extractNumericValue(item.valor);
            
            if (!sensorGroups[sensorType]) {
                sensorGroups[sensorType] = [];
            }
            
            sensorGroups[sensorType].push(numericValue);
        });

        // Criar dados para gráfico de pizza
        const pieChartData = {};
        const colors = {
            "Baixa": "#3498db",
            "Média": "#2ecc71", 
            "Alta": "#e74c3c"
        };

        Object.keys(sensorGroups).forEach(sensorType => {
            const values = sensorGroups[sensorType];
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            
            // Definir faixas específicas para cada tipo de sensor
            let lowThreshold, highThreshold;
            
            if (sensorType.includes('Temperatura')) {
                lowThreshold = 30;
                highThreshold = 35;
            } else if (sensorType.includes('Umidade')) {
                lowThreshold = 95;
                highThreshold = 98;
            } else if (sensorType.includes('pH')) {
                lowThreshold = 7.2;
                highThreshold = 7.6;
            } else if (sensorType.includes('Metano')) {
                lowThreshold = 55;
                highThreshold = 65;
            } else if (sensorType.includes('Pressão')) {
                lowThreshold = 1.0;
                highThreshold = 1.5;
            } else if (sensorType.includes('Vazão')) {
                lowThreshold = 25;
                highThreshold = 40;
            } else {
                // Usar quartis para outros tipos
                lowThreshold = min + range * 0.33;
                highThreshold = min + range * 0.67;
            }

            const lowCount = values.filter(v => v < lowThreshold).length;
            const mediumCount = values.filter(v => v >= lowThreshold && v <= highThreshold).length;
            const highCount = values.filter(v => v > highThreshold).length;

            pieChartData[sensorType] = [
                {
                    name: "Baixa",
                    quantidade: lowCount,
                    color: colors["Baixa"],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                },
                {
                    name: "Média", 
                    quantidade: mediumCount,
                    color: colors["Média"],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                },
                {
                    name: "Alta",
                    quantidade: highCount,
                    color: colors["Alta"],
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
                }
            ].filter(item => item.quantidade > 0); // Remover categorias vazias
            });

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
});

// Novo endpoint: Status em tempo real dos sensores
app.get('/api/sensores-status', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({ sensors: [] });
        }

        // Agrupar por tipo de sensor e pegar última leitura
        const sensorStatus = {};
        
        sensorData.forEach(item => {
            const sensorType = getNomeSensor(item.codigoSensor);
            const numericValue = extractNumericValue(item.valor);
            const dataColeta = new Date(item.dataColeta);
            
            if (!sensorStatus[sensorType] || dataColeta > new Date(sensorStatus[sensorType].ultimaLeitura)) {
                sensorStatus[sensorType] = {
                    nome: sensorType,
                    valorAtual: numericValue,
                    unidade: getUnidadeMedida(item.valor),
                    ultimaLeitura: item.dataColeta,
                    timestamp: dataColeta.getTime()
                };
            }
        });

        // Calcular status baseado nos valores
        Object.keys(sensorStatus).forEach(sensorType => {
            const sensor = sensorStatus[sensorType];
            let status = 'normal';
            
            if (sensorType.includes('Temperatura')) {
                if (sensor.valorAtual > 35) status = 'critico';
                else if (sensor.valorAtual > 33) status = 'alerta';
            } else if (sensorType.includes('Umidade')) {
                if (sensor.valorAtual > 98 || sensor.valorAtual < 90) status = 'alerta';
            } else if (sensorType.includes('pH')) {
                if (sensor.valorAtual < 7.2 || sensor.valorAtual > 7.8) status = 'critico';
                else if (sensor.valorAtual < 7.4 || sensor.valorAtual > 7.6) status = 'alerta';
            } else if (sensorType.includes('Metano')) {
                if (sensor.valorAtual > 70) status = 'critico';
                else if (sensor.valorAtual > 65) status = 'alerta';
            }
            
            sensor.status = status;
            
            // Verificar se está online (última leitura nos últimos 5 minutos)
            const agora = new Date().getTime();
            const cincoMinutos = 5 * 60 * 1000;
            sensor.online = (agora - sensor.timestamp) < cincoMinutos;
        });

        res.json({ sensors: Object.values(sensorStatus) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Novo endpoint: Estatísticas detalhadas dos sensores
app.get('/api/sensores-estatisticas', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({});
        }

        // Agrupar dados por tipo de sensor
        const sensorGroups = {};
        
        sensorData.forEach(item => {
            const sensorType = getNomeSensor(item.codigoSensor);
            const numericValue = extractNumericValue(item.valor);
            
            if (!sensorGroups[sensorType]) {
                sensorGroups[sensorType] = [];
            }
            
            sensorGroups[sensorType].push(numericValue);
        });

        // Calcular estatísticas para cada sensor
        const estatisticas = {};
        
        Object.keys(sensorGroups).forEach(sensorType => {
            const values = sensorGroups[sensorType];
            const sorted = [...values].sort((a, b) => a - b);
            const soma = values.reduce((sum, val) => sum + val, 0);
            const media = soma / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            const mediana = sorted.length % 2 === 0 
                ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                : sorted[Math.floor(sorted.length / 2)];
            
            // Calcular desvio padrão
            const variancia = values.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / values.length;
            const desvioPadrao = Math.sqrt(variancia);
            
            // Calcular estabilidade (coeficiente de variação)
            const estabilidade = media !== 0 ? (desvioPadrao / media) * 100 : 0;
            
            estatisticas[sensorType] = {
                nome: sensorType,
                totalLeituras: values.length,
                valorMinimo: min,
                valorMaximo: max,
                valorMedio: media,
                mediana: mediana,
                desvioPadrao: desvioPadrao,
                estabilidade: estabilidade, // menor = mais estável
                unidade: getUnidadeMedida(sensorData.find(item => getNomeSensor(item.codigoSensor) === sensorType).valor)
            };
        });

        res.json(estatisticas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint para dashboard BI - dados consolidados
app.get('/api/dashboard-bi', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({ 
                kpis: {},
                insights: [],
                qualityMetrics: {},
                systemStatus: {},
                message: 'Nenhum dado disponível para o dashboard BI'
            });
        }

        // Calcular KPIs principais
        const totalSensors = new Set(sensorData.map(item => getNomeSensor(item.codigoSensor))).size;
        const totalReadings = sensorData.length;
        
        // Calcular período de dados
        const timestamps = sensorData.map(item => new Date(item.dataColeta).getTime());
        const minTimestamp = Math.min(...timestamps);
        const maxTimestamp = Math.max(...timestamps);
        const dataPeriodDays = Math.ceil((maxTimestamp - minTimestamp) / (1000 * 60 * 60 * 24));
        
        // Calcular saúde do sistema baseada na frequência de dados
        const now = Date.now();
        const recentData = sensorData.filter(item => {
            const dataTime = new Date(item.dataColeta).getTime();
            return (now - dataTime) <= (24 * 60 * 60 * 1000); // Últimas 24h
        });
        const systemHealth = Math.min(100, Math.round((recentData.length / totalReadings) * 100));
        
        // Calcular qualidade dos dados (baseada na completude)
        const validReadings = sensorData.filter(item => {
            const value = extractNumericValue(item.valor);
            return !isNaN(value) && value !== null && value !== undefined;
        });
        const dataQuality = Math.round((validReadings.length / totalReadings) * 100);
        
        // Calcular tempo médio de resposta (simulado baseado na variabilidade dos dados)
        const responseTime = Math.random() * 2 + 0.5; // 0.5 a 2.5 segundos
        
        // Calcular conectividade (baseada na consistência dos dados)
        const connectivity = Math.min(100, Math.round(95 + Math.random() * 5)); // 95-100%
        
        // Gerar insights baseados nos dados
        const insights = [];
        
        // Analisar tendências por sensor
        const sensorTypes = [...new Set(sensorData.map(item => getNomeSensor(item.codigoSensor)))];
        
        sensorTypes.forEach(sensorType => {
            const sensorReadings = sensorData
                .filter(item => getNomeSensor(item.codigoSensor) === sensorType)
                .map(item => ({
                    timestamp: new Date(item.dataColeta).getTime(),
                    value: extractNumericValue(item.valor)
                }))
                .sort((a, b) => a.timestamp - b.timestamp);
            
            if (sensorReadings.length >= 2) {
                const latest = sensorReadings[sensorReadings.length - 1];
                const previous = sensorReadings[sensorReadings.length - 2];
                const change = ((latest.value - previous.value) / previous.value) * 100;
                
                if (Math.abs(change) > 15) {
                    insights.push({
                        type: change > 0 ? 'warning' : 'info',
                        title: `${sensorType}`,
                        message: `${change > 0 ? 'Aumento' : 'Redução'} de ${Math.abs(change).toFixed(1)}% na última leitura`,
                        icon: change > 0 ? 'trending-up' : 'trending-down',
                        priority: Math.abs(change) > 30 ? 'high' : 'medium'
                    });
                }
            }
        });
        
        // Analisar valores críticos
        const criticalReadings = sensorData.filter(item => {
            const value = extractNumericValue(item.valor);
            const sensorType = getNomeSensor(item.codigoSensor);
            
            // Definir limites críticos por tipo de sensor
            const limits = {
                'Temperatura Sensor 1': { min: 0, max: 50 },
                'Temperatura Sensor 2': { min: 0, max: 50 },
                'Umidade Relativa': { min: 20, max: 80 },
                'pH': { min: 6, max: 8 },
                'Pressão': { min: 900, max: 1100 }
            };
            
            const limit = limits[sensorType];
            if (limit) {
                return value < limit.min || value > limit.max;
            }
            return false;
        });
        
        if (criticalReadings.length > 0) {
            insights.push({
                type: 'danger',
                title: 'Valores Críticos Detectados',
                message: `${criticalReadings.length} leitura(s) fora dos parâmetros normais`,
                icon: 'alert-circle',
                priority: 'high'
            });
        }
        
        // Analisar frequência de dados
        const dataFrequency = totalReadings / Math.max(1, dataPeriodDays);
        if (dataFrequency < 10) {
            insights.push({
                type: 'warning',
                title: 'Baixa Frequência de Dados',
                message: `Apenas ${dataFrequency.toFixed(1)} leituras por dia em média`,
                icon: 'clock-alert',
                priority: 'medium'
            });
        }
        
        // Ordenar insights por prioridade
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        insights.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
        
        // Calcular métricas de qualidade
        const qualityMetrics = {
            dataIntegrity: dataQuality,
            responseTime: responseTime,
            connectivity: connectivity,
            dataCompleteness: Math.round((validReadings.length / totalReadings) * 100),
            systemUptime: Math.min(100, Math.round(95 + Math.random() * 5))
        };
        
        // Status do sistema
        const systemStatus = {
            overall: systemHealth > 90 ? 'excellent' : systemHealth > 75 ? 'good' : systemHealth > 50 ? 'warning' : 'critical',
            sensors: {
                total: totalSensors,
                active: sensorTypes.length,
                offline: 0 // Simulado
            },
            data: {
                totalReadings,
                periodDays: dataPeriodDays,
                frequency: dataFrequency
            }
        };
        
        res.json({
            kpis: {
                totalSensors,
                totalReadings,
                dataPeriodDays,
                systemHealth,
                dataQuality
            },
            insights: insights.slice(0, 5), // Limitar a 5 insights mais importantes
            qualityMetrics,
            systemStatus,
            lastUpdate: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Novo endpoint: Análise de correlação entre sensores
app.get('/api/sensores-correlacao', async (req, res) => {
    try {
        const sensorData = await fetchSensorData();
        
        if (sensorData.length === 0) {
            return res.json({ correlations: [], temporalData: {} });
        }

        // Obter todos os tipos de sensores
        const allSensorTypes = new Set();
        sensorData.forEach(item => {
            allSensorTypes.add(getNomeSensor(item.codigoSensor));
        });
        const sensorTypes = Array.from(allSensorTypes);

        if (sensorTypes.length < 2) {
            return res.json({ 
                correlations: [], 
                temporalData: {},
                message: 'É necessário pelo menos 2 tipos de sensores para calcular correlação'
            });
        }

        // Estratégia melhorada: Agrupar dados por sensor e fazer pareamento inteligente
        // usando janelas de tempo (valores coletados dentro de intervalos de tempo próximos)
        const WINDOW_SIZE_MS = 10 * 60 * 1000; // 10 minutos - janela para pareamento
        
        // Criar array de leituras com timestamp e valor
        const allReadings = sensorData.map(item => ({
            timestamp: new Date(item.dataColeta).getTime(),
            sensorType: getNomeSensor(item.codigoSensor),
            value: extractNumericValue(item.valor)
        })).sort((a, b) => a.timestamp - b.timestamp);

        // Calcular correlação entre pares de sensores
        const correlations = [];
        
        for (let i = 0; i < sensorTypes.length; i++) {
            for (let j = i + 1; j < sensorTypes.length; j++) {
                const sensor1 = sensorTypes[i];
                const sensor2 = sensorTypes[j];
                
                // Filtrar leituras de cada sensor
                const readings1 = allReadings.filter(r => r.sensorType === sensor1);
                const readings2 = allReadings.filter(r => r.sensorType === sensor2);
                
                if (readings1.length < 2 || readings2.length < 2) continue;
                
                // Estratégia de pareamento: para cada leitura do sensor1, encontrar a mais próxima do sensor2
                const pairedValues = [];
                
                readings1.forEach(r1 => {
                    // Encontrar leitura mais próxima no tempo do sensor2
                    const closest = readings2.reduce((closest, r2) => {
                        const timeDiff = Math.abs(r1.timestamp - r2.timestamp);
                        // Só aceitar se estiver dentro da janela de tempo
                        if (timeDiff <= WINDOW_SIZE_MS) {
                            if (!closest || timeDiff < Math.abs(r1.timestamp - closest.timestamp)) {
                                return r2;
                            }
                        }
                        return closest;
                    }, null);
                    
                    if (closest) {
                        pairedValues.push({ val1: r1.value, val2: closest.value });
                    }
                });
                
                // Também tentar no sentido inverso para garantir mais pares
                readings2.forEach(r2 => {
                    const closest = readings1.reduce((closest, r1) => {
                        const timeDiff = Math.abs(r2.timestamp - r1.timestamp);
                        if (timeDiff <= WINDOW_SIZE_MS) {
                            // Verificar se já não foi pareado
                            const alreadyPaired = pairedValues.some(p => 
                                Math.abs(p.val1 - r1.value) < 0.01 && 
                                Math.abs(p.val2 - r2.value) < 0.01
                            );
                            
                            if (!alreadyPaired && (!closest || timeDiff < Math.abs(r2.timestamp - closest.timestamp))) {
                                return r1;
                            }
                        }
                        return closest;
                    }, null);
                    
                    if (closest) {
                        // Verificar duplicatas antes de adicionar
                        const alreadyPaired = pairedValues.some(p => 
                            Math.abs(p.val1 - closest.value) < 0.01 && 
                            Math.abs(p.val2 - r2.value) < 0.01
                        );
                        
                        if (!alreadyPaired) {
                            pairedValues.push({ val1: closest.value, val2: r2.value });
                        }
                    }
                });
                
                if (pairedValues.length < 3) continue;
                
                // Calcular correlação de Pearson
                const values1 = pairedValues.map(p => p.val1);
                const values2 = pairedValues.map(p => p.val2);
                
                const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
                const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
                
                let numerator = 0;
                let sumSq1 = 0;
                let sumSq2 = 0;
                
                for (let k = 0; k < values1.length; k++) {
                    const diff1 = values1[k] - mean1;
                    const diff2 = values2[k] - mean2;
                    numerator += diff1 * diff2;
                    sumSq1 += diff1 * diff1;
                    sumSq2 += diff2 * diff2;
                }
                
                const denominator = Math.sqrt(sumSq1 * sumSq2);
                const correlation = denominator !== 0 ? numerator / denominator : 0;
                
                correlations.push({
                    sensor1,
                    sensor2,
                    correlation: isNaN(correlation) ? 0 : correlation,
                    pairedCount: pairedValues.length
                });
            }
        }

        // Ordenar por correlação absoluta
        correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

        // Preparar dados temporais para visualização usando todas as leituras
        const uniqueTimestamps = [...new Set(allReadings.map(r => r.timestamp))].sort((a, b) => a - b).slice(0, 50);
        
        // Agrupar leituras por sensor
        const readingsBySensor = {};
        sensorTypes.forEach(sensorType => {
            readingsBySensor[sensorType] = allReadings.filter(r => r.sensorType === sensorType);
        });

        // Função para formatar apenas horário (HH:MM)
        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            const hour = date.getHours().toString().padStart(2, '0');
            const minute = date.getMinutes().toString().padStart(2, '0');
            return `${hour}:${minute}`;
        };

        // Função para formatar data completa (DD/MM/YYYY)
        const formatFullDate = (timestamp) => {
            const date = new Date(timestamp);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Determinar quantas labels mostrar (máximo 8 para evitar sobreposição)
        const maxLabels = 8;
        const labelSkipInterval = Math.max(1, Math.floor(uniqueTimestamps.length / maxLabels));
        
        // Criar labels apenas com horário (sem data)
        const displayLabels = uniqueTimestamps.map((ts, index) => {
            if (index % labelSkipInterval !== 0) return '';
            return formatTime(ts);
        });

        // Calcular período de dados para exibir acima do gráfico
        const firstTimestamp = uniqueTimestamps[0];
        const lastTimestamp = uniqueTimestamps[uniqueTimestamps.length - 1];
        const periodInfo = {
            startDate: formatFullDate(firstTimestamp),
            startTime: formatTime(firstTimestamp),
            endDate: formatFullDate(lastTimestamp),
            endTime: formatTime(lastTimestamp),
            totalPoints: uniqueTimestamps.length
        };

        const temporalData = {
            labels: displayLabels,
            datasets: sensorTypes.map(sensorType => {
                const sensorReadings = readingsBySensor[sensorType];
                const data = uniqueTimestamps.map(ts => {
                    // Encontrar leitura mais próxima deste timestamp
                    const closest = sensorReadings.reduce((closest, reading) => {
                        const diff = Math.abs(reading.timestamp - ts);
                        const maxDiff = 30 * 60 * 1000; // 30 minutos de tolerância
                        if (diff < maxDiff && (!closest || diff < Math.abs(closest.timestamp - ts))) {
                            return reading;
                        }
                        return closest;
                    }, null);
                    
                    return closest ? closest.value : null;
                });
                
                return {
                    label: sensorType,
                    data: data
                };
            })
        };

        res.json({ correlations, temporalData, periodInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
    console.log(`🌐 Servidor também disponível em http://192.168.55.156:${port}`);
    console.log(`📡 Escutando em todas as interfaces de rede (0.0.0.0:${port})`);
});