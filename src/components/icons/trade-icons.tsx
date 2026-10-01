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

/** コンパスローズ・方位磁針（装飾用） */
export function CompassRoseIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 3.75 13.4 10.6 20.25 12 13.4 13.4 12 20.25 10.6 13.4 3.75 12 10.6 10.6 12 3.75Z" fill="currentColor" fillOpacity={0.15} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M12 3.75v1.75M12 18.5v1.75M3.75 12h1.75M18.5 12h1.75" strokeOpacity={0.6} />
    </svg>
  );
}

/** アンカー（錨） */
export function AnchorIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <path d="M12 6.6v13.65" />
      <path d="M8.75 10h6.5" />
      <path d="M5.5 14c0 3.5 2.9 6 6.5 6.25M18.5 14c0 3.5-2.9 6-6.5 6.25" />
      <path d="M4.75 13.5h1.75M17.5 13.5h1.75" />
    </svg>
  );
}

/** 灯台 */
export function LighthouseIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 20.25h4l-.9-13.5H10.9l-.9 13.5Z" />
      <path d="M9.4 10.5h5.2M9.1 14.25h5.8" />
      <path d="M10.75 6.75V3.5h2.5v3.25" />
      <path d="M12 2.25v1" />
      <path d="M4.5 20.25h15" />
      <path d="M15.5 4.75 18 3.25M15.5 8.75 18.25 8" strokeOpacity={0.6} />
    </svg>
  );
}

/** バーコード（貿易書類風） */
export function BarcodeIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5v14M7 5v14M9.5 5v14M13 5v14M15.5 5v14M18 5v14M20.5 5v14" strokeWidth={1.6} />
    </svg>
  );
}

/** 天秤（規制の公正性） */
export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v16.5M8.25 20.25h7.5" />
      <path d="M4.5 7h6M13.5 7h6" />
      <path d="M4.5 7 2.5 11.5a2.5 2.5 0 0 0 4.5 2L4.5 7ZM19.5 7l-2.5 4.5a2.5 2.5 0 0 0 4.5-2L19.5 7Z" />
    </svg>
  );
}

/** 地球儀＋矢印（国際取引） */
export function GlobeArrowIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10.5" cy="12" r="7" />
      <path d="M3.5 12h14M10.5 5c1.9 1.7 1.9 10.3 0 14M10.5 5c-1.9 1.7-1.9 10.3 0 14" />
      <path d="M15.5 16.5 20.5 21.5M15.75 21.5l4.75 0 0-4.75" />
    </svg>
  );
}

/** 衛星・通信塔（AI/データ通信） */
export function SatelliteIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(45 12 12)" />
      <path d="M9.5 9.5 7 7M14.5 14.5 17 17" />
      <path d="M5.5 5 7 7M19.5 19 17 17" />
      <path d="M3.75 10.5a6.5 6.5 0 0 1 2.5-4M20.25 13.5a6.5 6.5 0 0 1-2.5 4" strokeOpacity={0.65} />
      <path d="M12 15.5v4.75M9.75 20.25h4.5" />
    </svg>
  );
}

/** 虫眼鏡＋文書（根拠調査） */
export function MagnifierDocumentIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.5 3.75h7.25L17 7V18a1.25 1.25 0 0 1-1.25 1.25h-5.5" />
      <path d="M13.75 3.75V7h3" />
      <path d="M8.25 11h4.5M8.25 13.75h3" />
      <circle cx="9" cy="17.75" r="3" />
      <path d="M11.25 20 13 21.75" />
    </svg>
  );
}

/** クリップボード＋ペン（チェックリスト） */
export function ClipboardPenIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 4.75h6a1 1 0 0 1 1 1V6h-8v-.25a1 1 0 0 1 1-1Z" />
      <path d="M7 6h10a1 1 0 0 1 1 1v11.25a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
      <path d="M9 11h4.25M9 14h2.5" />
      <path d="m15.5 13.25 2.6-2.6a1.1 1.1 0 0 1 1.56 1.56l-2.6 2.6-1.9.5.34-2.06Z" fill="currentColor" fillOpacity={0.1} />
    </svg>
  );
}

/** 計器盤（ダッシュボード／監視） */
export function GaugeIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.25 15.5a7.75 7.75 0 1 1 15.5 0" />
      <path d="M12 15.5 15.75 10" />
      <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M4.25 15.5h1.5M18.25 15.5h1.5M6.5 9.75l1.1 1.1M17.5 9.75l-1.1 1.1" strokeOpacity={0.6} />
    </svg>
  );
}

/** 警告灯（リスクアラート） */
export function WarningLightIcon(props: IconProps) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 11a3.5 3.5 0 1 1 7 0c0 2-1.2 2.9-1.75 4.25h-3.5C9.7 13.9 8.5 13 8.5 11Z" />
      <path d="M9.75 15.25h4.5v1.5a1 1 0 0 1-1 1h-2.5a1 1 0 0 1-1-1v-1.5Z" />
      <path d="M12 4v2M5.5 7l1.4 1.4M18.5 7l-1.4 1.4" strokeOpacity={0.6} />
      <path d="M11.25 19.5h1.5" />
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
