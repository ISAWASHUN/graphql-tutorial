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

async function vote(parent, args, context) {
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  })

  if(Boolean(vote)) {
    throw new Error(`すでに投票済みです: ${args.linkId}`)
  }

  //投票がなければ新規作成
  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  })

  context.pubsub.publish("NEW_VOTE", newVote)

  return newVote
}

module.exports = {
  signup,
  login,
  post,
  vote
}