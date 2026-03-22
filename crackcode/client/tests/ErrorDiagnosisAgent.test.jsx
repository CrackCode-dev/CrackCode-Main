import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import ErrorDiagnosisView from '../src/components/codeEditor/ErrorDiagnosisView';
import ErrorConceptCard from '../src/components/codeEditor/ErrorConceptCard';

// ═════════════════════════════════════════════════════════════════════════════
// 1. ErrorDiagnosisView — null / empty states
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — null/empty states', () => {
  it('renders nothing when result is null', () => {
    const { container } = render(<ErrorDiagnosisView result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when result is undefined', () => {
    const { container } = render(<ErrorDiagnosisView result={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. ErrorDiagnosisView — error type header
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — error type header', () => {
  it('displays the error type name', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.getByText('Name Error')).toBeInTheDocument();
  });

  it('shows the test number badge when testNumber is provided', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Type Error', testNumber: 2 }} />);
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('does not render test number badge when testNumber is absent', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Type Error' }} />);
    expect(screen.queryByText(/^Test \d+$/)).not.toBeInTheDocument();
  });

  it('renders for every known error type without crashing', () => {
    const errorTypes = [
      'Wrong Answer', 'Runtime Error', 'Syntax Error', 'Name Error',
      'Index Error', 'Type Error', 'Zero Division Error', 'Indentation Error',
      'Value Error', 'Compilation Error', 'Attribute Error', 'Import Error',
    ];

    errorTypes.forEach((errorType) => {
      const { unmount } = render(<ErrorDiagnosisView result={{ errorType }} />);
      expect(screen.getByText(errorType)).toBeInTheDocument();
      unmount();
    });
  });

  it('renders for an unknown error type using fallback style', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Unknown Custom Error' }} />);
    expect(screen.getByText('Unknown Custom Error')).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. ErrorDiagnosisView — Wrong Answer output comparison
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — Wrong Answer output comparison', () => {
  const waResult = {
    errorType: 'Wrong Answer',
    expected: '25',
    actual: '20',
  };

  it('shows the Expected / Your Output panel for Wrong Answer', () => {
    render(<ErrorDiagnosisView result={waResult} />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
    expect(screen.getByText('Your Output')).toBeInTheDocument();
  });

  it('displays the expected value', () => {
    render(<ErrorDiagnosisView result={waResult} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('displays the actual output value', () => {
    render(<ErrorDiagnosisView result={waResult} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('shows "no output" when actual is falsy', () => {
    render(<ErrorDiagnosisView result={{ ...waResult, actual: '' }} />);
    expect(screen.getByText('no output')).toBeInTheDocument();
  });

  it('JSON-stringifies object expected values', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Wrong Answer', expected: { a: 1 }, actual: '{}' }} />);
    expect(screen.getByText('{"a":1}')).toBeInTheDocument();
  });

  it('does not show Expected/Actual panel for non-Wrong-Answer errors', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error', expected: 'foo', actual: 'bar' }} />);
    expect(screen.queryByText('Expected')).not.toBeInTheDocument();
  });

  it('does not show Expected/Actual panel when expected is null', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Wrong Answer', expected: null }} />);
    expect(screen.queryByText('Expected')).not.toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. ErrorDiagnosisView — raw error message section
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — raw error message', () => {
  it('shows the raw error block for non-Wrong-Answer errors', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error', rawError: 'NameError: x is not defined' }} />);
    expect(screen.getByText('Error Message')).toBeInTheDocument();
    expect(screen.getByText('NameError: x is not defined')).toBeInTheDocument();
  });

  it('does not show raw error block when rawError is absent', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
  });

  it('does not show raw error block for Wrong Answer even if rawError is set', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Wrong Answer', rawError: 'some raw error', expected: '1', actual: '2' }} />);
    expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. ErrorDiagnosisView — fallback (no AI) content
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — fallback built-in content', () => {
  it('shows "What went wrong" section', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.getByText('What went wrong')).toBeInTheDocument();
  });

  it('shows the built-in whatWentWrong text for Name Error', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.getByText(/variable or function name/i)).toBeInTheDocument();
  });

  it('shows "Steps to check" section', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.getByText('Steps to check')).toBeInTheDocument();
  });

  it('renders numbered steps for the Name Error fallback', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    // Name Error has 3 steps
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows the generic fallback whatWentWrong for unknown error types', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Unknown Error' }} />);
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  it('shows all fallback error types with their correct descriptions', () => {
    const cases = [
      ['Index Error',        /position in a list or string/i],
      ['Type Error',         /wrong type/i],
      ['Syntax Error',       /grammatical error/i],
      ['Zero Division Error',/divide a number by zero/i],
      ['Indentation Error',  /spacing.*indentation/i],
      ['Value Error',        /invalid value/i],
      ['Compilation Error',  /could not even be compiled/i],
      ['Wrong Answer',       /logic or calculation/i],
    ];

    cases.forEach(([errorType, pattern]) => {
      const { unmount } = render(<ErrorDiagnosisView result={{ errorType }} />);
      expect(screen.getByText(pattern)).toBeInTheDocument();
      unmount();
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. ErrorDiagnosisView — AI analysis content
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — AI analysis content', () => {
  const aiResult = {
    errorType: 'Name Error',
    aiAnalysis: {
      simplifiedMessage: 'You used a variable before defining it.',
      whatWentWrong: 'AI-powered explanation of name error.',
      actionableSteps: ['Step A from AI', 'Step B from AI'],
      conceptTitle: 'Variable Scope',
      conceptLesson: 'Variables must be defined before use.',
    },
  };

  it('renders the AI simplified message', () => {
    render(<ErrorDiagnosisView result={aiResult} />);
    expect(screen.getByText('You used a variable before defining it.')).toBeInTheDocument();
  });

  it('shows the "AI Analysis" label next to the simplified message', () => {
    render(<ErrorDiagnosisView result={aiResult} />);
    expect(screen.getByText(/AI Analysis/)).toBeInTheDocument();
  });

  it('renders the AI whatWentWrong text instead of fallback', () => {
    render(<ErrorDiagnosisView result={aiResult} />);
    expect(screen.getByText('AI-powered explanation of name error.')).toBeInTheDocument();
    // fallback text should NOT appear
    expect(screen.queryByText(/variable or function name was used that hasn't been defined/i)).not.toBeInTheDocument();
  });

  it('renders AI actionable steps', () => {
    render(<ErrorDiagnosisView result={aiResult} />);
    expect(screen.getByText('Step A from AI')).toBeInTheDocument();
    expect(screen.getByText('Step B from AI')).toBeInTheDocument();
  });

  it('renders the AI concept card with the concept title', () => {
    render(<ErrorDiagnosisView result={aiResult} />);
    expect(screen.getByText(/Variable Scope/)).toBeInTheDocument();
  });

  it('does not show the simplified message block when aiAnalysis is absent', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error' }} />);
    expect(screen.queryByText(/AI Analysis/)).not.toBeInTheDocument();
  });

  it('does not render concept card when no conceptTitle is provided', () => {
    render(<ErrorDiagnosisView result={{ errorType: 'Name Error', aiAnalysis: { simplifiedMessage: 'msg' } }} />);
    expect(screen.queryByText(/Concept:/)).not.toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. ErrorDiagnosisView — inline ConceptCard (toggle behaviour)
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorDiagnosisView — inline ConceptCard toggle', () => {
  const resultWithConcept = {
    errorType: 'Name Error',
    aiAnalysis: {
      conceptTitle: 'Variable Scope',
      conceptLesson: 'A variable must be declared before it can be used.',
    },
  };

  it('concept lesson is hidden by default', () => {
    render(<ErrorDiagnosisView result={resultWithConcept} />);
    expect(screen.queryByText('A variable must be declared before it can be used.')).not.toBeInTheDocument();
  });

  it('concept lesson appears after clicking the toggle button', async () => {
    render(<ErrorDiagnosisView result={resultWithConcept} />);
    const toggleBtn = screen.getByRole('button', { name: /Concept: Variable Scope/i });
    await userEvent.click(toggleBtn);
    expect(screen.getByText('A variable must be declared before it can be used.')).toBeInTheDocument();
  });

  it('concept lesson collapses after clicking the toggle a second time', async () => {
    render(<ErrorDiagnosisView result={resultWithConcept} />);
    const toggleBtn = screen.getByRole('button', { name: /Concept: Variable Scope/i });
    await userEvent.click(toggleBtn);
    await userEvent.click(toggleBtn);
    expect(screen.queryByText('A variable must be declared before it can be used.')).not.toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. ErrorConceptCard — standalone component
// ═════════════════════════════════════════════════════════════════════════════

describe('ErrorConceptCard', () => {
  it('renders nothing when conceptTitle is not provided', () => {
    const { container } = render(<ErrorConceptCard />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when conceptTitle is null', () => {
    const { container } = render(<ErrorConceptCard conceptTitle={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the concept title in the header', () => {
    render(<ErrorConceptCard conceptTitle="List Indexing" />);
    expect(screen.getByText('Concept: List Indexing')).toBeInTheDocument();
  });

  it('is collapsed by default — lesson text not visible', () => {
    render(<ErrorConceptCard conceptTitle="List Indexing" conceptLesson="Index starts at 0." />);
    expect(screen.queryByText('Index starts at 0.')).not.toBeInTheDocument();
  });

  it('expands to show concept lesson when clicked', async () => {
    render(<ErrorConceptCard conceptTitle="List Indexing" conceptLesson="Index starts at 0." />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Index starts at 0.')).toBeInTheDocument();
  });

  it('collapses lesson when clicked again', async () => {
    render(<ErrorConceptCard conceptTitle="List Indexing" conceptLesson="Index starts at 0." />);
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(screen.queryByText('Index starts at 0.')).not.toBeInTheDocument();
  });

  it('shows fixDirection when expanded', async () => {
    render(
      <ErrorConceptCard
        conceptTitle="Loop Bounds"
        conceptLesson="Lesson text."
        fixDirection="Check your loop end condition."
      />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Check your loop end condition.')).toBeInTheDocument();
  });

  it('does not show fixDirection section when fixDirection is absent', async () => {
    render(<ErrorConceptCard conceptTitle="Loop Bounds" conceptLesson="Lesson text." />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Where to look')).not.toBeInTheDocument();
  });

  it('shows "What this means" heading when expanded with a lesson', async () => {
    render(<ErrorConceptCard conceptTitle="Loop Bounds" conceptLesson="Lesson text." />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('What this means')).toBeInTheDocument();
  });

  it('does not show lesson body when conceptLesson is absent', async () => {
    render(<ErrorConceptCard conceptTitle="Loop Bounds" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('What this means')).not.toBeInTheDocument();
  });
});
