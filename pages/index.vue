<template>
  <div class="container">
    <CBox
      v-bind="mainStyles[colorMode]"
      d="flex"
      w="100vw"
      h="100vh"
      flex-dir="column"
      justify-content="center"
    >
      <CHeading text-align="center" mb="4">Wallet Integration Demo</CHeading>
      <CFlex justify="center" direction="column" align="center">
        <CBox mb="3">
          <CButton variant-color="gray" @click="getAccountFromSignature">
            Get Account from Signature
          </CButton>
        </CBox>
      </CFlex>
    </CBox>
  </div>
</template>

<script lang="js">
import {
  CBox,
  CButton,
  CFlex,
  CHeading
} from '@chakra-ui/vue'

import { signInWithCustomToken } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { initFirebase } from "../lib/firebase"
import { initWeb3 } from "../lib/web3"

export default {
  name: 'IndexPage',
  components: {
    CBox,
    CButton,

    CFlex,
    CHeading
  },
  inject: ['$chakraColorMode', '$toggleColorMode'],
  data () {
    return {
      showModal: false,
      mainStyles: {
        dark: {
          bg: 'gray.700',
          color: 'whiteAlpha.900'
        },
        light: {
          bg: 'white',
          color: 'gray.900'
        }
      }
    }
  },
  computed: {
    colorMode () {
      return this.$chakraColorMode()
    },
    theme () {
      return this.$chakraTheme()
    },
    toggleColorMode () {
      return this.$toggleColorMode
    }
  },

  methods: {
    async getAccountFromSignature () {

      const web3 = await initWeb3();
      const [address] = await web3.eth.getAccounts();

      // wallet addressの取得
      const walletAddress = address
      console.log("walletAddress: ", walletAddress);

      const {functions, auth} = initFirebase();

      // サーバーサイドから署名のチャレンジの取得（このチャレンジはセッションやjwtなどを使って不正に署名を再利用されないようにするもの）
      const { data: challenge }  = await httpsCallable(functions, "getChallenge")({walletAddress});

      // 署名を行う
      const signature = await web3.eth.personal.sign(challenge, walletAddress)
      console.log("signature: ", signature);

      // サーバーサイドに署名の検証を送り、検証に成功するとcustomTokenを取得することができる
       const { data: customToken }  = await httpsCallable(functions, "signInWithWeb3Wallet")({signature, walletAddress, challenge});
      console.log("customToken: ", customToken)

      // サーバーから帰ってきたcustomTokenを使用しfirebaseにログインする

      await signInWithCustomToken(auth, customToken);

      // ID Tokenの取得、このIDトークンを他のエンドポイントのヘッダに入れて投げるようにします
      const idToken = await auth.currentUser.getIdToken()
      console.log("idToken", idToken)

    }
  }
}
</script>
