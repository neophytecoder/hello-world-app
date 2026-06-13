import { useEffect, useState } from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Autocomplete,
} from '@mui/material'
import { type FigureDetail, type FigurePayload, type FigureSummary } from '../api'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (payload: FigurePayload) => Promise<void>
  initial?: FigureDetail | null
  allFigures: FigureSummary[]
}

export default function FigureForm({ open, onClose, onSubmit, initial, allFigures }: Props) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeId, setYoutubeId] = useState('')
  const [components, setComponents] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setSlug(initial?.slug ?? '')
      setDescription(initial?.description ?? '')
      setYoutubeId(initial?.youtube_id ?? '')
      setComponents(initial?.components.map(c => c.slug) ?? [])
      setSlugEdited(!!initial)
      setSaving(false)
    }
  }, [open, initial])

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  async function handleSubmit() {
    setSaving(true)
    try {
      await onSubmit({ name, slug, description, youtube_id: youtubeId, components })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const componentOptions = allFigures
    .filter(f => f.slug !== initial?.slug)
    .map(f => f.slug)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Figure' : 'Add Figure'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField
          label="Name"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Slug"
          value={slug}
          onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
          fullWidth
          required
          helperText="URL-friendly identifier (auto-generated from name)"
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          required
        />
        <TextField
          label="YouTube ID"
          value={youtubeId}
          onChange={e => setYoutubeId(e.target.value)}
          fullWidth
          required
          helperText='The video ID from the YouTube URL, e.g. "dQw4w9WgXcQ"'
        />
        <Autocomplete
          multiple
          options={componentOptions}
          value={components}
          onChange={(_, value) => setComponents(value)}
          renderInput={params => (
            <TextField {...params} label="Component Figures" helperText="Figures that make up this figure" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !name || !slug || !description || !youtubeId}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
