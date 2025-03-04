chrome.runtime.onInstalled.addListener(() => {
  console.log('Grape QRCode extension installed');
  chrome.contextMenus.create({
    id: "createQRCode",
    title: "Crear QR del enlace",
    contexts: ["link"]
  });
});

// Variable para almacenar el ID de la ventana popup
let popupWindowId = null;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createQRCode") {
    // Crear una ventana popup sin dimensiones específicas para que se ajuste al contenido
    chrome.windows.create({
      url: `src/popup.html?link=${encodeURIComponent(info.linkUrl)}`,
      type: 'popup',
      focused: true
    }, (window) => {
      // Guardar el ID de la ventana para poder ajustar su tamaño más tarde
      popupWindowId = window.id;
    });
  }
});

// Escuchar mensajes para ajustar el tamaño del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'adjustSize' && popupWindowId) {
    // Ajustar el tamaño de la ventana popup
    chrome.windows.update(popupWindowId, {
      width: message.width,
      height: message.height
    });
  }
});
