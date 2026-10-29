type EventName = 'form_submit' | 'consultation_request' | 'whatsapp_click';
type EventMetadata = { serviceId?: string; placement?: string; consultationLed?: boolean };

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const eventNames = new Set<EventName>(['form_submit', 'consultation_request', 'whatsapp_click']);
const serviceIds = new Set([
  'creative-media', 'branding-strategy', 'digital-growth', 'websites-experiences',
  'ai-automation', 'crm-business-tech', 'analytics-performance', 'global-localization',
]);
const placements = new Set(['hero', 'header', 'services', 'contact', 'footer', 'form', 'proposal_form', 'floating']);
const metadataKeys = new Set(['serviceId', 'placement', 'consultationLed']);
const consentKey = 'kkm_analytics_consent';
const measurementId = (import.meta.env.VITE_GA4_MEASUREMENT_ID ?? '').trim();
export const analyticsConfigured = /^G-[A-Z0-9]{4,}$/i.test(measurementId);

function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(consentKey) === 'granted';
  } catch {
    return false;
  }
}

// Strip search parameters and fragments from locations sent to analytics.
function cleanLocation(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? `${url.origin}${url.pathname}` : undefined;
  } catch {
    return undefined;
  }
}

/** Loads GA4 only after explicit consent; never sends an automatic page view. */
export function activateAnalyticsIfConsented(): void {
  if (typeof window === 'undefined' || !analyticsConfigured || !hasConsent()) return;
  const browser = window as AnalyticsWindow;
  (browser as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  if (browser.gtag) {
    browser.gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }

  browser.dataLayer = browser.dataLayer || [];
  browser.gtag = (...args: unknown[]) => { browser.dataLayer?.push(args); };
  browser.gtag('js', new Date());
  const pageLocation = cleanLocation(browser.location.href);
  const pageReferrer = cleanLocation(browser.document.referrer);
  browser.gtag('config', measurementId, {
    send_page_view: false,
    ...(pageLocation ? { page_location: pageLocation } : {}),
    ...(pageReferrer ? { page_referrer: pageReferrer } : { page_referrer: '' }),
  });
  const script = browser.document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  browser.document.head.appendChild(script);
}

/** Persist an explicit choice. If storage is unavailable, analytics stays off. */
export function setAnalyticsConsent(consent: boolean): void {
  if (typeof window === 'undefined' || typeof consent !== 'boolean') return;
  const browser = window as AnalyticsWindow;
  try {
    browser.localStorage.setItem(consentKey, consent ? 'granted' : 'denied');
  } catch {
    consent = false;
  }
  if (consent) {
    activateAnalyticsIfConsented();
  } else if (analyticsConfigured) {
    (browser as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
    browser.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }
}

/** Send only approved event names and fixed, non-personal metadata values. */
export function trackEvent(name: EventName, metadata?: EventMetadata): void {
  if (typeof window === 'undefined' || !eventNames.has(name) || !analyticsConfigured || !hasConsent()) return;
  if (metadata !== undefined) {
    if (metadata === null || typeof metadata !== 'object' || Array.isArray(metadata)) return;
    if (Object.keys(metadata).some((key) => !metadataKeys.has(key))) return;
    if (metadata.serviceId !== undefined && !serviceIds.has(metadata.serviceId)) return;
    if (metadata.placement !== undefined && !placements.has(metadata.placement)) return;
    if (metadata.consultationLed !== undefined && typeof metadata.consultationLed !== 'boolean') return;
  }
  activateAnalyticsIfConsented();
  const browser = window as AnalyticsWindow;
  const pageLocation = cleanLocation(browser.location.href);
  const pageReferrer = cleanLocation(browser.document.referrer);
  browser.gtag?.('event', name, {
    ...(metadata?.serviceId ? { service_id: metadata.serviceId } : {}),
    ...(metadata?.placement ? { placement: metadata.placement } : {}),
    ...(metadata?.consultationLed !== undefined ? { consultation_led: metadata.consultationLed } : {}),
    ...(pageLocation ? { page_location: pageLocation } : {}),
    page_referrer: pageReferrer ?? '',
  });
}


