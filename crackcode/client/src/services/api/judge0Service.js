export const submitCodeToJudge0 = async (code, language, input) => {
  // For UI testing, we simulate a successful Python execution
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stdout: "Found at index 2\n",
        time: "0.02",
        memory: "1240",
        stderr: null,
        compile_output: null
      });
    }, 1500);
  });
};