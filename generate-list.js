import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.join(__dirname, 'public', 'images', '360');
const outputFile = path.join(__dirname, 'public', 'gallery-data.json');

// Lê todos os arquivos no diretório
fs.readdir(galleryDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler o diretório de imagens:', err);
    return;
  }

  // Filtra apenas por arquivos de imagem (adicionar outras extensões se necessário)
  const imageFiles = files.filter(file => {
    const fileExtension = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(fileExtension);
  });

  // Escreve a lista de arquivos em um JSON
  fs.writeFile(outputFile, JSON.stringify(imageFiles, null, 2), (err) => {
    if (err) {
      console.error('Erro ao escrever o arquivo JSON:', err);
      return;
    }
    console.log(`Lista de imagens gerada com sucesso em ${outputFile}`);
  });
});
