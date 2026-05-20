# WhatsApp automatico su "Segna consegnato"

Quando clicchi **Segna consegnato** in `admin.html`, il backend invia il messaggio al cliente tramite **WhatsApp Cloud API** (Meta). Non devi aprire WhatsApp né premere Invia.

## 1. Meta / WhatsApp Business

1. Vai su [Meta for Developers](https://developers.facebook.com/) e crea un'app (tipo Business).
2. Aggiungi il prodotto **WhatsApp** → **API Setup**.
3. Annota:
   - **Phone number ID** (non il numero visualizzato, ma l'ID numerico lungo)
   - **Temporary access token** (per test) oppure genera un **token permanente** (System User + permessi `whatsapp_business_messaging`)

## 2. Template messaggio (consigliato)

Per messaggi **avviati da te** (cliente che non ti ha scritto nelle ultime 24h), Meta richiede un **template approvato**.

1. In **WhatsApp Manager** → Message templates → Crea template in italiano, es. nome `spottly_card_setup`.
2. Corpo esempio (2 variabili):

   ```
   Ciao {{1}}! La tua tessera Spottly è pronta.
   Configurala nell'app con l'email {{2}}: Profilo → Tessera → codice sulla card.
   ```

3. Quando è **Approved**, imposta in `functions/.env`:

   ```
   WHATSAPP_TEMPLATE_NAME=spottly_card_setup
   WHATSAPP_TEMPLATE_LANGUAGE=it
   ```

Se non usi un template, il sistema prova un messaggio di testo libero (funziona solo se il cliente è nella finestra conversazione 24h).

## 3. Configura Firebase Functions

```bash
cd functions
cp .env.example .env
# Modifica .env con token e phone number id
npm install
cd ..
```

In `functions/.env` (non committare — è in `.gitignore`):

```
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_TEMPLATE_NAME=spottly_card_setup
WHATSAPP_TEMPLATE_LANGUAGE=it
ADMIN_EMAILS=tua-email@dominio.it
```

## 4. Deploy

```bash
firebase deploy --only functions,firestore:rules
```

Regione funzione: **europe-west1** (già impostata in codice e in `shop-config.js`).

## 5. Admin

In `shop-config.js` lascia `SPOTTLY_USE_WHATSAPP_API = true`.  
Personalizza il testo in `SPOTTLY_CARD_SETUP_WHATSAPP_MESSAGE` (usato se non hai template; con template le variabili {{1}} e {{2}} sono nome e email).

## Errori comuni

| Errore Meta | Cosa fare |
|-------------|-----------|
| Template name does not exist | Nome template diverso da quello in `.env` |
| (#131030) Recipient phone number not in allowed list | In modalità test aggiungi il numero del cliente nella lista test di Meta |
| Message failed to send because more than 24 hours | Usa un template approvato |
| Invalid OAuth access token | Rigenera il token e aggiorna secret / `.env` |
