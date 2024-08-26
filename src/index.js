const EmailService = require('./EmailService');
const Provider1 = require('./Provider1');
const Provider2 = require('./Provider2');

const provider1 = new Provider1('Provider1', 0.7);
const provider2 = new Provider2('Provider2', 0.7);
const emailService = new EmailService(provider1, provider2);

const email = {
    to: 'user@example.com',
    subject: 'Email Service',
    body: 'This is email-service based'
};

async function sendEmail() {
    try {
        const res = await emailService.sendEmail(email.to, email.subject, email.body);
        console.log('Email sending:', res);
    } catch (err) {
        console.error('Email sending error:', err);
    }
}

sendEmail();