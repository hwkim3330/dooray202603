const DOORAY_TOKEN = 's701wolho5si:QQ5-gGPzTymiCSytV3vSRA';
const DOORAY_API = 'https://api.dooray.com';

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <title>KETI 회의실</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    :root{
      --brand:#2563eb;
      --brand-deep:#1e40af;
      --line:#e5e7eb; --muted:#6b7280; --bg:#ffffff; --text:#111827;
      --roomW: 120px;
      --slotW: 60px;
      --rowH: 72px;
      --nowGradStart: #eff6ff;
      --nowGradEnd:   #dbeafe;
      --nowText:#1d4ed8;
      --nowBorder:#bfdbfe;
      --stripe1: rgba(37,99,235,0.06);
      --stripe2: rgba(37,99,235,0.06);
    }
    body{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; padding:16px; }
    .banner{ display:none; margin-bottom:10px; padding:10px 12px; border-radius:10px; font-size:14px; font-weight:700; }
    .banner.on{ display:block; }
    .banner.offline{ background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; }
    .banner.error{ background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
    .header{
      background:#fff; border-radius:16px; box-shadow:0 2px 20px rgba(0,0,0,.08);
      padding:14px 16px; margin-bottom:16px;
    }
    .header-content{ display:flex; align-items:center; gap:14px; justify-content:space-between; flex-wrap:wrap; }
    .title-wrap{ display:flex; align-items:center; gap:12px; }
    .logo{ width:256px; height:72px; object-fit:contain; border-radius:12px; }
    .controls{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .date-input{ padding:8px 10px; border:1px solid var(--line); border-radius:10px; font-size:14px; min-height:36px; }
    .stats{ display:flex; gap:24px; align-items:center; flex-wrap:wrap; }
    .stat{ text-align:center; }
    .stat-label{ font-size:12px; color:var(--muted); margin-bottom:4px; }
    .stat-value{ font-size:24px; font-weight:800; color:var(--brand); line-height:1; }
    .card{ background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 20px rgba(0,0,0,.08); margin-bottom:16px; position:relative; }
    .card-h{ display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#f8fafc; border-bottom:2px solid #e2e8f0; }
    .card-left{ display:flex; align-items:baseline; gap:10px; }
    .loc-name{ font-size:18px; font-weight:700; }
    .loc-sub{ font-size:12px; color:var(--muted); }
    .refresh{ display:flex; align-items:center; gap:6px; background:var(--brand); color:#fff; border:none; padding:8px 12px; border-radius:10px; font-weight:700; cursor:pointer; }
    .refresh:hover{ filter:brightness(.97); }
    .refresh.spin .ico{ animation:spin 1s linear infinite; }
    .ico{ font-size:18px; }
    @keyframes spin{ from{transform:rotate(0)} to{transform:rotate(360deg)} }
    .wrap{
      padding:12px; overflow:auto; position:relative;
      background-image:
        linear-gradient(to right, rgba(255,255,255,0.6), rgba(255,255,255,0.6)),
        repeating-linear-gradient(
          to right,
          var(--stripe1) 0,
          var(--stripe1) calc(var(--slotW) * 2),
          var(--stripe2) calc(var(--slotW) * 2),
          var(--stripe2) calc(var(--slotW) * 4)
        );
      background-blend-mode: lighten;
    }
    .tl{
      width:100%;
      border-collapse:separate; border-spacing:0;
      table-layout: fixed;
      min-width: calc(var(--roomW) + var(--slotW) * 2 * 10);
      background:transparent;
    }
    .tl col.roomcol { width: var(--roomW); }
    .tl col.slotcol { width: var(--slotW); }
    .tl thead th{
      background:#f8fafc; padding:10px 6px; font-size:13px; font-weight:700; color:#334155; text-align:center; border:1px solid #e2e8f0;
      transition: background-color .25s ease, color .25s ease, box-shadow .25s ease, border-color .25s ease;
      user-select:none;
    }
    .tl th.room-h{
      position:sticky; left:0; z-index:10; width:var(--roomW);
      background:#f1f5f9; color:#0f172a; border-right:2px solid #e2e8f0;
    }
    .tl thead th.now-hour{
      background: linear-gradient(180deg, var(--nowGradStart), var(--nowGradEnd));
      color: var(--nowText);
      border-color: var(--nowBorder);
      box-shadow: inset 0 -3px 0 0 var(--brand);
    }
    .tl tbody tr:hover{ background:rgba(241,245,249,.5); }
    .tl td{ height:var(--rowH); border:1px solid #e2e8f0; padding:0; position:relative; background:transparent; }
    .tl td.room{
      position:sticky; left:0; z-index:5; width:var(--roomW);
      background:#fff; border-right:2px solid var(--brand); text-align:center; vertical-align:middle; padding:8px;
    }
    .floor{ font-size:13px; color:#475569; margin-bottom:2px; font-weight:600; }
    .rname{ font-size:16px; font-weight:800; line-height:1.2; white-space:pre-line; word-break:keep-all; }
    .bk{
      position:absolute; inset:6px; border-radius:10px;
      background: linear-gradient(135deg, rgba(37,99,245,.85), rgba(30,64,185,.85));
      color:#fff; padding:10px; display:flex; flex-direction:column; justify-content:center;
      box-shadow:0 2px 8px rgba(30,64,175,.18); cursor:pointer; touch-action:manipulation;
      font-size: clamp(12px, calc((var(--slotW) * var(--span)) * 0.18), 16px);
      line-height:1.25; will-change:transform;
    }
    .bk .t{ font-weight:900; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; }
    .bk .u{ font-weight:600; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; opacity:.95; }
    .bk[data-span="1"]{ padding:8px; }
    .bk[data-span="1"] .t{ -webkit-line-clamp:1; }
    .bk[data-span="1"] .u{ font-size:.9em; }
    @media (prefers-reduced-motion: reduce){
      *{ animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important; scroll-behavior:auto !important; }
    }
    @media (pointer:coarse){
      :root{ --rowH: 80px; --slotW: 64px; }
      .stat-value{ font-size:26px; }
      .date-input{ padding:12px 16px; font-size:16px; }
      .bk{ font-size: clamp(12px, calc((var(--slotW) * var(--span)) * 0.17), 18px); }
      .bk .t{ -webkit-line-clamp:3; }
      .bk .u{ font-size:.95em; }
    }
  </style>
</head>
<body>
  <div id="offlineBanner" class="banner offline">오프라인 상태입니다. 네트워크가 복구되면 자동 동기화합니다.</div>
  <div id="errorBanner" class="banner error">데이터를 불러오지 못했습니다. 잠시 후 재시도합니다.</div>

  <div class="header">
    <div class="header-content">
      <div class="title-wrap">
        <img class="logo" src="https://hwkim3330.github.io/velocitydrivesp-keti/assets/keti.png" alt="KETI" />
      </div>
      <div class="controls">
        <input id="datePick" class="date-input" type="date" />
      </div>
      <div class="stats">
        <div class="stat"><div class="stat-label">글로벌R&D</div><div id="globalAvailable" class="stat-value">0</div></div>
        <div class="stat"><div class="stat-label">GBC</div><div id="gbcAvailable" class="stat-value">0</div></div>
        <div class="stat"><div class="stat-label">전체</div><div id="totalAvailable" class="stat-value">0</div></div>
      </div>
    </div>
  </div>

  <div id="main"></div>

  <div id="modal" class="modal" role="dialog" aria-modal="true" style="position:fixed; inset:0; background:rgba(0,0,0,.5); display:none; align-items:center; justify-content:center; padding:24px; z-index:9999;">
    <div id="sheet" class="sheet" role="document" style="background:#fff; border-radius:18px; max-width:640px; width:100%; padding:18px; box-shadow:0 8px 24px rgba(0,0,0,.2);">
      <div class="m-ttl" style="font-size:22px; font-weight:900; margin-bottom:8px;">제목</div>
      <div class="m-row" style="font-size:16px; color:#333; margin:6px 0;"><span class="m-l" style="color:#6b7280; display:inline-block; min-width:64px;">시간</span><span id="mTime"></span></div>
      <div class="m-row" style="font-size:16px; color:#333; margin:6px 0;"><span class="m-l" style="color:#6b7280; display:inline-block; min-width:64px;">회의실</span><span id="mRoom"></span></div>
      <div class="m-row" style="font-size:16px; color:#333; margin:6px 0;"><span class="m-l" style="color:#6b7280; display:inline-block; min-width:64px;">담당</span><span id="mUser"></span></div>
      <div class="m-close" style="margin-top:14px; display:flex; justify-content:flex-end;">
        <button id="mClose" type="button" class="m-btn" style="background:var(--brand); color:#fff; border:none; border-radius:10px; padding:10px 16px; font-weight:700; cursor:pointer;">닫기</button>
      </div>
    </div>
  </div>

  <script>
    const KST = 'Asia/Seoul';
    const nowKST = () => new Date(new Date().toLocaleString('en-US', { timeZone: KST }));
    const ymdKST = (d = nowKST()) => new Intl.DateTimeFormat('sv-SE', { timeZone: KST, year:'numeric', month:'2-digit', day:'2-digit' }).format(d);
    const fmtTime = (d) => new Intl.DateTimeFormat('ko-KR', { timeZone: KST, hour:'2-digit', minute:'2-digit' }).format(d);
    const fmtStamp = (d) => new Intl.DateTimeFormat('ko-KR', { timeZone: KST, month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).format(d);

    const API = {
      START_HOUR: 9,
      END_HOUR: 19,
      TIMEOUT_MS: 15000,
      async fetch(endpoint, params = {}, attempt = 1){
        const qs = new URLSearchParams(params).toString();
        const url = '/api' + endpoint + (qs ? '?' + qs : '');
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), this.TIMEOUT_MS);
        try{
          const res = await fetch(url, { signal: ctl.signal });
          clearTimeout(timer);
          if(!res.ok) throw new Error('HTTP ' + res.status);
          return await res.json();
        }catch(err){
          clearTimeout(timer);
          if (attempt < 3){
            await new Promise(r => setTimeout(r, 800 * attempt));
            return this.fetch(endpoint, params, attempt + 1);
          }
          throw err;
        }
      }
    };

    class App {
      constructor() {
        this.locations = [];
        this.data = {};
        this.date = ymdKST();
        this.followToday = true;
        this.intervalId = null;
        this.midnightTimer = null;
        this._hourTick = null;
        this.bind();
        this.init();
      }
      bind() {
        const $date = document.getElementById('datePick');
        $date.value = this.date;
        $date.addEventListener('change', () => {
          const wasFollow = this.followToday;
          this.date = $date.value || ymdKST();
          this.followToday = (this.date === ymdKST());
          this.refreshAll();
          if (!wasFollow && this.followToday) this.scheduleMidnightTick();
        }, { passive:true });
        document.getElementById('main').addEventListener('click', (e) => {
          const el = e.target.closest('.bk');
          if (!el) return;
          this.openModal({ title: el.dataset.title || '예약', time: el.dataset.time || '', room: el.dataset.room || '', user: el.dataset.user || '' });
        }, { passive:true });
        const modal = document.getElementById('modal');
        const sheet = document.getElementById('sheet');
        document.getElementById('mClose').addEventListener('click', () => this.closeModal(), { passive:true });
        modal.addEventListener('click', (e) => { if (e.target === modal) this.closeModal(); }, { passive:true });
        sheet.addEventListener('click', (e) => e.stopPropagation(), { passive:true });
        window.addEventListener('online',  () => this.onOnline(),  { passive:true });
        window.addEventListener('offline', () => this.onOffline(), { passive:true });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') this.refreshAll(true).then(()=>this.highlightNowHourAll());
        }, { passive:true });
      }
      init() {
        this.refreshAll();
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.refreshAll(true), 5 * 60 * 1000);
        this.scheduleMidnightTick();
        clearInterval(this._hourTick);
        this._hourTick = setInterval(()=>this.highlightNowHourAll(), 60*1000);
        if (!navigator.onLine) this.onOffline(); else this.onOnline();
      }
      scheduleMidnightTick(){
        clearTimeout(this.midnightTimer);
        if (!this.followToday) return;
        const now = nowKST();
        const next = new Date(now);
        next.setDate(now.getDate()+1);
        next.setHours(0,0,5,0);
        const ms = next - now;
        this.midnightTimer = setTimeout(() => {
          this.date = ymdKST();
          const $date = document.getElementById('datePick');
          if ($date) $date.value = this.date;
          this.refreshAll();
          this.scheduleMidnightTick();
        }, Math.max(ms, 1000));
      }
      async refreshAll(silent=false) {
        try {
          this.hideError();
          const locs = await API.fetch('/reservation/v1/resource-categories', { size: 20 });
          this.locations = (locs.result || []).filter(l =>
            l.name && (l.name.includes('판교(글로벌R&D센터)') || l.name.includes('판교(GBC)'))
          ).sort((a,b) => (a.name.includes('글로벌R&D센터') ? -1 : (b.name.includes('글로벌R&D센터') ? 1 : 0)));
          for (const loc of this.locations) {
            await this.loadLocation(loc.id, silent);
          }
          this.updateStats();
          if (!silent) this.render();
          this.highlightNowHourAll();
        } catch (err) {
          console.error(err);
          this.showError('데이터를 불러오지 못했습니다. 잠시 후 자동 재시도합니다.');
        }
      }
      async loadLocation(locationId, silent=false) {
        const loc = this.locations.find(l => l.id === locationId);
        if (!loc) return;
        const btn = document.getElementById('btn-'+locationId);
        if (btn && !silent) btn.classList.add('spin');
        try {
          const roomsRes = await API.fetch('/reservation/v1/reservable-resources', { resourceCategoryId: locationId, size: 200 });
          const rooms = roomsRes.result || [];
          let reservations = [];
          if (rooms.length > 0) {
            const ids = rooms.map(r => r.id).join(',');
            const day = this.date;
            const timeMin = day+'T00:00:00+09:00';
            const timeMax = day+'T23:59:59+09:00';
            const resv = await API.fetch('/reservation/v1/resource-reservations', { resourceIds: ids, timeMin, timeMax, size: 500 });
            reservations = resv.result || [];
          }
          this.data[locationId] = { location: loc, rooms, reservations, lastUpdate: nowKST() };
          this.updateCard(locationId);
          this.updateStats();
        } catch (err) {
          console.error('load '+locationId, err);
          this.showError('일부 위치 데이터를 불러오지 못했습니다.');
        } finally {
          if (btn) btn.classList.remove('spin');
        }
      }
      updateStats() {
        let g=0, b=0; const now = nowKST();
        Object.values(this.data).forEach(d => {
          if (!d) return;
          const isGlobal = d.location.name.includes('글로벌R&D센터');
          d.rooms.forEach(r => {
            const list = d.reservations.filter(x => x.resource?.id === r.id);
            const busy = list.some(x => now >= new Date(x.startedAt) && now <= new Date(x.endedAt));
            if (!busy) (isGlobal ? g++ : b++);
          });
        });
        document.getElementById('globalAvailable').textContent = g;
        document.getElementById('gbcAvailable').textContent = b;
        document.getElementById('totalAvailable').textContent = g + b;
      }
      render() {
        const $main = document.getElementById('main');
        if (!this.locations.length){
          $main.innerHTML = '<div class="card"><div class="card-h"><div class="loc-name">데이터 없음</div></div><div class="wrap"><div>표시할 위치가 없습니다.</div></div></div>';
          return;
        }
        let html = '';
        this.locations.forEach(loc => {
          const d = this.data[loc.id];
          const label = loc.name.includes('글로벌R&D') ? '글로벌R&D센터' : 'GBC';
          const last = d?.lastUpdate ? fmtStamp(d.lastUpdate) : '-';
          html += '<div class="card"><div class="card-h"><div class="card-left"><div class="loc-name">'+label+'</div><div id="lu-'+loc.id+'" class="loc-sub">업데이트: '+last+'</div></div><button id="btn-'+loc.id+'" class="refresh"><span class="ico">↻</span> 새로고침</button></div><div class="wrap" id="wrap-'+loc.id+'">'+(d ? this.renderTable(d.rooms, d.reservations) : this.loading())+'</div></div>';
        });
        $main.innerHTML = html;
        this.locations.forEach(loc => {
          const btn = document.getElementById('btn-'+loc.id);
          if (btn) btn.onclick = () => { this.loadLocation(loc.id).then(()=>this.highlightNowHourAll()); };
        });
        this.highlightNowHourAll();
      }
      updateCard(locationId) {
        const d = this.data[locationId]; if (!d) return;
        const wrap = document.getElementById('wrap-'+locationId);
        const lu = document.getElementById('lu-'+locationId);
        if (wrap) wrap.innerHTML = this.renderTable(d.rooms, d.reservations);
        if (lu) lu.textContent = '업데이트: ' + fmtStamp(d.lastUpdate);
      }
      highlightNowHourAll(){
        const today = ymdKST();
        const isToday = (this.date === today);
        document.querySelectorAll('.tl thead tr').forEach(tr => {
          tr.querySelectorAll('th.now-hour').forEach(th => th.classList.remove('now-hour'));
          if (!isToday) return;
          const hNow = nowKST().getHours();
          const start = API.START_HOUR, end = API.END_HOUR;
          if (hNow < start || hNow >= end) return;
          const th = tr.querySelector('th[data-hour="'+hNow+'"]');
          if (th) th.classList.add('now-hour');
        });
      }
      splitAB(name){
        const m = name.match(/^(소회의실|중회의실)\\s*([A-Za-z가-힣0-9\\-]+)$/);
        return m ? m[1]+'\\n'+m[2] : name;
      }
      fmtRoom(name){
        const m = name.match(/^(\\d+층)\\s*(.*)$/);
        if (m) return { floor:m[1], name:this.splitAB(m[2]||'회의실') };
        if (name.includes('회의실')) return { floor:'', name:this.splitAB(name) };
        return { floor:'', name };
      }
      fmtTimeText(s, e){
        const sd = new Date(s), ed = new Date(e);
        return fmtTime(sd)+' ~ '+fmtTime(ed);
      }
      renderTable(rooms, reservations){
        if (!rooms || rooms.length===0) return this.loading();
        const start = API.START_HOUR;
        const end = API.END_HOUR;
        const SLOTS = (end - start) * 2;
        let out = '<table class="tl"><colgroup>';
        out += '<col class="roomcol" />';
        for (let i=0;i<SLOTS;i++) out += '<col class="slotcol" />';
        out += '</colgroup>';
        out += '<thead><tr><th class="room-h">회의실</th>';
        for (let h=start; h<end; h++) out += '<th colspan="2" data-hour="'+h+'">'+h+':00</th>';
        out += '</tr></thead><tbody>';
        const by = {};
        (reservations||[]).forEach(r => {
          const id = r.resource?.id; if (!id) return;
          (by[id] = by[id] || []).push(r);
        });
        rooms.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(room => {
          const info = this.fmtRoom(room.name);
          out += '<tr><td class="room"><div class="floor">'+(info.floor||'')+'</div><div class="rname">'+info.name+'</div></td>';
          const slots = Array(SLOTS).fill(null);
          (by[room.id]||[]).forEach(res => {
            const s=new Date(res.startedAt), e=new Date(res.endedAt);
            let si = (s.getHours()-start)*2 + Math.floor(s.getMinutes()/30);
            let ei = (e.getHours()-start)*2 + Math.ceil(e.getMinutes()/30);
            si = Math.max(0, si); ei = Math.min(SLOTS, ei);
            if (ei>si){
              const span = ei-si;
              slots[si] = { span, title: res.subject||'예약', user: res.users?.from?.member?.name||'', time: this.fmtTimeText(res.startedAt, res.endedAt), room: room.name };
              for (let i=si+1;i<ei;i++) slots[i]='skip';
            }
          });
          for (let i=0;i<SLOTS;i++){
            if (slots[i]==null){ out += '<td></td>'; }
            else if (slots[i]!=='skip'){
              const s=slots[i];
              out += '<td colspan="'+s.span+'"><div class="bk" style="--span:'+s.span+'" data-span="'+s.span+'" data-title="'+s.title.replace(/"/g,'&quot;')+'" data-user="'+s.user.replace(/"/g,'&quot;')+'" data-time="'+s.time.replace(/"/g,'&quot;')+'" data-room="'+s.room.replace(/"/g,'&quot;')+'"><div class="t">'+s.title+'</div>'+(s.user?'<div class="u">'+s.user+'</div>':'')+'</div></td>';
              i += s.span-1;
            }
          }
          out += '</tr>';
        });
        out += '</tbody></table>';
        return out;
      }
      loading(){ return '<div class="wrap"><div class="muted">불러오는 중…</div></div>'; }
      openModal({title,time,room,user}){
        const modal = document.getElementById('modal');
        document.querySelector('#sheet .m-ttl').textContent = title || '예약';
        document.getElementById('mTime').textContent  = time  || '-';
        document.getElementById('mRoom').textContent  = room  || '-';
        document.getElementById('mUser').textContent  = user  || '-';
        modal.style.display = 'flex';
      }
      closeModal(){ document.getElementById('modal').style.display = 'none'; }
      onOnline(){ document.getElementById('offlineBanner').classList.remove('on'); }
      onOffline(){ document.getElementById('offlineBanner').classList.add('on'); }
      showError(msg){ const e=document.getElementById('errorBanner'); e.textContent = msg; e.classList.add('on'); }
      hideError(){ document.getElementById('errorBanner').classList.remove('on'); }
    }
    let app;
    document.addEventListener('DOMContentLoaded', () => { app = new App(); }, { passive: true });
  </script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Serve HTML on root
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    // Proxy API calls to Dooray
    if (url.pathname.startsWith('/api/')) {
      const doorayPath = url.pathname.replace(/^\/api/, '');
      const doorayUrl = DOORAY_API + doorayPath + (url.search || '');

      try {
        const resp = await fetch(doorayUrl, {
          method: request.method,
          headers: {
            'Authorization': `dooray-api ${DOORAY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const body = await resp.text();
        return new Response(body, {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
