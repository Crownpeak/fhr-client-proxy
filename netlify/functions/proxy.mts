import type {Context, Handler} from "@netlify/functions";
import fetch from "node-fetch";

// Environment variables for Fredhopper Query API target URL and credentials
const username = process.env.API_USERNAME;
const password = process.env.API_PASSWORD;
const targetHost = process.env.TARGET_HOST;

// Validate environment variables
if (!username || !password || !targetHost) {
    throw new Error(
        "Missing environment variables: API_USERNAME, API_PASSWORD, or TARGET_HOST"
    );
}

const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

export const handler : Handler = async (event, context) => {
    const { httpMethod, queryStringParameters } = event;

    // Ensure only GET requests are allowed
    if (httpMethod !== 'GET') {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ error: "Only GET requests are allowed" }),
        };
    }

    const targetUrl = new URL(targetHost);
    // Passthrough the query params
    if (queryStringParameters) {
        Object.entries(queryStringParameters).forEach(([key, value]) => {
            targetUrl.searchParams.append(key as string, value as string);
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
        // Add caching or custom logic here if required
        const response = await fetch(targetUrl.toString(), options);

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
                // Add additional headers if needed
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