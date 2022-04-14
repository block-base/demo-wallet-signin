const functions = require('firebase-functions')
const admin = require('firebase-admin')
const ethers = require('ethers')
const jwt = require('jsonwebtoken')

admin.initializeApp()

const secret = 'secret' // for demo

const cors = require('cors')({ origin: true })

exports.getChallenge = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const { walletAddress } = request.body

    // チャレンジの作成
    const payload = {
      exp: Date.now() + 1000 * 60 * 10, // valid for 10 minutes
      sub: walletAddress,
    }
    const challenge = jwt.sign(payload, secret)
    response.send(challenge)
  })
})

exports.signInWithWeb3Wallet = functions.https.onRequest(
  (request, response) => {
    cors(request, response, async () => {
      const { signature, walletAddress, challenge } = request.body

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
      const customToken = await admin.auth().createCustomToken(walletAddress)
      response.send(customToken)
    })
  }
)
