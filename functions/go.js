// /go = the App Store link from the ad page (/play) and the ads. Cloudflare Pages Function: answers with a
// server-side 302 to the App Store (in-app browsers such as Instagram/Facebook got a JS redirect before).
// ?ct=<name> replaces the App Store campaign token (letters, digits, _ and -, up to 30), &ppid=<id> opens a
// Custom Product Page (hex digits and dashes). Anything else is ignored.
// Each hit is logged without IP or cookies: path, ct, ppid yes/no, country, in-app browser, OS.
// Live log: Pages > sharliztower > Functions > Real-time logs. Saved counts: bind a Workers Analytics Engine
// dataset as GO_HITS in the Pages settings (optional; without it the 302 works the same).
const APP = 'https://apps.apple.com/app/apple-store/id6819720504?pt=129570131';

export function storeUrl(reqUrl, defCt) {
  const q = new URL(reqUrl).searchParams;
  let ct = q.get('ct');
  if (!ct || !/^[\w-]{1,30}$/.test(ct)) ct = defCt;
  const pp = q.get('ppid');
  const ppid = pp && /^[0-9a-fA-F-]{8,40}$/.test(pp) ? pp : '';
  return { url: APP + '&ct=' + ct + '&mt=8' + (ppid ? '&ppid=' + ppid : ''), ct, ppid };
}

export function appOf(ua) {
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB|FBIOS|FBSS/.test(ua)) return 'facebook';
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return 'tiktok';
  if (/CriOS|Chrome\//.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'safari';
  return 'other';
}

export function go(ctx, path, defCt) {
  const { request, env } = ctx;
  const { url, ct, ppid } = storeUrl(request.url, defCt);
  const ua = request.headers.get('user-agent') || '';
  const os = /iPhone|iPad|iPod/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : 'other';
  const country = (request.cf && request.cf.country) || '';
  const app = appOf(ua);
  console.log(JSON.stringify({ go: path, ct, ppid: ppid ? 1 : 0, country, app, os }));
  try {
    if (env && env.GO_HITS && env.GO_HITS.writeDataPoint)
      env.GO_HITS.writeDataPoint({ indexes: [path], blobs: [path, ct, ppid, country, app, os], doubles: [1] });
  } catch (e) {}
  return new Response(null, { status: 302, headers: { Location: url, 'Cache-Control': 'no-store' } });
}

export const onRequest = (ctx) => go(ctx, '/go', 'meta_w1_caau');
