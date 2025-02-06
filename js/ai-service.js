// const OPENROUTER_API_KEY = ""; // Replace with your API key
const SITE_URL = window.location.origin;
const SITE_NAME = "Judge0 IDE";

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

function checkRateLimit() {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        throw new Error('Please wait a moment before sending another message');
    }
    lastRequestTime = now;
}

async function getAIResponse(message, code, language) {
    try {
        const systemPrompt = `You are an expert programming assistant specializing in ${language}. 
Your responses should be:
- Clear and concise
- Include code examples when relevant
- Explain complex concepts in simple terms
- Focus on best practices and performance considerations`;

        const userPrompt = `Context:
- Language: ${language}
- Code:
\`\`\`${language}
${code}
\`\`\`

Question: ${message}

Please provide a helpful response that directly addresses the question and references the specific code provided above when relevant.`;

        console.log('Sending request to backend...');

        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userPrompt,
                code,
                language,
                systemPrompt
            })
        });

        const data = await response.json();
        console.log('Response from backend:', data);

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to get AI response');
        }

        if (!data.response) {
            throw new Error('No response content received from AI service');
        }

        return data.response;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
    }
}

// Helper function to format code examples in the response
function formatCodeExample(code, language) {
    return `\`\`\`${language}\n${code}\n\`\`\``;
}

export { getAIResponse }; 