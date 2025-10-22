// Environment-based configuration
// This file switches between dev and prod configs based on NODE_ENV

let keys;

if (process.env.NODE_ENV === 'production') {
  keys = require('./keys_prod').default;
} else {
  keys = require('./keys_dev').default;
}

export default keys;

