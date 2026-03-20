import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme/ThemeContext';
import { fetchChallengeCollection, transformProblemData } from '../../services/api/questionService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';

// Initial placeholders for 4 cases (preserve difficulty keys for selection
// but avoid showing dummy labels; real label comes from fetched schema)
const initialCases = [
  { difficulty: 'easy', difficultyLabel: null },
  { difficulty: 'medium', difficultyLabel: null },
  { difficulty: 'hard', difficultyLabel: null },
  { difficulty: 'medium', difficultyLabel: null },
];

const CaseLogMainPage = () => {
  useTheme(); // Subscribe to theme changes
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [cases, setCases] = useState(initialCases);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCases = async () => {
      try {
        setError(null);
        // Fetch from caseLog collection
        const items = await fetchChallengeCollection('caseLog');
        
        if (!items || items.length === 0) {
          throw new Error('No cases found in collection');
        }

        // Map to 4 cards - one per difficulty level (repeated)
        const usedIds = new Set();
        const difficultyMap = { easy: 'easy', medium: 'intermediate', hard: 'hard' };

        const mapped = initialCases.map((c, index) => {
          const wanted = difficultyMap[c.difficulty];

          // Find candidates matching the wanted difficulty and not used yet
          const candidates = items.filter((it) => {
            const d = (it.difficulty || '').toLowerCase();
            const matches = wanted === 'intermediate' ? (d === 'intermediate' || d === 'medium') : d === wanted;
            const id = it.problemId || it._id || '';
            return matches && !usedIds.has(id);
          });

          // Fallback: any unused item
          let found = candidates[0];
          if (!found) {
            found = items.find((it) => {
              const id = it.problemId || it._id || '';
              return !usedIds.has(id);
            });
          }

          // Final fallback: first item
          if (!found) found = items[0];

          if (!found) {
            return { ...c, title: c.difficultyLabel + ' Case', description: 'No case available', id: `local-${c.difficulty}-${index}` };
          }

          const id = found.problemId || found._id || '';
          usedIds.add(id);

          const transformed = transformProblemData(found, 'python');
          return {
            id: transformed.problemId || transformed.id,
            title: transformed.title,
            description: transformed.description,
            difficulty: transformed.difficulty || c.difficulty,
            difficultyLabel: c.difficultyLabel,
            points: transformed.starterCode ? 100 : 50,
            solved: false,
            popularity: found.popularity || 0,
            timeEstimate: transformed.timeEstimate || '10-15 min',
            raw: found,
            transformed,
          };
        });

        if (mounted) {
          setCases(mapped);
          setLoading(false);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load cases', err);
        if (mounted) {
          setError(err.message || 'Failed to load cases');
          setLoading(false);
        }
      }
    };

    fetchCases();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Header variant="empty" />

      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-6xl mx-auto pt-10">
          {/* Header Section */}
          <div className="mb-14">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Case Log Challenges
            </h1>
            <p style={{ color: 'var(--textSec)' }} className="text-lg max-w-2xl">
              Investigate and solve challenging cases. Each case is a mystery waiting to be cracked. 
              Master your coding skills with our curated detective challenges.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-2" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
                <p style={{ color: 'var(--textSec)' }}>Loading cases...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                <AlertCircle style={{ color: 'var(--brand)' }} className="w-12 h-12" />
                <p style={{ color: 'var(--text)' }} className="font-semibold">Unable to Load Cases</p>
                <p style={{ color: 'var(--textSec)' }} className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Cases Grid - 2x2 Layout */}
          {!loading && !error && cases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onMouseEnter={() => setHoveredId(caseItem.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    // Navigate to code editor with preloaded question data
                    if (caseItem.raw && (caseItem.transformed?.problemId || caseItem.id)) {
                      const targetId = caseItem.transformed?.problemId || caseItem.id;
                      navigate(`/code-editor/${targetId}`, { 
                        state: { question: caseItem.raw, language: 'python', sourceArea: 'case_log' } 
                      });
                    } else if (caseItem.transformed && caseItem.transformed.problemId) {
                      navigate(`/code-editor/${caseItem.transformed.problemId}`, { 
                        state: { question: caseItem.transformed, language: 'python', sourceArea: 'case_log' } 
                      });
                    } else {
                      navigate('/code-editor');
                    }
                  }}
                  className="relative rounded-lg p-5 transition-all duration-300 cursor-pointer group overflow-hidden"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    boxShadow: hoveredId === caseItem.id ? '0 10px 30px rgba(255, 165, 0, 0.15)' : 'none',
                    transform: hoveredId === caseItem.id ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                >
                  {/* Background accent */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full transition-all duration-300"
                    style={{
                      background: 'var(--brand)',
                      width: hoveredId === caseItem.id ? '4px' : '1px',
                    }}
                  />

                  {/* Difficulty Badge */}
                  <div className="mb-3">
                    {caseItem.difficulty ? (
                      <Badge
                        type="difficulty"
                        difficulty={caseItem.difficulty}
                        size="sm"
                      >
                        {caseItem.difficultyLabel || (caseItem.difficulty && caseItem.difficulty.charAt(0).toUpperCase() + caseItem.difficulty.slice(1))}
                      </Badge>
                    ) : (
                      <div className="px-2 py-1 rounded text-xs font-bold" style={{ color: 'var(--textSec)' }}>Loading...</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-opacity-90 transition-all break-words line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <p style={{ color: 'var(--textSec)' }} className="text-xs mb-2">
                      {caseItem.timeEstimate}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--textSec)' }}>Points</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--brand)' }}>+{caseItem.points}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      icon={ArrowRight} 
                      iconPosition="right"
                    >
                      Solve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CaseLogMainPage;