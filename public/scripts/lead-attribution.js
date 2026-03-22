/* =========================================
   GLOBAL LEAD ATTRIBUTION TRACKING
========================================= */
(function () {
  try {
    console.log('[Lead Attribution] Script initialized');

    var UTM_KEYS = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term'
    ];

    var LANDING_PAGE_CONFIG = {
      'warranty-case-evaluation': { page_source: 'meta_warranty_01', campaign_type: 'meta' },
      'american-integrity-claims-attorneys': { page_source: 'google_warranty_01', campaign_type: 'google' },
      'social-security-disability-attorneys': { page_source: 'google_ssdi_01', campaign_type: 'google' },
      'property-damage-claims-attorneys': { page_source: 'google_property_damage_01', campaign_type: 'google' },
    };

    function setPageIdentifier() {
      try {
        var pathname = window.location.pathname.replace(/^\//, '').split('?')[0];
        var config = LANDING_PAGE_CONFIG[pathname];
        if (config) {
          localStorage.setItem('page_source', config.page_source);
          localStorage.setItem('campaign_type', config.campaign_type);
          console.log('[Lead Attribution] Set page identifier:', {
            page_source: config.page_source,
            campaign_type: config.campaign_type,
            pathname: pathname
          });
        }
      } catch (error) {
        console.error('[Lead Attribution] Error setting page identifier:', error);
      }
    }

    function setOrganicFallback() {
      try {
        if (!localStorage.getItem('page_source')) {
          localStorage.setItem('page_source', 'organic_site');
          localStorage.setItem('campaign_type', 'organic');
          console.log('[Lead Attribution] Set organic fallback:', {
            page_source: 'organic_site',
            campaign_type: 'organic'
          });
        }
      } catch (error) {
        console.error('[Lead Attribution] Error setting organic fallback:', error);
      }
    }

    function captureAttribution() {
      try {
        console.log('[Lead Attribution] Capturing attribution data...');
        setPageIdentifier();
        setOrganicFallback();

        var params = new URLSearchParams(window.location.search);
        UTM_KEYS.forEach(function(key) {
          var value = params.get(key);
          if (value && !localStorage.getItem(key)) {
            localStorage.setItem(key, value);
            console.log('[Lead Attribution] Captured UTM:', key, '=', value);
          }
        });

        if (!localStorage.getItem('referrer')) {
          var referrer = document.referrer || '';
          localStorage.setItem('referrer', referrer);
          console.log('[Lead Attribution] Captured referrer:', referrer || '(empty)');
        }

        var currentUrl = window.location.href;
        localStorage.setItem('page_url', currentUrl);
        console.log('[Lead Attribution] Updated page_url:', currentUrl);
      } catch (error) {
        console.error('[Lead Attribution] Error in captureAttribution:', error);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', captureAttribution);
    } else {
      captureAttribution();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function() {
        captureAttribution();
      });

      var originalPushState = history.pushState;
      var originalReplaceState = history.replaceState;

      history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(captureAttribution, 0);
      };

      history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(captureAttribution, 0);
      };
    }
  } catch (error) {
    console.error('[Lead Attribution] Script initialization error:', error);
  }
})();
