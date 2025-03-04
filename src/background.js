chrome.runtime.onInstalled.addListener(() => {
  console.log('Grape QRCode extension installed');
  chrome.contextMenus.create({
    id: "createQRCode",
    title: "Crear QR del enlace",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createQRCode") {
    chrome.tabs.create({
      url: `src/popup.html?link=${encodeURIComponent(info.linkUrl)}`
    });
  }
});
