// PDF.js setup
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

// Translations
const translations = {
  fr: {
    headerSubtitle: "CV numérique",
    footerGitHub: "Dépot GitHub",
  },
  en: {
    headerSubtitle: "Digital CV",
    footerGitHub: "GitHub Repository",
  },
};

// State
let currentLanguage = 'fr';
let pdfDoc = null;

// DOM Elements
const languageButton = document.getElementById('language-button');
const downloadButton = document.getElementById('download-button');
const headerSubtitle = document.getElementById('header-subtitle');
const footerGitHub = document.getElementById('footer-github');
const errorMessage = document.getElementById('error-message');

// Event Listeners
languageButton.addEventListener('click', toggleLanguage);
downloadButton.addEventListener('click', downloadPDF);

// Functions
function toggleLanguage() {
  currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
  headerSubtitle.textContent = translations[currentLanguage].headerSubtitle;
  footerGitHub.textContent = translations[currentLanguage].footerGitHub;
  languageButton.textContent = currentLanguage === 'fr' ? '🇬🇧' : '🇫🇷';
  loadPDF(currentLanguage === 'fr' ? 'CV_NDupont.pdf' : 'CV_NDupont_EN.pdf');
}

function loadPDF(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise
    .then((pdf) => {
      pdfDoc = pdf;
      renderPage(1);
    })
    .catch((reason) => {
      console.error(reason);
      errorMessage.textContent = 'Erreur de chargement du PDF: ' + reason;
    });
}

function renderPage(pageNumber) {
  pdfDoc.getPage(pageNumber).then((page) => {
    const scale = window.innerWidth < 768 ? 1.5 : 1.0;
    const viewport = page.getViewport({ scale: scale });

    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    page.render(renderContext);
  });
}

function downloadPDF() {
  const pdfUrl = currentLanguage === 'fr' ? 'CV_NDupont.pdf' : 'CV_NDupont_EN.pdf';
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = 'CV_NDupont.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initialize
window.onload = () => {
  loadPDF('CV_NDupont.pdf');
};
