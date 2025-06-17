import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const integrantes = [
    { id: '1', nome: 'EIvold Santos' },
    { id: '2', nome: 'Welder Rafael' },
    { id: '3', nome: 'Breno Dalprat' },
    { id: '4', nome: 'Rafael Do Carmo' },
    { id: '5', nome: 'Lucas Teodoro' }
];

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

export default function IntegrantesPage() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="account-group-outline" size={40} color="#1a2536" />
                    <Text style={styles.pageTitle}>Nossa Equipe</Text>
                </View>
                
                {/* Usamos .map() para criar um card para cada integrante do array */}
                {integrantes.map(integrante => (
                    <MemberCard key={integrante.id} nome={integrante.nome} />
                ))}

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Trabalho de Conclusão de Curso</Text>
                    <Text style={styles.collegeText}>Faculdade SENAI Félix Guisard</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8', // Cor de fundo suave
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
    memberCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        // Sombra sutil para dar elevação
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