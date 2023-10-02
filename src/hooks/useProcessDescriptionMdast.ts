import type { ReactNode } from 'react'
import { createElement, useEffect, useMemo, useState } from 'react'
import rehypeHighlight from 'rehype-highlight'
import rehype2react from 'rehype-react'
import emoji from 'remark-emoji'
import gfm from 'remark-gfm'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import markdown from 'remark-stringify'
import { unified } from 'unified'

import type { ComponentsMapping, ProcessedRelease, Repository } from '~/models'

interface HookArgs {
	repository: Repository
	description: ProcessedRelease['descriptionMdast']
	componentsMapping: ComponentsMapping
}

interface HookReturnedValue {
	processedDescription: ReactNode
	isProcessing: boolean
}

function processDescriptionAsync(
	description: ProcessedRelease['descriptionMdast'],
	components: ComponentsMapping,
): Promise<ReactNode> {
	return new Promise((resolve, reject) => {
		unified()
			.use(parse)
			.use(gfm)
			.use(emoji, { accessible: true })
			.use(remark2rehype)
			.use(rehypeHighlight, { ignoreMissing: true })
			.use(rehype2react, {
				createElement,
				components,
			})
			.process(
				unified().use(markdown).use(gfm).stringify(description),
				(err, file) => {
					if (err) {
						reject(err)
					} else if (!file?.result) {
						reject('Result not generated')
					} else {
						resolve(file.result as Parameters<typeof resolve>[0])
					}
				},
			)
	})
}

function useProcessDescriptionMdast({
	repository,
	description,
	componentsMapping,
}: HookArgs): HookReturnedValue {
	const [processedDescription, setProcessedDescription] =
		useState<ReactNode | null>(null)

	const [isProcessing, setIsProcessing] = useState(true)

	useEffect(() => {
		const handleProcessDescription = async () => {
			setIsProcessing(true)
			const result = await processDescriptionAsync(
				description,
				componentsMapping,
			)

			setProcessedDescription(result)
			setIsProcessing(false)
		}

		void handleProcessDescription()
	}, [componentsMapping, description, repository.html_url])

	const data = useMemo(
		() => ({
			processedDescription,
			isProcessing,
		}),
		[isProcessing, processedDescription],
	)

	return data
}

export default useProcessDescriptionMdast
