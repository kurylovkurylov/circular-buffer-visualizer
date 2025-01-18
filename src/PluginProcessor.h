#pragma once

#include "Clipper.h"
#include "Parameters.h"
#include <JuceHeader.h>

//==============================================================================
class AudioPluginAudioProcessor final : public juce::AudioProcessor {
public:
  //==============================================================================
  AudioPluginAudioProcessor(
      AudioProcessorValueTreeState::ParameterLayout layout);
  ~AudioPluginAudioProcessor() override;

  //==============================================================================
  void prepareToPlay(double sampleRate, int samplesPerBlock) override;
  void releaseResources() override;

  bool isBusesLayoutSupported(const BusesLayout &layouts) const override;

  void processBlock(juce::AudioBuffer<float> &, juce::MidiBuffer &) override;
  using AudioProcessor::processBlock;

  //==============================================================================
  juce::AudioProcessorEditor *createEditor() override;
  bool hasEditor() const override;

  //==============================================================================
  const juce::String getName() const override;

  bool acceptsMidi() const override;
  bool producesMidi() const override;
  bool isMidiEffect() const override;
  double getTailLengthSeconds() const override;

  //==============================================================================
  int getNumPrograms() override;
  int getCurrentProgram() override;
  void setCurrentProgram(int index) override;
  const juce::String getProgramName(int index) override;
  void changeProgramName(int index, const juce::String &newName) override;

  //==============================================================================
  void getStateInformation(juce::MemoryBlock &destData) override;
  void setStateInformation(const void *data, int sizeInBytes) override;

  Parameters parameters;

  juce::Array<float> peakHistory;
  juce::Array<float> grHistory;
  juce::Array<float> vuHistory;

private:
  juce::AudioProcessorValueTreeState state;
  void updateClipperParameters();

  const int historySize = 512;
  const int samplesPerBlock = 512;

  int historyIndex = 0;
  int subBlockIndex = 0;

  float currentPeak = 0.0f;
  float currentGr = 0.0f;
  float currentVu = 0.0f;
  float lastVu = 0.0f;

  const float vuIntTimeSec = 0.3f;
  const float vuAlpha = std::exp(-1.0f / (vuIntTimeSec * 44100.0f));

  void pushSample(float drySample, float wetSample) {
    float absDrySample = std::abs(drySample);
    float absWetSample = std::abs(wetSample);

    float drySampleDb = juce::Decibels::gainToDecibels(absDrySample);
    float wetSampleDb = juce::Decibels::gainToDecibels(absWetSample);
    float grDb = drySampleDb - wetSampleDb;

    currentPeak = juce::jmax(currentPeak, absDrySample);
    currentGr = juce::jmax(currentGr, grDb);
    currentVu = juce::jmax(currentVu, processVu(absDrySample));

    if (++subBlockIndex >= samplesPerBlock) {
      float peakDb = juce::Decibels::gainToDecibels(currentPeak);
      peakHistory.setUnchecked(historyIndex, peakDb);
      currentPeak = 0.0f;

      float vuDb = juce::Decibels::gainToDecibels(currentVu);
      vuHistory.setUnchecked(historyIndex, vuDb);
      currentVu = 0.0f;

      grHistory.setUnchecked(historyIndex, currentGr);
      currentGr = 0.0f;

      historyIndex = (historyIndex + 1) % historySize;
      subBlockIndex = 0;
    }
  }

  float processVu(float sample) {
    lastVu = vuAlpha * lastVu + (1.0f - vuAlpha) * sample;
    return lastVu;
  }

  Clipper clipper;
  juce::dsp::Gain<float> inGain;
  juce::dsp::Gain<float> outGain;
  juce::dsp::DryWetMixer<float> mixer;
  //==============================================================================
  JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioPluginAudioProcessor)
};
