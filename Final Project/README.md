# node-secret-scanner

A simple **Node.js CLI** that scans files or directories for **hardcoded secrets** using regex.

---

## 🚀 Usage

```bash
node src/index.js ./path/to/scan -v
node src/index.js ./file.txt -r json -o findings.json
```

**Flags:**
`-o` output file | `-r` report format (`text`/`json`) | `-e` exclude dirs | `-v` verbose

---

## 🔍 Patterns Used

```js
const patterns = [
  { name: 'AWS Access Key ID', regex: /\b(A3T[A-Z0-9]|AKIA|ASIA|AGPA|AIDA|AROA|AIPA)[A-Z0-9]{16}\b/g },
  { name: 'AWS Secret Access Key', regex: /\b([A-Za-z0-9\/+=]{40})\b/g },
  { name: 'Generic API Key (Google etc.)', regex: /\bAIza[0-9A-Za-z-_]{35}\b/g },
  { name: 'Slack Token', regex: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { name: 'JWT', regex: /\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b/g }
]
```

---

## 🧪 Quick Test

Create a file `demo/test.js`:

```js
const AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE'

const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'

const GOOGLE_API_KEY = 'AIzaSyA8WkD0ExampleFakeKey1234567890abCDEFG'

const JWT_SIGNATURE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiamRvZyJ9.signatureExample123'

const SLACK_TOKEN = 'xoxb-123456789012-987654321098-ABcDeFGhIjKlMnOpQrSt'
```

Then run:

```bash
node src/index.js ./src/demo -v
```

Expected: 5 matches (one per pattern).

---

## ⚠️ Notes

* Regex-based → possible **false positives**.
* Always verify and **rotate real secrets**.
* Output saved to `secret-scan.log` and optionally JSON.