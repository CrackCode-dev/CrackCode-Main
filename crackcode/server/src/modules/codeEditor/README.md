# Code Editor Module - Judge0 Integration

## Overview

The Code Editor module provides a backend service for executing user code using the Judge0 API. This integration separates the Judge0 API key from the frontend, improving security by keeping sensitive credentials on the backend.

## Architecture

```
Frontend (Monaco Editor)
    ↓
    └→ Call /api/codeEditor/execute
         ↓
    Backend (Code Editor Module)
         ↓
         └→ Call Judge0 API (via axios)
              ↓
         Return Results
```

## Backend Files

### 1. `codeEditor.service.js`
Handles all Judge0 API communications:
- **`submitCodeToJudge0()`** - Submits code to Judge0 for execution
- **`runTestCases()`** - Runs multiple test cases and returns results
- **`executeCode()`** - Executes code with a single input
- **`getLanguageId()`** - Maps language names to Judge0 language IDs

**Supported Languages:**
- Python (ID: 71)
- JavaScript (ID: 63)
- C++ (ID: 54)
- Java (ID: 62)
- C (ID: 50)

### 2. `codeEditor.controller.js`
Handles HTTP requests:
- **`executeTestCases`** - POST `/api/codeEditor/execute`
  - Validates input and calls service
  - Returns formatted test results
  
- **`runCode`** - POST `/api/codeEditor/run`
  - Executes code with custom input
  - Used for debugging
  
- **`getSupportedLanguages`** - GET `/api/codeEditor/languages`
  - Returns supported programming languages

### 3. `routes.js`
Defines API endpoints:
```
POST   /api/codeEditor/execute    - Run test cases
POST   /api/codeEditor/run        - Run code with input
GET    /api/codeEditor/languages  - Get supported languages
```

## API Endpoints

### Execute Test Cases
**POST** `/api/codeEditor/execute`

**Request Body:**
```json
{
  "sourceCode": "print('Hello, World!')",
  "language": "python",
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected output",
      "setup": "optional setup code"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "testNumber": 1,
        "status": "passed",
        "message": "Test Case 1 Passed",
        "input": "test input",
        "expected": "expected output",
        "actual": "expected output",
        "time": 0.02,
        "memory": 1240
      }
    ],
    "summary": {
      "total": 1,
      "passed": 1,
      "failed": 0
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message"
}
```

### Run Code with Input
**POST** `/api/codeEditor/run`

**Request Body:**
```json
{
  "sourceCode": "code here",
  "language": "python",
  "input": "input here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stdout": "output",
    "stderr": "error output",
    "compile_output": "compilation error",
    "time": 0.02,
    "memory": 1240,
    "status_id": 3,
    "status": "accepted"
  }
}
```

## Frontend Integration

### Updated Files

#### 1. `judge0Service.js`
Updated to call the backend API instead of Judge0 directly:
```javascript
export const submitCodeToJudge0 = async (code, language, testCases) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/codeEditor/execute`,
    { sourceCode: code, language, testCases }
  );
  return response.data.data;
};
```

#### 2. `useCodeExecution.js`
Updated hook to handle batch test case execution:
- Calls backend with all test cases at once
- Transforms response to frontend format
- Shows detective messages based on results

## Environment Setup

### Backend (.env)

Add the Judge0 API key:
```env
JUDGE0_API_KEY=your_rapidapi_key_here
```

**Get your API Key:**
1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Sign up / Log in
3. Copy your X-RapidAPI-Key from the dashboard
4. Add it to your `.env` file

### Frontend (.env)

Ensure the backend URL is configured:
```env
VITE_BACKEND_URL=http://localhost:5050
```

## Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd crackcode
npm install
```

This will install axios and all other dependencies.

**Frontend:**
```bash
cd crackcode/client
npm install
```

### 2. Configure Environment Variables

Add `JUDGE0_API_KEY` to `crackcode/server/.env`

### 3. Start Backend

```bash
cd crackcode
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on: `http://localhost:5050`

### 4. Start Frontend

```bash
cd crackcode/client
npm run dev
```

The frontend will run on: `http://localhost:5173`

## How It Works

### Test Case Execution Flow

1. **User writes code** in Monaco editor (frontend)
2. **User clicks "Execute"** button
3. **Frontend sends request** to backend with:
   - Source code
   - Programming language
   - Array of test cases (input + expected output)

4. **Backend service** receives request and:
   - Validates inputs
   - Iterates through each test case
   - Calls Judge0 API for each test case
   - Compares output with expected output
   - Returns formatted results

5. **Frontend receives results** and:
   - Displays each test case result
   - Shows pass/fail status
   - Displays execution time and memory
   - Shows error messages if any

### Error Handling

The service handles various error scenarios:
- **Compilation errors** - Returns compile_output
- **Runtime errors** - Returns stderr
- **Wrong output** - Compares stderr with expectedOutput
- **API errors** - Catches and formats errors
- **Timeout** - 30-second timeout for code execution

## Code Structure

```
crackcode/
├── server/
│   └── src/
│       └── modules/
│           └── codeEditor/
│               ├── codeEditor.service.js    # Judge0 API logic
│               ├── codeEditor.controller.js # HTTP handlers
│               └── routes.js                # Route definitions
├── client/
│   └── src/
│       ├── services/
│       │   └── api/
│       │       └── judge0Service.js         # Backend API calls
│       └── features/
│           └── codeEditor/
│               └── hooks/
│                   └── useCodeExecution.js  # Execution logic
└── package.json                             # Dependencies
```

## Testing

### Test the Backend Directly (using cURL or Postman)

```bash
curl -X POST http://localhost:5050/api/codeEditor/execute \
  -H "Content-Type: application/json" \
  -d '{
    "sourceCode": "print(\"Hello\")",
    "language": "python",
    "testCases": [
      {
        "input": "",
        "expectedOutput": "Hello"
      }
    ]
  }'
```

### Test Languages Endpoint

```bash
curl http://localhost:5050/api/codeEditor/languages
```

## Performance Considerations

- **Timeout**: 30 seconds for individual submissions, 60 seconds for all test cases
- **Parallel Execution**: Test cases are executed sequentially to avoid rate limiting
- **Memory**: Results are returned immediately after execution completes
- **Rate Limiting**: Judge0 has rate limits on RapidAPI - monitor your plan

## Security Notes

✅ **Improved:**
- Judge0 API key is stored on backend (not exposed in frontend)
- API communications are secure
- Input validation on backend

⚠️ **To Consider:**
- Add rate limiting to prevent abuse
- Validate code execution timeouts
- Monitor API usage against your RapidAPI plan

## Troubleshooting

### "Failed to execute code" Error

1. **Check backend is running:**
   ```bash
   curl http://localhost:5050/api/health
   ```

2. **Verify JUDGE0_API_KEY is set:**
   ```bash
   echo $JUDGE0_API_KEY  # Linux/Mac
   echo %JUDGE0_API_KEY% # Windows
   ```

3. **Check network connectivity:**
   - Frontend can reach backend on correct port
   - Backend can reach judge0-ce.p.rapidapi.com

### Judge0 Not Responding

1. Check if API key is valid
2. Check if RapidAPI subscription is active
3. Check if you've exceeded rate limits
4. Verify internet connection

### Monaco Editor Not Working

1. Ensure `@monaco-editor/react` is installed
2. Check browser console for errors
3. Verify language prop is set correctly

## Future Enhancements

- [ ] Add caching of test results
- [ ] Implement result history/persistence
- [ ] Add debugging capabilities (breakpoints, step-through)
- [ ] Support more programming languages
- [ ] Add code profiling information
- [ ] Implement concurrent test execution with rate limiting
- [ ] Add WebSocket support for real-time execution updates

## References

- [Judge0 API Documentation](https://rapidapi.com/judge0-official/api/judge0-ce)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)
