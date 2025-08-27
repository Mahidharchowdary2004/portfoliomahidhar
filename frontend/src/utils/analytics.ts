// Google Analytics event tracking utility
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  window.gtag('config', 'G-QRB2QHM4E3', {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track project clicks
export const trackProjectClick = (projectName: string, linkType: 'github' | 'deployment') => {
  trackEvent('project_click', 'Projects', `${projectName} - ${linkType}`);
};

// Track contact form submissions
export const trackContactFormSubmit = (success: boolean) => {
  trackEvent('contact_form', 'Contact', success ? 'success' : 'error');
}; 