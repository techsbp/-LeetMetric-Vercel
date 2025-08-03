export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add this new line to prevent caching
  // Add these 3 lines to strongly prevent caching
response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
response.setHeader('Pragma', 'no-cache');
response.setHeader('Expires', '0');

  // Handle preflight requests for CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // ... the rest of your code remains exactly the same ...

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username } = request.body;
    const leetcodeApiUrl = 'https://leetcode.com/graphql/';
    const query = `
      query userSessionProgress($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum { difficulty count submissions }
          }
        }
      }
    `;

    const apiResponse = await fetch(leetcodeApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!apiResponse.ok) {
      throw new Error(`LeetCode API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}

