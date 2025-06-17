import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { StatusBar } from 'expo-status-bar';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- CONFIGURAÇÃO FIREBASE (sem alterações) ---
const firebaseConfig = {
    apiKey: "AIzaSyB8PkMfiKp71BwpbPxZNSj3uJSUO24JipA",
    authDomain: "agc-rem.firebaseapp.com",
    databaseURL: "https://agc-rem-default-rtdb.firebaseio.com",
    projectId: "agc-rem",
    storageBucket: "agc-rem.firebasestorage.app",
    messagingSenderId: "996806465064",
    appId: "1:996806465064:web:e8899fba6597b214f0471d",
    measurementId: "G-VMTRJ0R48J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- COMPONENTE PRINCIPAL ---
export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de loading global

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setError('');
        });
        return () => unsubscribe();
    }, []);

    const handleAuthentication = async () => {
        if (loading) return; // Previne múltiplos cliques
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('Usuário logado com sucesso!');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('Usuário criado com sucesso!');
            }
        } catch (err) {
            // Mapeia erros do Firebase para mensagens amigáveis
            let friendlyMessage = 'Ocorreu um erro. Tente novamente.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                friendlyMessage = 'Email ou senha inválidos.';
            } else if (err.code === 'auth/email-already-in-use') {
                friendlyMessage = 'Este email já está em uso.';
            } else if (err.code === 'auth/weak-password') {
                friendlyMessage = 'A senha deve ter pelo menos 6 caracteres.';
            } else if (err.code === 'auth/invalid-email') {
                friendlyMessage = 'O formato do email é inválido.';
            }
            setError(friendlyMessage);
            console.error('Erro de autenticação:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await signOut(auth);
            console.log('Usuário deslogado com sucesso!');
            // Limpa os campos após o logout
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {user ? (
                    <PaginaAuthenticated handleLogout={handleLogout} loading={loading} />
                ) : (
                    <PaginaAuth
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                        handleAuthentication={handleAuthentication}
                        error={error}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        loading={loading}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// --- PÁGINA DE AUTENTICAÇÃO ESTILIZADA ---
const PaginaAuth = ({
    email, setEmail, password, setPassword, isLogin, setIsLogin,
    handleAuthentication, error, showPassword, setShowPassword, loading
}) => (
    <View style={authStyles.container}>
        <StatusBar style="dark" />
        <View style={authStyles.header}>
            <Image
                source={require('../assets/images/senai-logo.png')} // Usando o mesmo logo
                style={authStyles.logo}
            />
            <Text style={authStyles.title}>{isLogin ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}</Text>
            <Text style={authStyles.subtitle}>Acesse para continuar</Text>
        </View>

        <View style={authStyles.formContainer}>
            {error ? <Text style={authStyles.errorText}>{error}</Text> : null}
            <TextInput
                style={authStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#888"
            />
            <View style={authStyles.passwordContainer}>
                <TextInput
                    style={authStyles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[authStyles.button, loading && authStyles.buttonDisabled]}
                onPress={handleAuthentication}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={authStyles.buttonText}>{isLogin ? 'Entrar' : 'Inscrever-se'}</Text>
                )}
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={authStyles.toggleContainer}>
            <Text style={authStyles.toggleText}>
                {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                <Text style={authStyles.toggleLink}>{isLogin ? 'Cadastre-se' : 'Faça login'}</Text>
            </Text>
        </TouchableOpacity>
    </View>
);

// --- PÁGINA AUTENTICADA ESTILIZADA ---
const PaginaAuthenticated = ({ handleLogout, loading }) => {
    const router = useRouter();
    return (
        <ImageBackground
            source={require('../assets/images/background.jpg')}
            style={homeStyles.background}
            resizeMode='cover'
        >
            <View style={homeStyles.overlay}>
                <StatusBar style="light" />
                <View style={homeStyles.topContainer}>
                    <Image
                        source={require('../assets/images/senai-logo.png')}
                        style={homeStyles.logo}
                    />
                    <Text style={homeStyles.welcomeText}>Bem Vindo!</Text>
                </View>

                <View style={homeStyles.card}>
                    <Text style={homeStyles.cardTitle}>Navegação Principal</Text>
                    
                    <TouchableOpacity
                        style={homeStyles.button}
                        onPress={() => router.navigate('/Paginas/Categoria')}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#fff" />
                        <Text style={homeStyles.buttonText}>Categorias</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={homeStyles.button}
                        onPress={() => router.navigate('/Paginas/Temporal')}>
                        <MaterialCommunityIcons name="chart-timeline-variant" size={20} color="#fff" />
                        <Text style={homeStyles.buttonText}>Temporal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={homeStyles.button}
                        onPress={() => router.navigate('/Paginas/Empilhado')}>
                        <MaterialCommunityIcons name="chart-bar-stacked" size={20} color="#fff" />
                        <Text style={homeStyles.buttonText}>Empilhado</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                        style={homeStyles.button}
                        onPress={() => router.navigate('/Paginas/Sobre')}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#fff" />
                        <Text style={homeStyles.buttonText}>Sobre</Text>
                    </TouchableOpacity>

                <View style={homeStyles.bottomContainer}>
                    <TouchableOpacity
                        style={[homeStyles.logoutButton, loading && homeStyles.buttonDisabled]}
                        onPress={handleLogout}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={homeStyles.logoutButtonText}>Sair</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

// --- ESTILOS PARA A PÁGINA DE AUTENTICAÇÃO ---
const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a2536',
    },
    subtitle: {
        fontSize: 16,
        color: '#6e7a8a',
        marginTop: 5,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
    },
    errorText: {
        color: '#d9534f',
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#f5c6cb',
    },
    input: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#dfe3e8',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dfe3e8',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0f3460',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#a9a9a9',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleContainer: {
        marginTop: 30,
    },
    toggleText: {
        fontSize: 16,
        color: '#6e7a8a',
    },
    toggleLink: {
        color: '#0f3460',
        fontWeight: 'bold',
    },
});

// --- ESTILOS PARA A PÁGINA AUTENTICADA ---
const homeStyles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    topContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    card: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f3460',
        paddingVertical: 14,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    bottomContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#a9a9a9',
    },
});