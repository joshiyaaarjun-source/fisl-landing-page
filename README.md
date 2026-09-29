# Fortune Investment Lead Application v2

Built from the supplied Fortune form specification. The supplied specification calls for a three-stage progressive form, structured JSON, source/UTM tracking, consent, conditional business questions, no sensitive KYC credentials, and an existing n8n webhook architecture. See the supplied specification for the full requirements.

## Run
Node.js 18+:
npm install
npm start

Open http://localhost:3000

## n8n
Set N8N_WEBHOOK_URL to the existing Fortune n8n lead/application webhook. The browser never receives private credentials; the server forwards the structured JSON.

## API
GET /api/health
POST /api/leads
GET /api/leads

## Social links
/apply?source=instagram
/apply?source=facebook
/apply?source=youtube
and standard UTM parameters are captured automatically.

## Important
The local JSON store is for prototype/internal deployment. For production, replace it with an authenticated database and add rate limiting/CAPTCHA as appropriate.
