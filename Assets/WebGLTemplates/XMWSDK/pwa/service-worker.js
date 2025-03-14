const CACHE_NAME = "game-cache-v1";
const cacheList = [
  "/",
  "./index.html",
  "./icon/app_icon_192.png",
  "./icon/app_icon_512.png",
];

// 监听安装事件 并在此阶段 缓存基本资源
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(
        // 缓存基本资源
        (cache) => cache.addAll(cacheList)
      )
      .then(() =>
        // 当脚本更新时 使新版Service Worker强制进入activate状态
        self.skipWaiting()
      )
  );
});
// 监听fetch请求事件
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") {
    // 跳过非 GET 请求
    return;
  }
  const requestURL = new URL(e.request.url);
  // 过滤掉 chrome-extension:// 请求
  if (requestURL.protocol === "chrome-extension:") {
    return;
  }
  // 拦截相关请求
  e.respondWith(
    // 如果缓存中已经有请求的数据就终止请求 直接返回缓存数据
    caches.match(e.request).then(async function (response) {
      if (response != null) {
        return response;
      }
      // 否则就重新向服务端请求
      const res = await fetch(e.request);
      // 这块需要结合具体业务具体分析 我这里的示例逻辑是无脑全部缓存
      // 请求成功后将请求的资源缓存起来 后续请求直接走缓存
      const cache = await caches.open(CACHE_NAME);
      cache.put(e.request, res.clone());
      // 将请求的资源返回给页面。
      return res;
    })
  );
});
// 监听激活事件
self.addEventListener("activate", function (e) {
  e.waitUntil(
    //获取所有cache名称
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          // 获取缓存中所有不属于当前版本cachekey下的内容
          cacheNames
            .filter((cacheNames) => {
              return cacheNames !== CACHE_NAME;
            })
            .map((cacheNames) => {
              // 删除不属于当前版本的cache缓存数据
              return caches.delete(cacheNames);
            })
        );
      })
      .then(() => {
        // 无须刷新页面 即可使新版server worker接管当前页面
        return self.clients.claim();
      })
  );
});
