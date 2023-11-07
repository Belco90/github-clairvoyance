'use client'

import { Box, CircularProgress, Flex } from '@chakra-ui/react'

import RepositoryReleasesComparator from '~/components/RepositoryReleasesComparator'
import { ComparatorProvider } from '~/contexts/comparator-context'
import { useMsw } from '~/hooks/useMsw'

const ComparatorClientView = () => {
	const { isReady } = useMsw()

	return (
		<Box height="full" width="full" bgColor="background3">
			{isReady ? (
				<ComparatorProvider>
					<RepositoryReleasesComparator />
				</ComparatorProvider>
			) : (
				<Flex align="center" justify="center" height="100%">
					<CircularProgress isIndeterminate size="8" color="primary.400" />
				</Flex>
			)}
		</Box>
	)
}

export default ComparatorClientView
