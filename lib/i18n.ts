export const languages = {
  en: {
    name: "English",
    code: "en",
  },
  bn: {
    name: "বাংলা",
    code: "bn",
  },
}

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    models: "AI Models",
    aiTools: "AI Tools",
    serverMgmt: "Server Management",
    database: "Database",
    commands: "Commands",
    devTools: "Dev Tools",
    webhooks: "Webhooks",
    documentation: "Documentation",
    settings: "Settings",

    // Dashboard
    dashboardTitle: "AI Management Dashboard",
    dashboardDesc: "Monitor and manage your local AI models and integrations",
    activeModels: "Active Models",
    totalRequests: "Total Requests",
    avgResponseTime: "Avg Response Time",
    connectedEditors: "Connected Editors",

    // Models
    modelsTitle: "AI Models",
    modelsDesc: "Manage and monitor your local AI models",
    modelSettings: "Model Settings",
    viewDetails: "View Details",
    testModel: "Test Model",

    // Installation
    installTitle: "Installation Guide",
    installDesc: "Complete installation and setup instructions for your AI models",
    systemReq: "System Requirements",
    minRam: "Minimum RAM",
    freeDisk: "Free Disk Space",
    gpuSupport: "GPU Support (Optional)",

    // Common
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    refresh: "Refresh",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  },
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    models: "এআই মডেল",
    aiTools: "এআই টুলস",
    serverMgmt: "সার্ভার ব্যবস্থাপনা",
    database: "ডেটাবেস",
    commands: "কমান্ড",
    devTools: "ডেভ টুলস",
    webhooks: "ওয়েবহুক",
    documentation: "ডকুমেন্টেশন",
    settings: "সেটিংস",

    // Dashboard
    dashboardTitle: "এআই ব্যবস্থাপনা ড্যাশবোর্ড",
    dashboardDesc: "আপনার স্থানীয় এআই মডেল এবং ইন্টিগ্রেশন পর্যবেক্ষণ এবং পরিচালনা করুন",
    activeModels: "সক্রিয় মডেল",
    totalRequests: "মোট অনুরোধ",
    avgResponseTime: "গড় প্রতিক্রিয়ার সময়",
    connectedEditors: "সংযুক্ত এডিটর",

    // Models
    modelsTitle: "এআই মডেল",
    modelsDesc: "আপনার স্থানীয় এআই মডেল পরিচালনা এবং পর্যবেক্ষণ করুন",
    modelSettings: "মডেল সেটিংস",
    viewDetails: "বিস্তারিত দেখুন",
    testModel: "মডেল পরীক্ষা করুন",

    // Installation
    installTitle: "ইনস্টলেশন গাইড",
    installDesc: "আপনার এআই মডেলের সম্পূর্ণ ইনস্টলেশন এবং সেটআপ নির্দেশাবলী",
    systemReq: "সিস্টেম প্রয়োজনীয়তা",
    minRam: "ন্যূনতম র‍্যাম",
    freeDisk: "ফ্রি ডিস্ক স্পেস",
    gpuSupport: "জিপিইউ সাপোর্ট (ঐচ্ছিক)",

    // Common
    search: "খুঁজুন",
    add: "যোগ করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    refresh: "রিফ্রেশ",
    loading: "লোড হচ্ছে...",
    success: "সফল",
    error: "ত্রুটি",
    warning: "সতর্কতা",
    info: "তথ্য",
  },
}

export type Language = keyof typeof languages
export type TranslationKey = keyof typeof translations.en
