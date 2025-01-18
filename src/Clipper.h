#pragma once

#include <JuceHeader.h>

class Clipper {
private:
  float clipThreshold{1.f};
  float saturationThreshold{1.f};
  float precomputedMultiplier{1.f};
  bool isHardClip{true};

public:
  Clipper() = default;

  inline float processSample(float inputSample) noexcept {
    return isHardClip ? hardClipFunc(inputSample) : softClipFunc(inputSample);
  }

  void process(dsp::ProcessContextReplacing<float> &context) {
    // dsp::AudioBlock<float>::process(
    //     context.getInputBlock(), context.getOutputBlock(),
    //     [this](float x) { return processSample(x); });

    auto inputBlock = context.getInputBlock();
    auto outputBlock = context.getOutputBlock();
    auto numSamples = inputBlock.getNumSamples();
    auto numChannels = inputBlock.getNumChannels();

    for (size_t channel = 0; channel < numChannels; ++channel) {
      for (size_t sample = 0; sample < numSamples; ++sample) {
        outputBlock.getChannelPointer(channel)[sample] =
            processSample(inputBlock.getChannelPointer(channel)[sample]);
      }
    }
  }

  // inline void processBlock(juce::dsp::AudioBlock<float> &block) noexcept {
  //   for (int ch = 0; ch < block.getNumChannels(); ++ch) {
  //     for (int s = 0; s < block.getNumSamples(); ++s) {
  //       block.getChannelPointer(ch)[s] =
  //           processSample(block.getChannelPointer(ch)[s]);
  //     }
  //   }
  // }

  inline void setThresholds(float newClipThreshold,
                            float newSaturationThreshold) noexcept {
    if (approximatelyEqual(newClipThreshold, clipThreshold) &&
        approximatelyEqual(newSaturationThreshold, saturationThreshold))
      return;

    clipThreshold = jmax(newClipThreshold, 0.f);
    saturationThreshold = jmin(clipThreshold, newSaturationThreshold);

    isHardClip = clipThreshold <= saturationThreshold;

    updateMultiplier();
  }

private:
  inline float hardClipFunc(float x) noexcept {
    return (std::abs(x + clipThreshold) - std::abs(x - clipThreshold)) * 0.5f;
  }

  inline float softClipFunc(float x) noexcept {
    float absX = std::abs(x);
    float sign = std::copysign(1.f, x);

    return absX < saturationThreshold
               ? x
               : computeKnee(jmin(absX, clipThreshold)) * sign;
  }

  inline void updateMultiplier() noexcept {
    precomputedMultiplier =
        isHardClip ? 1.f : 1.f / (2.f * (clipThreshold - saturationThreshold));
  }

  inline float computeKnee(float x) noexcept {
    return (2.f * clipThreshold * x - square(x) - square(saturationThreshold)) *
           precomputedMultiplier;
  }

  JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(Clipper)
};