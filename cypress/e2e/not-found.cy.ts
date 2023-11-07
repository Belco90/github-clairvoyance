it('should display custom "not found" page for non-existing page', () => {
	cy.visit('/not-existing-page', { failOnStatusCode: false })
	cy.metaDescriptionShouldEqual(
		'Compare GitHub changelogs across multiple releases in a single view',
	)
	cy.title().should('equal', 'Not Found | Octoclairvoyant')

	cy.findByRole('heading', {
		name: 'This page could not be found.',
	}).should('exist')

	cy.findByText('Octoclairvoyant cannot divine the page you wanted.').should(
		'exist',
	)

	cy.findByRole('main').within(() => {
		cy.findByRole('img')
			.should('have.attr', 'src')
			.and('contain', 'mascot-icon')
	})

	cy.findByRole('link', { name: /go to comparator/i }).should(
		'have.attr',
		'href',
		'/comparator',
	)

	cy.findByRole('link', { name: 'Or go to homepage' }).should(
		'have.attr',
		'href',
		'/',
	)
})
