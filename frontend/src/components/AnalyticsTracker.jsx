import { useEffect } from 'react';

/**
 * Analytics Tracking Component
 * 
 * Add your tracking IDs in the .env file:
 * REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * REACT_APP_META_PIXEL_ID=XXXXXXXXXX
 */

const AnalyticsTracker = () => {
  useEffect(() => {
    // Google Analytics 4
    const gaMeasurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    
    if (gaMeasurementId && gaMeasurementId !== 'G-XXXXXXXXXX') {
      // Load GA4 script
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
      document.head.appendChild(gaScript);
      
      // Initialize GA4
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId, {
        page_title: document.title,
        page_location: window.location.href
      });
      
      console.log('Google Analytics initialized:', gaMeasurementId);
    }

    // Meta Pixel
    const metaPixelId = process.env.REACT_APP_META_PIXEL_ID || 'XXXXXXXXXX';
    
    if (metaPixelId && metaPixelId !== 'XXXXXXXXXX') {
      // Initialize Meta Pixel
      !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;
        n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];
        t=b.createElement(e);t.async=!0;
        t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s);
      }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', metaPixelId);
      window.fbq('track', 'PageView');
      
      console.log('Meta Pixel initialized:', metaPixelId);
    }

    // Track page views on route changes
    const handleRouteChange = () => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href
        });
      }
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
};

// Tracking utility functions
export const trackEvent = (eventName, eventData = {}) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  // Meta Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, eventData);
  }
  
  console.log('Event tracked:', eventName, eventData);
};

export const trackCTAClick = (buttonLocation) => {
  trackEvent('cta_click', {
    button_location: buttonLocation,
    page_url: window.location.href
  });
  
  if (window.fbq) {
    window.fbq('track', 'Lead');
  }
};

export const trackFormOpen = () => {
  trackEvent('form_open', {
    page_url: window.location.href
  });
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: 'Business Form',
      content_type: 'form'
    });
  }
};

export const trackFormSubmit = () => {
  trackEvent('form_submit', {
    page_url: window.location.href
  });
};

export const trackScrollDepth = (percentage) => {
  trackEvent('scroll_depth', {
    percent_scrolled: percentage,
    page_url: window.location.href
  });
};

export default AnalyticsTracker;
