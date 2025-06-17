const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const dbConfig = {
    host: '10.108.34.95',
    user: 'root',
    password: 'root',
    database: 'db_prod',
    port: 3306,
};

function getNomeCor(id) {
    switch (id) {
        case 1: return 'Verde';
        case 2: return 'Amarelo';
        case 3: return 'Vermelho';
        case 4: return 'Azul';
        default: return `Cor ${id}`;
    }
}

function getNomeMaterial(id) {
    switch (id) {
        case 1: return 'Plástico';
        case 2: return 'Metal';
        default: return `Material ${id}`;
    }
}

function getNomeTamanho(id) {
    switch (id) {
        case 1: return 'Pequeno';
        case 2: return 'Médio';
        case 3: return 'Grande';
        default: return `Tamanho ${id}`;
    }
}

app.get('/api/producao-materiais-tempo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            `SELECT 
                DATE_FORMAT(data_hora, '%d/%m') as dia, 
                material,
                COUNT(id_prod) as quantidade 
             FROM tb_prod 
             WHERE data_hora >= CURDATE() - INTERVAL 30 DAY
             GROUP BY DATE(data_hora), material
             ORDER BY DATE(data_hora) ASC`
        );
        await connection.end();

        if (rows.length === 0) return res.json({ labels: [], datasets: [], legend: [] });

        const labels = [...new Set(rows.map(r => r.dia))];
        const legend = [...new Set(rows.map(r => getNomeMaterial(r.material)))];
        const datasets = legend.map((materialNome, index) => {
            const dataPoints = labels.map(dia => {
                const row = rows.find(r => r.dia === dia && getNomeMaterial(r.material) === materialNome);
                return row ? row.quantidade : 0;
            });
            const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'];
            return {
                data: dataPoints,
                color: (opacity = 1) => colors[index % colors.length].replace(', 1)', `, ${opacity})`),
                strokeWidth: 3
            };
        });
        
        res.json({ labels, datasets, legend });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/tamanhos-por-cor', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            `SELECT cor, tamanho, COUNT(id_prod) as total 
             FROM tb_prod GROUP BY cor, tamanho ORDER BY cor, tamanho`
        );
        await connection.end();

        if (rows.length === 0) return res.json({ labels: [], legend: [], data: [] });

        const labels = [...new Set(rows.map(r => getNomeCor(r.cor)))];
        const legend = [...new Set(rows.map(r => getNomeTamanho(r.tamanho)))];
        const barColors = ["#FFC312", "#C4E538", "#12CBC4"];

        const data = labels.map(nomeCor => {
            const colorData = [];
            for (const nomeTamanho of legend) {
                const row = rows.find(r => getNomeCor(r.cor) === nomeCor && getNomeTamanho(r.tamanho) === nomeTamanho);
                colorData.push(row ? row.total : 0);
            }
            return colorData;
        });
        
        res.json({ labels, legend, data, barColors });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/mix-por-material', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            `SELECT material, tamanho, COUNT(id_prod) as quantidade 
             FROM tb_prod GROUP BY material, tamanho`
        );
        await connection.end();

        const pieChartData = {};
        const colors = { "Pequeno": "#3498db", "Médio": "#2ecc71", "Grande": "#e74c3c" };

        for (const row of rows) {
            const materialNome = getNomeMaterial(row.material);
            if (!pieChartData[materialNome]) {
                pieChartData[materialNome] = [];
            }
            const nomeTamanho = getNomeTamanho(row.tamanho);
            pieChartData[materialNome].push({
                name: nomeTamanho,
                quantidade: row.quantidade,
                color: colors[nomeTamanho] || '#bdc3c7',
                legendFontColor: "#7F7F7F",
                legendFontSize: 15
            });
        }
        res.json(pieChartData);
    } catch (error) { res.status(500).json({ message: error.message }); }
});

app.listen(port, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});