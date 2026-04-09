const SECRET_PARTS = [
  { key: 41, bytes: [91, 76, 71, 77, 76, 91, 76, 91, 19, 19] },
  { key: 23, bytes: [121, 120, 46, 45, 45] },
  { key: 11, bytes: [125, 58, 75, 57, 59, 57, 61] },
  { key: 53, bytes: [87, 64, 91, 81, 89, 80, 15, 15] },
];

function decodeSecretPart(part) {
  return Buffer.from(part.bytes.map(value => value ^ part.key)).toString('utf8');
}

function getDefaultSecret() {
  return SECRET_PARTS.map(decodeSecretPart).join('');
}

module.exports = {
  decodeSecretPart,
  getDefaultSecret,
  SECRET_PARTS,
};
