// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
// 判断workbox是否加载成功
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener("message", e => {
  if (e.data) {
    if (e.data === "skipWaiting") {
      self.skipWaiting();
    }
  }
});

workbox.clientsClaim();

// The precaching code provided by Workbox. You don't need to change this part.
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});