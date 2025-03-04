/* eslint-disable no-undef */
const qrData = document.getElementById('qr-input');
const qrButton = document.getElementById('qr-button');
const downloadLink = document.getElementById('a-download');

const qrcode = new QRCode(document.getElementById('qrcode'), {
  text: '',
  width: 280,
  height: 280,
  colorDark: '#551A8B',
  colorLight: '#F8F8F8',
  correctLevel: QRCode.CorrectLevel.H,
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Generar QR automáticamente con la URL de la página actual
window.addEventListener('load', () => {
  const currentUrl = window.location.href;
  qrcode.makeCode(currentUrl);
  qrData.value = currentUrl;
  sleep(100).then(() => {
    const src = document.querySelector('img').getAttribute('src');
    document.getElementById('a-download').href = `${src}`;
  });
  downloadLink.download = 'qrcode';
});

qrButton.addEventListener('click', () => {
  qrcode.makeCode(qrData.value);
  sleep(100).then(() => {
    const src = document.querySelector('img').getAttribute('src');
    document.getElementById('a-download').href = `${src}`;
  });
  downloadLink.download = 'qrcode';
});
