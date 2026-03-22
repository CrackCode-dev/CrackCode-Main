import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ─── Shared mocks ─────────────────────────────────────────────────────────────

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ problemId: 'py_fundamentals_001' }),
    useLocation: () => ({ state: null, pathname: '/editor/py_fundamentals_001' }),
  };
});

// Mock @monaco-editor/react — jsdom cannot run Monaco
vi.mock('@monaco-editor/react', () => ({
  default: ({ onChange, value, language }) => (
    <textarea
      data-testid="monaco-editor"
      data-language={language}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Mock axios instance used by the components
vi.mock('../src/api/axios.js', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { withCredentials: false, headers: { common: {} } },
  },
}));

// Mock the useCodeExecution hook so we don't need the full backend
vi.mock('../src/features/codeEditor/hooks/useCodeExecution.js', () => ({
  useCodeExecution: () => ({
    executeCode: vi.fn(),
  }),
}));

// Mock useProblemData to avoid real fetch calls
vi.mock('../src/features/codeEditor/hooks/useProblemData.js', () => ({
  useProblemData: () => ({
    error: null,
    setLanguage: vi.fn(),
    setLanguageLocked: vi.fn(),
  }),
}));

// Mock child components that are not under test in integration scenarios
vi.mock('../src/components/codeEditor/AIAssistantChat.jsx', () => ({
  default: () => <div data-testid="ai-assistant-chat">AI Assistant</div>,
}));

vi.mock('../src/components/codeEditor/ErrorDiagnosisView.jsx', () => ({
  default: ({ result }) => (
    <div data-testid="error-diagnosis-view">{result?.error || 'Error view'}</div>
  ),
}));

vi.mock('../src/components/common/BackBtn', () => ({
  default: () => <button data-testid="back-btn">Back</button>,
}));

vi.mock('../src/components/codeEditor/CaseDetails.jsx', () => ({
  default: () => <div data-testid="case-details">Case Details</div>,
}));

vi.mock('../src/components/codeEditor/EditorWrapper.jsx', () => ({
  default: () => <div data-testid="editor-wrapper">Editor Wrapper</div>,
}));

// ─── Imports under test ───────────────────────────────────────────────────────

import { EditorProvider, useEditor } from '../src/context/codeEditor/EditorContext';
import EditorToolbar from '../src/components/codeEditor/EditorToolbar';
import ConsolePanel from '../src/components/codeEditor/ConsolePanel';
import CodeEditorPage from '../src/pages/codeEditor/CodeEditorPage';
import {
  generateDetectiveMessage,
  generateErrorHint,
  generateSuccessSummary,
  generateFailureSummary,
} from '../src/features/codeEditor/utils/detectiveMessages';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps `ui` inside EditorProvider and MemoryRouter */
const renderWithEditor = (ui, contextOverrides = {}) => {
  // A thin wrapper that applies overrides to the real context
  const Wrapper = ({ children }) => {
    return (
      <EditorProvider>
        <ContextOverrider overrides={contextOverrides}>{children}</ContextOverrider>
      </EditorProvider>
    );
  };

  return render(<MemoryRouter>{ui}</MemoryRouter>, { wrapper: Wrapper });
};

/**
 * Reads the real EditorContext and patches it with `overrides`.
 * This allows tests to set specific state values without reimplementing
 * the whole context.
 */
const ContextOverrider = ({ children, overrides }) => {
  // We use a helper component that reads context and re-renders children
  // with applied overrides via a bridge
  return <OverrideBridge overrides={overrides}>{children}</OverrideBridge>;
};

// Bridge that applies overrides to context via useEffect mutations
const OverrideBridge = ({ children, overrides }) => {
  const ctx = useEditor();
  React.useEffect(() => {
    Object.entries(overrides).forEach(([key, value]) => {
      const setter = ctx[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`];
      if (typeof setter === 'function') setter(value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return children;
};

// ═════════════════════════════════════════════════════════════════════════════
// 1. EditorContext
// ═════════════════════════════════════════════════════════════════════════════

describe('EditorContext', () => {
  it('provides default initial values', () => {
    let ctx;
    const Capture = () => {
      ctx = useEditor();
      return null;
    };

    render(
      <EditorProvider>
        <Capture />
      </EditorProvider>
    );

    expect(ctx.currentProblem).toBeNull();
    expect(ctx.loading).toBe(true);
    expect(ctx.code).toBe('');
    expect(ctx.language).toBe('python');
    expect(ctx.languageLocked).toBe(false);
    expect(ctx.isExecuting).toBe(false);
    expect(ctx.testResults).toEqual([]);
    expect(ctx.showClue).toBe(false);
    expect(ctx.activeTab).toBe('error-diagnosis');
    expect(ctx.activeRightTab).toBe('test-cases');
    expect(ctx.errorHistory).toEqual([]);
    expect(ctx.attemptCount).toBe(0);
    expect(ctx.aiMessages).toEqual([]);
    expect(ctx.aiInput).toBe('');
    expect(ctx.isAiTyping).toBe(false);
  });

  it('updates code via setCode', () => {
    let ctx;
    const Capture = () => {
      ctx = useEditor();
      return null;
    };

    render(
      <EditorProvider>
        <Capture />
      </EditorProvider>
    );

    act(() => ctx.setCode('print("hello")'));
    expect(ctx.code).toBe('print("hello")');
  });

  it('updates language via setLanguage', () => {
    let ctx;
    const Capture = () => {
      ctx = useEditor();
      return null;
    };

    render(
      <EditorProvider>
        <Capture />
      </EditorProvider>
    );

    act(() => ctx.setLanguage('javascript'));
    expect(ctx.language).toBe('javascript');
  });

  it('throws when useEditor is called outside EditorProvider', () => {
    const BadComponent = () => {
      useEditor();
      return null;
    };

    // Suppress the expected console.error from React
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadComponent />)).toThrow(
      'useEditor must be used within EditorProvider'
    );
    spy.mockRestore();
  });

  it('updates activeRightTab', () => {
    let ctx;
    const Capture = () => {
      ctx = useEditor();
      return null;
    };

    render(
      <EditorProvider>
        <Capture />
      </EditorProvider>
    );

    act(() => ctx.setActiveRightTab('ai-assistant'));
    expect(ctx.activeRightTab).toBe('ai-assistant');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. EditorToolbar
// ═════════════════════════════════════════════════════════════════════════════

describe('EditorToolbar', () => {
  const mockProblem = {
    fileName: 'mystery.py',
    problemId: 'py_fundamentals_001',
    starterCode: {
      python: 'def solve():\n    pass',
      javascript: 'function solve() {}',
    },
  };

  const renderToolbar = (overrides = {}) =>
    renderWithEditor(<EditorToolbar />, {
      currentProblem: mockProblem,
      code: '# my code',
      language: 'python',
      languageLocked: false,
      isExecuting: false,
      attemptCount: 0,
      ...overrides,
    });

  it('renders the file name from currentProblem', () => {
    renderToolbar();
    expect(screen.getByText('mystery.py')).toBeInTheDocument();
  });

  it('renders Run and Submit buttons', () => {
    renderToolbar();
    expect(screen.getByTitle('Run code (Ctrl+Enter)')).toBeInTheDocument();
    expect(screen.getByTitle('Submit solution for official evaluation')).toBeInTheDocument();
  });

  it('disables Run button while executing', () => {
    renderToolbar({ isExecuting: true });
    expect(screen.getByTitle('Run code (Ctrl+Enter)')).toBeDisabled();
  });

  it('shows "Running…" text while executing', () => {
    renderToolbar({ isExecuting: true });
    expect(screen.getByText(/Running/)).toBeInTheDocument();
  });

  it('shows attempt count badge when attemptCount > 0', () => {
    renderToolbar({ attemptCount: 3 });
    expect(screen.getByText(/3 runs/)).toBeInTheDocument();
  });

  it('shows "1 run" (singular) when attemptCount === 1', () => {
    renderToolbar({ attemptCount: 1 });
    expect(screen.getByText(/1 run/)).toBeInTheDocument();
  });

  it('does not show attempt badge when attemptCount is 0', () => {
    renderToolbar({ attemptCount: 0 });
    // The badge renders as "N run(s)" — no digit before "run" means badge is absent
    expect(screen.queryByText(/^\d+ runs?$/)).not.toBeInTheDocument();
  });

  it('renders language selector with python selected by default', () => {
    renderToolbar();
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('python');
  });

  it('disables language selector when languageLocked is true', () => {
    renderToolbar({ languageLocked: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('shows all four language options', () => {
    renderToolbar();
    const select = screen.getByRole('combobox');
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toEqual(['python', 'javascript', 'java', 'cpp']);
  });

  it('renders the keyboard shortcut hint', () => {
    renderToolbar();
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('shows default file name when currentProblem has no fileName', () => {
    renderWithEditor(<EditorToolbar />, {
      currentProblem: null,
      code: '',
      language: 'python',
      isExecuting: false,
      attemptCount: 0,
      languageLocked: false,
    });
    expect(screen.getByText('investigation.py')).toBeInTheDocument();
  });

  it('fires Ctrl+Enter keyboard shortcut without throwing', () => {
    // The shortcut calls executeCode — since we already mock the hook at
    // module level this just verifies the listener is registered without error.
    renderToolbar();
    expect(() =>
      fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true })
    ).not.toThrow();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. ConsolePanel
// ═════════════════════════════════════════════════════════════════════════════

describe('ConsolePanel', () => {
  const renderPanel = (overrides = {}) =>
    renderWithEditor(<ConsolePanel />, {
      activeRightTab: 'test-cases',
      testResults: [],
      isExecuting: false,
      errorHistory: [],
      attemptCount: 0,
      ...overrides,
    });

  // ── Tab rendering ──────────────────────────────────────────────────────────

  it('renders all four tabs', () => {
    renderPanel();
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
    expect(screen.getByText('Error Diagnosis')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('clicking a tab makes it active', async () => {
    renderPanel();
    const aiTab = screen.getByText('AI Assistant');
    await userEvent.click(aiTab);
    expect(screen.getByTestId('ai-assistant-chat')).toBeInTheDocument();
  });

  // ── Test Cases tab ─────────────────────────────────────────────────────────

  it('shows empty-state message when no test results and not executing', () => {
    renderPanel({ activeRightTab: 'test-cases', testResults: [] });
    expect(
      screen.getByText(/Run your code to see test case results/)
    ).toBeInTheDocument();
  });

  it('shows loading spinner while executing', () => {
    renderPanel({ activeRightTab: 'test-cases', isExecuting: true });
    expect(screen.getByText(/Running test cases/)).toBeInTheDocument();
  });

  it('renders test case cards after execution', () => {
    const testResults = [
      { status: 'passed', details: { input: '5', expected: '25', time: '0.01' } },
      { status: 'failed', error: 'NameError: name x is not defined', details: { input: '3', expected: '9' } },
    ];
    renderPanel({ activeRightTab: 'test-cases', testResults });

    expect(screen.getByText('Test Case 1')).toBeInTheDocument();
    expect(screen.getByText('Test Case 2')).toBeInTheDocument();
    // The component renders result.status directly — CSS uppercase applied visually
    expect(screen.getByText('passed')).toBeInTheDocument();
    expect(screen.getByText('failed')).toBeInTheDocument();
  });

  it('renders the pass/fail summary bar', () => {
    const testResults = [
      { status: 'passed', details: {} },
      { status: 'passed', details: {} },
      { status: 'failed', error: 'err', details: {} },
    ];
    renderPanel({ activeRightTab: 'test-cases', testResults });

    // "2/3 passed" summary
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('/3 passed')).toBeInTheDocument();
  });

  it('shows first line of error message for failed test cases', () => {
    const testResults = [
      {
        status: 'failed',
        error: 'NameError: name x is not defined\n  at line 2',
        details: { input: '1', expected: '1' },
      },
    ];
    renderPanel({ activeRightTab: 'test-cases', testResults });
    expect(screen.getByText('NameError: name x is not defined')).toBeInTheDocument();
  });

  // ── Error Diagnosis tab ────────────────────────────────────────────────────

  it('shows empty-state message in error diagnosis when no results', () => {
    renderPanel({ activeRightTab: 'error-diagnosis', testResults: [] });
    expect(
      screen.getByText(/Run your code to see error diagnosis here/)
    ).toBeInTheDocument();
  });

  it('shows success message when all tests pass', () => {
    const testResults = [
      { status: 'passed', details: {} },
      { status: 'passed', details: {} },
    ];
    renderPanel({ activeRightTab: 'error-diagnosis', testResults });
    expect(screen.getByText('Answer Correct!')).toBeInTheDocument();
  });

  it('renders ErrorDiagnosisView for the first failed test', () => {
    const testResults = [
      { status: 'failed', error: 'TypeError: unsupported operand', details: {} },
    ];
    renderPanel({ activeRightTab: 'error-diagnosis', testResults });
    expect(screen.getByTestId('error-diagnosis-view')).toBeInTheDocument();
  });

  it('shows analysing spinner while executing in error diagnosis tab', () => {
    renderPanel({ activeRightTab: 'error-diagnosis', isExecuting: true });
    expect(screen.getByText(/Analysing evidence/)).toBeInTheDocument();
  });

  // ── AI Assistant tab ────────────────────────────────────────────────────────

  it('renders AIAssistantChat in the AI assistant tab', () => {
    renderPanel({ activeRightTab: 'ai-assistant' });
    expect(screen.getByTestId('ai-assistant-chat')).toBeInTheDocument();
  });

  // ── History tab ────────────────────────────────────────────────────────────

  it('shows empty history message when no runs recorded', () => {
    renderPanel({ activeRightTab: 'history', errorHistory: [] });
    expect(
      screen.getByText(/Your run history for this problem will appear here/)
    ).toBeInTheDocument();
  });

  it('shows run count when history entries exist', () => {
    const errorHistory = [
      {
        id: 1,
        runIndex: 1,
        timestamp: '12:00:00',
        results: [{ status: 'passed', details: {} }],
        passed: 1,
        total: 1,
      },
      {
        id: 2,
        runIndex: 2,
        timestamp: '12:01:00',
        results: [{ status: 'failed', error: 'err', details: {} }],
        passed: 0,
        total: 1,
      },
    ];
    renderPanel({ activeRightTab: 'history', errorHistory });
    expect(screen.getByText(/2 runs recorded/)).toBeInTheDocument();
  });

  it('renders each history entry', () => {
    const errorHistory = [
      {
        id: 1,
        runIndex: 1,
        timestamp: '10:30:00',
        results: [],
        passed: 1,
        total: 1,
      },
    ];
    renderPanel({ activeRightTab: 'history', errorHistory });
    expect(screen.getByText(/Run #1/)).toBeInTheDocument();
  });

  // ── Error badge on Error Diagnosis tab ────────────────────────────────────

  it('shows error badge count on Error Diagnosis tab when tests fail', () => {
    const testResults = [
      { status: 'failed', error: 'err', details: {} },
      { status: 'failed', error: 'err2', details: {} },
    ];
    renderPanel({ activeRightTab: 'test-cases', testResults });
    // The badge shows "2" for 2 failed tests next to Error Diagnosis tab
    const badges = screen.getAllByText('2');
    expect(badges.length).toBeGreaterThan(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. Detective Messages Utility
// ═════════════════════════════════════════════════════════════════════════════

describe('generateDetectiveMessage', () => {
  it('returns a non-empty string for "success"', () => {
    const msg = generateDetectiveMessage('success');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for "runtime_error"', () => {
    const msg = generateDetectiveMessage('runtime_error');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for "compile_error"', () => {
    const msg = generateDetectiveMessage('compile_error');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for "wrong_answer"', () => {
    const msg = generateDetectiveMessage('wrong_answer');
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('returns the fallback message for an unknown type', () => {
    expect(generateDetectiveMessage('unknown_type')).toBe(
      'The investigation continues...'
    );
  });
});

describe('generateErrorHint', () => {
  it('returns IndexError hint for out-of-bounds errors', () => {
    const hint = generateErrorHint('runtime_error', 'IndexError: list index out of range');
    expect(hint).toMatch(/array indices/i);
  });

  it('returns NameError hint for undefined variable errors', () => {
    const hint = generateErrorHint('runtime_error', 'NameError: name x is not defined');
    expect(hint).toMatch(/variable names/i);
  });

  it('returns TypeError hint for type mismatch errors', () => {
    const hint = generateErrorHint('runtime_error', 'TypeError: unsupported operand');
    expect(hint).toMatch(/data types/i);
  });

  it('returns SyntaxError hint for syntax errors', () => {
    const hint = generateErrorHint('compile_error', 'SyntaxError: invalid syntax');
    expect(hint).toMatch(/syntax/i);
  });

  it('returns ZeroDivisionError hint for division by zero', () => {
    const hint = generateErrorHint('runtime_error', 'ZeroDivisionError: division by zero');
    expect(hint).toMatch(/zero/i);
  });

  it('returns the generic fallback for unknown error messages', () => {
    const hint = generateErrorHint('runtime_error', 'something completely unknown');
    expect(hint).toMatch(/trace through your code/i);
  });
});

describe('generateSuccessSummary', () => {
  it('returns a string that includes totalTests count and language', () => {
    const msg = generateSuccessSummary(3, 'Python');
    expect(msg).toMatch(/3/);
    expect(msg).toMatch(/Python/);
  });
});

describe('generateFailureSummary', () => {
  it('returns a string that includes passed count', () => {
    const msg = generateFailureSummary(2, 5);
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
    // All four template strings include the passedTests count
    expect(msg).toMatch(/2/);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. CodeEditorPage (integration smoke test)
// ═════════════════════════════════════════════════════════════════════════════

describe('CodeEditorPage', () => {
  it('renders the back button, case details, and editor wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/editor/py_fundamentals_001']}>
        <CodeEditorPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('back-btn')).toBeInTheDocument();
    expect(screen.getByTestId('case-details')).toBeInTheDocument();
    expect(screen.getByTestId('editor-wrapper')).toBeInTheDocument();
  });
});
