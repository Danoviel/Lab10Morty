// Script para pre-generar datos de Rick and Morty API como JSON estático
// Ejecutar: node scripts/generate-characters-data.js
// Esto evita timeouts en Vercel Hobby (límite de 60s para generar páginas estáticas)

const fs = require('fs');
const path = require('path');

async function fetchWithRetry(url, retries = 3, baseDelay = 2000) {
  let res = await fetch(url);
  for (let attempt = 1; attempt <= retries && res.status === 429; attempt++) {
    const wait = baseDelay * attempt;
    console.log(`    429 en ${url}, reintentando en ${wait}ms...`);
    await new Promise(r => setTimeout(r, wait));
    res = await fetch(url);
  }
  return res;
}

async function fetchAllCharacters() {
  const allCharacters = [];
  let nextUrl = 'https://rickandmortyapi.com/api/character';
  let pageNum = 1;
  
  console.log('Descargando personajes de Rick and Morty API...');
  
  while (nextUrl) {
    const res = await fetchWithRetry(nextUrl);
    if (!res.ok) {
      console.warn(`Error ${res.status} en página ${pageNum}. Guardando ${allCharacters.length} personajes...`);
      break;
    }
    
    const data = await res.json();
    allCharacters.push(...data.results);
    nextUrl = data.info.next;
    
    console.log(`  Página ${pageNum}: ${allCharacters.length} personajes acumulados`);
    pageNum++;
    
    // Delay para no saturar la API
    if (nextUrl) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  console.log(`\nTotal: ${allCharacters.length} personajes descargados`);
  
  // Guardar en archivo JSON
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const outputPath = path.join(dataDir, 'characters.json');
  fs.writeFileSync(outputPath, JSON.stringify(allCharacters, null, 2));
  
  console.log(`Datos guardados en: ${outputPath}`);
}

fetchAllCharacters().catch(console.error);
