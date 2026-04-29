(() => {
    const USERNAME = 'wtfashwin';
    const CACHE_KEY = 'gh_stats_v1';
    const CACHE_TTL_MS = 60 * 60 * 1000;
    const API = 'https://api.github.com';

    const readCache = () => {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { ts, data } = JSON.parse(raw);
            if (Date.now() - ts > CACHE_TTL_MS) return null;
            return data;
        } catch { return null; }
    };

    const writeCache = (data) => {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
    };

    const safeFetch = async (url) => {
        const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
        if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
        return r.json();
    };

    const fetchStats = async () => {
        const [profile, prSearch, repoPage1] = await Promise.all([
            safeFetch(`${API}/users/${USERNAME}`),
            safeFetch(`${API}/search/issues?q=${encodeURIComponent(`author:${USERNAME} is:pr`)}&per_page=1`),
            safeFetch(`${API}/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`)
        ]);

        const repos = Array.isArray(repoPage1) ? repoPage1 : [];
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

        let recentCommits = 0;
        try {
            const events = await safeFetch(`${API}/users/${USERNAME}/events/public?per_page=100`);
            recentCommits = events
                .filter(e => e.type === 'PushEvent')
                .reduce((sum, e) => sum + ((e.payload && e.payload.commits) ? e.payload.commits.length : 0), 0);
        } catch {}

        return {
            repos: profile.public_repos || repos.length,
            stars: totalStars,
            prs: prSearch.total_count || 0,
            commits: recentCommits
        };
    };

    const setStat = (selector, value, label) => {
        const card = document.querySelector(selector);
        if (!card) return;
        const numEl = card.querySelector('.stat-number');
        const labelEl = card.querySelector('.stat-info p');
        if (!numEl) return;
        numEl.setAttribute('data-target', String(value));
        if (label && labelEl) labelEl.textContent = label;
        if (numEl.classList.contains('counted')) {
            numEl.textContent = value.toLocaleString();
        }
    };

    const apply = (data) => {
        const cards = document.querySelectorAll('.github-stat-card');
        if (cards.length < 4) return;
        const numEls = [...cards].map(c => c.querySelector('.stat-number'));
        const labelEls = [...cards].map(c => c.querySelector('.stat-info p'));

        const updates = [
            { value: data.commits, label: 'Commits (last 90d)' },
            { value: data.prs,     label: 'Pull Requests' },
            { value: data.stars,   label: 'Total Stars' },
            { value: data.repos,   label: 'Public Repositories' }
        ];

        updates.forEach((u, i) => {
            if (!numEls[i]) return;
            numEls[i].setAttribute('data-target', String(u.value));
            if (labelEls[i]) labelEls[i].textContent = u.label;
            if (numEls[i].classList.contains('counted')) {
                numEls[i].textContent = u.value.toLocaleString();
            }
        });
    };

    const run = async () => {
        const cached = readCache();
        if (cached) apply(cached);
        try {
            const fresh = await fetchStats();
            writeCache(fresh);
            apply(fresh);
        } catch (err) {
            console.warn('[github-stats] live fetch failed, keeping previous values:', err.message);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
