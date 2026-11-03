const fs = require('fs');
const path = require('path');

// Liste actualisée : IA, Cloud, BDD & Tech moderne
const topics = [
    // Intelligence Artificielle & Data
    'Grand_modèle_de_langage',
    'Apprentissage_par_renforcement',
    'Base_de_données_vectorielle',
    'Generative_adversarial_network',
    'Inférence',
    'Réseau_de_neurones_artificiel',
    
    // Cloud & DevOps
    'Informatique_nuageuse',
    'Serverless',
    'Kubernetes',
    'Microservices',
    'Infrastructures_en_tant_que_code',
    'Conteneur_(informatique)',
    
    // BDD & Architecture
    'NoSQL',
    'Base_de_données_relationnelle',
    'Stockage_clé-valeur',
    'Lac_de_données',
    'Bus_de_données_d%27entreprise',
    
    // Sécurité & Réseaux
    'Zero_Trust',
    'Cryptographie_asymétrique',
    'OAuth',
    'Chiffrement_de_bout_en_bout'
];

async function fetchTechTerm() {
    // Calcul de l'index basé sur le jour de l'année pour éviter les répétitions
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const topicIndex = dayOfYear % topics.length;
    const selectedTopic = topics[topicIndex];

    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${selectedTopic}`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'GithubAutoBot/1.0 (contact@example.com)' }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return {
            title: data.title,
            extract: data.extract,
            url: data.content_urls.desktop.page
        };
    } catch (error) {
        console.error('Erreur de récupération:', error);
        return {
            title: 'Intelligence Artificielle',
            extract: 'Ensemble de théories et de techniques mises en œuvre en vue de réaliser des machines capables de simuler l\'intelligence.',
            url: 'https://fr.wikipedia.org/wiki/Intelligence_artificielle'
        };
    }
}

async function main() {
    const todayTech = await fetchTechTerm();
    const timestamp = new Date().toISOString().split('T')[0];

    const readmeContent = `# 📚 Le Dictionnaire Tech Autonome (IA, Cloud & Data)

> Un robot autonome qui va chercher dynamiquement une notion informatique sur Wikipédia chaque jour !

## 💡 Notion du jour (${timestamp})

### 🔹 **${todayTech.title}**
> ${todayTech.extract}

📖 [En savoir plus sur Wikipédia](${todayTech.url})

---

## 🛠️ À propos de ce dépôt
Ce dépôt s'enrichit automatiquement grâce à un **GitHub Action** quotidien exécutant un script Node.js sécurisé.

*Dernière synchronisation : ${new Date().toUTCString()}*
`;

    const readmePath = path.join(__dirname, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`[SUCCÈS] Notion mise à jour : ${todayTech.title}`);
}

main();
