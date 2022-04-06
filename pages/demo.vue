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
      const dataToSign = "data";
      await window.ethereum.enable()
      const web3 = new Web3(window.ethereum)
      const [address] = await web3.eth.getAccounts();
      console.log("address: ", address);
      const signature = await web3.eth.personal.sign(dataToSign, address)
      console.log("signature: ", signature);
      const recovered = await web3.eth.personal.ecRecover(dataToSign, signature);
      console.log("recovered: ", recovered)
    }
  }
}
</script>
