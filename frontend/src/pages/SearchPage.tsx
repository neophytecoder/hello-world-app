import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  Box, Button, Card, CardActionArea, CardContent,
  Container, InputAdornment, TextField, Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { type FigureSummary, searchFigures } from '../api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [figures, setFigures] = useState<FigureSummary[]>([])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      searchFigures(query).then(setFigures).catch(() => setFigures([]))
    }, 250)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [query])

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Salsa Figures
        </Typography>
        <Button component={Link} to="/admin" variant="outlined" size="small">
          Admin
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search figures…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {figures.map(figure => (
          <Card key={figure.slug} variant="outlined">
            <CardActionArea component={Link} to={`/figures/${figure.slug}`}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {figure.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {figure.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
        {figures.length === 0 && (
          <Typography color="text.secondary">No figures found.</Typography>
        )}
      </Box>
    </Container>
  )
}
