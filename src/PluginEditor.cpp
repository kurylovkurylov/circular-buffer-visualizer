#include "PluginEditor.h"
#include "PluginProcessor.h"

//==============================================================================
AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor(
    AudioPluginAudioProcessor &p)
    : AudioProcessorEditor(&p), processorRef(p),
      clipThresholdAttachment(p.parameters.clipThreshold, clipThresholdRelay),
      saturationThresholdAttachment(p.parameters.saturationThreshold,
                                    saturationThresholdRelay),
      inGainAttachment(p.parameters.inGain, inGainRelay),
      outGainAttachment(p.parameters.outGain, outGainRelay),
      mixAttachment(p.parameters.mix, mixRelay) {
  juce::ignoreUnused(processorRef);
  addAndMakeVisible(webBrowser);
  webBrowser.goToURL(WebBrowserComponent::getResourceProviderRoot());

  setSize(512 + 16, 512 + 16);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor() {}

//==============================================================================
void AudioPluginAudioProcessorEditor::paint(juce::Graphics &g) {
  juce::ignoreUnused(g);
}

void AudioPluginAudioProcessorEditor::resized() {
  webBrowser.setBounds(getLocalBounds());
}

static std::vector<std::byte> stringToBytes(const char *str) {
  const unsigned char *bytes = reinterpret_cast<const unsigned char *>(str);
  std::vector<std::byte> vec;
  while (*bytes != '\0') {
    vec.push_back(static_cast<std::byte>(*bytes));
    ++bytes;
  }
  return vec;
}

std::optional<WebBrowserComponent::Resource>
AudioPluginAudioProcessorEditor::getResource(const String &url) {
  const auto urlToRetrive = url == "/"
                                ? String{"index.html"}
                                : url.fromFirstOccurrenceOf("/", false, false);

  if (urlToRetrive == "index.html") {
    return WebBrowserComponent::Resource{stringToBytes(frontend::index_html),
                                         String{"text/html"}};
  }

  if (urlToRetrive == "index.css") {
    return WebBrowserComponent::Resource{stringToBytes(frontend::index_css),
                                         String{"text/css"}};
  }

  if (urlToRetrive == "index.js") {
    return WebBrowserComponent::Resource{stringToBytes(frontend::index_js),
                                         String{"text/javascript"}};
  }

  if (urlToRetrive == "peakHistory") {
    auto &history = processorRef.peakHistory;

    std::vector<std::byte> byteData(history.size() * sizeof(float));
    std::memcpy(byteData.data(), history.data(),
                history.size() * sizeof(float));

    return WebBrowserComponent::Resource{byteData, "application/octet-stream"};
  }

  if (urlToRetrive == "vuHistory") {
    auto &history = processorRef.vuHistory;

    std::vector<std::byte> byteData(history.size() * sizeof(float));
    std::memcpy(byteData.data(), history.data(),
                history.size() * sizeof(float));

    return WebBrowserComponent::Resource{byteData, "application/octet-stream"};
  }

  if (urlToRetrive == "grHistory") {
    auto &history = processorRef.grHistory;

    std::vector<std::byte> byteData(history.size() * sizeof(float));
    std::memcpy(byteData.data(), history.data(),
                history.size() * sizeof(float));

    return WebBrowserComponent::Resource{byteData, "application/octet-stream"};
  }

  return std::nullopt;
}