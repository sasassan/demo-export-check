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
