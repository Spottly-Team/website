window.SPOTTLY_FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDibLwVlbGIBs5LYymKNrS-Z7m0t7Ht7vU',
    authDomain: 'sixsevennnn-dk.firebaseapp.com',
    projectId: 'sixsevennnn-dk',
    storageBucket: 'sixsevennnn-dk.firebasestorage.app',
    messagingSenderId: '159481500389',
    appId: '1:159481500389:web:9aa45e611d2178c7e43a0c',
    measurementId: 'G-26X78QB84G'
};

window.SPOTTLY_FIREBASE_COLLECTION = 'shop_orders';

// PayPal: Client ID dell'app Live da https://developer.paypal.com/dashboard/
// L'ordine online viene salvato su Firestore solo dopo capture riuscita.
window.SPOTTLY_PAYPAL_CLIENT_ID = 'ASaJ2EbCjAWDZoF8xzNFKEAe-8aemQ5lpKy9MY33uE3zc-d_XkbZJPqFPBhn4R5Wm8f5avHrhB2NtSX7';

// Importo tessera (14.99 o 14,99 — stesso importo che addebiti)
window.SPOTTLY_TESSERA_PRICE_EUR = '14.99';

// Invio automatico WhatsApp Cloud API al "Segna consegnato" (vedi WHATSAPP_SETUP.md).
// Token e Phone Number ID vanno in functions/.env — NON qui (sicurezza).
window.SPOTTLY_USE_WHATSAPP_API = true;
window.SPOTTLY_FIREBASE_FUNCTIONS_REGION = 'europe-west1';

// Placeholder: {firstName}, {lastName}, {email}
window.SPOTTLY_CARD_SETUP_WHATSAPP_MESSAGE =
    'Ciao {firstName}!\n\n' +
    'La tua tessera Spottly è pronta. Ecco come configurarla:\n\n' +
    '1. Scarica l\'app Spottly (App Store o Google Play)\n' +
    '2. Accedi o registrati con la stessa email dell\'ordine: {email}\n' +
    '3. Vai su Profilo → Tessera e inserisci il codice stampato sulla card\n' +
    '4. Mostra la tessera digitale nei locali partner per usare gli sconti\n\n' +
    'Se qualcosa non funziona, rispondi a questo messaggio.\n\n' +
    '— Team Spottly';
