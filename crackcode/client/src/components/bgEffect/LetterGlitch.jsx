import { useRef, useEffect } from 'react';

const LetterGlitch = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc', '#ff6b35', '#f7c244'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  codeKeywords = [
    // JavaScript/TypeScript
    'const', 'let', 'var', 'function', 'return', 'import', 'export', 'async', 'await', '=>', 'class', 'this', 'new', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'Promise', 'fetch', 'then', 'finally', 'spread', 'map()', 'filter()', 'reduce()', 'forEach', 'Object', 'Array', 'JSON', 'module', 'require', 'default',
    // HTML/JSX
    '<div>', '</div>', '<span>', '<p>', '<h1>', '<ul>', '<li>', '<a>', '<img>', '<form>', '<input>', '<button>', 'className=', 'onClick=', '<head>', '<body>', '<html>', '<script>', '<style>', '<link>', '<meta>', 'href=', 'src=', '<nav>', '<footer>', '<header>', '<section>', '<main>',
    // CSS
    'display:', 'flex', 'grid', 'margin:', 'padding:', 'color:', 'background:', 'border:', 'position:', 'absolute', 'relative', 'z-index:', 'opacity:', 'transform:', 'transition:', '@media', '@keyframes', ':hover', ':focus', '!important', 'calc()', 'var(--', 'rem', 'px', 'vh', 'vw',
    // Python
    'def', 'self', 'print()', 'range()', 'lambda', 'elif', 'True', 'False', 'None', '__init__', 'import', 'from', 'as', 'with', 'open()', 'class:', 'yield', 'assert', 'raise', 'except', 'finally:', 'pass', 'global', 'nonlocal', '__name__', '__main__', 'pip', 'venv', 'dict', 'list', 'tuple', 'set',
    // C++
    '#include', '<iostream>', '<vector>', '<string>', '<map>', '<set>', '<algorithm>', '<memory>', 'std::', 'cout', 'cin', 'endl', 'namespace', 'using', 'template', 'typename', 'virtual', 'override', 'const', 'constexpr', 'static_cast', 'dynamic_cast', 'nullptr', 'auto', 'inline', 'explicit', 'friend', 'operator', 'struct', 'enum', 'union', 'typedef', 'sizeof', 'new', 'delete', 'malloc', 'free', 'printf', 'scanf', '&', '*ptr', '->',  'public:', 'private:', 'protected:', '::',
    // C
    '#define', '#ifdef', '#ifndef', '#endif', '#pragma', 'stdio.h', 'stdlib.h', 'string.h', 'malloc()', 'calloc()', 'realloc()', 'free()', 'sizeof()', 'NULL', 'FILE*', 'fopen', 'fclose', 'fprintf', 'fscanf', 'argv', 'argc',
    // Java
    'public', 'private', 'protected', 'static', 'void', 'int', 'String', 'boolean', 'float', 'double', 'main()', 'System', 'extends', 'implements', 'interface', 'abstract', 'final', 'super', 'package', 'import', '@Override', '@Autowired', 'throws', 'throw', 'synchronized', 'volatile', 'transient', 'ArrayList', 'HashMap', 'LinkedList',
    // C#
    'Console', 'WriteLine', 'ReadLine', 'namespace', 'using', 'partial', 'sealed', 'readonly', 'ref', 'out', 'params', 'async', 'await', 'Task', 'IEnumerable', 'LINQ', 'var', 'dynamic', 'object', 'decimal', 'get;', 'set;', '[Attribute]', 'delegate', 'event', 'lock', 'unsafe', 'fixed',
    // SQL
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'VARCHAR', 'INTEGER', 'CREATE', 'TABLE', 'INDEX', 'ALTER', 'DROP', 'PRIMARY', 'FOREIGN', 'KEY', 'NULL', 'NOT NULL', 'UNIQUE', 'DEFAULT', 'AUTO_INCREMENT', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'AS', 'DISTINCT', 'COUNT()', 'SUM()', 'AVG()', 'MAX()', 'MIN()',
    // Rust
    'fn', 'let', 'mut', 'pub', 'impl', 'trait', 'struct', 'enum', 'match', 'Option', 'Result', 'Some', 'None', 'Ok', 'Err', 'unwrap()', 'expect()', '&str', 'String', 'Vec<>', 'Box<>', 'Rc<>', 'Arc<>', 'async', 'await', 'move', 'dyn', 'where', 'mod', 'use', 'crate', 'super', 'self', 'unsafe', 'extern', 'macro!',
    // Go
    'func', 'package', 'import', 'go', 'chan', 'defer', 'range', 'select', 'goroutine', 'make()', 'append()', 'len()', 'cap()', 'panic', 'recover', 'interface{}', 'struct{}', 'map[]', 'slice', ':=', 'nil', 'iota', 'fallthrough',
    // General/Common
    'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'null', 'undefined', 'true', 'false', 'return', 'void', 'int', 'char', 'bool', 'float', 'double', 'long', 'short', 'unsigned', 'signed',
    // React/Frameworks
    'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext', 'useReducer', 'props', 'state', 'render()', 'component', '<App/>', '<Router>', 'navigate', 'dispatch', 'action', 'reducer', 'store', 'Provider', 'connect', 'mapState', 'mapDispatch', 'createSlice', 'configureStore',
    // Symbols/Operators
    '{ }', '[ ]', '( )', ';', '===', '!==', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '=>', '//', '/*', '*/', '<?php', '?>', '!=', '==', '>=', '<=', '>>', '<<', '&=', '|=', '^=', '~', '%', '?:', '...', '`${}`'
  ]
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const keywords = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());

  const fontSize = 14;
  const charWidth = 8;
  const charHeight = 22;
  const keywordMaxWidth = 12;

  const getRandomKeyword = () => {
    return codeKeywords[Math.floor(Math.random() * codeKeywords.length)];
  };

  const getRandomColor = () => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const hexToRgb = hex => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const interpolateColor = (start, end, factor) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width, height) => {
    const cellWidth = charWidth * keywordMaxWidth;
    const cellHeight = charHeight;
    const columns = Math.ceil(width / cellWidth) + 1;
    const rows = Math.ceil(height / cellHeight) + 1;
    return { columns, rows };
  };

  const initializeKeywords = (columns, rows) => {
    grid.current = { columns, rows };
    const totalCells = columns * rows;
    const cellWidth = charWidth * keywordMaxWidth;
    
    keywords.current = Array.from({ length: totalCells }, (_, index) => {
      const row = Math.floor(index / columns);
      const staggerOffset = (row % 2) * (cellWidth * 0.4); // stagger odd rows
      
      return {
        keyword: getRandomKeyword(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1,
        offsetX: staggerOffset + (Math.random() * 20 - 10),
        offsetY: Math.random() * 8 - 4
      };
    });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeKeywords(columns, rows);

    drawKeywords();
  };

  const drawKeywords = () => {
    if (!context.current || keywords.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px 'Fira Code', 'Monaco', 'Consolas', monospace`;
    ctx.textBaseline = 'top';

    const cellWidth = charWidth * keywordMaxWidth;

    keywords.current.forEach((item, index) => {
      const col = index % grid.current.columns;
      const row = Math.floor(index / grid.current.columns);
      const baseX = col * cellWidth;
      const baseY = row * charHeight;
      const x = baseX + item.offsetX;
      const y = baseY + item.offsetY;
      ctx.fillStyle = item.color;
      ctx.fillText(item.keyword, x, y);
    });
  };

  const updateKeywords = () => {
    if (!keywords.current || keywords.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(keywords.current.length * 0.05));
    const cellWidth = charWidth * keywordMaxWidth;

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * keywords.current.length);
      if (!keywords.current[index]) continue;

      const row = Math.floor(index / grid.current.columns);
      const staggerOffset = (row % 2) * (cellWidth * 0.4);

      keywords.current[index].keyword = getRandomKeyword();
      keywords.current[index].targetColor = getRandomColor();
      keywords.current[index].offsetX = staggerOffset + (Math.random() * 20 - 10);
      keywords.current[index].offsetY = Math.random() * 8 - 4;

      if (!smooth) {
        keywords.current[index].color = keywords.current[index].targetColor;
        keywords.current[index].colorProgress = 1;
      } else {
        keywords.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    keywords.current.forEach(item => {
      if (item.colorProgress < 1) {
        item.colorProgress += 0.05;
        if (item.colorProgress > 1) item.colorProgress = 1;

        const startRgb = hexToRgb(item.color);
        const endRgb = hexToRgb(item.targetColor);
        if (startRgb && endRgb) {
          item.color = interpolateColor(startRgb, endRgb, item.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawKeywords();
    }
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateKeywords();
      drawKeywords();
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]"></div>
      )}
      {centerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"></div>
      )}
    </div>
  );
};

export default LetterGlitch;