export interface FigureSummary {
  name: string
  slug: string
  description: string
}

export interface ComponentRef {
  name: string
  slug: string
}

export interface FigureDetail {
  name: string
  slug: string
  description: string
  youtube_id: string
  components: ComponentRef[]
}

export interface FigurePayload {
  name: string
  slug: string
  description: string
  youtube_id: string
  components: string[]
}

export async function searchFigures(q: string): Promise<FigureSummary[]> {
  const res = await fetch(`/api/figures?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function fetchFigure(slug: string): Promise<FigureDetail> {
  const res = await fetch(`/api/figures/${slug}`)
  if (!res.ok) throw new Error('Figure not found')
  return res.json()
}

export async function createFigure(payload: FigurePayload): Promise<void> {
  const res = await fetch('/api/figures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Create failed')
}

export async function updateFigure(slug: string, payload: FigurePayload): Promise<void> {
  const res = await fetch(`/api/figures/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Update failed')
}

export async function deleteFigure(slug: string): Promise<void> {
  const res = await fetch(`/api/figures/${slug}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
}
