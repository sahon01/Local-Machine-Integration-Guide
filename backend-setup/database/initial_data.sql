-- Initial Data for ZombieCoder Admin Database
-- Version: 1.0.0

-- Insert Servers
INSERT INTO servers (name, port, base_url, type, description, is_active) VALUES
('Our-Server', 12345, 'http://localhost', 'main_server', 'Main AI server with unified agent system', TRUE),
('Orchestration API', 8000, 'http://localhost', 'orchestration', 'FastAPI orchestration with 5 agents', TRUE),
('OpenAI Gateway', 8001, 'http://localhost', 'gateway', 'OpenAI-compatible gateway router', TRUE),
('Bengali NLP Agent', 8002, 'http://localhost', 'agent', 'Bengali language processing', TRUE),
('Code Generation Agent', 8003, 'http://localhost', 'agent', 'AI-powered code generation', TRUE),
('Code Review Agent', 8004, 'http://localhost', 'agent', 'Automated code review', TRUE),
('Documentation Agent', 8005, 'http://localhost', 'agent', 'Auto-documentation generation', TRUE),
('Testing Agent', 8006, 'http://localhost', 'agent', 'Unit test generation', TRUE),
('Deployment Agent', 8007, 'http://localhost', 'agent', 'Production deployment automation', TRUE),
('Voice Processor', 8014, 'http://localhost', 'agent', 'Voice command processing', TRUE),
('Ollama Server', 11434, 'http://localhost', 'ollama', 'Local AI model server', TRUE);

-- Insert Orchestration Agents (Server ID = 2, Port 8000)
INSERT INTO agents (name, agent_type, server_id, endpoint, capabilities, description, is_active) VALUES
('Editor Agent', 'editor', 2, '/agents/editor', 
  '["code_editing", "refactoring", "debugging", "code_formatting", "import_organization", "variable_renaming", "function_extraction", "class_restructuring"]',
  'Code editing and refactoring specialist', TRUE),

('Analyzer Agent', 'analyzer', 2, '/agents/analyzer',
  '["code_analysis", "quality_check", "security_scan", "complexity_analysis", "style_checking"]',
  'Code quality and security analyzer', TRUE),

('Generator Agent', 'generator', 2, '/agents/generator',
  '["code_generation", "template_creation", "boilerplate_generation", "api_endpoint_generation", "test_case_generation", "documentation_generation"]',
  'Code generation and template creation', TRUE),

('Translator Agent', 'translator', 2, '/agents/translator',
  '["text_translation", "code_comment_translation", "documentation_translation", "multilingual_support", "bengali_translation", "english_translation"]',
  'Multi-language translation specialist', TRUE),

('Optimizer Agent', 'optimizer', 2, '/agents/optimizer',
  '["performance_optimization", "memory_optimization", "code_cleanup", "algorithm_optimization", "database_query_optimization", "bottleneck_detection", "profiling"]',
  'Performance and memory optimization specialist', TRUE);

-- Insert Specialized Agents (Different servers)
INSERT INTO agents (name, agent_type, server_id, endpoint, capabilities, description, is_active) VALUES
('Bengali NLP', 'nlp', 4, '/v1/chat/completions',
  '["bengali_processing", "language_understanding", "text_generation", "sentiment_analysis"]',
  'Bengali language processing specialist', TRUE),

('Code Generation', 'code_gen', 5, '/v1/chat/completions',
  '["code_generation", "syntax_completion", "boilerplate_creation", "smart_suggestions"]',
  'AI-powered code generation', TRUE),

('Code Review', 'code_review', 6, '/v1/chat/completions',
  '["code_analysis", "bug_detection", "optimization_suggestions", "best_practices"]',
  'Automated code review and analysis', TRUE),

('Documentation', 'documentation', 7, '/v1/chat/completions',
  '["doc_generation", "api_docs", "readme_creation", "inline_comments"]',
  'Documentation generation specialist', TRUE),

('Testing', 'testing', 8, '/v1/chat/completions',
  '["test_generation", "unit_tests", "integration_tests", "test_coverage"]',
  'Test case generation and validation', TRUE),

('Deployment', 'deployment', 9, '/v1/chat/completions',
  '["deployment_automation", "ci_cd", "docker_integration", "kubernetes"]',
  'Production deployment automation', TRUE),

('Voice Processor', 'voice', 10, '/v1/audio/speech',
  '["tts", "stt", "voice_commands", "audio_processing"]',
  'Voice processing and recognition', TRUE);

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value, category, data_type, description) VALUES
('site_name', 'ZombieCoder AI Infrastructure', 'general', 'string', 'Site name'),
('site_tagline', 'যেখানে কোড ও কথা বলে', 'general', 'string', 'Site tagline in Bengali'),
('admin_email', 'infi@zombiecoder.my.id', 'contact', 'string', 'Admin contact email'),
('admin_phone', '+880 1323-626282', 'contact', 'string', 'Admin contact phone'),
('default_model', 'llama3.2:1b', 'ai', 'string', 'Default AI model'),
('ollama_url', 'http://localhost:11434', 'ai', 'string', 'Ollama server URL'),
('auto_health_check', 'true', 'monitoring', 'boolean', 'Enable automatic health checks'),
('health_check_interval', '60', 'monitoring', 'number', 'Health check interval in seconds'),
('max_response_time', '5000', 'performance', 'number', 'Maximum acceptable response time in ms'),
('enable_logging', 'true', 'system', 'boolean', 'Enable activity logging'),
('log_retention_days', '30', 'system', 'number', 'Number of days to retain logs');

-- Insert Default Menu Items
INSERT INTO menu_items (name, name_bn, route, icon, category, order_index, visible) VALUES
('Dashboard', 'ড্যাশবোর্ড', '/admin', 'LayoutDashboard', 'main', 1, TRUE),
('Models', 'মডেল', '/admin/models', 'Brain', 'main', 2, TRUE),
('Agents', 'এজেন্ট', '/admin/agents', 'Bot', 'main', 3, TRUE),
('Servers', 'সার্ভার', '/admin/servers', 'Server', 'main', 4, TRUE),
('Database', 'ডাটাবেস', '/database', 'Database', 'tools', 5, TRUE),
('AI Chat', 'এআই চ্যাট', '/ai-chat', 'MessageSquare', 'tools', 6, TRUE),
('Productivity', 'উৎপাদনশীলতা', '/admin/productivity', 'Briefcase', 'tools', 7, TRUE),
('Analytics', 'বিশ্লেষণ', '/admin/analytics', 'BarChart', 'monitoring', 8, TRUE),
('Settings', 'সেটিংস', '/admin/settings', 'Settings', 'system', 9, TRUE),
('Documentation', 'ডকুমেন্টেশন', '/documentation', 'Book', 'help', 10, TRUE);

-- Insert Sample AI Models
INSERT INTO ai_models (name, provider, model_identifier, server_id, status, version, description) VALUES
('Llama 3.2 1B', 'Ollama', 'llama3.2:1b', 11, 'active', '1b', 'Small, fast general-purpose model'),
('Llama 3.2 3B', 'Ollama', 'llama3.2:3b', 11, 'active', '3b', 'Balanced performance and quality'),
('CodeLlama', 'Ollama', 'codellama:7b', 11, 'active', '7b', 'Specialized for code generation'),
('Mistral', 'Ollama', 'mistral:7b', 11, 'active', '7b', 'High-quality general model'),
('Phi-3', 'Ollama', 'phi3:mini', 11, 'active', 'mini', 'Microsoft small language model');
