function newLinkSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_LINK")
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload
  }
}

module.exports = {
  newLink
}