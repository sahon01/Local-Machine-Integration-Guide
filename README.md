# AI Management Dashboard - Enhanced Edition

A comprehensive AI model management and development toolkit with advanced voice support, custom character creation, project integration, and daily planning features.

## 🚀 New Features

### Voice Integration
- **Bengali Voice Support** - Full voice input/output in Bengali (বাংলা)
- **Voice Input Fields** - All input fields support voice commands
- **Voice Reminders** - Time-based voice notifications
- **System Voice Reports** - Spoken system status updates

### Custom AI Characters
- **Character Creator** - Design AI personalities for specific projects
- **Multi-language Characters** - English and Bengali speaking agents
- **Project-Specific Agents** - Agents that understand project context
- **Voice-Enabled Characters** - Characters with voice interaction

### Project Management
- **Project-Agent Integration** - Connect AI agents to specific projects
- **Code Editor Integration** - VS Code, Cursor, WebStorm support
- **Real-time Code Analysis** - Live code review and suggestions
- **Project Monitoring** - Track agent activity across projects

### Daily Planning & Scheduling
- **Daily Planner** - Schedule tasks, meetings, and reminders
- **Voice Reminders** - Time-based voice notifications
- **Task Management** - Voice-enabled task tracking
- **Meeting Scheduler** - Integrated calendar with voice alerts

### System Monitoring
- **Real-time RAM Usage** - Live memory monitoring
- **Performance Optimization** - Prevent system overload
- **Voice Status Reports** - Spoken system health updates
- **Resource Alerts** - Voice warnings for high usage

## 🛠️ Installation

### Quick Start (Windows)
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ai-management-dashboard

# Run the installation script
.\install-windows.bat
\`\`\`

### Manual Installation
\`\`\`bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
# AI Management Dashboard Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3307
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
DATABASE_USER=root
DATABASE_PASSWORD=105585
DATABASE_NAME=modelsraver1
ELEVENLABS_API_KEY=your_api_key_here
\`\`\`

### Voice Configuration
The system automatically detects available voices for English and Bengali. For optimal Bengali voice support, ensure your system has Bengali TTS voices installed.

## 📱 Usage

### Main Dashboard
- **URL:** http://localhost:3000
- **Features:** System overview, quick actions, performance monitoring

### Admin Panel
- **URL:** http://localhost:3000/admin
- **Features:** Complete administrative interface with sidebar navigation

### Key Pages
- **Custom Characters:** `/custom-characters` - Create and manage AI personalities
- **Daily Planner:** `/daily-planner` - Schedule and voice reminders
- **Project Manager:** `/projects` - Project-agent integration
- **System Monitor:** `/system-monitor` - Real-time performance with voice reports
- **Code Integration:** `/code-integration` - Editor-agent connections

## 🎯 Features by Category

### AI Tools
- **AI Chat** - Multi-model conversation interface
- **Custom Characters** - Personalized AI agents
- **Prompt Generator** - Optimized prompt creation
- **Project Ideas** - AI-generated development suggestions

### Project Management
- **Project Manager** - Centralized project overview
- **Project Agents** - AI agents assigned to specific projects
- **Code Integration** - Editor-agent connections
- **Real-time Monitoring** - Live project activity tracking

### Daily Planning
- **Daily Planner** - Task and schedule management
- **Voice Reminders** - Time-based voice notifications
- **Meeting Scheduler** - Calendar integration
- **Work Schedule** - Daily work planning

### System Management
- **System Monitor** - Real-time performance tracking
- **Resource Alerts** - Voice warnings for high usage
- **Performance Optimization** - Prevent system overload
- **Voice Reports** - Spoken system status

### Voice Features
- **Voice Input** - All input fields support voice commands
- **Bengali Support** - Full Bengali voice interaction
- **Voice Reminders** - Time-based notifications
- **Voice Reports** - System status announcements

## 🔊 Voice Commands

### English Commands
- "Add task: Review code"
- "Set reminder for 2 PM"
- "Check system status"
- "Analyze this code"

### Bengali Commands (বাংলা)
- "কাজ যোগ করুন: কোড পর্যালোচনা"
- "দুপুর ২টায় রিমাইন্ডার সেট করুন"
- "সিস্টেম স্ট্যাটাস চেক করুন"

## 🤖 AI Character Creation

### Character Types
- **Developer Mentor** - Code guidance and best practices
- **Code Reviewer** - Automated code review and suggestions
- **Project Manager** - Task and timeline management
- **Data Specialist** - Data analysis and insights
- **Bengali Expert** - Bengali language support

### Character Configuration
- **Personality Traits** - Define character behavior
- **Expertise Areas** - Specify knowledge domains
- **Voice Settings** - Configure voice characteristics
- **Project Assignment** - Link to specific projects

## 📊 System Requirements

### Minimum Requirements
- **RAM:** 16GB (monitored in real-time)
- **CPU:** Multi-core processor
- **Disk:** 100GB free space
- **OS:** Windows 10/11, macOS, or Linux

### Recommended for Voice Features
- **Microphone:** For voice input
- **Speakers/Headphones:** For voice output
- **Bengali TTS:** For Bengali voice support

## 🔧 Troubleshooting

### Common Issues

1. **Voice Input Not Working**
   \`\`\`bash
   # Check microphone permissions
   # Ensure browser has microphone access
   \`\`\`

2. **Bengali Voice Not Available**
   \`\`\`bash
   # Install Bengali TTS voices on your system
   # Windows: Settings > Time & Language > Speech
   \`\`\`

3. **High RAM Usage**
   \`\`\`bash
   # Monitor system performance at /system-monitor
   # Voice alerts will notify of high usage
   \`\`\`

4. **Agent Not Responding**
   \`\`\`bash
   # Check agent status in project manager
   # Restart agent from admin panel
   \`\`\`

## 🌐 Multi-language Support

### Supported Languages
- **English** - Full interface and voice support
- **Bengali (বাংলা)** - Complete localization with voice

### Language Switching
- Use the language selector in the admin sidebar
- Voice commands automatically detect language
- Characters can be configured for specific languages

## 📈 Performance Monitoring

### Real-time Metrics
- **CPU Usage** - Live monitoring with voice alerts
- **Memory Usage** - RAM tracking with optimization suggestions
- **Disk Usage** - Storage monitoring
- **Network Activity** - Bandwidth tracking

### Voice Alerts
- High CPU usage warnings
- Memory optimization suggestions
- Disk space alerts
- System performance reports

## 🔗 Integration

### Code Editors
- **VS Code** - Full integration with extensions
- **Cursor** - AI-powered development
- **WebStorm** - JetBrains IDE support

### AI Models
- **Mistral** - Code analysis and review
- **DeepSeek** - Code generation
- **Phi** - General purpose tasks
- **Gemma** - Documentation generation
- **TinyLlama** - Quick responses

### Voice Services
- **ElevenLabs** - Advanced voice synthesis
- **Browser TTS** - Built-in text-to-speech
- **Speech Recognition** - Voice input processing

## 📝 Development

### Project Structure
\`\`\`
├── app/
│   ├── admin/              # Admin panel pages
│   ├── custom-characters/  # Character management
│   ├── daily-planner/      # Planning and scheduling
│   ├── projects/           # Project management
│   ├── system-monitor/     # Performance monitoring
│   └── code-integration/   # Editor integration
├── components/
│   ├── voice-provider.tsx  # Voice context
│   ├── system-monitor-provider.tsx # System monitoring
│   ├── voice-input-field.tsx # Voice input component
│   └── custom-character-creator.tsx # Character creation
└── lib/
    ├── i18n.ts            # Multi-language support
    └── language-context.tsx # Language provider
\`\`\`

### Adding New Features
1. Create component in appropriate directory
2. Add voice support using `useVoice` hook
3. Integrate with system monitoring if needed
4. Add translations for multi-language support
5. Test with both English and Bengali

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add voice support for new features
4. Include Bengali translations
5. Test system performance impact
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation:** http://localhost:3000/documentation
- **System Monitor:** http://localhost:3000/system-monitor
- **Voice Help:** Say "help" in any voice input field
- **GitHub Issues:** [Create an issue](https://github.com/your-repo/issues)

---

**Note:** This enhanced version includes comprehensive voice support, custom AI character creation, project-agent integration, daily planning features, and real-time system monitoring to ensure optimal performance while providing a rich, interactive development experience.
