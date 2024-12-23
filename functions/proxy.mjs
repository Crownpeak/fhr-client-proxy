import fetch from "node-fetch";

// Basic Auth Credentials
const username = process.env.API_USERNAME;
const password = process.env.API_PASSWORD;
const targetHost = process.env.TARGET_HOST;

// Validate environment variables
if (!username || !password || !targetHost) {
  throw new Error(
    "Missing environment variables: API_USERNAME, API_PASSWORD, or TARGET_HOST"
  );
}

// Basic Auth header
const basicAuth =
  "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

export const handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;

   // Ensure only GET requests are allowed
   if (httpMethod !== 'GET') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ error: "Only GET requests are allowed" }),
    };
  }

  // Construct the target URL
  const targetUrl = new URL(targetHost);
  // Add query
  if (queryStringParameters) {
    Object.entries(queryStringParameters).forEach(([key, value]) => {
      targetUrl.searchParams.append(key, value);
    });
  }

  const options = {
    method: httpMethod,
    headers: {
      Authorization: basicAuth,
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(targetUrl.toString(), options);

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(
        `Error fetch from target URL: ${response.status} ${response.statusText}`
      );
    }

    const responseBody = await response.text();

    const responseHeaders = {};
    responseHeaders["Content-Type"] = "application/json";

    return {
      statusCode: response.status,
      headers: {
        ...responseHeaders,
        // You can add more headers if needed
      },
      body: responseBody,
    };
  } catch (error) {
    console.error("Error fetching from target URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from target URL" }),
    };
  }
};
