const functions = require('firebase-functions')
const admin = require('firebase-admin')
const ethers = require('ethers')
const jwt = require('jsonwebtoken')

admin.initializeApp()

const secret = 'secret' // for demo

exports.getChallenge = functions.https.onCall((data, _context) => {
  const { walletAddress } = data

  // チャレンジの作成
  const payload = {
    exp: Date.now() + 1000 * 60 * 10, // valid for 10 minutes
    sub: walletAddress,
  }

  const challenge = jwt.sign(payload, secret)
  return challenge
})

exports.signInWithWeb3Wallet = functions.https.onCall(
  async (data, _context) => {
    const { signature, walletAddress, challenge } = data

    // チャレンジの検証
    const challengeData = jwt.verify(challenge, secret)
    if (!challengeData.exp || challengeData.exp < Date.now()) {
      throw new functions.https.HttpsError(
        'deadline-exceeded',
        'The function must be called with non expired challenge'
      )
    }

    // 署名の検証
    const recoveredAddress = ethers.utils.verifyMessage(challenge, signature)
    if (walletAddress.toLowerCase() !== recoveredAddress.toLowerCase()) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with valid signature for the wallet Address'
      )
    }

    // 認証トークンの発行
    const customToken = await admin
      .auth()
      .createCustomToken(walletAddress, { walletAddress })

    return customToken
  }
)
