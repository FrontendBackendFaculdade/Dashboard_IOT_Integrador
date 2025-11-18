// Dashboard/constants/ChartTheme.js
// Paleta de cores profissional e tema consistente para o painel BI

export const CHART_THEME = {
  // Cores principais do sistema
  primary: {
    blue: '#1e3a8a',      // Azul principal
    darkBlue: '#0f3460',  // Azul escuro (já usado)
    lightBlue: '#3b82f6',  // Azul claro
    accent: '#06b6d4',     // Ciano para destaques
  },
  
  // Cores semânticas para indicadores
  semantic: {
    success: '#10b981',    // Verde para valores positivos/normais
    warning: '#f59e0b',    // Amarelo para alertas
    danger: '#ef4444',     // Vermelho para valores críticos
    info: '#3b82f6',       // Azul para informações
  },
  
  // Cores para categorias de sensores
  sensorColors: {
    temperature: '#ef4444',    // Vermelho para temperatura
    humidity: '#3b82f6',      // Azul para umidade
    ph: '#10b981',            // Verde para pH
    methane: '#8b5cf6',      // Roxo para metano
    pressure: '#f59e0b',     // Amarelo para pressão
    flow: '#06b6d4',         // Ciano para vazão
  },
  
  // Cores para faixas de valores
  valueRanges: {
    low: '#10b981',         // Verde para valores baixos/normais
    medium: '#f59e0b',      // Amarelo para valores médios
    high: '#ef4444',        // Vermelho para valores altos/críticos
  },
  
  // Cores neutras
  neutral: {
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },
  
  // Backgrounds
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Sombras
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Configuração padrão para gráficos
export const CHART_CONFIG = {
  backgroundColor: CHART_THEME.background.primary,
  backgroundGradientFrom: CHART_THEME.background.primary,
  backgroundGradientTo: CHART_THEME.background.primary,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: CHART_THEME.primary.accent,
  },
  propsForBackgroundLines: {
    strokeDasharray: '5,5',
    stroke: CHART_THEME.neutral.gray200,
    strokeWidth: 1,
  },
};

// Configuração específica para cada tipo de gráfico
export const CHART_CONFIGS = {
  pie: {
    ...CHART_CONFIG,
    paddingLeft: '15',
    absolute: true,
  },
  
  line: {
    ...CHART_CONFIG,
    bezier: true,
    withShadow: true,
    withDots: true,
    withInnerLines: false,
    withOuterLines: true,
  },
  
  bar: {
    ...CHART_CONFIG,
    barPercentage: 0.7,
    hideLegend: false,
  },
  
  stackedBar: {
    ...CHART_CONFIG,
    barPercentage: 0.6,
    hideLegend: false,
  },
};

// Estilos padrão para componentes
export const COMPONENT_STYLES = {
  container: {
    backgroundColor: CHART_THEME.background.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    ...CHART_THEME.shadows.medium,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: CHART_THEME.neutral.gray800,
    marginBottom: 16,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: CHART_THEME.neutral.gray600,
    marginBottom: 12,
    textAlign: 'center',
  },
  
  kpiCard: {
    backgroundColor: CHART_THEME.background.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    alignItems: 'center',
    ...CHART_THEME.shadows.small,
  },
  
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    color: CHART_THEME.neutral.gray800,
  },
  
  kpiLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: CHART_THEME.neutral.gray600,
    marginTop: 4,
    textAlign: 'center',
  },
  
  kpiChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: CHART_THEME.background.card,
    borderRadius: 16,
    margin: 16,
  },
  
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: CHART_THEME.semantic.danger,
    marginTop: 12,
    textAlign: 'center',
  },
  
  errorMessage: {
    fontSize: 14,
    color: CHART_THEME.neutral.gray600,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
};

// Função para obter cor do sensor baseado no tipo
export const getSensorColor = (sensorType) => {
  const type = sensorType.toLowerCase();
  
  if (type.includes('temperatura')) return CHART_THEME.sensorColors.temperature;
  if (type.includes('umidade')) return CHART_THEME.sensorColors.humidity;
  if (type.includes('ph')) return CHART_THEME.sensorColors.ph;
  if (type.includes('metano')) return CHART_THEME.sensorColors.methane;
  if (type.includes('pressão')) return CHART_THEME.sensorColors.pressure;
  if (type.includes('vazão')) return CHART_THEME.sensorColors.flow;
  
  return CHART_THEME.primary.blue;
};

// Função para obter cor baseada no valor (baixo/médio/alto)
export const getValueRangeColor = (range) => {
  switch (range.toLowerCase()) {
    case 'baixa':
    case 'baixo':
      return CHART_THEME.valueRanges.low;
    case 'média':
    case 'médio':
      return CHART_THEME.valueRanges.medium;
    case 'alta':
    case 'alto':
      return CHART_THEME.valueRanges.high;
    default:
      return CHART_THEME.neutral.gray500;
  }
};

// Função para calcular variação percentual
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Função para formatar variação percentual
export const formatPercentageChange = (change) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

// Função para obter cor da variação
export const getChangeColor = (change) => {
  if (change > 0) return CHART_THEME.semantic.success;
  if (change < 0) return CHART_THEME.semantic.danger;
  return CHART_THEME.neutral.gray500;
};
