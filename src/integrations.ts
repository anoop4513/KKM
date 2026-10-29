import { useEffect } from 'react';

const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').trim();
export const whatsAppUrl: string | null = /^\d{8,15}$/.test(whatsappNumber)
  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Katha Kantam Media, I’d like to discuss a project.')}`
  : null;

function validatedBookingUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export const bookingUrl = validatedBookingUrl(import.meta.env.VITE_BOOKING_URL);

const measurementId = String(import.meta.env.VITE_GA4_MEASUREMENT_ID || '').trim().toUpperCase();
export const analyticsConfigured = /^G-[A-Z0-9]{4,20}$/.test(measurementId);
const consentKey = 'kkm-analytics-consent';
const consentEvent = 'kkm:analytics-consent';
const serviceSlugs = new Set([
  'creative-media-production', 'branding-creative-strategy', 'digital-marketing-growth',
  'website-digital-experience', 'ai-business-automation', 'crm-business-technology',
  'data-analytics-performance', 'global-creative-localization', 'help-me-choose',
]);
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Gtag }
}

function consentGranted(): boolean {
  try { return window.localStorage.getItem(consentKey) === 'granted'; }
  catch { return false; }
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(consentKey, granted ? 'granted' : 'denied'); }
  catch { /* If consent cannot be stored, analytics remains off. */ }
  window.dispatchEvent(new CustomEvent(consentEvent));
}

function pageContext() {
  let referrer = '';
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch { /* No referrer is also valid. */ }
  return { page_location: window.location.origin + window.location.pathname, page_title: document.title, page_referrer: referrer };
}

let initialized = false;
function enableAnalytics() {
  if (!analyticsConfigured || !consentGranted()) return;
  if (!initialized) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function (..._args: unknown[]) { window.dataLayer?.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    initialized = true;
    const script = document.createElement('script');
    script.id = 'kkm-ga4-tag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }
  window.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  // Page context is explicit and query-free. No automatic page-view event is sent.
  window.gtag?.('config', measurementId, { ...pageContext(), send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
}

export function useConversionTracking(): void {
  useEffect(() => {
    if (!analyticsConfigured) return;
    let allowed = consentGranted();
    if (allowed) enableAnalytics();

    const consentChanged = () => {
      allowed = consentGranted();
      if (allowed) enableAnalytics();
      else if (initialized) window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    };
    const track = (name: 'enquiry_submitted' | 'whatsapp_click' | 'booking_click', details: { service?: string; consultation?: boolean } = {}) => {
      if (!allowed || !consentGranted()) return;
      const parameters: Record<string, string | boolean> = { ...pageContext() };
      if (details.service && serviceSlugs.has(details.service)) parameters.service = details.service;
      if (typeof details.consultation === 'boolean') parameters.consultation = details.consultation;
      window.gtag?.('event', name, parameters);
    };
    const conversion = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, unknown>>).detail;
      if (!detail || detail.event !== 'enquiry_submitted') return;
      track('enquiry_submitted', { service: typeof detail.service === 'string' ? detail.service : undefined, consultation: typeof detail.consultation === 'boolean' ? detail.consultation : undefined });
    };
    const externalClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[data-conversion]');
      if (!link) return;
      if (link.dataset.conversion === 'whatsapp_click' && whatsAppUrl && link.href === whatsAppUrl) track('whatsapp_click');
      if (link.dataset.conversion === 'booking_click' && bookingUrl && link.href === bookingUrl) track('booking_click', { consultation: true });
    };
    const storageChanged = (event: StorageEvent) => { if (event.key === consentKey || event.key === null) consentChanged(); };
    window.addEventListener(consentEvent, consentChanged);
    window.addEventListener('storage', storageChanged);
    window.addEventListener('kkm:conversion', conversion);
    document.addEventListener('click', externalClick);
    return () => {
      allowed = false;
      window.removeEventListener(consentEvent, consentChanged);
      window.removeEventListener('storage', storageChanged);
      window.removeEventListener('kkm:conversion', conversion);
      document.removeEventListener('click', externalClick);
    };
  }, []);
}
