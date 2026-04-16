// Simple utility to download code as a file

export const downloadCodeAsFile = (code, filename = 'code.txt', language = 'txt') => {
  try {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `code.${getExtension(language)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ File downloaded:', link.download);
  } catch (error) {
    console.error('❌ Download failed:', error);
    alert('Failed to download file');
  }
};

// Helper function to get file extension based on language
export const getExtension = (language) => {
  const extensions = {
    python: 'py',
    javascript: 'js',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    php: 'php',
    typescript: 'ts',
    swift: 'swift',
    kotlin: 'kt',
    default: 'txt',
  };

  return extensions[language?.toLowerCase()] || extensions['default'];
};
