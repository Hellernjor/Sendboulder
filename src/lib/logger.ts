
// Centralized logging utility
export class Logger {
  static debug(component: string, message: string, data?: any) {
    console.log(`🔍 [${component}] ${message}`, data || '');
  }

  static info(component: string, message: string, data?: any) {
    console.log(`ℹ️ [${component}] ${message}`, data || '');
  }

  static warn(component: string, message: string, data?: any) {
    console.warn(`⚠️ [${component}] ${message}`, data || '');
  }

  static error(component: string, message: string, error?: any) {
    console.error(`❌ [${component}] ${message}`, error || '');
  }

  static success(component: string, message: string, data?: any) {
    console.log(`✅ [${component}] ${message}`, data || '');
  }

  static network(component: string, action: string, url: string, data?: any) {
    console.log(`🌐 [${component}] ${action} -> ${url}`, data || '');
  }

  static db(component: string, action: string, table?: string, data?: any) {
    console.log(`🗄️ [${component}] ${action}${table ? ` on ${table}` : ''}`, data || '');
  }

  static auth(component: string, action: string, data?: any) {
    console.log(`🔐 [${component}] ${action}`, data || '');
  }

  static component(component: string, lifecycle: string, data?: any) {
    console.log(`🧩 [${component}] ${lifecycle}`, data || '');
  }
}
