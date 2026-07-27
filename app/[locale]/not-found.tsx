import Button from "@/components/ui/Button";

// Technical 404 — K1 idiom. (No locale params available in not-found;
// links go through the root redirect.)
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
          Error / document does not exist
        </span>
        <h1 className="mt-4 font-mono text-7xl md:text-8xl font-semibold tracking-tight">
          404
        </h1>
        <dl className="mt-8 max-w-xs border-t border-hairline font-mono text-[12px]">
          <div className="flex justify-between border-b border-hairline py-2.5">
            <dt className="uppercase tracking-[0.12em] text-neutral-400">Status</dt>
            <dd>404 — Not Found</dd>
          </div>
          <div className="flex justify-between border-b border-hairline py-2.5">
            <dt className="uppercase tracking-[0.12em] text-neutral-400">Cause</dt>
            <dd>Moved or removed</dd>
          </div>
        </dl>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/en/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </div>
  );
}
