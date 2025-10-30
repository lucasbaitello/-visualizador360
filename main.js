import './style.css';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

// --- LÓGICA DO SELETOR DE TEMA ---
const themeToggleBtn = document.querySelector('#theme-toggle-btn');

// Verifica o tema salvo no carregamento da página
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
  document.body.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');

  let theme = 'dark';
  if (document.body.classList.contains('light-theme')) {
    theme = 'light';
  } else {
    // O ícone não precisa mais ser alterado via JS
  }
  localStorage.setItem('theme', theme);
});

// --- LÓGICA DA GALERIA E VISUALIZADOR ---
const contentWrapper = document.querySelector('.content-wrapper');
const galleryContainer = document.querySelector('#gallery-menu');
const menuToggleBtn = document.querySelector('#menu-toggle-btn');
const viewerContainer = document.querySelector('#viewer');

// Lógica para o menu retrátil
menuToggleBtn.addEventListener('click', () => {
  contentWrapper.classList.toggle('menu-collapsed');
  if (contentWrapper.classList.contains('menu-collapsed')) {
    menuToggleBtn.textContent = '«';
    menuToggleBtn.title = 'Mostrar menu';
  } else {
    menuToggleBtn.textContent = '»';
    menuToggleBtn.title = 'Esconder menu';
  }
});

// Função para limpar a extensão e formatar o nome do arquivo para a legenda
function formatCaption(filename) {
  return filename
    .replace(/\.(jpg|jpeg|png)$/i, '')
    .replace(/[_-]/g, '-');
}

// Função principal para iniciar a aplicação
async function init() {
  if (!viewerContainer || !galleryContainer) {
    console.error('Container do viewer ou da galeria não encontrado!');
    return;
  }

  try {
    const response = await fetch('/gallery-data.json');
    if (!response.ok) {
      throw new Error('Não foi possível carregar a lista de imagens.');
    }
    const images = await response.json();

    if (images.length === 0) {
      galleryContainer.innerHTML = '<p>Nenhuma imagem encontrada.</p>';
      return;
    }

    const viewer = new Viewer({
      container: viewerContainer,
      panorama: `/images/360/${images[0]}`,
      loadingTxt: 'Carregando...',
      navbar: [ 
        'zoom',
        'spacer', // Item "em branco" para empurrar o próximo para a direita
        'fullscreen',
      ],
      minFov: 10,
      maxFov: 120,
    });

    images.forEach((image, index) => {
      const imagePath = `/images/360/${image}`;
      const container = document.createElement('div');
      container.className = 'thumbnail-container';
      const thumbnail = document.createElement('img');
      thumbnail.src = imagePath;
      thumbnail.className = 'gallery-thumbnail';
      const caption = document.createElement('p');
      caption.className = 'thumbnail-caption';
      caption.textContent = formatCaption(image);

      if (index === 0) {
        thumbnail.classList.add('active');
      }

      thumbnail.addEventListener('click', () => {
        galleryContainer.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
        viewer.setPanorama(imagePath);
      });

      container.appendChild(thumbnail);
      container.appendChild(caption);
      galleryContainer.appendChild(container);
    });

  } catch (error) {
    console.error('Erro ao inicializar a galeria:', error);
    galleryContainer.innerHTML = `<p style="color: #ff8a8a;">Erro ao carregar galeria. Tente rodar 'npm run generate'.</p>`;
  }
}

init();