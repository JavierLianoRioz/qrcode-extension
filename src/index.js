/* eslint-disable no-undef */
const qrData = document.getElementById('qr-input');
const qrButton = document.getElementById('qr-button');
const pasteButton = document.getElementById('paste-button');
const domainDisplay = document.getElementById('domain-display');
const downloadLink = document.getElementById('a-download');

const qrcode = new QRCode(document.getElementById('qrcode'), {
  text: '',
  width: 280,
  height: 280,
  colorDark: '#8aadf4', // primary color
  colorLight: '#24273a', // background color
  correctLevel: QRCode.CorrectLevel.H,
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Función para ajustar el tamaño del popup
const adjustPopupSize = () => {
  // Solo ajustar si estamos en una ventana popup (no en el popup de la extensión)
  if (window.location.search.includes('link=')) {
    // Dar tiempo para que el contenido se renderice completamente
    sleep(300).then(() => {
      // Obtener el elemento principal que contiene todo el contenido
      const extensionElement = document.getElementById('extension');
      
      // Obtener el tamaño real del contenido
      const width = extensionElement.offsetWidth;
      const height = extensionElement.offsetHeight;
      
      // Comunicar con el background script para ajustar el tamaño
      chrome.runtime.sendMessage({
        action: 'adjustSize',
        width: width + 20, // Margen adicional para evitar barras de desplazamiento
        height: height + 40 // Aumentamos el margen inferior para más espacio
      });
    });
  }
};

// Generar QR automáticamente con la URL de la página actual o el enlace del menú contextual
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const link = urlParams.get('link');

  if (link) {
    qrcode.makeCode(link);
    qrData.value = link;
    domainDisplay.value = new URL(link).hostname;
    sleep(100).then(() => {
      const src = document.querySelector('img').getAttribute('src');
      document.getElementById('a-download').href = `${src}`;
      adjustPopupSize();
    });
    downloadLink.download = 'qrcode';
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      qrcode.makeCode(currentUrl);
      qrData.value = currentUrl;
      domainDisplay.value = new URL(currentUrl).hostname;
      sleep(100).then(() => {
        const src = document.querySelector('img').getAttribute('src');
        document.getElementById('a-download').href = `${src}`;
      });
      downloadLink.download = 'qrcode';
    });
  }
});

qrButton.addEventListener('click', () => {
  qrcode.makeCode(qrData.value);
  domainDisplay.value = new URL(qrData.value).hostname;
  sleep(100).then(() => {
    const src = document.querySelector('img').getAttribute('src');
    document.getElementById('a-download').href = `${src}`;
    adjustPopupSize();
  });
  downloadLink.download = 'qrcode';
});

pasteButton.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    qrData.value = text;
    domainDisplay.value = new URL(text).hostname;
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
});

qrData.addEventListener('input', function() {
  this.style.height = '';
  this.style.height = this.scrollHeight + 'px';
});
