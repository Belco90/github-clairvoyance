import type { RequestHandler, DefaultBodyType } from 'msw'
import { rest } from 'msw'

import {
	domTestingLibraryReleases,
	renovateReleases,
} from '~/fixtures/github/releases'
import type { Release } from '~/models'
import { paginateList } from '~/utils'

/**
 * https://docs.github.com/en/rest/overview/resources-in-the-rest-api#pagination
 */
const DEFAULT_ITEMS_PER_PAGE = 30

interface RepoReleasesParams {
	repoOwner: string
	repoName: string
}

const REPO_FIXTURES_MAPPING: Record<string, Array<Release> | undefined> = {
	'dom-testing-library': domTestingLibraryReleases,
	renovate: renovateReleases,
}

const githubReposReleasesHandlers: Array<RequestHandler> = [
	rest.get<DefaultBodyType, RepoReleasesParams>(
		'https://api.github.com/repos/:repoOwner/:repoName/releases',
		(req, res, context) => {
			const { repoOwner, repoName } = req.params
			const releasesFixture = REPO_FIXTURES_MAPPING[repoName]

			if (!releasesFixture) {
				return res(
					context.json({
						message: 'Not Found',
					}),
				)
			}

			const perPage = Number(
				req.url.searchParams.get('per_page') ?? DEFAULT_ITEMS_PER_PAGE,
			)
			const pageIndex = Number(req.url.searchParams.get('page') ?? 1)

			const { data, hasNext } = paginateList(
				releasesFixture,
				perPage,
				pageIndex,
			)

			// Keep response transformers in an array, so it can be extended later
			// if necessary. Always init with the paginated data.
			const responseTransformers = [context.json<Array<Release>>(data)]

			if (hasNext) {
				const nextPage = pageIndex + 1
				const repoString = `${repoOwner}/${repoName}`
				responseTransformers.push(
					context.set(
						'link',
						`<https://api.github.com/repos/${repoString}/releases?per_page=${perPage}&page=${nextPage}>; rel="next"`,
					),
				)
			}

			return res(...responseTransformers)
		},
	),
]

export { githubReposReleasesHandlers }
