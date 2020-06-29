try {
  const crypto = require('crypto');
  const buffer = crypto.randomBytes(32);
  console.log(buffer.toString())
  console.log(buffer)
} catch (err) {
  console.log('crypto support is disabled!');
}