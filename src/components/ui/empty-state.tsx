import { CustomsDocumentIllustration } from "@/components/icons/trade-illustrations";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export function EmptyState({ title, description, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        {icon ?? <CustomsDocumentIllustration aria-hidden="true" className="h-9 w-9" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
