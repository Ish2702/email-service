# Email Sending Service

## Overview
This project implements a resilient email sending service using JavaScript. It includes features like retry mechanisms, fallback between providers, idempotency, rate limiting, and status tracking.

## Features
- *Retry Mechanism*: Retries sending emails if the initial attempt fails.
- *Fallback Between Providers*: Automatically switches to a backup provider if the primary one fails.
- *Idempotency*: Ensures that duplicate emails are not sent if the service is retried.
- *Rate Limiting*: Controls the rate at which emails are sent to avoid provider limits.
- *Status Tracking*: Tracks the status of each email sent.

## Bonus Implementations
- *Simple Logging*: Logs key events and errors for monitoring.

## Setup
To set up the project locally:
1. Clone the repository: git clone <repository-url>
2. Install dependencies: npm install
3. Start the service: npm start

## Testing
Run the unit tests using:
```bash
npm test