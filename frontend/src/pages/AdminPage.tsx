import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Box, Button, Container, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import {
  type FigureDetail, type FigureSummary, type FigurePayload,
  searchFigures, fetchFigure, createFigure, updateFigure, deleteFigure,
} from '../api'
import FigureForm from '../components/FigureForm'

export default function AdminPage() {
  const [figures, setFigures] = useState<FigureSummary[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FigureDetail | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  async function load() {
    const data = await searchFigures('')
    setFigures(data)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(payload: FigurePayload) {
    if (editing) {
      await updateFigure(editing.slug, payload)
    } else {
      await createFigure(payload)
    }
    await load()
  }

  async function handleDelete() {
    if (!deleteSlug) return
    await deleteFigure(deleteSlug)
    setDeleteSlug(null)
    await load()
  }

  async function openEdit(slug: string) {
    const figure = await fetchFigure(slug)
    setEditing(figure)
    setFormOpen(true)
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Search
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin — Figures
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Figure
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {figures.map(f => (
              <TableRow key={f.slug} hover>
                <TableCell>{f.name}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{f.slug}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(f.slug)} aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteSlug(f.slug)} aria-label="delete" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FigureForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
        allFigures={figures}
      />

      <Dialog open={!!deleteSlug} onClose={() => setDeleteSlug(null)}>
        <DialogTitle>Delete figure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{deleteSlug}</strong>. Other figures that reference it as a component will simply omit the link.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSlug(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
