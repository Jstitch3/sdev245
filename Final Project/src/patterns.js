const patterns = [
    {
        name: 'AWS Access Key ID',
        regex: /\b(A3T[A-Z0-9]|AKIA|ASIA|AGPA|AIDA|AROA|AIPA)[A-Z0-9]{16}\b/g,
        note: 'AWS-style Access Key ID'
    },
    {
        name: 'AWS Secret Access Key',
        regex: /(?<![A-Za-z0-9\/+=])[A-Za-z0-9\/+=]{40}(?![A-Za-z0-9\/+=])/g,
        note: 'Potential AWS Secret'
    },
    {
        name: 'Generic API Key',
        regex: /AIza[0-9A-Za-z\-_]{20,100}/g,
        note: 'Google API Key'
    },
    {
        name: 'Slack Token',
        regex: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g,
        note: 'Slack Token'
    },
    {
        name: 'JWT',
        regex: /\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b/g,
        note: 'Likely a JWT'
    }
]

export { patterns }