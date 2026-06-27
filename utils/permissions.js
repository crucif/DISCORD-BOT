function userHas(message, permission) {
  return message.member?.permissions?.has(permission);
}

function botHas(message, permission) {
  return message.guild?.members?.me?.permissions?.has(permission);
}

module.exports = { userHas, botHas };
