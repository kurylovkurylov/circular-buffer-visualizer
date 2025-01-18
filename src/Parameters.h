#pragma once

#include <JuceHeader.h>

namespace ID {
#define PARAMETER_ID(str) static const ParameterID str{#str, 1};

PARAMETER_ID(clipThreshold)
PARAMETER_ID(saturationThreshold)
PARAMETER_ID(inGain)
PARAMETER_ID(outGain)
PARAMETER_ID(mix)

#undef PARAMETER_ID
} // namespace ID

struct Parameters {
public:
  explicit Parameters(AudioProcessorValueTreeState::ParameterLayout &layout)

      : clipThreshold(addToLayout<AudioParameterFloat>(
            layout, ID::clipThreshold, "Digital",
            NormalisableRange<float>(-48.f, 12.f), 6.f,
            AudioParameterFloatAttributes{}.withLabel("dB"))),

        saturationThreshold(addToLayout<AudioParameterFloat>(
            layout, ID::saturationThreshold, "Analog",
            NormalisableRange<float>(-48.f, 12.f), 0.f,
            AudioParameterFloatAttributes{}.withLabel("dB"))),

        inGain(addToLayout<AudioParameterFloat>(
            layout, ID::inGain, "In Gain",
            NormalisableRange<float>(-18.f, 18.f), 0.f,
            AudioParameterFloatAttributes{}.withLabel("dB"))),

        outGain(addToLayout<AudioParameterFloat>(
            layout, ID::outGain, "Out Gain",
            NormalisableRange<float>(-18.f, 18.f), 0.f,
            AudioParameterFloatAttributes{}.withLabel("dB"))),

        mix(addToLayout<AudioParameterFloat>(
            layout, ID::mix, "Mix", NormalisableRange<float>(0.f, 100.f), 100.f,
            AudioParameterFloatAttributes{}.withLabel("%"))) {}

  AudioParameterFloat &clipThreshold;
  AudioParameterFloat &saturationThreshold;
  AudioParameterFloat &inGain;
  AudioParameterFloat &outGain;
  AudioParameterFloat &mix;

private:
  template <typename Param>
  static void add(AudioProcessorParameterGroup &group,
                  std::unique_ptr<Param> param) {
    group.addChild(std::move(param));
  }

  template <typename Param>
  static void add(AudioProcessorValueTreeState::ParameterLayout &group,
                  std::unique_ptr<Param> param) {
    group.add(std::move(param));
  }

  template <typename Param, typename Group, typename... Ts>
  static Param &addToLayout(Group &layout, Ts &&...ts) {
    auto param = std::make_unique<Param>(std::forward<Ts>(ts)...);
    auto &ref = *param;
    add(layout, std::move(param));
    return ref;
  }
};