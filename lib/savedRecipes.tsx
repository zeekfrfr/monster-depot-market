'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { getSupabase } from './supabase'

export type ToggleResult = 'saved' | 'removed' | 'signed-out' | 'error'

interface SavedRecipesValue {
  ready: boolean
  signedIn: boolean
  isSaved: (recipeId: string) => boolean
  toggle: (recipeId: string) => Promise<ToggleResult>
  refresh: () => Promise<void>
}

const Ctx = createContext<SavedRecipesValue | null>(null)

export function SavedRecipesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) {
      setReady(true)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSignedIn(false)
      setSavedIds(new Set())
      setReady(true)
      return
    }
    setSignedIn(true)
    const { data } = await supabase.from('saved_recipes').select('recipe_id')
    setSavedIds(new Set((data ?? []).map((r) => r.recipe_id as string)))
    setReady(true)
  }, [])

  useEffect(() => {
    load()
    const supabase = getSupabase()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange(() => load())
    return () => data.subscription.unsubscribe()
  }, [load])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  const toggle = useCallback(async (id: string): Promise<ToggleResult> => {
    const supabase = getSupabase()
    if (!supabase) return 'error'
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'signed-out'

    const wasSaved = savedIds.has(id)
    // Optimistic update.
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (wasSaved) next.delete(id)
      else next.add(id)
      return next
    })

    const revert = () =>
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (wasSaved) next.add(id)
        else next.delete(id)
        return next
      })

    if (wasSaved) {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', id)
      if (error) {
        revert()
        return 'error'
      }
      return 'removed'
    }

    const { error } = await supabase
      .from('saved_recipes')
      .insert({ user_id: user.id, recipe_id: id })
    if (error) {
      revert()
      return 'error'
    }
    return 'saved'
  }, [savedIds])

  return (
    <Ctx.Provider value={{ ready, signedIn, isSaved, toggle, refresh: load }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSavedRecipes(): SavedRecipesValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSavedRecipes must be used within SavedRecipesProvider')
  return ctx
}
