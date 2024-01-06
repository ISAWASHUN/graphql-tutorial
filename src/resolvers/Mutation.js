const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

APP_SECRET = 'GraphQL-is-aw3some';

//userの新規登録のリゾルバー
async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({ data: { ...args, password } });
  const token = jwt.sign({ userId: user.id }, APP_SECRET)
  return {
    token:
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } });
  if (!user) {
    throw new Error('No such user found');
  }

  //パスワードが一致するか確認
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  //JWTを発行
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  //JWTとユーザーを返す
  return {
    token,
    user,
  };
}

async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: { connect: { id: userId } }
    }
  })

  context.pubsub.publish("NEW_LINK", newLink)

  return newLink
}

module.exports = {
  signup,
  login,
  post,
}