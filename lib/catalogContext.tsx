'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Catalog } from './catalog'

const CatalogContext = createContext<Catalog | null>(null)

// Seeded once from the server (root layout) with DB-fetched prices/toppings.
export function CatalogProvider({
  initial,
  children,
}: {
  initial: Catalog
  children: ReactNode
}) {
  return <CatalogContext.Provider value={initial}>{children}</CatalogContext.Provider>
}

// Returns the live catalog, or null if used outside the provider. Consumers
// fall back to static lib/products.ts values when a field is absent.
export function useCatalog(): Catalog | null {
  return useContext(CatalogContext)
}
