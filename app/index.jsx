import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    ActivityIndicator
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
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

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

const styles = {
    container: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    authContainer: {
        width: '75%',
        maxWidth: 400,
        alignSelf: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    buttonContainer: {
        marginVertical: 10
    },
    bottomContainer: {
        marginTop: 20
    },
    toggleText: {
        color: '#3498db',
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center'
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center'   
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    inputField: {
        flex: 1,
        padding: 0,
    },
    iconContainer: {
        paddingLeft: 10,
    },
};

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setError(''); // Clear error on auth state change
        });

        return () => unsubscribe();
    }, []);

    const handleAuthentication = async() => {
        setError(''); // Clear previous errors
        try {
            if (user) {
                await signOut(auth);
                console.log('Usuário deslogado com sucesso!');
            } else {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('Usuário logado com sucesso!');
                } else {
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('Usuário criado com sucesso!');
                }
            }
        } catch (error) {
            setError(error.message);
            console.error('Erro de autenticação:', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user
                ? (<PaginaAuthenticated user={user} handleAuthentication={handleAuthentication}/>)
                : (<PaginaAuth
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    handleAuthentication={handleAuthentication}
                    error={error}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}/>)}
        </ScrollView>
    );
}

const PaginaAuth = ({
    email,
    setEmail,
    password,
    setPassword,
    isLogin,
    setIsLogin,
    handleAuthentication,
    error,
    showPassword,
    toggleShowPassword
}) => {
    return (
        <View style={styles.authContainer}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Cadastrar'}</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputField}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#aaa"
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={isLogin ? 'Entrar' : 'Inscrever-se'}
                    onPress={handleAuthentication}
                    color="#3498db"
                />
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.toggleText}>
                        {isLogin
                            ? 'Precisa de uma conta? Cadastre-se'
                            : 'Já tem uma conta? Faça login'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const PaginaAuthenticated = ({ handleAuthentication}) => {
    const [loading, setLoading] = useState(false);
    
const styles_home = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between'
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80
  },
  middleContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3498db',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 50,
    overflow: 'hidden'
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
    const router = useRouter();
    return (
        <ImageBackground
            source={require('../assets/images/background.jpg')}
            style={styles_home.background}
            imageStyle={{opacity: 0.5}}
            resizeMode='cover'>
            <View style={styles_home.container}>
                <View style={styles_home.topContainer}>
                    <Image
                        source={require('../assets/images/senai-logo.png')} 
                        style={styles_home.logo}
                    />
                    <Text style={styles_home.welcomeText}>Bem Vindo!</Text>
                </View>
                
                <View style={styles_home.middleContainer}>
                    <View style={styles_home.buttonContainer}>

                        <TouchableOpacity 
                        style={styles_home.button}
                        onPress={() => router.navigate('/Paginas/graph')}>
                        <Text style={styles_home.buttonText}>Gráfico</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        style={styles_home.button}
                        onPress={() => router.navigate('/Paginas/cor')}>
                        <Text style={styles_home.buttonText}>Cores</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                        style={styles_home.button}
                        onPress={() => router.navigate('/Paginas/material')}>
                        <Text style={styles_home.buttonText}>Material</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                
                <View style={styles_home.bottomContainer}>
                    <TouchableOpacity 
                        style={styles_home.logoutButton} 
                        onPress={handleAuthentication}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles_home.logoutButtonText}>Sair</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar style="auto" />
        </ImageBackground>
    );
};
