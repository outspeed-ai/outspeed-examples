import AVFoundation
import OutspeedSDK
import SwiftUI

let OPENAI_API_KEY = ""
let OUTSPEED_API_KEY = ""

struct ContentView: View {
    @State private var conversation: OutspeedSDK.Conversation?
    @State private var connectionStatus: OutspeedSDK.Status = .disconnected
    @State private var webrtcManager: WebRTCManager?
    @State private var showOptionsSheet = false
    @FocusState private var isTextFieldFocused: Bool
    @State private var conversationItems: [LocalConversationItem] = []  // Local conversation items
    @State private var outgoingMessage: String = ""  // Local outgoing message
    @State private var conversation_items: [OutspeedSDK.ConversationItem] = []

    // AppStorage properties
    @AppStorage("openaiApiKey") private var openaiApiKey = OPENAI_API_KEY
    @AppStorage("outspeedApiKey") private var outspeedApiKey = OUTSPEED_API_KEY
    @AppStorage("systemMessage") private var systemMessage = Provider.outspeed.defaultSystemMessage
    @AppStorage("selectedModel") private var selectedModel = Provider.outspeed.defaultModel
    @AppStorage("selectedVoice") private var selectedVoice = Provider.outspeed.defaultVoice
    @AppStorage("selectedProvider") private var selectedProvider = Provider.outspeed.rawValue

    // Computed properties
    private var currentProvider: Provider {
        Provider(rawValue: selectedProvider) ?? .openai
    }

    private var currentApiKey: String {
        switch currentProvider {
        case .openai:
            return openaiApiKey
        case .outspeed:
            return outspeedApiKey
        }
    }

    private var modelOptions: [String] {
        currentProvider.modelOptions
    }

    private var voiceOptions: [String] {
        currentProvider.voiceOptions
    }

    var body: some View {
        VStack(spacing: 12) {
            HeaderView()
            ConnectionControls()
            Divider().padding(.vertical, 6)

            ConversationView()

            MessageInputView()
        }
        .sheet(isPresented: $showOptionsSheet) {
            OptionsView(
                openaiApiKey: $openaiApiKey,
                outspeedApiKey: $outspeedApiKey,
                systemMessage: $systemMessage,
                selectedModel: $selectedModel,
                selectedVoice: $selectedVoice,
                selectedProvider: $selectedProvider,
                modelOptions: modelOptions,
                voiceOptions: voiceOptions
            )
        }
    }

    @ViewBuilder
    private func HeaderView() -> some View {
        VStack(spacing: 2) {
            Text("Advanced Voice Mode")
                .font(.system(size: 24, weight: .bold))
                .padding(.top, 12)
                .lineLimit(1)
                .minimumScaleFactor(0.5)
            Text("In Swift with WebRTC")
                .font(.system(size: 15, weight: .light))
                .padding(.bottom, 10)
        }
    }

    private func initConversationAsync() {
        Task {
            do {
                conversation_items = []

                // Configure system message & first message (ElevenLabs compatible)
                let agentConfig = OutspeedSDK.AgentConfig(
                    prompt: OutspeedSDK.AgentPrompt(prompt: systemMessage),
                    firstMessage: "Hey there, how can i help you with Outspeed today?"
                )

                // Configure voice selection (ElevenLabs compatible)
                let ttsConfig = OutspeedSDK.TTSConfig(voiceId: selectedVoice)
                // example usage of Voice enum
                // let ttsConfig = OutspeedSDK.TTSConfig(voiceId: OutspeedSDK.Voice.david.rawValue)

                let config = OutspeedSDK.SessionConfig(
                    overrides: OutspeedSDK.ConversationConfigOverride(
                        agent: agentConfig,
                        tts: ttsConfig
                    )
                )
                var callbacks = OutspeedSDK.Callbacks()
                callbacks.onConnect = { conversationId in
                    connectionStatus = .connected
                    print("Connected with ID: \(conversationId)")
                }
                callbacks.onMessage = { message, role in
                    print("Role: \(String(describing: role)) Message: \(message)")
                    let newItem = OutspeedSDK.ConversationItem(
                        id: UUID().uuidString, role: String(describing: role),
                        text: message)
                    conversation_items.append(newItem)
                }
                callbacks.onError = { error, info in
                    print("Error: \(error), Info: \(String(describing: info))")
                }
                callbacks.onStatusChange = { status in
                    print("Status changed to: \(status.rawValue)")
                    connectionStatus = status
                }
                callbacks.onDisconnect = {
                    connectionStatus = .disconnected
                }
                conversation = try await OutspeedSDK.Conversation.startSession(
                    config: config,
                    callbacks: callbacks, apiKey: currentApiKey,
                    provider: currentProvider,
                )
                webrtcManager = conversation?.connection
                // Use the conversation instance as needed
            } catch {
                print("Failed to start conversation: \(error)")
            }
        }
    }

    @ViewBuilder
    private func ConnectionControls() -> some View {
        HStack {
            // Connection status indicator
            Circle()
                .frame(width: 12, height: 12)
                // .contentTransition(.numericText())  // needs iOS 16+
                .animation(.easeInOut(duration: 0.3), value: connectionStatus)
                .onChange(of: connectionStatus) { _ in
                    switch connectionStatus {
                    case .connecting:
                        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
                    case .connected:
                        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    case .disconnected:
                        webrtcManager?.eventTypeStr = ""
                    default:
                        break
                    }
                }

            Spacer()

            // Connection Button
            if connectionStatus == .connected {
                Button("Stop Connection") {
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    conversation?.endSession()
                }
                .buttonStyle(.borderedProminent)
            } else {
                Button("Start Connection") {
                    UIImpactFeedbackGenerator(style: .soft).impactOccurred()
                    initConversationAsync()
                }
                .buttonStyle(.borderedProminent)
                .disabled(connectionStatus == .connecting)
                Button {
                    showOptionsSheet.toggle()
                } label: {
                    Image(systemName: "gearshape")
                }
                .padding(.leading, 10)
            }
        }
        .padding(.horizontal)
    }

    // MARK: - Conversation View
    @ViewBuilder
    private func ConversationView() -> some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Conversation")
                    .font(.headline)
                Spacer()
                Text(webrtcManager?.eventTypeStr ?? "")
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
                    .padding(.leading, 16)
            }
            .padding(.horizontal)
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    ForEach(conversation_items) { msg in
                        MessageRow(msg: LocalConversationItem(from: msg))
                    }
                }
                .padding()
            }
        }
    }

    // MARK: - Message Row
    @ViewBuilder
    private func MessageRow(msg: LocalConversationItem) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: msg.roleSymbol)
                .foregroundColor(msg.roleColor)
                .padding(.top, 4)
            Text(msg.text.trimmingCharacters(in: .whitespacesAndNewlines))
                .frame(maxWidth: .infinity, alignment: .leading)
                // .contentTransition(.numericText())  // needs iOS 16+
                .animation(.easeInOut(duration: 0.1), value: msg.text)
        }
        .contextMenu {
            Button("Copy") {
                UIPasteboard.general.string = msg.text
            }
        }
        .padding(.bottom, msg.role == "assistant" || msg.role == "ai" ? 24 : 8)
    }

    // MARK: - Message Input
    @ViewBuilder
    private func MessageInputView() -> some View {
        HStack {
            TextField("Insert message...", text: $outgoingMessage)
                .textFieldStyle(.roundedBorder)
                .focused($isTextFieldFocused)
                .onChange(of: outgoingMessage) { newValue in
                    if let manager = webrtcManager {
                        manager.outgoingMessage = newValue
                    }
                }
            Button("Send") {
                webrtcManager?.sendMessage()
                isTextFieldFocused = false
                outgoingMessage = ""
            }
            .disabled(connectionStatus != .connected)
            .buttonStyle(.bordered)
        }
        .padding([.horizontal, .bottom])
    }
}

// MARK: - Local ConversationItem to resolve type conflict
struct LocalConversationItem: Identifiable {
    let id: String
    let role: String
    var text: String

    var roleSymbol: String {
        role.lowercased() == "user" ? "person.fill" : "sparkles"
    }

    var roleColor: Color {
        role.lowercased() == "user" ? .blue : .purple
    }

    init(id: String, role: String, text: String) {
        self.id = id
        self.role = role
        self.text = text
    }

    // Converter from OutspeedSwift.ConversationItem
    init(from item: OutspeedSDK.ConversationItem) {
        self.id = item.id
        self.role = item.role
        self.text = item.text
    }
}

struct OptionsView: View {
    @Binding var openaiApiKey: String
    @Binding var outspeedApiKey: String
    @Binding var systemMessage: String
    @Binding var selectedModel: String
    @Binding var selectedVoice: String
    @Binding var selectedProvider: String

    let modelOptions: [String]
    let voiceOptions: [String]

    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Provider")) {
                    Picker("Provider", selection: $selectedProvider) {
                        Text("OpenAI").tag(Provider.openai.rawValue)
                        Text("Outspeed").tag(Provider.outspeed.rawValue)
                    }
                    .pickerStyle(.segmented)
                    .onChange(of: selectedProvider) { newValue in
                        let newProvider = Provider(rawValue: newValue) ?? .openai
                        selectedModel = newProvider.defaultModel
                        selectedVoice = newProvider.defaultVoice
                    }
                }

                Section(header: Text("API Keys")) {
                    TextField("OpenAI API Key", text: $openaiApiKey)
                        .autocapitalization(.none)
                    TextField("Outspeed API Key", text: $outspeedApiKey)
                        .autocapitalization(.none)
                }

                Section(header: Text("System Message")) {
                    TextEditor(text: $systemMessage)
                        .frame(minHeight: 100)
                        .cornerRadius(5)
                }

                Section(header: Text("Model")) {
                    Picker("Model", selection: $selectedModel) {
                        ForEach(modelOptions, id: \.self) {
                            Text($0)
                        }
                    }
                    .pickerStyle(.menu)
                }

                Section(header: Text("Voice")) {
                    Picker("Voice", selection: $selectedVoice) {
                        ForEach(voiceOptions, id: \.self) {
                            Text($0.capitalized)
                        }
                    }
                    .pickerStyle(.menu)
                }
            }
            .navigationTitle("Options")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Preview

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
