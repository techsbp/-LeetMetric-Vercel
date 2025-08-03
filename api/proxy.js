export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username } = request.body;

    // The LeetCode API endpoint
    const leetcodeApiUrl = 'https://leetcode.com/graphql/';

    // The GraphQL query
    const query = `
      query userSessionProgress($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    // Fetch data from LeetCode's API
    const apiResponse = await fetch(leetcodeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!apiResponse.ok) {
      throw new Error(`LeetCode API responded with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Send the data back to your frontend
    response.status(200).json(data);

  } catch (error) {
    // Handle any errors
    response.status(500).json({ error: error.message });
  }
}