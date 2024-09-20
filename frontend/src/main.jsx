import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { SocketContextProvider } from './context/SocketContext.jsx';	

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "whiteAlpha.900")(props),
			bg: mode("#fafafa", "#0a0a0a")(props)
		},
	})
};

const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const colors = {
	gray: {
		light: "#fafafa",	
		dark: "#0a0a0a",
	},
};

const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<RecoilRoot>
		<BrowserRouter>
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<SocketContextProvider>
				<App />
			</SocketContextProvider>
		</ChakraProvider>
		</BrowserRouter>
	</RecoilRoot>
 </StrictMode>
);
