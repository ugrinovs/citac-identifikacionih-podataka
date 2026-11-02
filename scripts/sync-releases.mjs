import { writeFile } from 'node:fs/promises';

const repository = process.env.RELEASE_REPOSITORY || 'ugrinovs/citac-identifikacionih-podataka';
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
  throw new Error('RELEASE_REPOSITORY mora biti u obliku owner/repo.');
}

const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=50`, {
  headers: {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cip-site',
  },
});
if (!response.ok) {
  throw new Error(`GitHub Releases API: ${response.status} ${response.statusText}`);
}

const raw = await response.json();
if (!Array.isArray(raw)) throw new Error('Neočekivan odgovor GitHub Releases API-ja.');

const releases = raw
  .filter((release) => !release.draft && !release.prerelease)
  .map((release) => {
    const installer = release.assets?.find((asset) => /^(?:LicnaKarta|CIP)(?:-[\w.-]+)?\.dmg$/i.test(asset.name));
    if (!installer || !release.published_at || !release.tag_name) return null;
    const checksumAsset = release.assets?.find((asset) => asset.name === `${installer.name}.sha256`);
    const checksumLine = (release.body || '').split(/\r?\n/).find((line) => line.includes('SHA-256') && line.includes(installer.name));
    const sha256 = /^sha256:([a-f0-9]{64})$/i.exec(installer.digest || '')?.[1]
      || checksumLine?.match(/\b[a-f0-9]{64}\b/i)?.[0]
      || null;
    return {
      version: release.tag_name.replace(/^v/, ''),
      publishedAt: new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium' }).format(new Date(release.published_at)),
      downloadUrl: installer.browser_download_url,
      size: `${(installer.size / 1024 / 1024).toFixed(1)} MiB`,
      sha256,
      checksumUrl: checksumAsset?.browser_download_url || null,
      unsigned: /nema Apple Developer ID potpis/i.test(release.body || ''),
      notes: (release.body || 'Nema beleški za ovo izdanje.').trim(),
    };
  })
  .filter(Boolean);

const manifest = { latest: releases[0] || null, releases };
await writeFile(new URL('../src/data/releases.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Upisano ${releases.length} javnih izdanja iz ${repository}.`);
