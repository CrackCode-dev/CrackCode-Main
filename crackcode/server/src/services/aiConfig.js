// Central place for all AI settings and toggles
// enable/disable features in .env without changing code

export const aiConfig = {
  // Master switch: enable or disable all AI features
  enabled: process.env.ENABLE_AI_AGENT === 'true',

  errorDiagnosisEnabled: process.env.ENABLE_AI_ERROR_DIAGNOSIS === 'true',
  assistantEnabled: process.env.ENABLE_AI_ASSISTANT === 'true',

  // Which Gemini model to use
  model: process.env.AI_MODEL || 'gemini-2.5-flash',

  errorDiagnosisLimitPerMinute: Number(process.env.AI_ERROR_LIMIT_PER_MINUTE || 8),
  assistantLimitPerMinute: Number(process.env.AI_ASSISTANT_LIMIT_PER_MINUTE || 4),

  // Max output tokens per response
  maxOutputTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || 700),
};

// Helper function: log all AI config at startup
export const logAIConfig = () => {
  console.log(`
--------------------------------------------------
               AI SERVICES CONFIG                    
--------------------------------------------------
Master Enabled:        ${aiConfig.enabled ? '✓ YES' : '✗ NO'}
Error Diagnosis:       ${aiConfig.errorDiagnosisEnabled ? '✓ YES' : '✗ NO'} (limit: ${aiConfig.errorDiagnosisLimitPerMinute}/min) Assistant:             ${aiConfig.assistantEnabled ? '✓ YES' : '✗ NO'} (limit: ${aiConfig.assistantLimitPerMinute}/min)
Model:                 ${aiConfig.model}

  `.trim());
};
