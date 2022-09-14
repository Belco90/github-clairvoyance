// Increase the command timeout since it takes a while for findBy queries
// to find certain elements while the comparator is still processing the changelog.
const LONGER_COMMAND_TIMEOUT = Cypress.config('defaultCommandTimeout') * 2
Cypress.config('defaultCommandTimeout', LONGER_COMMAND_TIMEOUT)

it('should show changelog results when filling the form', () => {
	cy.visit('/comparator')

	cy.findByRole('textbox', { name: /enter repository name/i }).type(
		'dom testing library'
	)

	cy.findByRole('listbox', { name: /enter repository name/i })
		.findByText('testing-library/dom-testing-library')
		.click()

	cy.findByRole('combobox', { name: /select from release/i }).select('v6.16.0')

	cy.findByRole('combobox', { name: /select to release/i }).select('v8.1.0')

	cy.findByRole('link', { name: 'dom-testing-library' }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library'
	)

	// Confirm from and to version range is displayed
	cy.findByRole('heading', { name: /changes from v6\.16\.0 to v8\.1\.0/i })

	cy.findByRole('heading', {
		level: 2,
		name: /breaking changes/i,
	})

	cy.findAllByText('v7.0.0', { ignore: 'option' }).should('have.length', 2)

	cy.findByRole('heading', { level: 5, name: /drop node 8/i })

	cy.findByText(
		/node 10 or greater is required\. node 8 is \(\) \(\), closes/i
	).should('have.length', 1)

	cy.findByRole('link', { name: /out of lts/i }).should(
		'have.attr',
		'href',
		'https://nodejs.org/en/about/releases/'
	)

	cy.findByRole('link', { name: /#459/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/issues/459'
	)

	cy.findByRole('link', { name: /c3ab843/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/commit/c3ab843c292484428f045671ea22cbb30eb70559'
	)

	cy.findByRole('link', { name: /#430/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/issues/430'
	)

	// Check if the code block renders with the diff display
	cy.findByText(/- "test": "react-scripts test --env=dom"/i)
	cy.findByText(
		/\+ "test": "react-scripts test --env=jest-environment-jsdom-sixteen"/i
	)

	cy.findByRole('heading', { level: 2, name: /features/i })
	cy.findByRole('heading', { level: 2, name: /bug fixes/i })
	cy.findByRole('heading', { level: 2, name: /reverts/i })
	cy.findByRole('heading', { level: 2, name: /recommendations/i })
	cy.findByRole('heading', { level: 2, name: /chore/i })
	cy.get('body').happoScreenshot({
		component: 'Comparator page: basic changelog from filled form',
	})
})

it('should show changelog results when preloading from URL', () => {
	cy.visit(
		'/comparator?repo=testing-library%2Fdom-testing-library&from=v6.16.0&to=v8.1.0'
	)

	// Confirm repository name is displayed
	cy.findByRole('link', { name: 'dom-testing-library' }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library'
	)

	// Confirm from and to version range is displayed
	cy.findByRole('heading', {
		name: /changes from v6\.16\.0 to v8\.1\.0/i,
	})

	cy.findByRole('heading', {
		level: 2,
		name: /breaking changes/i,
	})

	cy.findAllByText('v7.0.0', { ignore: 'option' }).should('have.length', 2)
	cy.findByRole('heading', { level: 5, name: /drop node 8/i })
	cy.findByText(
		/node 10 or greater is required\. node 8 is \(\) \(\), closes/i
	).should('have.length', 1)
	cy.findByRole('link', { name: /out of lts/i }).should(
		'have.attr',
		'href',
		'https://nodejs.org/en/about/releases/'
	)
	cy.findByRole('link', { name: /#459/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/issues/459'
	)
	cy.findByRole('link', { name: /c3ab843/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/commit/c3ab843c292484428f045671ea22cbb30eb70559'
	)
	cy.findByRole('link', { name: /#430/i }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library/issues/430'
	)

	// Check if the code block renders with the diff display
	cy.findByText(/- "test": "react-scripts test --env=dom"/i)
	cy.findByText(
		/\+ "test": "react-scripts test --env=jest-environment-jsdom-sixteen"/i
	)

	cy.findByText(/waitForElement was still in use/) // description from v7.0.1 release
	cy.findByRole('heading', { level: 2, name: /features/i })
	cy.findByRole('heading', { level: 2, name: /bug fixes/i })
	cy.findByRole('heading', { level: 2, name: /reverts/i })
	cy.findByRole('heading', { level: 2, name: /recommendations/i })
	cy.findByRole('heading', { level: 2, name: /chore/i })
})

it('should show changelog results when preloading from URL with "latest"', () => {
	cy.visit(
		'/comparator?repo=testing-library%2Fdom-testing-library&from=v8.11.0&to=latest'
	)

	cy.findByRole('link', { name: 'dom-testing-library' }).should(
		'have.attr',
		'href',
		'https://github.com/testing-library/dom-testing-library'
	)

	cy.findByRole('heading', { name: 'Changes from v8.11.0 to latest' })
	cy.findByText('Latest (v8.17.1)').should('be.selected')

	cy.findByRole('heading', { level: 2, name: /features/i })
	cy.findByRole('heading', { level: 2, name: /bug fixes/i })

	// description from v8.11.1 release
	cy.findByText(/Don't queue microtasks after condition is met/)

	cy.get('body').happoScreenshot({
		component:
			'Comparator page: basic changelog from preloaded URL with "latest"',
	})
})

/**
 * Relates to #741
 *
 * By default we only paginate releases up to 10. If any version preloaded from the URL
 * is located after that, we need to keep paginating releases until found.
 *
 * When both versions are found, the fetching must be stopped, so we avoid unnecessary requests.
 *
 * In this test, to get all releases from v26.9.0 to v32.172.2 we need to fetch 11 pages. We have 12 available, but the
 * last one must not be requested since all the info will be available by then.
 */
it('should show changelog results when preloading from URL with more than 10 release pages', () => {
	cy.visit('/comparator?repo=renovatebot%2Frenovate&from=26.9.0&to=32.172.2')

	// Wait for the app ready is only necessary when preloading from URL and
	// add extra MSW handlers.
	cy.window().should('have.property', 'isApiMockingReady', true)

	cy.window().then((appWindow) => {
		if (appWindow.msw) {
			const { worker, rest } = appWindow.msw

			worker.use(
				rest.get(
					'https://api.github.com/repos/renovatebot/renovate/releases',
					(req, res) => {
						const pageIndex = Number(req.url.searchParams.get('page') || 1)

						// Since all info is available when page 11 is retrieved, page 12 should not be requested.
						// We are forcing an error on page 12 to make sure it's not requested.
						if (pageIndex === 12) {
							return res.networkError('Request page not available')
						}

						return undefined
					}
				)
			)
		} else if (appWindow.isApiMockingEnabled) {
			throw new Error('API mocking should be enabled but msw was not found')
		}
	})

	cy.findByRole('heading', { name: 'renovate' }).within(() => {
		cy.findByRole('link', { name: 'renovate' }).should(
			'have.attr',
			'href',
			'https://github.com/renovatebot/renovate'
		)
	})
	cy.findByRole('heading', { name: 'Changes from 26.9.0 to 32.172.2' })
	cy.findByRole('heading', { level: 2, name: /breaking changes/i })
	cy.findByRole('heading', { level: 2, name: /bug fixes/i })
	cy.findByRole('heading', { level: 2, name: /features/i })
	cy.findByRole('heading', { level: 2, name: /reverts/i })
	cy.findByRole('heading', { level: 2, name: /miscellaneous chores/i })

	// link for 26.9.1 release (lowest one)
	cy.findByRole('link', { name: '26.9.1' }).should(
		'have.attr',
		'href',
		'https://github.com/renovatebot/renovate/releases/tag/26.9.1'
	)
	// link for 32.172.2 release (highest one)
	cy.findAllByRole('link', { name: '32.172.2' }).should(
		'have.attr',
		'href',
		'https://github.com/renovatebot/renovate/releases/tag/32.172.2'
	)
})
