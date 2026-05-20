const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineString } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

const whatsappAccessToken = defineString('WHATSAPP_ACCESS_TOKEN');
const whatsappPhoneNumberId = defineString('WHATSAPP_PHONE_NUMBER_ID');
const whatsappTemplateName = defineString('WHATSAPP_TEMPLATE_NAME', { default: '' });
const whatsappTemplateLanguage = defineString('WHATSAPP_TEMPLATE_LANGUAGE', { default: 'it' });
const adminEmails = defineString('ADMIN_EMAILS', { default: '' });
const shopOrdersCollection = defineString('SHOP_ORDERS_COLLECTION', { default: 'shop_orders' });

const DEFAULT_SETUP_MESSAGE =
    'Ciao {firstName}!\n\n' +
    'La tua tessera Spottly è pronta. Ecco come configurarla:\n\n' +
    '1. Scarica l\'app Spottly (App Store o Google Play)\n' +
    '2. Accedi o registrati con la stessa email dell\'ordine: {email}\n' +
    '3. Vai su Profilo → Tessera e inserisci il codice stampato sulla card\n' +
    '4. Mostra la tessera digitale nei locali partner per usare gli sconti\n\n' +
    'Se qualcosa non funziona, rispondi a questo messaggio.\n\n' +
    '— Team Spottly';

function normalizePhone(phone) {
    return String(phone || '').replace(/[^\d+]/g, '').replace(/^\+/, '');
}

function buildSetupMessage(order, template) {
    const source = String(template || DEFAULT_SETUP_MESSAGE).trim();

    return source
        .replace(/\{firstName\}/g, order.firstName || '')
        .replace(/\{lastName\}/g, order.lastName || '')
        .replace(/\{email\}/g, order.email || '');
}

function assertAdminAccess(auth) {
    if (!auth || !auth.token || !auth.token.email) {
        throw new HttpsError('unauthenticated', 'Accedi con Firebase per usare l\'admin.');
    }

    const allowed = adminEmails.value().split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);

    if (allowed.length && !allowed.includes(auth.token.email.toLowerCase())) {
        throw new HttpsError('permission-denied', 'Account non autorizzato per l\'admin ordini.');
    }
}

async function sendWhatsappMessage({ to, body, firstName, email, accessToken }) {
    const phoneNumberId = whatsappPhoneNumberId.value().trim();
    const token = accessToken.trim();
    const templateName = whatsappTemplateName.value().trim();

    if (!phoneNumberId || !token) {
        throw new HttpsError(
            'failed-precondition',
            'Configura WHATSAPP_ACCESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID (functions/.env o Firebase Secrets).'
        );
    }

    const recipient = normalizePhone(to);

    if (!recipient) {
        throw new HttpsError('invalid-argument', 'Telefono cliente mancante o non valido.');
    }

    const graphUrl = 'https://graph.facebook.com/v21.0/' + phoneNumberId + '/messages';
    const headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    let payload;

    if (templateName) {
        payload = {
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'template',
            template: {
                name: templateName,
                language: { code: whatsappTemplateLanguage.value().trim() || 'it' },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            { type: 'text', text: firstName || 'Cliente' },
                            { type: 'text', text: email || '-' }
                        ]
                    }
                ]
            }
        };
    } else {
        payload = {
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'text',
            text: { body }
        };
    }

    const response = await fetch(graphUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        const apiMessage = result && result.error && result.error.message
            ? result.error.message
            : 'Invio WhatsApp non riuscito.';

        throw new HttpsError('internal', apiMessage);
    }

    return result;
}

exports.markOrderDeliveredAndNotify = onCall(
    { region: 'europe-west1' },
    async (request) => {
        assertAdminAccess(request.auth);

        const orderId = String((request.data && request.data.orderId) || '').trim();

        if (!orderId) {
            throw new HttpsError('invalid-argument', 'orderId mancante.');
        }

        const db = admin.firestore();
        const collectionName = shopOrdersCollection.value().trim() || 'shop_orders';
        const orderRef = db.collection(collectionName).doc(orderId);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            throw new HttpsError('not-found', 'Ordine non trovato.');
        }

        const order = orderSnap.data();

        if (order.delivered === true) {
            throw new HttpsError('already-exists', 'Ordine già segnato come consegnato.');
        }

        const messageTemplate = request.data && request.data.messageTemplate;
        const messageBody = buildSetupMessage(order, messageTemplate);
        const accessToken = whatsappAccessToken.value();

        const whatsappResult = await sendWhatsappMessage({
            to: order.phone,
            body: messageBody,
            firstName: order.firstName,
            email: order.email,
            accessToken
        });

        await orderRef.update({
            delivered: true,
            deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
            whatsappSetupSentAt: admin.firestore.FieldValue.serverTimestamp(),
            whatsappSetupMessageId: whatsappResult.messages && whatsappResult.messages[0]
                ? whatsappResult.messages[0].id
                : null
        });

        return {
            ok: true,
            whatsappMessageId: whatsappResult.messages && whatsappResult.messages[0]
                ? whatsappResult.messages[0].id
                : null
        };
    }
);
