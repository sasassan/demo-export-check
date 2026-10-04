import type { SVGProps } from "react";

/**
 * mock-3-global-v2.html の世界観を移植した港湾・航路ビジュアル。
 * - TradeRouteMap: ドット世界地図 + 航路アーク + 航行中船舶（ヒーロー用）
 * - PortTerminalScene: 夜のコンテナターミナル（クレーン・コンテナ船・コンテナヤード）
 * 全て装飾目的。利用側で aria-hidden="true" を付与すること。
 * SMIL(animateMotion)はCSSで止められないため、prefers-reduced-motion時は
 * globals.css 側で .hero-ship / .port-trolley を非表示にする。
 */

type SceneProps = SVGProps<SVGSVGElement>;

/* ---------- ドット世界地図 + 航路アーク ---------- */

const ARCS: { id: string; d: string; grad: string }[] = [
  { id: "r1", d: "M455 86 Q 240 6 88 89", grad: "g1" },
  { id: "r2", d: "M455 86 Q 326 8 262 57", grad: "g2" },
  { id: "r3", d: "M455 86 Q 392 74 335 104", grad: "g3" },
  { id: "r4", d: "M455 86 Q 430 130 404 147", grad: "g1" },
  { id: "r5", d: "M455 86 Q 412 100 360 115", grad: "g4" },
  { id: "r6", d: "M455 86 Q 486 140 471 210", grad: "g2" },
  { id: "r7", d: "M455 86 Q 300 196 190 192", grad: "g3" },
  { id: "r8", d: "M455 86 Q 444 82 429 94", grad: "g1" },
];

const SHIPS: { path: string; dur: string; begin?: string }[] = [
  { path: "r1", dur: "11s" },
  { path: "r1", dur: "11s", begin: "-5.5s" },
  { path: "r2", dur: "16s" },
  { path: "r7", dur: "15s", begin: "-8s" },
  { path: "r4", dur: "7s", begin: "-3s" },
  { path: "r3", dur: "9s", begin: "-2s" },
];

const HUBS: { x: number; y: number; label: string; hub?: boolean }[] = [
  { x: 455, y: 86, label: "TOKYO / HUB", hub: true },
  { x: 88, y: 89, label: "LOS ANGELES" },
  { x: 262, y: 57, label: "ROTTERDAM" },
  { x: 335, y: 104, label: "DUBAI" },
  { x: 404, y: 147, label: "SINGAPORE / HUB", hub: true },
  { x: 360, y: 115, label: "MUMBAI" },
  { x: 471, y: 210, label: "SYDNEY" },
  { x: 190, y: 192, label: "SANTOS" },
  { x: 429, y: 94, label: "SHANGHAI" },
];

/** ドット風に描く簡略な大陸輪郭（strokeDasharray で点列化する） */
const CONTINENTS = [
  "M60 55 L95 40 L120 48 L135 62 L128 80 L110 92 L95 88 L78 100 L72 88 L58 82 Z",
  "M180 30 L205 34 L200 48 L182 46 Z",
  "M128 120 L150 115 L158 132 L150 152 L138 172 L128 158 L122 140 Z",
  "M235 60 L262 52 L278 62 L268 74 L248 76 L236 70 Z",
  "M240 82 L268 76 L286 92 L282 118 L264 142 L248 128 L238 104 Z",
  "M270 48 L330 34 L370 42 L405 52 L420 68 L400 84 L368 92 L336 88 L310 76 L282 72 L272 60 Z",
  "M330 84 L346 80 L350 96 L336 100 L328 92 Z",
  "M368 108 L382 104 L390 112 L376 116 Z",
  "M392 118 L410 114 L418 124 L400 128 Z",
  "M400 150 L430 144 L448 158 L438 176 L414 172 L398 160 Z",
  "M420 68 L426 66 L428 74 L422 76 Z",
];

/** 島・飛び地のドットノイズ */
const ISLAND_DOTS: [number, number][] = [
  [52, 118], [96, 64], [118, 108], [166, 108], [204, 84], [226, 118],
  [252, 118], [300, 116], [316, 72], [352, 60], [384, 84], [344, 122],
  [376, 130], [430, 116], [452, 130], [172, 150], [216, 158], [292, 154],
  [352, 150], [452, 168], [142, 30], [300, 26], [386, 30], [54, 160],
];

export function TradeRouteMap({
  idPrefix = "trm",
  ...props
}: SceneProps & { idPrefix?: string }) {
  const g = (n: string) => `${idPrefix}-${n}`;
  return (
    <svg viewBox="0 0 512 256" {...props}>
      <defs>
        <pattern id={g("dots")} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(148,163,184,0.05)" />
        </pattern>
        <linearGradient id={g("g1")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id={g("g2")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id={g("g3")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id={g("g4")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(125,244,255,0.35)" />
          <stop offset="1" stopColor="rgba(125,244,255,0)" />
        </radialGradient>
      </defs>
      <rect width="512" height="256" fill={`url(#${g("dots")})`} />
      {/* 大陸（点列） */}
      <g fill="none" stroke="rgba(125,211,252,0.28)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {CONTINENTS.map((d) => (
          <path key={d} d={d} strokeDasharray="0.1 7.2" />
        ))}
      </g>
      {/* 島ドット */}
      <g fill="rgba(148,163,184,0.22)">
        {ISLAND_DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" />
        ))}
      </g>
      {/* 航路アーク */}
      {ARCS.map((arc) => (
        <path
          key={arc.id}
          id={g(arc.id)}
          className="arc-route"
          d={arc.d}
          stroke={`url(#${g(arc.grad)})`}
          fill="none"
          strokeWidth="1.6"
          opacity="0.8"
        />
      ))}
      {/* 航行中船舶 */}
      {SHIPS.map((ship, i) => (
        <g key={i} className="hero-ship">
          <circle className="hero-ship-glow" r="5">
            <animateMotion dur={ship.dur} begin={ship.begin ?? "0s"} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${g(ship.path)}`} />
            </animateMotion>
          </circle>
          <circle className="hero-ship-core" r="2.4">
            <animateMotion dur={ship.dur} begin={ship.begin ?? "0s"} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${g(ship.path)}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
      {/* ハブノード */}
      {HUBS.map((h) => (
        <g key={h.label} className="map-node-halo" transform={`translate(${h.x} ${h.y})`}>
          <circle r={h.hub ? 9 : 6} fill={`url(#${g("glow")})`} />
          <circle r={h.hub ? 3.2 : 2.4} fill={h.hub ? "#22D3EE" : "#7C8BA1"} />
          <text
            x="8"
            y="3"
            fill={h.hub ? "#7DD3FC" : "#7C8BA1"}
            fontSize="7"
            letterSpacing="1.4"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {h.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- 夜のコンテナターミナル ---------- */

const YARD_BOXES: { x: number; y: number; h: number; c: string }[] = (() => {
  const rows: { y: number; count: number }[] = [
    { y: 300, count: 9 },
    { y: 314, count: 8 },
    { y: 328, count: 5 },
  ];
  const colors = ["#16305C", "#1E3A66", "#24446F", "#2A4A7A"];
  const out: { x: number; y: number; h: number; c: string }[] = [];
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.count; i += 1) {
      const h = 10 + ((i * 7 + ri * 5) % 3) * 4;
      out.push({ x: 70 + ri * 150 + i * 16, y: row.y - h + 14, h, c: colors[(i + ri * 3) % 4] });
    }
  });
  return out;
})();

const DECK_BOXES: { x: number; h: number }[] = (() => {
  const out: { x: number; h: number }[] = [];
  for (let i = 0; i < 28; i += 1) {
    out.push({ x: 730 + i * 14.4, h: 18 + ((i * 11) % 3) * 8 });
  }
  return out;
})();

export function PortTerminalScene({
  idPrefix = "pt",
  ...props
}: SceneProps & { idPrefix?: string }) {
  const g = (n: string) => `${idPrefix}-${n}`;
  return (
    <svg viewBox="0 0 1240 400" preserveAspectRatio="xMidYMid slice" {...props}>
      <defs>
        <linearGradient id={g("skyGrad")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1322" />
          <stop offset="0.72" stopColor="#12264A" />
          <stop offset="1" stopColor="#16305C" />
        </linearGradient>
        <linearGradient id={g("seaGrad")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1B38" />
          <stop offset="1" stopColor="#071021" />
        </linearGradient>
      </defs>
      <rect className="port-sky" width="1240" height="400" fill={`url(#${g("skyGrad")})`} />
      {/* 星 */}
      <g fill="#CFE3FF">
        {[
          [80, 46, 0], [210, 90, 0.6], [330, 40, 1.1], [470, 110, 0.3], [620, 60, 1.6],
          [760, 34, 0.9], [890, 96, 1.9], [1180, 130, 0.4], [1010, 150, 1.3], [560, 140, 2.1],
        ].map(([x, y, delay]) => (
          <circle key={`${x}-${y}`} className="port-star" cx={x as number} cy={y as number} r="1.3" style={{ animationDelay: `${delay}s` }} />
        ))}
      </g>
      {/* 月 */}
      <g className="port-moon">
        <circle cx="1076" cy="66" r="52" fill="rgba(232,238,247,0.07)" />
        <circle cx="1076" cy="66" r="30" fill="#E8EEF7" opacity="0.92" />
        <circle cx="1066" cy="58" r="6" fill="#C7D4E8" opacity="0.5" />
        <circle cx="1086" cy="74" r="4" fill="#C7D4E8" opacity="0.45" />
      </g>
      {/* カモメ */}
      <g className="port-gull" stroke="#8FA6C4" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M0 0 Q 7 -9 14 0 Q 21 -9 28 0" transform="translate(120 80)" />
      </g>
      <g className="port-gull-slow" stroke="#6E86A8" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M0 0 Q 5 -7 10 0 Q 15 -7 20 0" transform="translate(260 120)" />
      </g>
      {/* 遠景ガントリークレーン */}
      <g fill="#0D1A36">
        <rect x="52" y="170" width="7" height="168" />
        <rect x="112" y="170" width="7" height="168" />
        <rect x="40" y="170" width="92" height="9" />
        <path d="M40 170 L86 132 L132 170 Z" />
        <rect x="292" y="186" width="6" height="152" />
        <rect x="342" y="186" width="6" height="152" />
        <rect x="282" y="186" width="78" height="8" />
        <path d="M282 186 L321 154 L360 186 Z" />
      </g>
      {/* コンテナヤード */}
      <g>
        {YARD_BOXES.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width="14" height={b.h} fill={b.c} stroke="#2B4A7A" strokeWidth="1" />
        ))}
      </g>
      {/* ヤード照明 */}
      <g>
        <rect x="70" y="262" width="4" height="76" fill="#12233F" />
        <circle className="port-beacon" cx="72" cy="258" r="3" fill="#7DF4FF" />
        <rect x="380" y="248" width="4" height="90" fill="#12233F" />
        <circle className="port-beacon" cx="382" cy="244" r="3" fill="#7DF4FF" style={{ animationDelay: ".8s" }} />
      </g>
      {/* ドック */}
      <rect x="0" y="338" width="1240" height="8" fill="#0E1B36" />
      <line x1="0" y1="338" x2="1240" y2="338" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
      {/* 手前ガントリークレーン GC-03 */}
      <g stroke="#1E3A66" strokeWidth="7" strokeLinecap="round">
        <line x1="486" y1="236" x2="486" y2="338" />
        <line x1="556" y1="236" x2="556" y2="338" />
        <line x1="486" y1="236" x2="556" y2="236" />
        <line x1="486" y1="236" x2="521" y2="178" />
        <line x1="556" y1="236" x2="521" y2="178" />
        <line x1="521" y1="178" x2="521" y2="196" />
      </g>
      <g stroke="#24344F" strokeWidth="2">
        <line x1="486" y1="252" x2="556" y2="252" />
        <line x1="486" y1="276" x2="556" y2="276" />
        <line x1="486" y1="300" x2="556" y2="300" />
      </g>
      <line x1="470" y1="232" x2="930" y2="232" stroke="#1E3A66" strokeWidth="7" />
      <circle className="port-beacon" cx="521" cy="172" r="4" fill="#F87171" />
      <text x="528" y="196" fill="#5A7194" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" letterSpacing="2">
        GC-03
      </text>
      {/* トロリー＋吊りコンテナ */}
      <g className="port-trolley">
        <animateMotion
          dur="16s"
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints="0;0;1;1;0;0"
          keyTimes="0;0.05;0.45;0.55;0.95;1"
          path="M470 232 L930 232"
        />
        <rect x="-16" y="-9" width="32" height="18" rx="3" fill="#16305C" stroke="#2B4A7A" strokeWidth="1.5" />
        <g className="port-lift">
          <line x1="-26" y1="9" x2="-26" y2="66" stroke="#33486E" strokeWidth="1.6" />
          <line x1="26" y1="9" x2="26" y2="66" stroke="#33486E" strokeWidth="1.6" />
          <rect x="-38" y="64" width="76" height="9" rx="2" fill="#12233F" stroke="#2B4A7A" strokeWidth="1.5" />
          <rect x="-32" y="73" width="64" height="30" rx="2" fill="#A85A3B" stroke="#7A3B26" strokeWidth="1.5" />
          <rect x="-32" y="73" width="64" height="7" fill="#8A452B" />
          <line x1="-20" y1="87" x2="20" y2="87" stroke="#7A3B26" strokeWidth="1.4" />
          <line x1="-20" y1="95" x2="20" y2="95" stroke="#7A3B26" strokeWidth="1.4" />
        </g>
      </g>
      {/* コンテナ船 */}
      <g className="port-ship">
        <path d="M690 338 Q 702 324 722 338 L 1190 338 L 1160 384 L 726 384 Z" fill="#0C1830" />
        <rect x="706" y="370" width="448" height="6" fill="#8A3B2E" />
        <rect x="690" y="333" width="500" height="5" fill="#091425" />
        {DECK_BOXES.map((b) => (
          <rect key={b.x} x={b.x} y={333 - b.h} width="13" height={b.h} fill="#1E3A66" stroke="#2B4A7A" strokeWidth="1" />
        ))}
        <rect x="1122" y="240" width="46" height="93" fill="#B9C7DB" />
        <rect x="1118" y="226" width="54" height="16" fill="#8FA3BD" />
        <g fill="#7DE8F5" opacity="0.9">
          <rect x="1128" y="252" width="9" height="7" />
          <rect x="1143" y="252" width="9" height="7" />
          <rect x="1128" y="266" width="9" height="7" />
          <rect x="1143" y="266" width="9" height="7" />
          <rect x="1128" y="280" width="9" height="7" />
          <rect x="1143" y="280" width="9" height="7" />
        </g>
        <rect x="1136" y="192" width="26" height="36" fill="#142A4D" />
        <rect x="1136" y="204" width="26" height="6" fill="#A85A3B" />
        <line x1="1136" y1="192" x2="1136" y2="182" stroke="#33486E" strokeWidth="2" />
        <circle className="port-beacon" cx="1136" cy="180" r="3" fill="#F87171" style={{ animationDelay: ".4s" }} />
        <g>
          <rect x="1128" y="158" width="20" height="13" fill="#fff" />
          <rect x="1128" y="158" width="20" height="6.5" fill="#D0342C" />
          <rect x="1128" y="164.5" width="20" height="6.5" fill="#005293" />
          <rect x="1128" y="158" width="10" height="6.5" fill="#fff" />
          <rect x="1138" y="164.5" width="10" height="6.5" fill="#D0342C" />
        </g>
        <text x="742" y="362" fill="#6E86A8" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" letterSpacing="2">
          M/V OCEAN TRADER
        </text>
        <text x="742" y="352" fill="#4E6384" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="8" letterSpacing="1">
          IMO 9821543 | PANAMA
        </text>
      </g>
      {/* 水面 */}
      <rect x="0" y="378" width="1240" height="22" fill={`url(#${g("seaGrad")})`} />
      <g className="port-waves">
        {[0, 240, 480, 720, 960, 1200, 1440].map((t) => (
          <path key={t} d="M0 388 Q 60 380 120 388 T 240 388" fill="none" stroke="#1C3A63" strokeWidth="2" transform={`translate(${t} 0)`} />
        ))}
        {[0, 240, 480, 720, 960, 1200, 1440].map((t) => (
          <path key={`b-${t}`} d="M0 394 Q 60 386 120 394 T 240 394" fill="none" stroke="#16294D" strokeWidth="1.6" opacity="0.7" transform={`translate(${t} 0)`} />
        ))}
      </g>
      {/* 水面の反射 */}
      <g>
        {[
          [726, 0, "#22D3EE"], [800, 0.7, "#B5633B"], [880, 1.3, "#22D3EE"],
          [960, 1.9, "#B9C7DB"], [1040, 2.5, "#22D3EE"], [1120, 3.1, "#B5633B"],
        ].map(([x, delay, color]) => (
          <rect key={x as number} className="port-shimmer" x={x as number} y="386" width="15" height="12" fill={color as string} style={{ animationDelay: `${delay}s` }} />
        ))}
      </g>
      {/* ラベル */}
      <text x="104" y="342" fill="#4E6384" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="8.5" letterSpacing="2">
        CONTAINER YARD
      </text>
    </svg>
  );
}
