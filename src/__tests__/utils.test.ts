import type { Content } from 'mdast'

import type { Release, Repository, RepositoryQueryParams } from '~/models'
import {
  filterReleasesByVersionRange,
  getMdastContentNodeTitle,
  getReleaseVersion,
  isStableRelease,
  mapRepositoryToQueryParams,
  mapStringToRepositoryQueryParams,
} from '~/utils'

describe('mapRepositoryToQueryParams util', () => {
  it.each`
    label               | input                                       | output
    ${'an empty repo'}  | ${undefined}                                | ${{ owner: '', repo: '' }}
    ${'a full repo'}    | ${{ owner: { login: 'foo' }, name: 'bar' }} | ${{ owner: 'foo', repo: 'bar' }}
    ${'a partial repo'} | ${{ owner: {}, name: 'bar' }}               | ${{ owner: '', repo: 'bar' }}
  `(
    'should map $label',
    ({
      input,
      output,
    }: {
      input: undefined | Repository
      output: RepositoryQueryParams
    }) => {
      const result = mapRepositoryToQueryParams(input)

      expect(result).toEqual(output)
    }
  )
})

describe('mapStringToRepositoryQueryParams util', () => {
  it.each`
    label                                                | input         | output
    ${'full repo details from splittable string'}        | ${'org/name'} | ${{ owner: 'org', repo: 'name' }}
    ${'partial repo details from non-splittable string'} | ${'foo'}      | ${{ owner: 'foo', repo: '' }}
    ${'empty details from empty string'}                 | ${''}         | ${{ owner: '', repo: '' }}
  `('should return $label', ({ input, output }) => {
    const result = mapStringToRepositoryQueryParams(input)

    expect(result).toEqual(output)
  })
})

describe('getReleaseVersion util', () => {
  it.each`
    tagName     | releaseName    | output
    ${'latest'} | ${'v5.2.0'}    | ${'v5.2.0'}
    ${'latest'} | ${''}          | ${'latest'}
    ${'v1.2.3'} | ${'ignore me'} | ${'v1.2.3'}
  `(
    'should return the correct version for a release with tag "$tagName" and name "$releaseName"',
    ({ tagName, releaseName, output }) => {
      const result = getReleaseVersion({
        tag_name: tagName,
        name: releaseName,
      } as Release)

      expect(result).toEqual(output)
    }
  )
})

describe('filterReleasesByVersionRange util', () => {
  const getFakeReleases = (): Array<Release> => {
    return [
      { tag_name: 'v2.9.23' },
      { tag_name: 'v2.9.15' },
      { tag_name: 'v2.9.7' },
      { tag_name: 'v2.2.0' },
      { tag_name: 'v2.1.0' },
      { tag_name: 'v2.0.0' },
      { tag_name: 'v1.1.2' },
      { tag_name: 'v1.1.1' },
      { tag_name: 'v1.1.0' },
      { tag_name: 'v1.0.0' },
    ] as Array<Release>
  }

  it('should filter by provided range excluding the "from" but including the "to"', () => {
    const result = filterReleasesByVersionRange({
      releases: getFakeReleases(),
      from: 'v2.0.0',
      to: 'v2.9.7',
    })

    expect(result).toEqual([
      { tag_name: 'v2.9.7' },
      { tag_name: 'v2.2.0' },
      { tag_name: 'v2.1.0' },
    ])
  })

  it('should filter until the latest available release', () => {
    const result = filterReleasesByVersionRange({
      releases: getFakeReleases(),
      from: 'v2.0.0',
      to: 'latest',
    })

    expect(result).toEqual([
      { tag_name: 'v2.9.23' },
      { tag_name: 'v2.9.15' },
      { tag_name: 'v2.9.7' },
      { tag_name: 'v2.2.0' },
      { tag_name: 'v2.1.0' },
    ])
  })

  it('should return an empty array if the range is the other way around', () => {
    const result = filterReleasesByVersionRange({
      releases: getFakeReleases(),
      from: 'v2.0.0',
      to: 'v1.0.0',
    })

    expect(result).toEqual([])
  })

  it('should return an empty array if the releases are out of the rage', () => {
    const result = filterReleasesByVersionRange({
      releases: getFakeReleases(),
      from: 'v2.99.0',
      to: 'v5.0.0',
    })

    expect(result).toEqual([])
  })

  it('should throw an error if a range version is invalid', () => {
    expect(() =>
      filterReleasesByVersionRange({
        releases: getFakeReleases(),
        from: '1',
        to: '2',
      })
    ).toThrow(TypeError('Invalid Version: 1'))
  })
})

describe('isStableRelease util', () => {
  it.each`
    tagName                 | output
    ${'v0.7.0'}             | ${true}
    ${'v1.0.0'}             | ${true}
    ${'v2.5.7'}             | ${true}
    ${'v5.0.0-alpha.3'}     | ${false}
    ${'v4.0.0-beta.4'}      | ${false}
    ${'I am not a release'} | ${false}
  `(
    'should return "$output" for tag "$tagName"',
    ({ tagName, output }: { tagName: string; output: boolean }) => {
      const result = isStableRelease({ tag_name: tagName } as Release)

      expect(result).toBe(output)
    }
  )
})

describe('getMdastContentNodeTitle util', () => {
  it('should return the title of the first child node found', () => {
    const result = getMdastContentNodeTitle({
      children: [{ value: 'foo' }, { value: 'bar' }],
    } as Content)

    expect(result).toBe('foo')
  })

  it('should return "unknown" if the first child node found has no title', () => {
    const result = getMdastContentNodeTitle({
      children: [{}, { value: 'bar' }],
    } as Content)

    expect(result).toBe('unknown')
  })

  it('should return "unknown" if there are no children', () => {
    const result = getMdastContentNodeTitle({} as Content)

    expect(result).toBe('unknown')
  })
})
