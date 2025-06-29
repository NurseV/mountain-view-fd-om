// server/hash_password.js

const bcrypt = require('bcrypt');

const password = '1234';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Your new password hash is:');
  console.log(hash);
});