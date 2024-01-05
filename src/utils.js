APP_SECRET = 'GraphQL-is-aw3some';

//tokenを複合するための関数
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}


function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
}