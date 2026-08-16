const BUSINESS_EMAIL = 'bewraped.info@gmail.com';
const BRAND_NAME = 'Bewraped';
const COOLDOWN_SECONDS = 15 * 60;

/**
 * Receives website enquiries and newsletter subscriptions. Deploy this project
 * as a Web App from the bewraped.info@gmail.com account.
 *
 * Security layers: input validation, a honeypot field, length limits, and a
 * per-email cooldown. For high-volume public campaigns, add Turnstile or
 * reCAPTCHA server-side verification before accepting requests.
 */
function doPost(event) {
  try {
    const data = JSON.parse(event && event.postData && event.postData.contents ? event.postData.contents : '{}');
    const name = cleanText_(data.name, 100);
    const contact = cleanText_(data.contact, 100);
    const email = cleanText_(data.email, 254).toLowerCase();
    const website = cleanText_(data.website, 200);
    const enquiryType = cleanText_(data.enquiryType, 100);
    const product = cleanText_(data.product, 120);
    const message = cleanText_(data.message, 1200);
    const isNewsletter = enquiryType === 'newsletter subscription';

    // Normal visitors never see or fill this field. It stops simple bots.
    if (website) throw new Error('Request rejected.');
    if (!isValidEmail_(email)) throw new Error('Please provide a valid email address.');
    if (!isNewsletter && (!name || !contact)) throw new Error('Please provide a name, contact number, and valid email address.');
    if (isRateLimited_(email)) throw new Error('Please wait a few minutes before submitting again.');

    const safeName = name || 'Bewraped friend';
    const source = cleanText_(data.source, 500) || 'Bewraped website';
    const submittedAt = cleanText_(data.submittedAt, 80) || new Date().toISOString();
    const enquiryFor = isNewsletter
      ? 'Newsletter subscription'
      : product
        ? `Shop product: ${product}`
        : enquiryType === 'Contact page enquiry'
          ? 'General contact enquiry'
          : 'General website enquiry';
    const businessMessage = [
      `A new Bewraped enquiry was received.`,
      '',
      `Enquiry for: ${enquiryFor}`,
      `Enquiry type: ${enquiryType || 'General enquiry'}`,
      `Product: ${product || 'Not a product enquiry'}`,
      '',
      `Customer name: ${safeName}`,
      `Customer contact: ${contact || 'Newsletter subscriber'}`,
      `Customer email: ${email}`,
      `Customer message: ${message || 'No additional message was provided.'}`,
      '',
      `Submitted from: ${source}`,
      `Submitted: ${submittedAt}`,
    ].join('\n');

    GmailApp.sendEmail(BUSINESS_EMAIL, `New Bewraped ${isNewsletter ? 'subscription' : product ? `${product} enquiry` : 'contact enquiry'} from ${safeName}`, businessMessage, {
      name: BRAND_NAME,
      replyTo: email,
    });

    const thankYouMessage = isNewsletter ? [
      `Hi ${safeName},`,
      '',
      'You are on the Bewraped list!',
      'We will send you occasional news about fresh flavours, pop-ups, and sweet little perks.',
      '',
      'Warmly,',
      'The Bewraped team',
    ].join('\n') : [
      `Hi ${safeName},`,
      '',
      'Thank you for getting in touch with Bewraped!',
      product ? `We have received your enquiry about the ${product} and will get back to you as soon as possible.` : 'We have received your enquiry and will get back to you as soon as possible.',
      '',
      'Warmly,',
      'The Bewraped team',
    ].join('\n');

    GmailApp.sendEmail(email, isNewsletter ? `Welcome to ${BRAND_NAME}` : `Thank you for contacting ${BRAND_NAME}`, thankYouMessage, {
      name: BRAND_NAME,
      replyTo: BUSINESS_EMAIL,
    });

    setRateLimit_(email);
    return response_({ ok: true });
  } catch (error) {
    console.error(error);
    return response_({ ok: false, error: error.message });
  }
}

function doGet() {
  return response_({ ok: true, service: 'Bewraped contact form' });
}

function isRateLimited_(email) {
  return CacheService.getScriptCache().get(cacheKey_(email)) !== null;
}

function setRateLimit_(email) {
  CacheService.getScriptCache().put(cacheKey_(email), '1', COOLDOWN_SECONDS);
}

function cacheKey_(email) {
  return `bewraped-form:${Utilities.base64EncodeWebSafe(email)}`;
}

function cleanText_(value, limit) {
  return String(value || '').trim().replace(/[\r\n]+/g, ' ').slice(0, limit || 200);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

