export default async function handler(request, response) {
  // Set headers to prevent caching and allow CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username } = request.body;

    console.log(`Server received request for username: ${username}`);

    const leetcodeApiUrl = 'https://leetcode.com/graphql/';

    // --- THIS IS THE CORRECTED QUERY ---
    // We have added totalSubmissionNum to the submitStats section.
    const query = `
      query userSessionProgress($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum { difficulty count submissions }
            totalSubmissionNum { difficulty count submissions }
          }
        }
      }
    `;
    
    console.log(`Fetching data from LeetCode for: ${username}`);

    const apiResponse = await fetch(leetcodeApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!apiResponse.ok) {
      throw new Error(`LeetCode API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    console.log('Data received from LeetCode:', JSON.stringify(data, null, 2));

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}


