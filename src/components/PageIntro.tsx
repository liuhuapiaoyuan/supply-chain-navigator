import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type PageIntroProps = {
  title: string;
  lines: string[];
  flowHint?: string;
};

export default function PageIntro({ title, lines, flowHint }: PageIntroProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-4">
      <div className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2">
        <CollapsibleTrigger className="flex w-full items-center gap-2 text-left text-sm font-medium text-foreground hover:opacity-90">
          <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="flex-1">{title}</span>
          {open ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-sm text-muted-foreground space-y-1.5 data-[state=closed]:animate-none">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          {flowHint ? <p className="text-xs text-primary/90 font-medium pt-1 border-t border-border/50 mt-2">{flowHint}</p> : null}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
