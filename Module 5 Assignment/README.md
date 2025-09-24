## 🔐 1. Broken Access Control

**Vulnerable**

```js
app.get('/profile/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) return res.status(500).send(err);
        res.json(user);
    });
});
```

**Flaw**: No authorization check → IDOR.

**Fixed**

```js
app.get('/profile/:userId', (req, res) => {
    const authUserId = req.user.id;
    if (req.params.userId !== authUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    User.findById(authUserId, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    });
});
```

**Why secure?**: Enforces user ownership, prevents IDOR.

---

## 🔐 2. Broken Access Control

**Vulnerable**

```python
@app.route('/account/<user_id>')
def get_account(user_id):
    user = db.query(User).filter_by(id=user_id).first()
    return jsonify(user.to_dict())
```

**Flaw**: Anyone can change `<user_id>` to access others’ accounts.

**Fixed**

```python
@app.route('/account/<user_id>')
def get_account(user_id):
    if str(current_user.id) != str(user_id):
        return jsonify({"error": "Forbidden"}), 403
    user = db.query(User).filter_by(id=current_user.id).first()
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user.to_dict())
```

**Why secure?**: Ties request to logged-in user only.

---

## 🔑 3. Cryptographic Failures

**Vulnerable**

```java
MessageDigest md = MessageDigest.getInstance("MD5");
md.update(password.getBytes());
return DatatypeConverter.printHexBinary(md.digest());
```

**Flaw**: Uses weak MD5 without salt.

**Fixed**

```java
import org.mindrot.jbcrypt.BCrypt;

String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
boolean ok = BCrypt.checkpw(password, hash);
```

**Why secure?**: BCrypt = salted + iterated, strong against brute force.

---

## 🔑 4. Cryptographic Failures

**Vulnerable**

```python
import hashlib
def hash_password(password):
    return hashlib.sha1(password.encode()).hexdigest()
```

**Flaw**: Uses SHA-1, broken for passwords.

**Fixed**

```python
import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
```

**Why secure?**: bcrypt adds salt + multiple rounds.

---

## 🧨 5. Injection

**Vulnerable**

```java
String query = "SELECT * FROM users WHERE username = '" + username + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(query);
```

**Flaw**: SQL injection via concatenation.

**Fixed**

```java
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement ps = connection.prepareStatement(sql);
ps.setString(1, username);
ResultSet rs = ps.executeQuery();
```

**Why secure?**: Parameterized queries separate code & data.

---

## 🧨 6. Injection

**Vulnerable**

```js
db.collection('users').findOne({ username: req.query.username }, ...);
```

**Flaw**: Directly trusts query param → NoSQL injection.

**Fixed**

```js
if (typeof req.query.username !== 'string') return res.status(400).end();
const safe = /^[A-Za-z0-9_.-]{3,30}$/.test(req.query.username);
if (!safe) return res.status(400).end();
const user = await db.collection('users').findOne({ username: req.query.username });
```

**Why secure?**: Validates input, blocks operator injection.

---

## 🎨 7. Insecure Design

**Vulnerable**

```python
user = User.query.filter_by(email=email).first()
user.password = new_password
db.session.commit()
```

**Flaw**: Resets password with just an email — no verification.

**Fixed**

```python
token = serializer.dumps(user.email, salt='password-reset')
```

**Why secure?**: Adds reset token + bcrypt → secure workflow by design.

---

## ⚙️ 8. Software & Data Integrity Failures

**Vulnerable**

```html
<script src="https://cdn.example.com/lib.js"></script>
```

**Flaw**: No integrity check — if CDN is compromised, site is too.

**Fixed**

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-BASE64HASH"
        crossorigin="anonymous"></script>
```

**Why secure?**: Subresource Integrity ensures file is unmodified.

---

## 🌐 9. Server-Side Request Forgery

**Vulnerable**

```python
url = input("Enter URL: ")
response = requests.get(url)
```

**Flaw**: Fetches arbitrary user-supplied URLs → SSRF.

**Fixed**

```python
ALLOWED_HOSTS = {"api.example.com"}
```

**Why secure?**: Allowlist + DNS/IP checks prevent access to internal services.

---

## 🔑 10. Identification & Authentication Failures

**Vulnerable**

```java
if (inputPassword.equals(user.getPassword())) { 
    // Login success
}
```

**Flaw**: Stores and compares plaintext passwords.

**Fixed**

```java
String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
boolean ok = BCrypt.checkpw(inputPassword, hash);
```

**Why secure?**: Stores passwords only as bcrypt hashes; secure verification.