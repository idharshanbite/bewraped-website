const BUSINESS_EMAIL = 'bewraped.info@gmail.com';
const BRAND_NAME = 'Bewraped';
const ENQUIRIES_SHEET_ID = '1sY6xe2dHkiBJglpzjBpRziYyXwE7qbnBfAXxXgJ4_3A';
const ENQUIRIES_SHEET_NAME = 'Enquiries';
const SRI_LANKA_TIME_ZONE = 'Asia/Colombo';
const COOLDOWN_SECONDS = 90;

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
    const message = cleanMessage_(data.message, 1200);
    const isNewsletter = enquiryType === 'newsletter subscription';

    // Normal visitors never see or fill this field. It stops simple bots.
    if (website) throw new Error('Request rejected.');
    if (!isValidEmail_(email)) throw new Error('Please provide a valid email address.');
    if (!isNewsletter && (!name || !contact)) throw new Error('Please provide a name, contact number, and valid email address.');
    const rateLimitContext = product || enquiryType || 'general';
    if (isRateLimited_(email, rateLimitContext)) throw new Error('Please wait a moment before submitting the same enquiry again.');

    const safeName = name || 'Bewraped friend';
    const receivedAt = new Date();
    const receivedAtText = formatReceivedAt_(receivedAt);
    const enquiryFor = isNewsletter
      ? 'Newsletter subscription'
      : product
        ? `Shop product: ${product}`
        : enquiryType === 'Contact page enquiry'
          ? 'General contact enquiry'
          : 'General website enquiry';
    const requestedItem = product || (isNewsletter ? 'Newsletter subscription' : 'General enquiry');
    const businessMessage = [
      `A new Bewraped enquiry was received.`,
      '',
      `Requested item: ${requestedItem}`,
      `Enquiry type: ${enquiryType || 'General enquiry'}`,
      '',
      `Customer name: ${safeName}`,
      `Customer contact: ${contact || 'Newsletter subscriber'}`,
      `Customer email: ${email}`,
      `Customer message: ${message || 'No additional message was provided.'}`,
      '',
      `Received at: ${receivedAtText}`,
    ].join('\n');

    GmailApp.sendEmail(BUSINESS_EMAIL, `New Bewraped ${isNewsletter ? 'subscription' : product ? `${product} enquiry` : 'contact enquiry'} from ${safeName}`, businessMessage, {
      name: BRAND_NAME,
      replyTo: email,
      htmlBody: buildBusinessEmail_({
        name: safeName,
        email,
        contact,
        message,
        enquiryFor,
        enquiryType,
        requestedItem,
        receivedAtText,
        isNewsletter,
      }),
    });

    appendEnquiryToSheet_({
      receivedAt,
      enquiryType: enquiryType || 'General enquiry',
      requestedItem,
      name: safeName,
      email,
      contact: contact || 'Newsletter subscriber',
      message: message || 'No additional message was provided.',
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

    setRateLimit_(email, rateLimitContext);
    return response_({ ok: true });
  } catch (error) {
    console.error(error);
    return response_({ ok: false, error: error.message });
  }
}

function doGet() {
  return response_({ ok: true, service: 'Bewraped contact form' });
}

function isRateLimited_(email, context) {
  return CacheService.getScriptCache().get(cacheKey_(email, context)) !== null;
}

function setRateLimit_(email, context) {
  CacheService.getScriptCache().put(cacheKey_(email, context), '1', COOLDOWN_SECONDS);
}

function cacheKey_(email, context) {
  return `bewraped-form:v2:${Utilities.base64EncodeWebSafe(`${email}:${context}`)}`;
}

function cleanText_(value, limit) {
  return String(value || '').trim().replace(/[\r\n]+/g, ' ').slice(0, limit || 200);
}

function cleanMessage_(value, limit) {
  return String(value || '')
    .trim()
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, limit || 1200);
}

function buildBusinessEmail_(details) {
  const email = escapeHtml_(details.email);
  const phone = escapeHtml_(details.contact || 'Not provided');
  const message = escapeHtml_(details.message || 'No additional message was provided.').replace(/\n/g, '<br>');
  const phoneRow = details.isNewsletter ? '' : fieldRow_('Phone', phone);

  return `
    <div style="margin:0;padding:32px 16px;background:#F1EADC;font-family:Arial,Helvetica,sans-serif;color:#171717;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E3DACA;">
        <tr>
          <td style="padding:26px 32px;background:#C8102E;color:#FFFFFF;">
            <div style="font-size:11px;font-weight:700;letter-spacing:1.8px;line-height:1.2;">BEWRAPED</div>
            <div style="margin-top:8px;font-size:24px;font-weight:700;line-height:1.25;">New website enquiry</div>
          </td>
        </tr>
        <tr>
          <td style="padding:30px 32px 8px;">
            <div style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8102E;">Customer details</div>
            <div style="margin-top:14px;">
              ${fieldRow_('Name', escapeHtml_(details.name))}
              ${fieldRow_('Email', `<a href="mailto:${escapeAttribute_(details.email)}" style="color:#C8102E;text-decoration:underline;">${email}</a>`)}
              ${phoneRow}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8102E;">Message</div>
            <div style="margin-top:12px;padding:18px;background:#F1EADC;border-left:4px solid #C8102E;font-size:15px;line-height:1.65;">${message}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 30px;">
            <div style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8102E;">Enquiry details</div>
            <div style="margin-top:14px;">
              ${fieldRow_('Requested item', escapeHtml_(details.requestedItem))}
              ${fieldRow_('Enquiry type', escapeHtml_(details.enquiryType || 'General enquiry'))}
              ${fieldRow_('Received at', escapeHtml_(details.receivedAtText), true)}
            </div>
            <div style="margin-top:24px;">
              <a href="mailto:${escapeAttribute_(details.email)}" style="display:inline-block;padding:12px 18px;background:#C8102E;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;">Reply to customer</a>
            </div>
          </td>
        </tr>
      </table>
      <div style="max-width:640px;margin:14px auto 0;font-size:11px;line-height:1.5;color:#766F65;text-align:center;">Sent from the Bewraped website contact form.</div>
    </div>`;
}

function fieldRow_(label, value, isLast) {
  return `<div style="padding:14px 0;${isLast ? '' : 'border-bottom:1px solid #E7E1D8;'}"><div style="margin-bottom:5px;font-size:12px;font-weight:700;color:#3B3732;">${label}</div><div style="font-size:15px;line-height:1.45;color:#171717;">${value}</div></div>`;
}

function appendEnquiryToSheet_(details) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const spreadsheet = SpreadsheetApp.openById(ENQUIRIES_SHEET_ID);
    const sheet = spreadsheet.getSheetByName(ENQUIRIES_SHEET_NAME);
    if (!sheet) throw new Error(`Could not find the \"${ENQUIRIES_SHEET_NAME}\" sheet.`);

    sheet.appendRow([
      details.receivedAt,
      details.enquiryType,
      details.requestedItem,
      details.name,
      details.email,
      details.contact,
      details.message,
    ]);

    const row = sheet.getLastRow();
    const entryRange = sheet.getRange(row, 1, 1, 7);
    sheet.getRange(row, 1).setNumberFormat('yyyy-mm-dd HH:mm:ss');
    entryRange.setVerticalAlignment('top').setWrap(true);
  } finally {
    lock.releaseLock();
  }
}

function formatReceivedAt_(date) {
  return Utilities.formatDate(date, SRI_LANKA_TIME_ZONE, 'EEE, d MMM yyyy, h:mm:ss a z');
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function(character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}

function escapeAttribute_(value) {
  return escapeHtml_(value);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

