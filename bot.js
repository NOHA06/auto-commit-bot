
const fs = require('fs');
const path = require('path');

// ==========================================
// 📚 DICTIONNAIRE TECH DU JOUR - NOHA06
// ==========================================

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const README_FILE = path.join(ROOT, 'README.md');

const TIME_ZONE = 'Africa/Abidjan';
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT = 10000;

// ==========================================
// 1. BASE DE CONNAISSANCES
// ==========================================

const topics = [
    // Intelligence artificielle & Data
    { name: 'Grand_modèle_de_langage', category: 'Intelligence artificielle', icon: '🤖' },
    { name: 'Apprentissage_par_renforcement', category: 'Intelligence artificielle', icon: '🤖' },
    { name: 'Base_de_données_vectorielle', category: 'Data & Bases de données', icon: '🗄️' },
    { name: 'Generative_adversarial_network', category: 'Intelligence artificielle', icon: '🤖' },
    { name: 'Inférence', category: 'Intelligence artificielle', icon: '🤖' },
    { name: 'Réseau_de_neurones_artificiel', category: 'Intelligence artificielle', icon: '🤖' },

    // Cloud & DevOps
    { name: 'Informatique_nuageuse', category: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Serverless', category: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Kubernetes', category: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Microservices', category: 'Architecture logicielle', icon: '🏗️' },
    { name: 'Infrastructure_as_code', category: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Conteneur_informatique', category: 'Cloud & DevOps', icon: '☁️' },

    // Bases de données & Architecture
    { name: 'NoSQL', category: 'Data & Bases de données', icon: '🗄️' },
    { name: 'Base_de_données_relationnelle', category: 'Data & Bases de données', icon: '🗄️' },
    { name: 'Stockage_clé-valeur', category: 'Data & Bases de données', icon: '🗄️' },
    { name: 'Lac_de_données', category: 'Data & Bases de données', icon: '🗄️' },
    { name: "Bus_de_données_d'entreprise", category: 'Architecture logicielle', icon: '🏗️' },

    // Cybersécurité & Réseaux
    { name: 'Zero_trust', category: 'Cybersécurité', icon: '🔐' },
    { name: 'Cryptographie_asymétrique', category: 'Cybersécurité', icon: '🔐' },
    { name: 'OAuth', category: 'Cybersécurité', icon: '🔐' },
    { name: 'Chiffrement_de_bout_en_bout', category: 'Cybersécurité', icon: '🔐' },
    { name: 'Pare-feu', category: 'Cybersécurité', icon: '🔐' },

    // Développement & Technologies
    { name: 'API_REST', category: 'Développement', icon: '💻' },
    { name: 'Git', category: 'Développement', icon: '💻' },
    { name: 'Intégration_continue', category: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Programmation_orientée_objet', category: 'Développement', icon: '💻' },
    { name: 'Framework', category: 'Développement', icon: '💻' },
    { name: 'Architecture_logicielle', category: 'Architecture logicielle', icon: '🏗️' },
    { name: 'Blockchain', category: 'Technologies émergentes', icon: '🌐' },
    { name: 'Internet_des_objets', category: 'Technologies émergentes', icon: '🌐' }
];

// ==========================================
// 2. OUTILS DE DATE
// ==========================================

function getDateInfo() {
    const now = new Date();

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(now);

    const values = Object.fromEntries(
        parts.map(part => [part.type, part.value])
    );

    const date = `${values.year}-${values.month}-${values.day}`;

    const formatted = new Intl.DateTimeFormat('fr-FR', {
        timeZone: TIME_ZONE,
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(now);

    const time = new Intl.DateTimeFormat('fr-FR', {
        timeZone: TIME_ZONE,
        hour: '2-digit',
        minute: '2-digit'
    }).format(now);

    return { date, formatted, time };
}

// ==========================================
// 3. GESTION DE L'HISTORIQUE
// ==========================================

function loadHistory() {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    if (!fs.existsSync(HISTORY_FILE)) {
        return {
            version: 1,
            publications: []
        };
    }

    try {
        const content = fs.readFileSync(HISTORY_FILE, 'utf8').trim();

        // Fichier vide : initialisation automatique
        if (!content) {
            console.warn('⚠️ Historique vide. Initialisation...');
            return {
                version: 1,
                publications: []
            };
        }

        const data = JSON.parse(content);

        if (!Array.isArray(data.publications)) {
            throw new Error('Format historique invalide.');
        }

        return data;

    } catch (error) {
        throw new Error(
            `Impossible de lire l'historique : ${error.message}`
        );
    }
}

function saveHistory(history) {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    fs.writeFileSync(
        HISTORY_FILE,
        JSON.stringify(history, null, 2) + '\n',
        'utf8'
    );
}

// ==========================================
// 4. SÉLECTION INTELLIGENTE
// ==========================================

function selectTopic(history) {
    const published = new Set(
        history.publications.map(item => item.topic)
    );

    const available = topics.filter(
        topic => !published.has(topic.name)
    );

    // Si toutes les notions ont été utilisées,
    // on recommence un nouveau cycle.
    if (available.length === 0) {
        console.log('🔄 Nouveau cycle de publication.');
        return topics[0];
    }

    // Sélection déterministe pour garder un ordre
    // prévisible et éviter les répétitions.
    const lastTopic = history.publications.at(-1)?.topic;

    const lastIndex = topics.findIndex(
        topic => topic.name === lastTopic
    );

    for (let i = 1; i <= topics.length; i++) {
        const candidate = topics[
            (lastIndex + i + topics.length) % topics.length
        ];

        if (available.some(item => item.name === candidate.name)) {
            return candidate;
        }
    }

    return available[0];
}

// ==========================================
// 5. RÉCUPÉRATION DEPUIS WIKIPÉDIA
// ==========================================

async function fetchTopic(topic) {
    const url =
        `https://fr.wikipedia.org/api/rest_v1/page/summary/` +
        encodeURIComponent(topic.name);

    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(
                `📡 Recherche : ${topic.name} (${attempt}/${MAX_ATTEMPTS})`
            );

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'NOHA06-TechDictionary/2.0'
                },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (
                data.type === 'disambiguation' ||
                !data.extract ||
                !data.title ||
                !data.content_urls?.desktop?.page
            ) {
                throw new Error('Contenu Wikipédia incomplet ou ambigu.');
            }

            const extract = data.extract
                .replace(/\s+/g, ' ')
                .trim();

            if (extract.length < 80) {
                throw new Error('Définition trop courte.');
            }

            return {
                topic: topic.name,
                title: data.title,
                extract,
                url: data.content_urls.desktop.page,
                category: topic.category,
                icon: topic.icon
            };

        } catch (error) {
            lastError = error;

            console.error(
                `⚠️ Tentative ${attempt} échouée : ${error.message}`
            );

            if (attempt < MAX_ATTEMPTS) {
                await new Promise(resolve =>
                    setTimeout(resolve, attempt * 1500)
                );
            }
        }
    }

    throw lastError;
}

// ==========================================
// 6. ÉCHAPPEMENT MARKDOWN
// ==========================================

function cleanMarkdown(value) {
    return String(value)
        .replace(/\r?\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\|/g, '\\|')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
}

// ==========================================
// 7. GÉNÉRATION DU README
// ==========================================

function generateReadme(current, history, dateInfo) {
    const publications = history.publications;
    const total = publications.length;

    const categories = new Set(
        publications.map(item => item.category)
    ).size;

    const recent = [...publications]
        .reverse()
        .slice(0, 10);

    const recentRows = recent.length
        ? recent.map((item, index) => `
| ${index + 1} | ${item.date} | ${item.icon || '📚'} ${cleanMarkdown(item.title)} | ${cleanMarkdown(item.category)} | [Consulter](${item.url}) |
`).join('')
        : '| - | - | Aucune publication | - | - |';

    return `<!--
  Dictionnaire Tech du Jour
  Projet automatisé - NOHA06
  Généré le ${dateInfo.date}
-->

<div align="center">

# 📚 DICTIONNAIRE TECH

### Comprendre une technologie, une notion à la fois.

<p>
  <img src="https://img.shields.io/badge/TECH-DU%20JOUR-7C3AED?style=for-the-badge" alt="Tech du jour">
  <img src="https://img.shields.io/badge/UPDATE-AUTOMATIQUE-00A859?style=for-the-badge" alt="Mise à jour automatique">
  <img src="https://img.shields.io/badge/POWERED%20BY-NOHA06-2A7DE1?style=for-the-badge" alt="NOHA06">
</p>

*Une découverte quotidienne autour de l'informatique, du développement et des technologies émergentes.*

</div>

---

## 💡 LA NOTION DU JOUR

<details open>
<summary><strong>${current.icon} ${cleanMarkdown(current.category)} — ${cleanMarkdown(current.title)}</strong></summary>

<br>

> ${cleanMarkdown(current.extract)}

<br>

<div align="right">

**📖 [Découvrir la source originale sur Wikipédia](${current.url})**

</div>

</details>

---

## 📊 LE DICTIONNAIRE EN CHIFFRES

<div align="center">

| 📚 Notions publiées | 🗂️ Catégories explorées | 💻 Notions disponibles |
|:---:|:---:|:---:|
| **${total}** | **${categories}** | **${topics.length}** |

</div>

---

## 🕘 HISTORIQUE DES DÉCOUVERTES

Voici les dix dernières notions ajoutées au dictionnaire.

| # | Date | Notion | Catégorie | Source |
|:---:|:---:|:---|:---|:---:|
${recentRows}

---

## 🧭 LES THÉMATIQUES EXPLORÉES

| Domaine | Description |
|:---|:---|
| 🤖 Intelligence artificielle | IA générative, modèles de langage, réseaux de neurones |
| 🗄️ Data & Bases de données | SQL, NoSQL, stockage et gestion des données |
| ☁️ Cloud & DevOps | Cloud computing, conteneurs, automatisation |
| 🔐 Cybersécurité | Protection, chiffrement, authentification |
| 💻 Développement | Programmation, API, frameworks, Git |
| 🏗️ Architecture logicielle | Microservices, conception et systèmes |
| 🌐 Technologies émergentes | Blockchain, IoT et innovations |

---

## ⚙️ À PROPOS DU PROJET

**Le Dictionnaire Tech du Jour** est un projet d'automatisation développé avec Node.js et GitHub Actions.

Son objectif est simple : découvrir régulièrement de nouvelles notions informatiques, enrichir ses connaissances et construire progressivement une bibliothèque de références techniques.

**Fonctionnement :**
- Sélection automatique d'une notion.
- Récupération de sa définition depuis Wikipédia.
- Vérification du contenu et gestion des erreurs.
- Enregistrement dans un historique pour éviter les répétitions.
- Actualisation automatique de ce README.

---

<div align="center">

### 🌱 APPRENDRE • EXPLORER • COMPRENDRE

**Un jour, une notion, une nouvelle connaissance.**

Développé avec curiosité par **[NOHA06](https://github.com/NOHA06)** 👩🏾‍💻

<sub>Dernière synchronisation : ${dateInfo.formatted} à ${dateInfo.time} (UTC)</sub>

</div>
`;
}

// ==========================================
// 8. PROGRAMME PRINCIPAL
// ==========================================

async function main() {
    console.log('\n====================================');
    console.log('📚 DICTIONNAIRE TECH DU JOUR - NOHA06');
    console.log('====================================\n');

    const dateInfo = getDateInfo();
    const history = loadHistory();

    console.log(`📅 Date : ${dateInfo.formatted}`);
    console.log(`📚 Publications : ${history.publications.length}`);

    // Vérifier si une notion existe déjà aujourd'hui.
    let current = history.publications.find(
        item => item.date === dateInfo.date
    );

    if (current) {
        console.log('ℹ️ Une notion a déjà été publiée aujourd’hui.');
        console.log(`📖 Notion : ${current.title}`);

    } else {
        let selected = selectTopic(history);
        let result = null;

        // Essayer les notions disponibles jusqu'à obtenir
        // une définition valide.
        const published = new Set(
            history.publications.map(item => item.topic)
        );

        const candidates = topics.filter(
            item => !published.has(item.name)
        );

        if (candidates.length === 0) {
            candidates.push(selected);
        } else {
            const selectedIndex = candidates.findIndex(
                item => item.name === selected.name
            );

            if (selectedIndex > 0) {
                candidates.unshift(
                    ...candidates.splice(selectedIndex, 1)
                );
            }
        }

        for (const topic of candidates) {
            try {
                result = await fetchTopic(topic);
                break;
            } catch (error) {
                console.error(
                    `❌ Notion ignorée : ${topic.name}`
                );
            }
        }

        if (!result) {
            throw new Error(
                'Aucune notion valide disponible. Publication annulée.'
            );
        }

        current = {
            ...result,
            date: dateInfo.date,
            publishedAt: new Date().toISOString()
        };

        history.publications.push(current);

        // Nouveau cycle si toutes les notions sont utilisées.
        if (history.publications.length >= topics.length) {
            history.publications = history.publications.slice(-topics.length);
        }

        saveHistory(history);

        console.log('\n✅ Nouvelle notion enregistrée !');
    }

    // Création de la vue finale
    const readme = generateReadme(
        current,
        history,
        dateInfo
    );

    fs.writeFileSync(README_FILE, readme, 'utf8');

    console.log('\n====================================');
    console.log('🎉 MISE À JOUR TERMINÉE');
    console.log('====================================');
    console.log(`📖 Notion : ${current.title}`);
    console.log(`🏷️ Catégorie : ${current.category}`);
    console.log(`📚 Total : ${history.publications.length}`);
    console.log('📄 README.md généré.');
    console.log('🗂️ Historique sauvegardé.');
    console.log('====================================\n');
}

main().catch(error => {
    console.error('\n🚨 ERREUR FATALE :', error.message);
    process.exitCode = 1;
});
