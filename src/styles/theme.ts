import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    gray: {
      //   900: "#181B23",
      //   800: '#1F2029',
      //   700: '#353646',
      //   600: '#4B4D63',
      //   500: '#616480',
      //   400: '#797D9A',
      350: '#9699B0',
      250: '#c2c4c6',
      //   250: '#E2E8F0',
      //   200: '#B3B5C6',
      //   100: '#D1D2DC',
      //   75: '#EDF2F7',
      50: '#F6FAFF',
      //   25: '#EEEEF2',
    }
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.700',
      }
    }
  },
  // config: {
  //   useSystemColorMode: true,
  // }
})
