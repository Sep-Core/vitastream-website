// 访问计数器（五个页面视为同一站点：同一用户只计数一次）
(() => {
  // 你的服务器地址（可以是IP或域名）
  const serverURL = "https://visitcounter.sepcorn.top/count";

  // 全站去重 key：同一域名下 5 个页面共享（cookie/localStorage）
  const storageKey = "vitastream_visit_counted_v1";
  const cookieName = "vitastream_vc_v1";
  const cookieMaxAgeSeconds = 60 * 60 * 24 * 365; // 1 year

  function getCookie(name) {
    const parts = document.cookie ? document.cookie.split("; ") : [];
    for (const part of parts) {
      const eq = part.indexOf("=");
      if (eq === -1) continue;
      const k = part.slice(0, eq);
      if (k === name) return decodeURIComponent(part.slice(eq + 1));
    }
    return null;
  }

  function setCookie(name, value, maxAgeSeconds) {
    // SameSite=Lax works for normal navigation; Secure omitted to allow http.
    // path=/ ensures all 5 pages share this cookie.
    document.cookie =
      `${name}=${encodeURIComponent(value)}; ` +
      `Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  }

  function hasCounted() {
    try {
      if (localStorage.getItem(storageKey) === "1") return true;
    } catch (_) {
      // ignore
    }
    return getCookie(cookieName) === "1";
  }

  function markCounted() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch (_) {
      // ignore
    }
    try {
      setCookie(cookieName, "1", cookieMaxAgeSeconds);
    } catch (_) {
      // ignore
    }
  }

  function sendCountRequest() {
    // Prefer sendBeacon when available; for GET we can use fetch with keepalive.
    if (navigator.sendBeacon) {
      try {
        // Some browsers may not send GET beacons as expected; still fine as best-effort.
        return navigator.sendBeacon(serverURL);
      } catch (_) {
        // ignore
      }
    }

    try {
      fetch(serverURL, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        keepalive: true,
        credentials: "omit",
      }).catch(() => {});
    } catch (_) {
      // ignore
    }
  }

  // 只要访问 5 个页面中的任意一个：首次触发计数；之后同一用户不再计数
  if (hasCounted()) return;
  markCounted(); // 先写标记，防止用户狂刷新造成多次计数
  sendCountRequest();
})();