// ===============================
// NEWS APP — Loads Homepage News
// ===============================

async function loadNews() {
    const container = document.getElementById("news-container");
    if (!container) return;

    try {
        const response = await fetch("/firestore-seed/news.json");

        if (!response.ok) {
            throw new Error("Failed to load news.json");
        }

        const news = await response.json();

        if (!Array.isArray(news)) {
            throw new Error("Invalid news structure");
        }

        // latest 5 items
        const latestNews = news.slice(0, 5);

        container.innerHTML = latestNews.map(item => `
            <div class="p-4 rounded-xl bg-gray-800 text-white mb-4 shadow-lg hover:bg-gray-700 transition">
                <h3 class="text-lg font-semibold mb-1">${item.title}</h3>
                <p class="text-sm opacity-90">${item.description}</p>
                <p class="text-xs mt-2 opacity-70">📅 ${item.date}</p>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="text-red-400 p-3 bg-red-900/20 rounded-lg">
                Failed to load news.
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadNews);