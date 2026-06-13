import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Box, Button, Chip, Container, Divider, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { type FigureDetail, fetchFigure } from '../api'
import YouTubeEmbed from '../components/YouTubeEmbed'

export default function FigurePage() {
  const { slug } = useParams<{ slug: string }>()
  const [figure, setFigure] = useState<FigureDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setFigure(null)
    setError(null)
    fetchFigure(slug)
      .then(setFigure)
      .catch(() => setError('Figure not found.'))
  }, [slug])

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        All Figures
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {figure && (
        <>
          <Typography variant="h3" sx={{ fontWeight: 700 }} gutterBottom>
            {figure.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {figure.description}
          </Typography>

          <YouTubeEmbed youtubeId={figure.youtube_id} />

          {figure.components.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Breakdown
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {figure.components.map(c => (
                  <Chip
                    key={c.slug}
                    label={c.name}
                    component={Link}
                    to={`/figures/${c.slug}`}
                    clickable
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
