// @ts-ignore
import * as juce from './juce'

const peakHistoryUrl = juce.getBackendResourceAddress('peakHistory')
const vuHistoryUrl = juce.getBackendResourceAddress('vuHistory')
const grHistoryUrl = juce.getBackendResourceAddress('grHistory')

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
