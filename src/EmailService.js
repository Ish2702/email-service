const crypto = require('crypto');

class EmailService {
  constructor(firstProvider, secondProvider) {
    this.providers = [firstProvider, secondProvider];
    this.currentProviderIndex = 0;
    this.sentMessages = new Set();
    this.maxRate = 100;
    this.rateWindow = 60000;
    this.sentCount = 0;
    this.windowStart = Date.now();
  }
//simple logging system
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  async sendEmail(to, subject, body, retries = 3) {
    const messageId = this.generateMessageId(to, subject, body);

    if (this.sentMessages.has(messageId)) {
      this.log(`Duplicate email detected: ${messageId}`);
      return { status: 'duplicate', message: 'Email already sent' };
    }
//rate limit
    if (!this.checkRateLimit()) {
      this.log(`Rate limit exceeded. Current count: ${this.sentCount}`);
      return { status: 'rate_limited', message: 'Rate limit exceeded' };
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const currentProvider = this.providers[this.currentProviderIndex];
        this.log(`Attempting to send email via ${currentProvider.name}. Attempt ${attempt + 1}/${retries}`);
        const result = await currentProvider.send(to, subject, body);
        this.sentMessages.add(messageId);
        this.log(`Email sent successfully: ${messageId}`);
        return { status: 'success', message: result };
      } catch (error) {
        this.log(`Attempt ${attempt + 1} failed: ${error.message}`);
        this.switchProvider();
        await this.backoff(attempt);
      }
    }

    this.log(`All attempts exhausted for email: ${messageId}`);
    return { status: 'failure', message: 'All attempts exhausted' };
  }

  switchProvider() {
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
    this.log(`Switched to provider: ${this.providers[this.currentProviderIndex].name}`);
  }

  generateMessageId(to, subject, body) {
    return crypto.createHash('md5').update(`${to}${subject}${body}`).digest('hex');
  }
//fallback
  async backoff(attempt) {
    const delay = Math.min(100 * Math.pow(2, attempt), 5000);
    this.log(`Backing off for ${delay}ms before next attempt`);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  checkRateLimit() {
    const now = Date.now();
    if (now - this.windowStart > this.rateWindow) {
      this.sentCount = 0;
      this.windowStart = now;
      this.log('Rate limit window reset');
    }

    if (this.sentCount >= this.maxRate) {
      return false;
    }

    this.sentCount++;
    return true;
  }
}

module.exports = EmailService; 