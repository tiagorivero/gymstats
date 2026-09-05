export const EsqueletoPanel = () => (
  <div className="min-h-screen bg-superficie" aria-busy="true" aria-label="Cargando el panel">
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-borde lg:bg-fondo">
      <div className="h-16 border-b border-borde" />
      <div className="space-y-2 p-3">
        {[0, 1, 2].map((fila) => (
          <div key={fila} className="h-9 animate-pulse rounded bg-superficie" />
        ))}
      </div>
    </div>

    <div className="lg:pl-64">
      <div className="h-16 border-b border-borde bg-fondo lg:hidden" />
      <div className="space-y-4 p-4 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-borde" />
        <div className="h-40 animate-pulse rounded-lg bg-borde/60" />
      </div>
    </div>
  </div>
)
