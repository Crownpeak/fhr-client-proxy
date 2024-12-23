# Netlify Fredhopper Proxy Example

This repository contains a Netlify function that acts as a proxy, forwarding requests to a specified Fredhopper target URL while adding Basic Authentication.

## Function Overview

The proxy function captures incoming requests and appends Basic Authentication credentials to the request headers. It then forwards the request to a specified Fredhopper target host and returns the response back to the client.

### Functionality

- **Basic Authentication**: The function uses Basic Auth credentials stored in environment variables.
- **Forwarding Requests**: It forwards requests to a specified target URL.
- **Response Handling**: The function returns the response from the target URL, excluding sensitive headers.

## Environment Variables

To run this function locally or deploy it on Netlify, you need to set the following environment variables:

| Variable       | Description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `API_USERNAME` | The username for Basic Authentication.                                                          |
| `API_PASSWORD` | The password for Basic Authentication.                                                          |
| `TARGET_HOST`  | The base URL of the target API you want to proxy requests to (e.g., `https://api.example.com`). |
