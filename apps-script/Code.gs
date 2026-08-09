const BUSINESS_EMAIL = 'bewraped.info@gmail.com';
const BRAND_NAME = 'Bewraped';

/**
 * Receives website enquiries and sends both the business notification and
 * customer thank-you email. Deploy this project as a Web App from the
 * bewraped.info@gmail.com account.
 */
function doPost(event) {
  try {
    const data = JSON.parse(event.postData && event.postData.contents ? event.postData.contents : '{}');
    const name = cleanText_(data.name);
    const contact = cleanText_(data.contact);
    const email = cleanText_(data.email).toLowerCase();

    if (!name || !contact || !isValidEmail_(email)) {
      throw new Error('Please provide a name, contact number, and valid email address.');
    }

    const source = cleanText_(data.source) || 'Bewraped website';
    const submittedAt = cleanText_(data.submittedAt) || new Date().toISOString();
    const enquiryMessage = [
      'A new website enquiry was received.',
      '',
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Email: ${email}`,
      `Page: ${source}`,
      `Submitted: ${submittedAt}`,
    ].join('\n');

    GmailApp.sendEmail(BUSINESS_EMAIL, `New Bewraped enquiry from ${name}`, enquiryMessage, {
      name: BRAND_NAME,
      replyTo: email,
    });

    const thankYouMessage = [
      `Hi ${name},`,
      '',
      'Thank you for getting in touch with Bewraped!',
      'We have received your details and will get back to you as soon as possible.',
      '',
      'Warmly,',
      'The Bewraped team',
    ].join('\n');

    GmailApp.sendEmail(email, `Thank you for contacting ${BRAND_NAME}`, thankYouMessage, {
      name: BRAND_NAME,
      replyTo: BUSINESS_EMAIL,
    });

    return response_({ ok: true });
  } catch (error) {
    console.error(error);
    return response_({ ok: false, error: error.message });
  }
}

function doGet() {
  return response_({ ok: true, service: 'Bewraped contact form' });
}

function cleanText_(value) {
  return String(value || '').trim().replace(/[\r\n]+/g, ' ');
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

