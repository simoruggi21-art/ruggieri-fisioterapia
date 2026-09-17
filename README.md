# ruggierifisio.it

Sito web di Simone Ruggieri, fisioterapista — [ruggierifisio.it](https://ruggierifisio.it).

Sito statico (HTML/CSS/JS puro, nessun build step) con backend [Supabase](https://supabase.com)
(database, autenticazione, storage, edge functions) e hosting su [Netlify](https://netlify.com).

## Struttura

- `index.html` — sito pubblico (presentazione, servizi, blog, FAQ)
- `app.html` — area riservata (login, agenda, messaggi, pazienti, gestionale)
- `blog-post.html` — pagina di un singolo articolo del blog
- `privacy.html` — informativa privacy
- `js/` — moduli JS (uno per funzionalità: agenda, chat, blog, pazienti, ecc.)
- `css/styles.css` — stile del sito
- `sql/schema.sql` — schema del database, tenuto sincronizzato con il progetto Supabase

## Sviluppo locale

Il sito non richiede build: basta servire la cartella con un qualsiasi server statico
(vedi `.claude/launch.json`) e configurare `js/config.js` con URL e chiave anonima del
proprio progetto Supabase.

## Deploy

Il deploy in produzione avviene su Netlify tramite l'API dei deploy diretti (zip upload),
escludendo `sql/` e `docs/` dal pacchetto pubblicato.
