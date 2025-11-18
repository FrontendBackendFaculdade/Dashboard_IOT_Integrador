import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const integrantes = [
    { id: '1', nome: 'Eivold Santos' },
    { id: '2', nome: 'Welder Rafael' },
    { id: '3', nome: 'Breno Dalprat' },
    { id: '4', nome: 'Rafael Do Carmo' },
    { id: '5', nome: 'Lucas Teodoro' }
];

const sensores = [
    { id: 1, nome: 'Temperatura Sensor 1', unidade: '°C', descricao: 'Monitora temperatura ambiente' },
    { id: 2, nome: 'Temperatura Sensor 2', unidade: '°C', descricao: 'Monitora temperatura secundária' },
    { id: 3, nome: 'Umidade Relativa', unidade: '%UR', descricao: 'Controla nível de umidade' },
    { id: 4, nome: 'pH', unidade: 'pH', descricao: 'Mede acidez/alcalinidade' },
    { id: 5, nome: 'Metano (CH4)', unidade: '%CH4', descricao: 'Detecta concentração de metano' },
    { id: 6, nome: 'Pressão', unidade: 'kPa', descricao: 'Monitora pressão do sistema' },
    { id: 7, nome: 'Vazão', unidade: 'L/h', descricao: 'Mede fluxo de líquidos' }
];

// Componente para renderizar cada card de sensor
const SensorCard = ({ sensor }) => (
    <View style={styles.sensorCard}>
        <View style={styles.sensorIconContainer}>
            <MaterialCommunityIcons name="thermometer" size={30} color="#0f3460" />
        </View>
        <View style={styles.sensorInfo}>
            <Text style={styles.sensorName}>{sensor.nome}</Text>
            <Text style={styles.sensorUnit}>Unidade: {sensor.unidade}</Text>
            <Text style={styles.sensorDescription}>{sensor.descricao}</Text>
        </View>
    </View>
);

export default function SobrePage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="information-outline" size={40} color="#1a2536" />
                    <Text style={styles.pageTitle}>Sobre o Sistema IoT</Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Sensores Monitorados</Text>
                    <Text style={styles.sectionDescription}>
                        O sistema monitora diversos tipos de sensores em tempo real para análise de dados industriais.
                    </Text>
                    
                    {/* Cards dos sensores */}
                    {sensores.map(sensor => (
                        <SensorCard key={sensor.id} sensor={sensor} />
                    ))}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Nossa Equipe</Text>
                    <Text style={styles.sectionDescription}>
                        Desenvolvido por estudantes do curso de Análise e Desenvolvimento de Sistemas.
                    </Text>
                    
                    {/* Cards dos integrantes */}
                    {integrantes.map(integrante => (
                        <MemberCard key={integrante.id} nome={integrante.nome} />
                    ))}
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Trabalho de Conclusão de Curso</Text>
                    <Text style={styles.collegeText}>Faculdade SENAI Félix Guisard</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Componente para renderizar cada card de integrante
const MemberCard = ({ nome }) => (
    <View style={styles.memberCard}>
        <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={50} color="#0f3460" />
        </View>
        <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{nome}</Text>
            <Text style={styles.memberRole}>Desenvolvedor da Equipe</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a2536',
        marginTop: 10,
    },
    sectionContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a2536',
        marginBottom: 10,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#6e7a8a',
        marginBottom: 15,
        lineHeight: 20,
    },
    sensorCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    sensorIconContainer: {
        backgroundColor: '#e8f4fd',
        borderRadius: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    sensorInfo: {
        flex: 1,
    },
    sensorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2536',
    },
    sensorUnit: {
        fontSize: 12,
        color: '#0f3460',
        fontWeight: '500',
        marginTop: 2,
    },
    sensorDescription: {
        fontSize: 12,
        color: '#6e7a8a',
        marginTop: 4,
    },
    memberCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarContainer: {
        backgroundColor: '#eef2f5',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a2536',
    },
    memberRole: {
        fontSize: 14,
        color: '#6e7a8a',
        marginTop: 4,
    },
    footerContainer: {
        marginTop: 40,
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0'
    },
    footerText: {
        fontSize: 14,
        color: '#6e7a8a',
    },
    collegeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f3460',
        marginTop: 5,
    },
});