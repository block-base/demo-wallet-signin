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

      // サーバーサイドに署名の検証を送り、検証に成功するとjwtを取得することができる
      const {data: customToken} = await axios.post("http://localhost:5001/blockbase-sandbox-team/us-central1/signInWithWeb3Wallet", {signature, walletAddress, challenge})
      console.log("customToken: ", customToken)
    }
  }
}
</script>
