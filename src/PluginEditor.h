#pragma once

#include "Frontend.h"
#include "PluginProcessor.h"

const juce::String localDevServerAddress = "http://localhost:5173";

//==============================================================================
class AudioPluginAudioProcessorEditor final
    : public juce::AudioProcessorEditor {
public:
  explicit AudioPluginAudioProcessorEditor(AudioPluginAudioProcessor &);
  ~AudioPluginAudioProcessorEditor() override;

  //==============================================================================
  void paint(juce::Graphics &) override;
  void resized() override;

private:
  AudioPluginAudioProcessor &processorRef;

  WebSliderRelay clipThresholdRelay{"clipThresholdSlider"};
  WebSliderRelay saturationThresholdRelay{"saturationThresholdSlider"};
  WebSliderRelay inGainRelay{"inGainSlider"};
  WebSliderRelay outGainRelay{"outGainSlider"};
  WebSliderRelay mixRelay{"mixSlider"};

  juce::WebBrowserComponent webBrowser{
      juce::WebBrowserComponent::Options{}
          .withBackend(WebBrowserComponent::Options::Backend::webview2)
          .withWinWebView2Options(
              WebBrowserComponent::Options::WinWebView2{}.withUserDataFolder(
                  File::getSpecialLocation(
                      File::SpecialLocationType::tempDirectory)))
          .withNativeIntegrationEnabled(true)
          .withOptionsFrom(clipThresholdRelay)
          .withOptionsFrom(saturationThresholdRelay)
          .withOptionsFrom(inGainRelay)
          .withOptionsFrom(outGainRelay)
          .withOptionsFrom(mixRelay)
          .withResourceProvider(
              [this](const auto &url) { return getResource(url); })};

  WebSliderParameterAttachment clipThresholdAttachment;
  WebSliderParameterAttachment saturationThresholdAttachment;
  WebSliderParameterAttachment inGainAttachment;
  WebSliderParameterAttachment outGainAttachment;
  WebSliderParameterAttachment mixAttachment;

  std::optional<WebBrowserComponent::Resource> getResource(const String &url);
  //==============================================================================

  JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioPluginAudioProcessorEditor)
};

inline File getExamplesDirectory() noexcept {
#ifdef PIP_JUCE_EXAMPLES_DIRECTORY
  MemoryOutputStream mo;

  auto success = Base64::convertFromBase64(
      mo, JUCE_STRINGIFY(PIP_JUCE_EXAMPLES_DIRECTORY));
  ignoreUnused(success);
  jassert(success);

  return mo.toString();
#elif defined PIP_JUCE_EXAMPLES_DIRECTORY_STRING
  return File{CharPointer_UTF8{PIP_JUCE_EXAMPLES_DIRECTORY_STRING}};
#else
  auto currentFile = File::getSpecialLocation(
      File::SpecialLocationType::currentApplicationFile);
  auto exampleDir = currentFile.getParentDirectory().getChildFile("examples");

  if (exampleDir.exists())
    return exampleDir;

  // keep track of the number of parent directories so we don't go on endlessly
  for (int numTries = 0; numTries < 15; ++numTries) {
    if (currentFile.getFileName() == "examples")
      return currentFile;

    const auto sibling = currentFile.getSiblingFile("examples");

    if (sibling.exists())
      return sibling;

    currentFile = currentFile.getParentDirectory();
  }

  return currentFile;
#endif
}

enum class AssertAssetExists { no, yes };

inline std::unique_ptr<InputStream> createAssetInputStream(
    const char *resourcePath,
    [[maybe_unused]] AssertAssetExists assertExists = AssertAssetExists::yes) {
#if JUCE_ANDROID
  ZipFile apkZip(File::getSpecialLocation(File::invokedExecutableFile));
  const auto fileIndex =
      apkZip.getIndexOfFileName("assets/" + String(resourcePath));

  if (fileIndex == -1) {
    jassert(assertExists == AssertAssetExists::no);
    return {};
  }

  return std::unique_ptr<InputStream>(apkZip.createStreamForEntry(fileIndex));
#else
#if JUCE_IOS
  auto assetsDir = File::getSpecialLocation(File::currentExecutableFile)
                       .getSiblingFile("Assets");
#elif JUCE_MAC
  auto assetsDir = File::getSpecialLocation(File::currentExecutableFile)
                       .getParentDirectory()
                       .getSiblingFile("Resources")
                       .getChildFile("Assets");

  if (!assetsDir.exists())
    assetsDir = getExamplesDirectory().getChildFile("Assets");
#else
  auto assetsDir = getExamplesDirectory().getChildFile("Assets");
#endif

  auto resourceFile = assetsDir.getChildFile(resourcePath);

  if (!resourceFile.existsAsFile()) {
    jassert(assertExists == AssertAssetExists::no);
    return {};
  }

  return resourceFile.createInputStream();
#endif
}

static ZipFile *getZipFile() {
  static auto stream = createAssetInputStream("UI.zip", AssertAssetExists::no);

  if (stream == nullptr)
    return nullptr;

  static ZipFile f{stream.get(), false};
  return &f;
}

static auto streamToVector(InputStream &stream) {
  std::vector<std::byte> result((size_t)stream.getTotalLength());
  stream.setPosition(0);
  [[maybe_unused]] const auto bytesRead =
      stream.read(result.data(), result.size());
  jassert(bytesRead == (ssize_t)result.size());
  return result;
}

static const char *getMimeForExtension(const String &extension) {
  static const std::unordered_map<String, const char *> mimeMap = {
      {{"htm"}, "text/html"},
      {{"html"}, "text/html"},
      {{"txt"}, "text/plain"},
      {{"jpg"}, "image/jpeg"},
      {{"jpeg"}, "image/jpeg"},
      {{"svg"}, "image/svg+xml"},
      {{"ico"}, "image/vnd.microsoft.icon"},
      {{"json"}, "application/json"},
      {{"png"}, "image/png"},
      {{"css"}, "text/css"},
      {{"map"}, "application/json"},
      {{"js"}, "text/javascript"},
      {{"woff2"}, "font/woff2"}};

  if (const auto it = mimeMap.find(extension.toLowerCase());
      it != mimeMap.end())
    return it->second;

  jassertfalse;
  return "";
}

static String getExtension(String filename) {
  return filename.fromLastOccurrenceOf(".", false, false);
}