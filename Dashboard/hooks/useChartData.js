// app/hooks/useChartData.js

import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Detectar plataforma e definir URL apropriada
const getApiBaseUrl = () => {
    if (Platform.OS === 'android') {
        // Para emulador Android, usar IP especial
        return 'http://10.0.2.2:3000';
    } else if (Platform.OS === 'ios') {
        // Para iOS, usar localhost
        return 'http://localhost:3000';
    } else {
        // Para web, usar IP da rede local
        return 'http://192.168.55.156:3000';
    }
};

const API_BASE_URL = getApiBaseUrl();

// Log para debug
console.log(`🔗 Plataforma detectada: ${Platform.OS}`);
console.log(`🌐 URL da API: ${API_BASE_URL}`);

export function useChartData(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Se o endpoint não for fornecido, não faça nada.
        if (!endpoint) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true); // Reinicia o loading para novas buscas
            setError(null);   // Limpa erros antigos
            setData(null);    // Limpa dados antigos

            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, { 
                    signal,
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Erro HTTP ${response.status}: Falha ao buscar dados do servidor.`);
                }

                const result = await response.json();
                
                // Verificação de segurança para o formato dos dados
                if (!result || typeof result !== 'object') {
                     throw new Error('Formato de dados recebido da API é inválido.');
                }

                setData(result);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    // Melhorar mensagem de erro para problemas de rede
                    if (err.message.includes('Network request failed') || err.message.includes('fetch')) {
                        setError(new Error(`Não foi possível conectar ao servidor. Verifique se o servidor está rodando em ${API_BASE_URL}`));
                    } else {
                        setError(err);
                    }
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [endpoint]); // O useEffect será executado novamente se o endpoint mudar

    return { data, loading, error };
}