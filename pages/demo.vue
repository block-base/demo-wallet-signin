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

import Web3 from "web3";
import axios from "axios"
import {initializeApp} from "firebase/app"
import { getAuth, signInWithCustomToken, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkGB_HRY59EWwQezpDH8SI7fNjIwafZ_s",
  authDomain: "blockbase-sandbox-team.firebaseapp.com",
  databaseURL: "https://blockbase-sandbox-team.firebaseio.com",
  projectId: "blockbase-sandbox-team",
  storageBucket: "blockbase-sandbox-team.appspot.com",
  messagingSenderId: "837371952785",
  appId: "1:837371952785:web:439973a258ffd19ac5c930",
  measurementId: "G-HE0GZS4EC5"
};

initializeApp(firebaseConfig);
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

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


      await window.ethereum.enable()
      const web3 = new Web3(window.ethereum)
      const [address] = await web3.eth.getAccounts();

      // wallet addressの取得
      const walletAddress = address
      console.log("walletAddress: ", walletAddress);

      // サーバーサイドから署名のチャレンジの取得（このチャレンジはセッションやjwtなどを使って不正に署名を再利用されないようにするもの）
      const { data: challenge } = await axios.post("http://localhost:5001/blockbase-sandbox-team/us-central1/getChallenge", {walletAddress})
      const dataToSign = challenge;

      // 署名を行う
      const signature = await web3.eth.personal.sign(dataToSign, walletAddress)
      console.log("signature: ", signature);

      // サーバーサイドに署名の検証を送り、検証に成功するとcustomTokenを取得することができる
      const {data: customToken} = await axios.post("http://localhost:5001/blockbase-sandbox-team/us-central1/signInWithWeb3Wallet", {signature, walletAddress, challenge})
      console.log("customToken: ", customToken)

      // サーバーから帰ってきたcustomTokenを使用しfirebaseにログインする
      await signInWithCustomToken(auth, customToken);

      // ID Tokenの取得
      const idToken = await auth.currentUser.getIdToken()
      console.log("idToken", idToken)

      // こちらのIDトークンはサーバーサイドでの検証が可能です
      const {data: result} = await axios.post("http://localhost:5001/blockbase-sandbox-team/us-central1/verifyIdToken", {idToken})
      console.log(result)

    }
  }
}
</script>
