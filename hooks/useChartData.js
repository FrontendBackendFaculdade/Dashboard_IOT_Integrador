// app/hooks/useChartData.js

import { useState, useEffect } from 'react';

// O IP do seu servidor. Colocá-lo aqui facilita a alteração em um só lugar.
const API_BASE_URL = 'http://10.108.34.110:3000';

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
                const response = await fetch(`${API_BASE_URL}${endpoint}`, { signal });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Falha ao buscar dados do servidor.');
                }

                const result = await response.json();
                
                // Verificação de segurança para o formato dos dados
                if (!result || typeof result !== 'object') {
                     throw new Error('Formato de dados recebido da API é inválido.');
                }

                setData(result);

            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err);
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