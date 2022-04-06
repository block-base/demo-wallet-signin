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
          <CButton variant-color="gray" @click="connectMetamask">
            Connect Metamask
          </CButton>

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
  // TODO: ここのロジックのみを実装する
  methods: {
    // Criteria:
    // クリックするとMetamaskの接続リクエストが表示される
    // 接続するとconsole.logにaddressが表示される
    connectMetamask () {
      const address = "result goes here"
      console.log("connectMetamask")
      console.log("result: ", address)
    },

    // Criteria:
    // クリックするとMetamaskの署名リクエストが表示される
    // 署名を行うとMetamaskの署名が発生する
    // 署名からAddressを復元してconsole.logに表示する
    getAccountFromSignature () {
      const address = "result goes here"
      console.log("getAccountFromSignature")
      console.log("result: ", address)
    }
  }
}
</script>
