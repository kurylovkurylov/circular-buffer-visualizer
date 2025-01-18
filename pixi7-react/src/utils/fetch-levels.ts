// @ts-expect-error no type definitions
import * as Juce from '../juce'

const peakHistoryUrl = Juce.getBackendResourceAddress('peakHistory')
const vuHistoryUrl = Juce.getBackendResourceAddress('vuHistory')
const grHistoryUrl = Juce.getBackendResourceAddress('grHistory')

export const fetchLevels = async () => {
  const responses = await Promise.all([
    fetch(peakHistoryUrl),
    fetch(vuHistoryUrl),
    fetch(grHistoryUrl),
  ])

  const buffers = await Promise.all(responses.map(res => res.arrayBuffer()))
  const data = {
    peakHistory: new Float32Array(buffers[0]),
    vuHistory: new Float32Array(buffers[1]),
    grHistory: new Float32Array(buffers[2]),
  }

  return data
}
