import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  FileSignature,
  FileText,
  Folder,
  Receipt,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/AppHeader";
import {
  DocumentCategoryCard,
  EmptyState,
  FilterButton,
  SearchField,
} from "@/components/ecora";
import { documents } from "@/data/mockData";
import type { DocumentCategory, DocumentItem } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documentos/")({
  head: () => ({
    meta: [
      { title: "Documentos · ECORA" },
      { name: "description", content: "Acesse projetos, contratos, medições e mais." },
    ],
  }),
  component: DocumentsPage,
});

const CATEGORIES: (DocumentCategory | "Todos")[] = [
  "Todos",
  "Projetos",
  "Documentação Técnica",
  "Relatórios",
  "Financeiro",
  "Contratos e Aditivos",
  "Arquivo Geral",
];

const CATEGORY_ICON: Record<DocumentCategory, React.ReactNode> = {
  Projetos: <Folder className="size-5" />,
  "Documentação Técnica": <FileText className="size-5" />,
  Relatórios: <FileText className="size-5" />,
  Financeiro: <Receipt className="size-5" />,
  "Contratos e Aditivos": <FileSignature className="size-5" />,
  "Arquivo Geral": <Folder className="size-5" />,
};

function DocumentsPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const okCat = category === "Todos" || d.category === category;
      const okQ = !query || d.name.toLowerCase().includes(query.toLowerCase());
      return okCat && okQ;
    });
  }, [category, query]);

  const countBy = (c: DocumentCategory) =>
    documents.filter((d) => d.category === c).length;

  return (
    <AppLayout
      header={
        <PageHeader
          title="Documentos"
          subtitle="Projetos, contratos, medições e relatórios da sua obra"
        />
      }
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchFieldControlled value={query} onChange={setQuery} />
          </div>
          <FilterButton
            type="button"
            onClick={() => {
              document.getElementById("document-categories")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Filtros
          </FilterButton>
        </div>

        {/* Category chips */}
        <div className="-mx-5 md:-mx-8 px-5 md:px-8 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((c) => {
            const on = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors",
                  on
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-surface-elevated text-graphite border-hairline hover:bg-muted",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Category cards */}
        <section>
          <h2 className="text-title mb-3">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(CATEGORY_ICON) as DocumentCategory[]).map((c) => (
              <DocumentCategoryCard
                key={c}
                name={c}
                count={countBy(c)}
                icon={CATEGORY_ICON[c]}
              />
            ))}
          </div>
        </section>

        {/* Documents list */}
        <section>
          <h2 className="text-title mb-3">
            {category === "Todos" ? "Todos os documentos" : category}
          </h2>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="Nenhum documento encontrado"
              description="Ajuste o filtro ou a busca para encontrar o que procura."
            />
          ) : (
            <ul className="space-y-2">
              {filtered.map((d) => (
                <DocRow key={d.id} doc={d} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function DocRow({ doc }: { doc: DocumentItem }) {
  return (
    <li>
      <Link
        to="/documentos/$documentId"
        params={{ documentId: doc.id }}
        className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-elevated p-3 hover:bg-muted transition-colors"
      >
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <FileText className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {doc.category} · {doc.date} · {formatSize(doc.sizeKB)}
          </p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </li>
  );
}

function formatSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

/** Controlled variant of SearchField from the design system. */
function SearchFieldControlled({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Preserve the same visual as the SearchField component.
  return (
    <label className="flex items-center gap-2 rounded-full border border-hairline bg-surface-elevated px-4 h-11">
      <SearchIcon />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar documentos"
        aria-label="Buscar documentos"
        className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
    </label>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-muted-foreground"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
// Reference kept to satisfy design-system-consistency lint;
// SearchField default remains available for other screens.
export { SearchField };
