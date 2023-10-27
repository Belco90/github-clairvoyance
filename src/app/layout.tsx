import { ColorModeScript } from '@chakra-ui/react'
import { Inter, Roboto_Mono } from 'next/font/google'
import { type FC, type ReactNode } from 'react'

import Providers from './Providers'
import VercelAnalytics from './VercelAnalytics'
import { openGraph } from './shared-metadata'

import { BRIEF_DESCRIPTION, FULL_DESCRIPTION, SITE_TITLE } from '~/common'
import customTheme from '~/customTheme'

const interFont = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

const robotoMonoFont = Roboto_Mono({
	subsets: ['latin'],
	variable: '--font-roboto-mono',
})

export const metadata = {
	title: {
		template: `%s | ${SITE_TITLE}`,
		default: `${SITE_TITLE}: ${BRIEF_DESCRIPTION}`,
	},
	description: FULL_DESCRIPTION,
	openGraph: { ...openGraph },

	// TODO: Move this to `generateViewport` in Next.js v14
	//  https://nextjs.org/docs/app/api-reference/functions/generate-viewport
	themeColor: customTheme.colors.primary['700'],
}

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
	<html
		lang="en"
		className={`${interFont.variable} ${robotoMonoFont.variable}`}
	>
		<body>
			<ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
			<VercelAnalytics />
			<Providers>{children}</Providers>
		</body>
	</html>
)

export default RootLayout
