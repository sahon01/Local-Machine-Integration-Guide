export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    models: "Models",
    database: "Database",
    server: "Server",
    analytics: "Analytics",
    webhooks: "Webhooks",
    users: "Users",
    settings: "Settings",

    // Admin Panel
    adminPanel: "Admin Panel",
    aiManagement: "AI Management",
    administration: "Administration",
    publicAccess: "Public Access",
    publicDashboard: "Public Dashboard",
    aiChat: "AI Chat",
    documentation: "Documentation",
    setupGuide: "Setup Guide",
    troubleshooting: "Troubleshooting",

    // System Status
    language: "Language",
    systemStatus: "System Status",
    allSystemsOperational: "All systems operational",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    add: "Add",
    remove: "Remove",

    // Models
    activeModels: "Active Models",
    totalRequests: "Total Requests",
    averageResponse: "Average Response",
    modelPerformance: "Model Performance",

    // Database
    databaseConnections: "Database Connections",
    queryPerformance: "Query Performance",
    backupStatus: "Backup Status",

    // Server
    serverUptime: "Server Uptime",
    cpuUsage: "CPU Usage",
    memoryUsage: "Memory Usage",
    diskSpace: "Disk Space",
  },
  bn: {
    // Navigation
    dashboard: "ড্যাশবোর্ড",
    models: "মডেল",
    database: "ডেটাবেস",
    server: "সার্ভার",
    analytics: "বিশ্লেষণ",
    webhooks: "ওয়েবহুক",
    users: "ব্যবহারকারী",
    settings: "সেটিংস",

    // Admin Panel
    adminPanel: "অ্যাডমিন প্যানেল",
    aiManagement: "এআই ব্যবস্থাপনা",
    administration: "প্রশাসন",
    publicAccess: "পাবলিক অ্যাক্সেস",
    publicDashboard: "পাবলিক ড্যাশবোর্ড",
    aiChat: "এআই চ্যাট",
    documentation: "ডকুমেন্টেশন",
    setupGuide: "সেটআপ গাইড",
    troubleshooting: "সমস্যা সমাধান",

    // System Status
    language: "ভাষা",
    systemStatus: "সিস্টেম স্ট্যাটাস",
    allSystemsOperational: "সব সিস্টেম চালু",

    // Common
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    success: "সফল",
    cancel: "বাতিল",
    save: "সংরক্ষণ",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    view: "দেখুন",
    add: "যোগ করুন",
    remove: "সরান",

    // Models
    activeModels: "সক্রিয় মডেল",
    totalRequests: "মোট অনুরোধ",
    averageResponse: "গড় প্রতিক্রিয়া",
    modelPerformance: "মডেল পারফরম্যান্স",

    // Database
    databaseConnections: "ডেটাবেস সংযোগ",
    queryPerformance: "কোয়েরি পারফরম্যান্স",
    backupStatus: "ব্যাকআপ স্ট্যাটাস",

    // Server
    serverUptime: "সার্ভার আপটাইম",
    cpuUsage: "সিপিইউ ব্যবহার",
    memoryUsage: "মেমরি ব্যবহার",
    diskSpace: "ডিস্ক স্পেস",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
