/**
 * 輸出リスクナビ全体で使う、やや大きめの装飾イラスト集。
 * navy / amber / emerald の既存配色に合わせ、currentColorベースで
 * 呼び出し側のtext-*クラスから色を継承する。全て装飾目的のため
 * 利用側で aria-hidden="true" を付与すること。
 */

type IllustrationProps = React.SVGProps<SVGSVGElement>;

/** ログインヒーロー用: 港とコンテナ船のイラスト */
export function PortHeroIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 420 260" fill="none" {...props}>
      {/* 空・海の区切り */}
      <path d="M0 190h420" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />
      {/* 港クレーン x2 */}
      <g stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.85}>
        <path d="M60 190V60" />
        <path d="M60 60h90l24 26" />
        <path d="M60 86h58" />
        <path d="M150 84v18" />
        <path d="M330 190V80" />
        <path d="M330 80h70l20 22" />
        <path d="M330 104h46" />
        <path d="M396 102v18" />
      </g>
      {/* コンテナ船の船体 */}
      <path
        d="M30 196h360l-26 42a18 18 0 0 1-15.4 9.8H71.4A18 18 0 0 1 56 238l-26-42Z"
        fill="currentColor"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeWidth={2}
      />
      {/* デッキ上のコンテナ */}
      <g stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
        <rect x="78" y="152" width="46" height="36" rx="2" fill="currentColor" fillOpacity={0.18} />
        <rect x="130" y="140" width="46" height="48" rx="2" fill="currentColor" fillOpacity={0.28} />
        <rect x="182" y="152" width="46" height="36" rx="2" fill="currentColor" fillOpacity={0.18} />
        <rect x="234" y="134" width="46" height="54" rx="2" fill="currentColor" fillOpacity={0.3} />
        <rect x="286" y="152" width="40" height="36" rx="2" fill="currentColor" fillOpacity={0.18} />
      </g>
      {/* 波 */}
      <g stroke="currentColor" strokeOpacity={0.35} strokeWidth={2} strokeLinecap="round">
        <path d="M10 250c14-6 28-6 42 0s28 6 42 0 28-6 42 0 28 6 42 0 28-6 42 0 28 6 42 0 28-6 42 0 28 6 42 0 28-6 42 0" />
      </g>
    </svg>
  );
}

/** 共通フッター用: 港のシルエットを横に伸ばすストリップ */
export function PortSilhouetteStrip(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 800 90" preserveAspectRatio="none" fill="none" {...props}>
      <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 86V22" />
        <path d="M40 22h70l18 18" />
        <path d="M40 40h46" />
        <path d="M250 86V34" />
        <path d="M250 34h60l16 16" />
        <path d="M250 48h40" />
        <path d="M560 86V18" />
        <path d="M560 18h78l20 20" />
        <path d="M560 40h52" />
      </g>
      <path
        d="M620 86h150l-10 -16a8 8 0 0 0-7-4H640a8 8 0 0 0-7 4l-10 16Z"
        fill="currentColor"
        fillOpacity={0.14}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <rect x="645" y="52" width="18" height="14" fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
      <rect x="668" y="48" width="18" height="18" fill="currentColor" fillOpacity={0.24} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
      <rect x="691" y="54" width="18" height="12" fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
      <path d="M0 86h800" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
    </svg>
  );
}

/** AI相談室・ダッシュボードの背景装飾: グローバルネットワーク */
export function GlobalNetworkIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 220 220" fill="none" {...props}>
      <circle cx="110" cy="110" r="86" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
      <circle cx="110" cy="110" r="60" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />
      <g stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5}>
        <path d="M110 24v172" />
        <path d="M24 110h172" />
        <path d="M46 46 174 174" />
        <path d="M174 46 46 174" />
      </g>
      <g fill="currentColor">
        <circle cx="110" cy="24" r="4" />
        <circle cx="196" cy="110" r="4" />
        <circle cx="110" cy="196" r="4" />
        <circle cx="24" cy="110" r="4" />
        <circle cx="46" cy="46" r="3.5" />
        <circle cx="174" cy="46" r="3.5" />
        <circle cx="174" cy="174" r="3.5" />
        <circle cx="46" cy="174" r="3.5" />
      </g>
    </svg>
  );
}

/** 空状態（案件なし等）用: 税関の書類イラスト */
export function CustomsDocumentIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" {...props}>
      <rect x="28" y="18" width="52" height="70" rx="4" fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.55} strokeWidth={2} />
      <path d="M62 18v16h16" stroke="currentColor" strokeOpacity={0.55} strokeWidth={2} strokeLinejoin="round" />
      <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round">
        <path d="M38 48h30" />
        <path d="M38 58h30" />
        <path d="M38 68h18" />
      </g>
      <circle cx="78" cy="80" r="18" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.6} strokeWidth={2} />
      <path d="M70 80 76 86 87 73" stroke="currentColor" strokeOpacity={0.7} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 区切り線用: 海面・波の帯（navy系の薄い色想定） */
export function WaveDivider(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" fill="none" {...props}>
      <path
        d="M0 14c16-7 33-7 50 0s33 7 50 0 33-7 50 0 33 7 50 0 33-7 50 0 33 7 50 0 33-7 50 0 33 7 50 0"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0 20c16-7 33-7 50 0s33 7 50 0 33-7 50 0 33 7 50 0 33-7 50 0 33 7 50 0 33-7 50 0 33 7 50 0"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** 背景用: 薄い世界地図パターン（ログイン画面などのウォーターマーク） */
export function WorldMapPattern(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 240" fill="none" {...props}>
      <g stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 90c10-18 28-26 46-22 14 3 20 16 36 14 20-2 24-20 46-18 18 2 22 16 40 14" />
        <path d="M60 130c18-10 34-6 48 4 16 12 32 10 44-2 14-14 32-14 46-2" />
        <path d="M160 50c8 12 6 26-4 34-14 11-30 4-40-6" />
        <path d="M240 150c14-8 30-4 40 8 10 11 24 13 36 4" />
        <path d="M300 70c10 6 14 18 8 30-6 11-20 14-30 8" />
      </g>
      <g fill="currentColor">
        <circle cx="80" cy="92" r="2.5" />
        <circle cx="150" cy="70" r="2.5" />
        <circle cx="220" cy="130" r="2.5" />
        <circle cx="290" cy="90" r="2.5" />
        <circle cx="340" cy="150" r="2.5" />
        <circle cx="110" cy="140" r="2.5" />
      </g>
      <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="2 4">
        <path d="M80 92 150 70" />
        <path d="M150 70 220 130" />
        <path d="M220 130 290 90" />
        <path d="M290 90 340 150" />
        <path d="M110 140 220 130" />
      </g>
    </svg>
  );
}

/** ログインフォーム周辺用: コンテナ・貨物のシルエット装飾 */
export function CargoSilhouetteCluster(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 110" fill="none" {...props}>
      <g stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeOpacity={0.5}>
        <rect x="8" y="52" width="34" height="26" rx="1.5" fill="currentColor" fillOpacity={0.08} />
        <rect x="46" y="40" width="34" height="38" rx="1.5" fill="currentColor" fillOpacity={0.12} />
        <rect x="84" y="58" width="30" height="20" rx="1.5" fill="currentColor" fillOpacity={0.08} />
      </g>
      <path
        d="M4 88h128l-10 15.5a7 7 0 0 1-6 3.5H20a7 7 0 0 1-6-3.5L4 88Z"
        fill="currentColor"
        fillOpacity={0.1}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <path d="M118 20 150 36 118 48Z" fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** 大型の装飾用コンパスローズ・ウォーターマーク */
export function CompassWatermark(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" {...props}>
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} />
      <circle cx="100" cy="100" r="68" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <path d="M100 10 108 92 190 100 108 108 100 190 92 108 10 100 92 92Z" fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
      <g stroke="currentColor" strokeOpacity={0.4} strokeWidth={1}>
        <path d="M100 10v8M100 182v8M10 100h8M182 100h8" />
      </g>
      <circle cx="100" cy="100" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 迷子の貨物船イラスト（404ページ用） */
export function LostCargoShipIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 240 180" fill="none" {...props}>
      <path d="M0 130h240" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />
      <g stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round">
        <path d="M20 150c10-5 20-5 30 0s20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0 20 5 30 0" />
        <path d="M20 164c10-5 20-5 30 0s20 5 30 0 20-5 30 0 20 5 30 0 20-5 30 0 20 5 30 0" strokeOpacity={0.25} />
      </g>
      <g transform="rotate(-8 120 95)">
        <path
          d="M70 100h100l-14 24a10 10 0 0 1-8.6 5.4H92.6A10 10 0 0 1 84 124l-14-24Z"
          fill="currentColor"
          fillOpacity={0.12}
          stroke="currentColor"
          strokeWidth={1.6}
        />
        <path d="M90 100V70a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v30" stroke="currentColor" strokeWidth={1.4} fill="currentColor" fillOpacity={0.15} />
        <path d="M114 100V58a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v42" stroke="currentColor" strokeWidth={1.4} fill="currentColor" fillOpacity={0.22} />
        <path d="M138 100V74a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v26" stroke="currentColor" strokeWidth={1.4} fill="currentColor" fillOpacity={0.15} />
        <path d="M120 55V40" stroke="currentColor" strokeWidth={1.4} />
      </g>
      <g stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round">
        <circle cx="186" cy="52" r="16" fill="none" />
        <path d="M186 36v4M186 64v4M170 52h4M198 52h4" />
        <path d="M179 45l3 3M194 45l-3 3M179 59l3-3M194 59l-3-3" strokeOpacity={0.5} />
      </g>
      <path d="M186 52 198 46" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.3} strokeLinecap="round" strokeDasharray="4 5">
        <path d="M60 118c20-30 50-45 90-30" />
      </g>
    </svg>
  );
}

/** 進行する貨物船のローディングアニメーション */
export function CargoShipLoader(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 56" fill="none" {...props}>
      <path d="M0 44h160" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5} />
      <g className="trade-ship-loader-wave" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} strokeLinecap="round">
        <path d="M0 50c8-4 16-4 24 0s16 4 24 0 16-4 24 0 16 4 24 0 16-4 24 0 16 4 24 0 16-4 24 0" />
      </g>
      <g className="trade-ship-loader-hull">
        <path
          d="M18 24h60l-8 15a6 6 0 0 1-5.3 3.2H31.3A6 6 0 0 1 26 39l-8-15Z"
          fill="currentColor"
          fillOpacity={0.18}
          stroke="currentColor"
          strokeWidth={1.4}
        />
        <rect x="32" y="12" width="12" height="12" rx="1" fill="currentColor" fillOpacity={0.22} stroke="currentColor" strokeWidth={1.2} />
        <rect x="46" y="8" width="12" height="16" rx="1" fill="currentColor" fillOpacity={0.3} stroke="currentColor" strokeWidth={1.2} />
        <rect x="60" y="14" width="10" height="10" rx="1" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1.2} />
      </g>
    </svg>
  );
}

/** タイムライン用: ルートマップ風の点線装飾 */
export function RouteMapDecoration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 24 200" preserveAspectRatio="none" fill="none" {...props}>
      <path
        d="M12 0v200"
        stroke="currentColor"
        strokeOpacity={0.25}
        strokeWidth={1.5}
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity={0.3} />
      <circle cx="12" cy="100" r="3" fill="currentColor" fillOpacity={0.3} />
      <circle cx="12" cy="188" r="3" fill="currentColor" fillOpacity={0.3} />
    </svg>
  );
}

/** 税関スタンプ風の装飾（フィルターエリア等） */
export function CustomsStampDecoration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" {...props}>
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeOpacity={0.35} strokeWidth={2} strokeDasharray="4 3" />
      <circle cx="40" cy="40" r="20" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.6} />
      <path d="M30 42l6 6 14-16" stroke="currentColor" strokeOpacity={0.55} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** AI相談室の背景用: うっすらコンパスローズ（会話バブル背景） */
export function CompassRoseBackdrop(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 300 300" fill="none" {...props}>
      <circle cx="150" cy="150" r="130" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} />
      <circle cx="150" cy="150" r="95" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} />
      <path d="M150 20 158 142 280 150 158 158 150 280 142 158 20 150 142 142Z" fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <g stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.75}>
        <path d="M150 20v12M150 268v12M20 150h12M268 150h12" />
      </g>
    </svg>
  );
}

/** メインページ用: 港ノード間を結ぶ航路と航行する貨物船のイラスト */
export function HubRouteIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" fill="none" {...props}>
      {/* 港ノード */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <circle cx="60" cy="52" r="9" strokeOpacity={0.3} />
        <circle cx="60" cy="52" r="4" strokeOpacity={0.75} fill="currentColor" fillOpacity={0.4} />
        <circle cx="262" cy="132" r="9" strokeOpacity={0.3} />
        <circle cx="262" cy="132" r="4" strokeOpacity={0.75} fill="currentColor" fillOpacity={0.4} />
      </g>
      {/* 点線航路 */}
      <path
        d="M70 56c44 24 100 32 132 24s42-22 54-16"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={1.5}
        strokeDasharray="4 5"
      />
      {/* 貨物船 */}
      <g className="trade-ship-loader-hull">
        <path
          d="M118 98h66l-9 18a9 9 0 0 1-8.2 5.1h-31.6A9 9 0 0 1 127 116l-9-18Z"
          fill="currentColor"
          fillOpacity={0.2}
          stroke="currentColor"
          strokeWidth={1.8}
        />
        <g fill="currentColor">
          <rect x="130" y="82" width="15" height="14" rx="1.5" fillOpacity={0.3} />
          <rect x="149" y="76" width="15" height="20" rx="1.5" fillOpacity={0.42} />
          <rect x="168" y="82" width="15" height="14" rx="1.5" fillOpacity={0.3} />
        </g>
        <path d="M102 104v14" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeOpacity={0.8} />
      </g>
      {/* 波 */}
      <g stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} strokeLinecap="round">
        <path d="M38 132c10-4 20-4 30 0s20 4 30 0 20-4 30 0 20 4 30 0 20-4 30 0" />
        <path d="M60 150c8-3 16-3 24 0s16 3 24 0 16-3 24 0" />
      </g>
      {/* コンパスアクセント */}
      <path
        d="M288 34l3.6 10.4 10.4 3.6-10.4 3.6-3.6 10.4-3.6-10.4-10.4-3.6 10.4-3.6Z"
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={1}
      />
    </svg>
  );
}

/** 空状態用: クリップボードと貨物コンテナのイラスト */
export function EmptyCasesIllustration(props: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" fill="none" {...props}>
      {/* 貨物コンテナ */}
      <g stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeOpacity={0.85}>
        <rect x="18" y="62" width="24" height="18" rx="2.5" />
        <path d="M18 72h-6v6a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6v-6h-6" />
        <path d="M24 71h12M24 77h8" strokeOpacity={0.45} strokeWidth={1.4} />
      </g>
      {/* クリップボード */}
      <g stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeOpacity={0.75}>
        <rect x="56" y="38" width="76" height="64" rx="6" />
        <path d="M76 38v-6a8 8 0 0 1 8-8h14a8 8 0 0 1 8 8v6" />
        <path d="M76 60h56M76 76h42" strokeOpacity={0.45} strokeWidth={1.4} />
      </g>
      {/* 航路ドット */}
      <g fill="currentColor" fillOpacity={0.35}>
        <circle cx="138" cy="28" r="3" />
        <circle cx="126" cy="44" r="2" />
        <circle cx="146" cy="52" r="2" />
      </g>
    </svg>
  );
}
