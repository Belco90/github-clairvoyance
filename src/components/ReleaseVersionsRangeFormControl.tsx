import { Stack, StackProps } from '@chakra-ui/react'

import ReleaseVersionFormControl from '~/components/ReleaseVersionFormControl'
import {
  useComparatorState,
  useComparatorUpdater,
} from '~/contexts/comparator-context'
import { Release } from '~/models'
import { useReleasesQuery } from '~/queries/release'
import { getReleaseVersion, releasesComparator } from '~/utils'

function mapReleasesRange(releases?: Release[]): [Release[], Release[]] {
  if (!releases?.length) {
    return [[], []]
  }

  const sortedReleases = releases.sort(releasesComparator)

  // Remove very last version to leave a gap of 1 version between penultimate from version and last to version
  const fromReleases =
    sortedReleases.length === 1 ? sortedReleases : sortedReleases.slice(1)

  // Prepend "latest" option based on last release object
  const toReleases = [
    {
      ...sortedReleases[0],
      name: `Latest (${getReleaseVersion(sortedReleases[0])})`,
      tag_name: 'latest',
      id: -1,
    },
    ...sortedReleases,
  ]

  return [fromReleases, toReleases]
}

const ReleaseVersionsRangeFormControl = (props: StackProps) => {
  const { repository, fromVersion, toVersion } = useComparatorState()
  const { setFromVersion, setToVersion } = useComparatorUpdater()

  const { data: releases, isLoading } = useReleasesQuery({ repository })

  const [fromReleases, toReleases] = mapReleasesRange(releases)

  const selectPlaceholder =
    Array.isArray(releases) && releases.length === 0
      ? 'Releases not found'
      : 'Choose a release'

  return (
    <Stack {...props}>
      <ReleaseVersionFormControl
        label="From release"
        id="from-version"
        isDisabled={!releases || isLoading}
        isLoading={isLoading}
        placeholder={selectPlaceholder}
        options={fromReleases}
        onChange={setFromVersion}
        value={fromVersion ?? undefined}
      />
      <ReleaseVersionFormControl
        label="To release"
        id="to-version"
        isDisabled={!releases || isLoading}
        isLoading={isLoading}
        placeholder={selectPlaceholder}
        options={toReleases}
        onChange={setToVersion}
        value={toVersion ?? undefined}
      />
    </Stack>
  )
}

export default ReleaseVersionsRangeFormControl
