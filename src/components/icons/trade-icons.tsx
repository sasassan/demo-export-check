/**
 * 輸出・貿易・物流・規制リスクをテーマにした共通SVGアイコン集。
 * 既存のHeroicons風アウトライン（stroke, 24x24 viewBox）に合わせて作成。
 * 装飾目的のものは呼び出し側で aria-hidden="true" を付与する想定。
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
} as const;

/** 貨物船・コンテナ船 */
export function CargoShipIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 16.5h18l-2.26 3.68a1.5 1.5 0 0 1-1.28.82H6.54a1.5 1.5 0 0 1-1.28-.82L3 16.5Z" />
      <path d="M5.5 16.5V8.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v7.75" />
      <path d="M11 16.5v-6.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v6.75" />
      <path d="M16.5 16.5v-4.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v4.25" />
      <path d="M12 6.5V3.75M12 3.75h2.25" />
    </svg>
  );
}

/** 貨物機・航空輸送 */
export function CargoPlaneIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 7.25 3 12.1l6.1 1.9M21 7.25 13.4 19.5l-1.9-5.5M21 7.25 11.5 14" />
    </svg>
  );
}

/** トラック・陸上輸送 */
export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 8.75h10.25v7.25H2.5z" />
      <path d="M12.75 11h3.4l2.35 2.35v2.65h-5.75" />
      <circle cx="6" cy="17.75" r="1.35" />
      <circle cx="15.5" cy="17.75" r="1.35" />
      <path d="M2.5 16h2M18.5 16h2.5v-3" />
    </svg>
  );
}

/** コンテナ・積荷 */
export function ContainerIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="11" rx="1" />
      <path d="M3 9.5h18M3 13h18M8 6v11M14 6v11" />
    </svg>
  );
}

/** 税関ゲート・検問所 */
export function CustomsGateIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 20V8.5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1V20" />
      <path d="M15.5 20V8.5a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1V20" />
      <path d="M6.5 8h11" />
      <path d="M7.5 20h9" />
      <path d="M12 4.25v3.5" />
      <circle cx="12" cy="3.4" r=".85" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 港・埠頭クレーン */
export function PortCraneIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 20.25V5.5" />
      <path d="M5 5.5h11.5l3 3.25" />
      <path d="M5 9.5h7.5" />
      <path d="M16.25 8.75v4" />
      <path d="M2.5 20.25h19" />
    </svg>
  );
}

/** 書類・インボイス */
export function DocumentInvoiceIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 3.75h7.25L19 8.5V19a1.25 1.25 0 0 1-1.25 1.25H7A1.25 1.25 0 0 1 5.75 19V5A1.25 1.25 0 0 1 7 3.75Z" />
      <path d="M14.25 3.75V8h4.25" />
      <path d="M8.5 11.5h7M8.5 14.25h7M8.5 17h4" />
    </svg>
  );
}

/** 関税・通関スタンプ */
export function CustomsStampIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="10.5" r="6" />
      <path d="M9.25 10.6 11 12.4l3.75-4.1" />
      <path d="M8.75 20.25 12 17l3.25 3.25" />
    </svg>
  );
}

/** セキュリティシールド（装飾用） */
export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.25 18.75 5.75v5.4c0 4.4-2.9 7.35-6.75 8.6-3.85-1.25-6.75-4.2-6.75-8.6v-5.4L12 3.25Z" />
    </svg>
  );
}

/** セキュリティシールド＋チェック（意味を持つ用途向け） */
export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.25 18.75 5.75v5.4c0 4.4-2.9 7.35-6.75 8.6-3.85-1.25-6.75-4.2-6.75-8.6v-5.4L12 3.25Z" />
      <path d="M9.25 12.1 11.3 14.2l3.6-4" />
    </svg>
  );
}

/** 警告・注意マーク */
export function WarningIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.75c.46 0 .88.25 1.1.66l7.1 12.9a1.25 1.25 0 0 1-1.1 1.84H4.9a1.25 1.25 0 0 1-1.1-1.84l7.1-12.9c.22-.4.64-.66 1.1-.66Z" />
      <path d="M12 9.5v3.75M12 16.75h.01" />
    </svg>
  );
}

/** 世界地図・グローバル展開（装飾用） */
export function WorldMapIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.6 2.3 2.6 14.2 0 16.5M12 3.75c-2.6 2.3-2.6 14.2 0 16.5" />
      <path d="M4.8 7.5c2 .9 12.4.9 14.4 0M4.8 16.5c2-.9 12.4-.9 14.4 0" />
    </svg>
  );
}

/** グローバルネットワーク（AI相談室などの装飾用） */
export function GlobalNetworkIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="7.25" strokeOpacity={0.55} />
      <path
        d="M12 5 18.3 9 16.8 17.5 7.3 16.8 5.6 8.3 12 5ZM12 5v7M18.3 9 12 12M16.8 17.5 12 12M7.3 16.8 12 12M5.6 8.3 12 12"
        strokeOpacity={0.55}
      />
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.3" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="17.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="7.3" cy="16.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="5.6" cy="8.3" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 規制文書・法令（承認済みドキュメント） */
export function RegulationDocIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.75 3.75h8l3 3V19a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4.75a1 1 0 0 1 1-1Z" />
      <path d="M14.75 3.75V7h3" />
      <path d="M9 11h6M9 14h6" />
      <circle cx="16.1" cy="17.1" r="2.4" fill="var(--color-background,#fff)" />
      <path d="M15.1 17.1 15.8 17.8 17.2 16.3" />
    </svg>
  );
}

export const transportIcons = [CargoShipIcon, CargoPlaneIcon, TruckIcon] as const;

/**
 * 文字列（案件ID等）から決定論的に輸送アイコンを選ぶ。
 * 実際の輸送手段データは保持していないため、見た目のバリエーションを
 * 一貫して出し分けるための装飾目的の補助関数。
 */
export function pickTransportIcon(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return transportIcons[hash % transportIcons.length];
}
