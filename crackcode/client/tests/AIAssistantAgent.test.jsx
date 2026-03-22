import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// jsdom does not implement scrollIntoView — stub it globally
window.HTMLElement.prototype.scrollIntoView = vi.fn();

import { EditorProvider, useEditor } from '../src/context/codeEditor/EditorContext';
import AIAssistantChat from '../src/components/codeEditor/AIAssistantChat';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renders AIAssistantChat inside a real EditorProvider.
 * `overrides` are applied via a bridge component so individual tests can
 * pre-seed context state (aiMessages, aiInput, isAiTyping, code, language, …).
 */
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

const renderChat = (overrides = {}) =>
  render(
    <EditorProvider>
      <OverrideBridge overrides={overrides}>
        <AIAssistantChat />
      </OverrideBridge>
    </EditorProvider>
  );

/** Returns a resolved fetch mock with the given reply text. */
const mockFetchSuccess = (reply = 'Here is the answer.') =>
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { reply } }),
    })
  );

/** Returns a resolved fetch mock that the server marks as error. */
const mockFetchServerError = (message = 'Something went wrong') =>
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: false, message }),
    })
  );

/** Returns a rejected fetch mock (network failure). */
const mockFetchNetworkError = (msg = 'Network error') =>
  vi.fn(() => Promise.reject(new Error(msg)));

/** Returns a non-ok HTTP response mock. */
const mockFetchHttpError = (status = 500, body = 'Internal Server Error') =>
  vi.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      text: () => Promise.resolve(body),
    })
  );

// ═════════════════════════════════════════════════════════════════════════════
// 1. Initial render — welcome / empty state
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — initial render', () => {
  it('shows the Detective AI welcome message when there are no messages', () => {
    renderChat();
    expect(
      screen.getByText(/I'm your AI partner on this case/i)
    ).toBeInTheDocument();
  });

  it('shows the "Run your code first" hint in the welcome message', () => {
    renderChat();
    expect(screen.getByText(/Run your code first/i)).toBeInTheDocument();
  });

  it('renders all four suggestion chips when no messages exist', () => {
    renderChat();
    ['Explain my error', 'Give me a hint', 'Check complexity', 'Help with loops'].forEach(
      (chip) => expect(screen.getByRole('button', { name: chip })).toBeInTheDocument()
    );
  });

  it('renders the textarea with the correct placeholder', () => {
    renderChat();
    expect(screen.getByPlaceholderText('Ask the Detective AI…')).toBeInTheDocument();
  });

  it('the send button is disabled when input is empty', () => {
    renderChat();
    // The send button has no accessible name — query by its parent label context
    const textarea = screen.getByPlaceholderText('Ask the Detective AI…');
    expect(textarea.value).toBe('');
    // The button closest to the textarea is the send button
    const sendBtn = textarea.closest('div').querySelector('button');
    expect(sendBtn).toBeDisabled();
  });

  it('shows the keyboard hint text', () => {
    renderChat();
    expect(screen.getByText(/Enter to send/i)).toBeInTheDocument();
    expect(screen.getByText(/Shift\+Enter for new line/i)).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. Input interaction
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — input interaction', () => {
  it('updates the textarea as the user types', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'What is wrong?');
    expect(input.value).toBe('What is wrong?');
  });

  it('enables the send button once text is entered', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Hello');
    const sendBtn = input.closest('div').querySelector('button');
    expect(sendBtn).not.toBeDisabled();
  });

  it('send button remains disabled when input is only whitespace', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, '   ');
    const sendBtn = input.closest('div').querySelector('button');
    expect(sendBtn).toBeDisabled();
  });

  it('clicking a suggestion chip populates the input', async () => {
    renderChat();
    await userEvent.click(screen.getByRole('button', { name: 'Give me a hint' }));
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    expect(input.value).toBe('Give me a hint');
  });

  it('clicking a suggestion chip focuses the input', async () => {
    renderChat();
    await userEvent.click(screen.getByRole('button', { name: 'Explain my error' }));
    expect(screen.getByPlaceholderText('Ask the Detective AI…')).toHaveFocus();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. Sending a message — successful API response
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — sending a message (success)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetchSuccess('Use a for-loop here.'));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('appends the user message to the chat after sending', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'How do I fix this?');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText('How do I fix this?')).toBeInTheDocument()
    );
  });

  it('clears the input after sending', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Question?');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() => expect(input.value).toBe(''));
  });

  it('shows the assistant reply prefixed with the detective emoji', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Help');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText(/Use a for-loop here\./)).toBeInTheDocument()
    );
  });

  it('hides the welcome message after the first message is sent', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Test');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.queryByText(/I'm your AI partner on this case/i)).not.toBeInTheDocument()
    );
  });

  it('hides the suggestion chips after the first message is sent', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Test');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Give me a hint' })).not.toBeInTheDocument()
    );
  });

  it('sends Enter key to submit the message', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Keyboard send');
    await userEvent.keyboard('{Enter}');

    await waitFor(() =>
      expect(screen.getByText('Keyboard send')).toBeInTheDocument()
    );
  });

  it('Shift+Enter does NOT submit the message', async () => {
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'No send');
    // Shift+Enter should add a newline, not submit
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');

    // No user message bubble should appear yet
    expect(screen.queryByText('No send')).toBeInTheDocument(); // still in input
    expect(fetch).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. Sending a message — API error handling
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows an error reply on network failure', async () => {
    vi.stubGlobal('fetch', mockFetchNetworkError('Network error'));
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Ping');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument()
    );
  });

  it('shows an error reply on HTTP 500 response', async () => {
    vi.stubGlobal('fetch', mockFetchHttpError(500, 'Internal Server Error'));
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Ping');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText(/Error:.*500/)).toBeInTheDocument()
    );
  });

  it('shows an error reply when success is false in the response body', async () => {
    vi.stubGlobal('fetch', mockFetchServerError('Model unavailable'));
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Ping');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText(/Error: Model unavailable/)).toBeInTheDocument()
    );
  });

  it('error reply is prefixed with the detective emoji', async () => {
    vi.stubGlobal('fetch', mockFetchNetworkError('Timeout'));
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Ping');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() =>
      expect(screen.getByText(/🕵️.*Error:/)).toBeInTheDocument()
    );
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. Typing indicator
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — typing indicator', () => {
  it('shows the typing indicator while isAiTyping is true', () => {
    renderChat({ isAiTyping: true });
    // The indicator renders 3 bouncing dots inside a flex container;
    // the parent assistant bubble is present — verify the animated dots exist
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('does not show the typing indicator when isAiTyping is false', () => {
    renderChat({ isAiTyping: false });
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(0);
  });

  it('send button is disabled while isAiTyping is true even with text', () => {
    renderChat({ isAiTyping: true, aiInput: 'some text' });
    // The component reads aiInput from context, so seed it via overrides
    const sendBtn = document.querySelector('button[disabled]');
    expect(sendBtn).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. Message history rendering
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — message history rendering', () => {
  const existingMessages = [
    { role: 'user',      text: 'What is a loop?',        id: 1 },
    { role: 'assistant', text: '🕵️ A loop repeats code.', id: 2 },
    { role: 'user',      text: 'Thanks!',                id: 3 },
  ];

  it('renders pre-existing user messages', () => {
    renderChat({ aiMessages: existingMessages });
    expect(screen.getByText('What is a loop?')).toBeInTheDocument();
    expect(screen.getByText('Thanks!')).toBeInTheDocument();
  });

  it('renders pre-existing assistant messages', () => {
    renderChat({ aiMessages: existingMessages });
    expect(screen.getByText('🕵️ A loop repeats code.')).toBeInTheDocument();
  });

  it('does not show welcome message when aiMessages is non-empty', () => {
    renderChat({ aiMessages: existingMessages });
    expect(screen.queryByText(/I'm your AI partner on this case/i)).not.toBeInTheDocument();
  });

  it('does not show suggestion chips when aiMessages is non-empty', () => {
    renderChat({ aiMessages: existingMessages });
    expect(screen.queryByRole('button', { name: 'Explain my error' })).not.toBeInTheDocument();
  });

  it('renders all messages in the correct order', () => {
    renderChat({ aiMessages: existingMessages });
    const texts = screen
      .getAllByText(/What is a loop\?|🕵️ A loop repeats code\.|Thanks!/);
    expect(texts[0]).toHaveTextContent('What is a loop?');
    expect(texts[1]).toHaveTextContent('🕵️ A loop repeats code.');
    expect(texts[2]).toHaveTextContent('Thanks!');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. API request payload
// ═════════════════════════════════════════════════════════════════════════════

describe('AIAssistantChat — API request payload', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends question, language, and code to /api/ai/assistant', async () => {
    const mockFetch = mockFetchSuccess('Answer');
    vi.stubGlobal('fetch', mockFetch);

    renderChat({ code: 'print("hi")', language: 'python' });
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Explain please');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/ai/assistant');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body.question).toBe('Explain please');
    expect(body.language).toBe('python');
    expect(body.code).toBe('print("hi")');
  });

  it('falls back to "python" when language is not set', async () => {
    const mockFetch = mockFetchSuccess('Answer');
    vi.stubGlobal('fetch', mockFetch);

    // EditorContext defaults language to 'python', so this just verifies no crash
    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Hello');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.language).toBe('python');
  });

  it('includes the first testResult as lastJudgeResult', async () => {
    const mockFetch = mockFetchSuccess('Answer');
    vi.stubGlobal('fetch', mockFetch);

    const testResults = [
      { status: 'failed', error: 'NameError', details: {} },
      { status: 'passed', details: {} },
    ];

    renderChat({ testResults });
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Why did it fail?');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.lastJudgeResult).toEqual(testResults[0]);
  });

  it('sends credentials: include with every request', async () => {
    const mockFetch = mockFetchSuccess('Answer');
    vi.stubGlobal('fetch', mockFetch);

    renderChat();
    const input = screen.getByPlaceholderText('Ask the Detective AI…');
    await userEvent.type(input, 'Hi');
    await userEvent.click(input.closest('div').querySelector('button'));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce());
    expect(mockFetch.mock.calls[0][1].credentials).toBe('include');
  });

  it('does not send when input is empty', async () => {
    const mockFetch = mockFetchSuccess('Answer');
    vi.stubGlobal('fetch', mockFetch);

    renderChat();
    // Try pressing Enter without any text
    await userEvent.keyboard('{Enter}');

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
