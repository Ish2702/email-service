const EmailService = require('../src/EmailService');
const Provider1 = require('../src/Provider1');
const Provider2 = require('../src/Provider2');

async function Tests() {
    const provider1 = new Provider1('Provider1', 0.3);
    const provider2 = new Provider2('Provider2', 0.3);
    const emailService = new EmailService(provider1, provider2);

    const testCases = [
        { name: 'Basic Send', to: 'user1@example.com', subject: 'Test 1', body: 'Hello World' },
        { name: 'Duplicate Send', to: 'user1@example.com', subject: 'Test 1', body: 'Hello World' },
        { name: 'Different Email', to: 'user2@example.com', subject: 'Test 2', body: 'Testing Service' },
    ];

    for (const test of testCases) {
        console.log(`\nRunning test: ${test.name}`);
        const result = await emailService.sendEmail(test.to, test.subject, test.body);
        console.log('Result:', result);
    }

    // Rate limit test
    console.log('\nTesting rate limit:');
    for (let i = 0; i < 110; i++) {
        const result = await emailService.sendEmail('ratelimit@example.com', 'Rate Test', 'Body');
        if (i % 25 === 0 || result.status === 'rate_limited') {
            console.log(`Attempt ${i + 1}:`, result);
        }
    }
}

Tests().catch(console.error);