export function sendAnalyticsEvent(eventName: string, payload: Record<string, any> = {}) {
    console.log('[ANALYTICS]', eventName, payload);
  }
  