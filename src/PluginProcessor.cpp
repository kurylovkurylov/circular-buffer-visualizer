#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
AudioPluginAudioProcessor::AudioPluginAudioProcessor(
    AudioProcessorValueTreeState::ParameterLayout layout)
    : AudioProcessor(
          BusesProperties()
#if !JucePlugin_IsMidiEffect
#if !JucePlugin_IsSynth
              .withInput("Input", juce::AudioChannelSet::stereo(), true)
#endif
              .withOutput("Output", juce::AudioChannelSet::stereo(), true)
#endif
              ),
      parameters(layout), state(*this, nullptr, "STATE", std::move(layout)) {
  peakHistory.resize(historySize);
  peakHistory.fill(-100.0f);
  grHistory.resize(historySize);
  grHistory.fill(0.0f);
  vuHistory.resize(historySize);
  vuHistory.fill(-100.0f);
}

AudioPluginAudioProcessor::~AudioPluginAudioProcessor() {}

//==============================================================================
const juce::String AudioPluginAudioProcessor::getName() const {
  return JucePlugin_Name;
}

bool AudioPluginAudioProcessor::acceptsMidi() const {
#if JucePlugin_WantsMidiInput
  return true;
#else
  return false;
#endif
}

bool AudioPluginAudioProcessor::producesMidi() const {
#if JucePlugin_ProducesMidiOutput
  return true;
#else
  return false;
#endif
}

bool AudioPluginAudioProcessor::isMidiEffect() const {
#if JucePlugin_IsMidiEffect
  return true;
#else
  return false;
#endif
}

double AudioPluginAudioProcessor::getTailLengthSeconds() const { return 0.0; }

int AudioPluginAudioProcessor::getNumPrograms() {
  return 1; // NB: some hosts don't cope very well if you tell them there are 0
            // programs, so this should be at least 1, even if you're not really
            // implementing programs.
}

int AudioPluginAudioProcessor::getCurrentProgram() { return 0; }

void AudioPluginAudioProcessor::setCurrentProgram(int index) {
  juce::ignoreUnused(index);
}

const juce::String AudioPluginAudioProcessor::getProgramName(int index) {
  juce::ignoreUnused(index);
  return {};
}

void AudioPluginAudioProcessor::changeProgramName(int index,
                                                  const juce::String &newName) {
  juce::ignoreUnused(index, newName);
}

//==============================================================================
void AudioPluginAudioProcessor::prepareToPlay(double sampleRate,
                                              int samplesPerBlock) {
  // Use this method as the place to do any pre-playback
  // initialisation that you need..
  juce::ignoreUnused(sampleRate, samplesPerBlock);
  juce::dsp::ProcessSpec spec;
  spec.sampleRate = sampleRate;
  spec.maximumBlockSize = (uint32)samplesPerBlock;
  spec.numChannels = (uint32)getTotalNumOutputChannels();

  inGain.prepare(spec);
  outGain.prepare(spec);
  mixer.prepare(spec);

  inGain.setRampDurationSeconds(0.05);
  outGain.setRampDurationSeconds(0.05);
}

void AudioPluginAudioProcessor::releaseResources() {
  // When playback stops, you can use this as an opportunity to free up any
  // spare memory, etc.
}

bool AudioPluginAudioProcessor::isBusesLayoutSupported(
    const BusesLayout &layouts) const {
#if JucePlugin_IsMidiEffect
  juce::ignoreUnused(layouts);
  return true;
#else
  // This is the place where you check if the layout is supported.
  // In this template code we only support mono or stereo.
  // Some plugin hosts, such as certain GarageBand versions, will only
  // load plugins that support stereo bus layouts.
  if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono() &&
      layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
    return false;

  // This checks if the input layout matches the output layout
#if !JucePlugin_IsSynth
  if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
    return false;
#endif

  return true;
#endif
}

void AudioPluginAudioProcessor::processBlock(juce::AudioBuffer<float> &buffer,
                                             juce::MidiBuffer &midiMessages) {
  juce::ignoreUnused(midiMessages);
  juce::ScopedNoDenormals noDenormals;

  updateClipperParameters();
  inGain.setGainDecibels(parameters.inGain.get());
  outGain.setGainDecibels(parameters.outGain.get());
  mixer.setWetMixProportion(parameters.mix.get() * 0.01f);

  juce::AudioBuffer<float> inputSamples{1, buffer.getNumSamples()};

  juce::dsp::AudioBlock<float> block(buffer);
  juce::dsp::ProcessContextReplacing<float> context(block);

  mixer.pushDrySamples(context.getInputBlock());

  inGain.process(context);
  inputSamples.copyFrom(0, 0, buffer.getReadPointer(0), buffer.getNumSamples());
  clipper.process(context);

  for (int i = 0; i < buffer.getNumSamples(); i++) {
    float drySample = inputSamples.getSample(0, i);
    float wetSample = buffer.getSample(0, i);

    pushSample(drySample, wetSample);
  }

  outGain.process(context);

  mixer.mixWetSamples(context.getOutputBlock());
}

void AudioPluginAudioProcessor::updateClipperParameters() {
  float clipThresholdValue = parameters.clipThreshold.get();
  float saturationThresholdValue = parameters.saturationThreshold.get();

  float clipThresholdLinear = Decibels::decibelsToGain(clipThresholdValue);
  float saturationThresholdLinear =
      Decibels::decibelsToGain(saturationThresholdValue);

  clipper.setThresholds(clipThresholdLinear, saturationThresholdLinear);
}

//==============================================================================
bool AudioPluginAudioProcessor::hasEditor() const {
  return true; // (change this to false if you choose to not supply an editor)
}

juce::AudioProcessorEditor *AudioPluginAudioProcessor::createEditor() {
  return new AudioPluginAudioProcessorEditor(*this);
}

//==============================================================================
void AudioPluginAudioProcessor::getStateInformation(
    juce::MemoryBlock &destData) {
  juce::MemoryOutputStream mos(destData, true);
  state.state.writeToStream(mos);
}

void AudioPluginAudioProcessor::setStateInformation(const void *data,
                                                    int sizeInBytes) {
  auto tree =
      juce::ValueTree::readFromData(data, static_cast<size_t>(sizeInBytes));

  if (tree.isValid()) {
    state.replaceState(tree);
  }
}

//==============================================================================
// This creates new instances of the plugin..
juce::AudioProcessor *JUCE_CALLTYPE createPluginFilter() {
  return new AudioPluginAudioProcessor({});
}
