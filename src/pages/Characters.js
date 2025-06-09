import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  Suspense,
  Fragment
} from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renamed to avoid conflict
import { UserContext } from '../context/UserContext';

// MUI Components
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Badge from '@mui/material/Badge';


// Lazy-load the CharacterCard component (assuming it will be refactored separately)
const CharacterCard = React.lazy(() => import('../components/CharacterCard'));

// MUI-based LoadingIndicator
const LoadingIndicator = ({ message, small }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: small ? 1 : 3, my: 2 }} role="status" aria-live="polite">
    <CircularProgress size={small ? 24 : 40} sx={{ mb: message ? 1 : 0 }} />
    {message && <Typography variant={small ? "body2" : "subtitle1"} color="text.secondary">{message}</Typography>}
  </Box>
);

// MUI-based ErrorMessage
const ErrorMessage = ({ message, onRetry }) => (
  <Alert severity="error" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Try Again</Button> : null} sx={{ my: 2 }}>
    {message}
  </Alert>
);

// MUI-based EmptyState
const EmptyState = () => (
  <Box sx={{ textAlign: 'center', p: 3, my: 2 }}>
    <Typography variant="h6" gutterBottom>No Characters Found</Typography>
    <Typography color="text.secondary">There are no characters available that match your criteria.</Typography>
  </Box>
);

// MUI-based MobileFilterBar
const MobileFilterBar = ({ onFilterChange, filterActive, onClearFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = () => {
    onFilterChange({ status: statusFilter, species: speciesFilter });
    handleClose();
  };

  const handleClearFilterInternal = () => {
    setStatusFilter('');
    setSpeciesFilter('');
    onClearFilter();
    handleClose();
  };
  
  return (
    <Box>
      <IconButton
        aria-label="filter characters"
        aria-controls="filter-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <Badge color="secondary" variant="dot" invisible={!filterActive}>
          <FilterListIcon />
        </Badge>
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'filter-button' }}
        PaperProps={{ sx: { width: '280px', p: 2 } }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>Filter By</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="alive">Alive</MenuItem>
            <MenuItem value="dead">Dead</MenuItem>
            <MenuItem value="unknown">Unknown</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="species-filter-label">Species</InputLabel>
          <Select
            labelId="species-filter-label"
            id="species-filter"
            value={speciesFilter}
            label="Species"
            onChange={(e) => setSpeciesFilter(e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="Human">Human</MenuItem>
            <MenuItem value="Alien">Alien</MenuItem>
            <MenuItem value="Robot">Robot</MenuItem>
            <MenuItem value="Humanoid">Humanoid</MenuItem>
            {/* Add more common species or fetch dynamically if possible */}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleClearFilterInternal} color="secondary">Clear All</Button>
          <Button onClick={handleApplyFilter} variant="contained">Apply</Button>
        </Box>
      </Menu>
    </Box>
  );
};


function Characters() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { unlockedCharacters = [] } = useContext(UserContext) || {};
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);
  
  const [filters, setFilters] = useState({});
  const [filterActive, setFilterActive] = useState(false);
  
  const scrollPositionRef = useRef(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullStartY = useRef(0);
  const containerRef = useRef(null);

  const getApiUrl = useCallback((pageNumber) => {
    let url = `https://rickandmortyapi.com/api/character?page=${pageNumber}`;
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.species) queryParams.append('species', filters.species);
    const queryString = queryParams.toString();
    if (queryString) url += `&${queryString}`;
    return url;
  }, [filters]);

  const loadCharacters = useCallback(async (pageNumber, isInitialLoad = false, isRefresh = false) => {
    if (isInitialLoad || isRefresh) {
      setInitialLoading(true);
      if (isRefresh) {
        setCharacters([]);
        setPage(1); // Reset page to 1 before fetching
        pageNumber = 1; // Ensure pageNumber is 1 for refresh
      }
    } else {
      setLoading(true);
    }
    setError('');
    
    if (!isRefresh && !isInitialLoad) scrollPositionRef.current = window.scrollY;
    
    try {
      const response = await fetch(getApiUrl(pageNumber), { signal: AbortSignal.timeout(isMobile ? 7000 : 10000) }); // Adjusted timeout
      if (!response.ok) throw new Error(response.status === 404 ? 'No characters found for these filters.' : `Error loading characters (${response.status})`);
      const data = await response.json();

      setCharacters((prevChars) => {
        if (isRefresh || (isInitialLoad && Object.keys(filters).length > 0 && pageNumber === 1)) { // Ensure pageNumber is 1 for filter replacement
             return data.results.map((character, index) => ({ ...character, requiredLevel: character.requiredLevel || Math.max(1, index + 1) }));
        }
        const existingIds = new Set(prevChars.map(c => c.id));
        const newCharacters = data.results.filter(char => !existingIds.has(char.id));
        return [...prevChars, ...newCharacters.map((character, index) => ({ ...character, requiredLevel: character.requiredLevel || Math.max(1, prevChars.length + index + 1) }))];
      });
      setHasMore(Boolean(data.info && data.info.next));
    } catch (err) {
      if (err.name === 'AbortError') setError('Request timed out. Please check your connection.');
      else setError(err.message || 'Failed to load characters.');
      console.error('Error loading characters:', err);
    } finally {
      if (isInitialLoad || isRefresh) {
        setInitialLoading(false);
        if (isRefresh && isMobile) window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setLoading(false);
        if (isMobile && !isRefresh) setTimeout(() => window.scrollTo({ top: scrollPositionRef.current }), 100);
      }
      setIsPulling(false);
    }
  }, [getApiUrl, filters, isMobile]); // Added filters and isMobile dependencies

  // Load characters initially or when page/filters change
   useEffect(() => {
    // Only trigger initial load or filter-based refresh from here
    // Page changes for "load more" are handled by IntersectionObserver or button click
    if (page === 1) { // This implies initial load or filter change which resets page to 1
        loadCharacters(1, true, Object.keys(filters).length > 0 || characters.length > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, loadCharacters]); // Page dependency removed to avoid re-triggering on loadMore updates


  const loadMore = useCallback(() => {
    if (hasMore && !loading && !initialLoading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadCharacters(nextPage, false, false); // Fetch next page
        return nextPage;
      });
    }
  }, [hasMore, loading, initialLoading, loadCharacters]);

  const handleRetry = useCallback(() => {
    loadCharacters(page, page === 1);
  }, [loadCharacters, page]);
  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setFilterActive(Object.values(newFilters).some(Boolean));
    setPage(1); // Reset to page 1 for new filter
    // loadCharacters(1, true, true); // This will be handled by the useEffect watching 'filters'
  }, []);
  
  const handleClearFilter = useCallback(() => {
    setFilters({});
    setFilterActive(false);
    setPage(1); // Reset to page 1
    // loadCharacters(1, true, true); // This will be handled by the useEffect watching 'filters'
  }, []);

  useEffect(() => {
    if (loading || initialLoading || !hasMore || !loadMoreRef.current) return;
    let debounceTimer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(loadMore, 300);
        }
      }, { threshold: isMobile ? 0.1 : 0.5, rootMargin: isMobile ? '50px' : '200px' } // Increased rootMargin for desktop
    );
    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);
    return () => { clearTimeout(debounceTimer); if (currentRef) observer.unobserve(currentRef); };
  }, [loading, initialLoading, hasMore, loadMore, isMobile]);
  
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    const container = containerRef.current;
    const handleTouchStart = (e) => { pullStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
      if (window.scrollY > 5) return;
      const pullDistance = e.touches[0].clientY - pullStartY.current;
      if (pullDistance > 70 && !isPulling) setIsPulling(true); // Increased threshold
    };
    const handleTouchEnd = () => { if (isPulling) loadCharacters(1, true, true); };
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isPulling, loadCharacters]);

  const renderedCharacters = useMemo(() => {
    return characters
      .filter(char => char && char.id) // Ensure character and id exist
      .map((character) => {
        const isUnlocked = unlockedCharacters.some(c => c && c.id === character.id);
        const fallback = (
          <Grid item xs={6} sm={4} md={3} key={`skeleton-${character.id || Math.random()}`}>
            <Box sx={{ aspectRatio: '1 / 1.5', backgroundColor: 'grey.200', borderRadius: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 1 }}>
              <Box sx={{ height: '60%', backgroundColor: 'grey.300', mb: 1, borderRadius: 0.5 }} />
              <Box sx={{ height: '10%', backgroundColor: 'grey.300', width: '80%', borderRadius: 0.5 }} />
            </Box>
          </Grid>
        );
        return (
          <Grid item xs={6} sm={4} md={3} key={`character-${character.id}`}>
            <Suspense fallback={fallback}>
              <CharacterCard character={character} unlocked={isUnlocked} isMobile={isMobile} />
            </Suspense>
          </Grid>
        );
    });
  }, [characters, unlockedCharacters, isMobile]);

  return (
    <Container ref={containerRef} maxWidth="lg" sx={{ py: 2 }}>
      {isPulling && (
        <Box sx={{ position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, display: 'flex', alignItems: 'center', bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 3 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="caption">Release to refresh</Typography>
        </Box>
      )}
      
      <Box component="header" sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: isMobile ? 1 : 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
          {isMobile && (
            <IconButton component={RouterLink} to="/" aria-label="back to home" size="small">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ flexGrow: isMobile ? 1 : 0, textAlign: isMobile ? 'center' : 'left' }}>
            Characters
          </Typography>
          {isMobile && (
            <MobileFilterBar onFilterChange={handleFilterChange} filterActive={filterActive} onClearFilter={handleClearFilter} />
          )}
        </Box>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             {/* Desktop Filter Placeholder - Can implement similar to MobileFilterBar with Popover or inline */}
            <FormControl size="small" sx={{minWidth: 120}}>
              <InputLabel>Status</InputLabel>
              <Select value={filters.status || ''} label="Status" onChange={e => handleFilterChange({...filters, status: e.target.value})}>
                <MenuItem value="">Any</MenuItem><MenuItem value="alive">Alive</MenuItem><MenuItem value="dead">Dead</MenuItem><MenuItem value="unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{minWidth: 120}}>
              <InputLabel>Species</InputLabel>
              <Select value={filters.species || ''} label="Species" onChange={e => handleFilterChange({...filters, species: e.target.value})}>
                <MenuItem value="">Any</MenuItem><MenuItem value="Human">Human</MenuItem><MenuItem value="Alien">Alien</MenuItem> {/* Add more */}
              </Select>
            </FormControl>
            {filterActive && <Button onClick={handleClearFilter} size="small">Clear Filters</Button>}
            <Button component={RouterLink} to="/" variant="outlined" size="small">Back to Home</Button>
          </Box>
        )}
        {!isMobile && <Typography variant="subtitle1" color="text.secondary" sx={{width: '100%', mt: 1, textAlign: 'left'}}>Discover and unlock characters from across the multiverse.</Typography>}
      </Box>

      <Box component="main" aria-busy={initialLoading || loading}>
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {initialLoading && !error ? (
          <LoadingIndicator message={isMobile ? "Loading characters..." : "Loading characters from the multiverse..."} />
        ) : characters.length === 0 && !loading && !error ? (
          <EmptyState />
        ) : (
          <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, mb: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Showing {characters.length} characters</Typography>
              {unlockedCharacters.length > 0 && (
                <Typography variant="body2" color="text.secondary">{unlockedCharacters.length} unlocked</Typography>
              )}
            </Box>
            
            <Grid container spacing={isMobile ? 1.5 : 2}>
              {renderedCharacters}
            </Grid>
            
            {loading && !initialLoading && (
              <LoadingIndicator message={isMobile ? "Loading..." : "Loading more characters..."} small />
            )}
          </Fragment>
        )}
        
        {hasMore && !initialLoading && !error && (
          <div ref={loadMoreRef} style={{ height: '20px', margin: '10px 0' }} />
        )}
      </Box>
      
      {isMobile ? (
        <Box sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, visibility: (loading || !hasMore || initialLoading) ? 'hidden' : 'visible' }}>
          <Button
            onClick={loadMore} 
            disabled={!hasMore || loading || initialLoading}
            variant="contained"
            size="medium"
          >
            {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More'}
          </Button>
        </Box>
      ) : (
        <Box component="footer" sx={{ textAlign: 'center', py: 2, mt: 2, visibility: (loading || !hasMore || initialLoading) ? 'hidden' : 'visible' }}>
          <Button
            onClick={loadMore} 
            disabled={!hasMore || loading || initialLoading}
            variant="contained"
            size="large"
          >
            {loading ? 'Loading...' : hasMore ? 'Load More Characters' : 'End of Results'}
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default React.memo(Characters);