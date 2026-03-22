(function () {
  try {
    var UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
    var LANDING_PAGE_CONFIG = {
      'warranty-case-evaluation': { page_source: 'meta_warranty_01', campaign_type: 'meta' },
      'american-integrity-claims-attorneys': { page_source: 'google_warranty_01', campaign_type: 'google' },
      'social-security-disability-attorneys': { page_source: 'google_ssdi_01', campaign_type: 'google' },
      'property-damage-claims-attorneys': { page_source: 'google_property_damage_01', campaign_type: 'google' },
    };

    function captureAttribution() {
      try {
        var pathname = window.location.pathname.replace(/^\//, '').split('?')[0];
        var config = LANDING_PAGE_CONFIG[pathname];
        if (config) {
          localStorage.setItem('page_source', config.page_source);
          localStorage.setItem('campaign_type', config.campaign_type);
        }
        if (!localStorage.getItem('page_source')) {
          localStorage.setItem('page_source', 'organic_site');
          localStorage.setItem('campaign_type', 'organic');
        }
        var params = new URLSearchParams(window.location.search);
        UTM_KEYS.forEach(function(key) {
          var value = params.get(key);
          if (value && !localStorage.getItem(key)) {
            localStorage.setItem(key, value);
          }
        });
        if (!localStorage.getItem('referrer')) {
          localStorage.setItem('referrer', document.referrer || '');
        }
        localStorage.setItem('page_url', window.location.href);
      } catch (e) {}
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', captureAttribution);
    } else {
      captureAttribution();
    }

    window.addEventListener('popstate', function() { captureAttribution(); });
    var _ps = history.pushState;
    var _rs = history.replaceState;
    history.pushState = function() { _ps.apply(history, arguments); setTimeout(captureAttribution, 0); };
    history.replaceState = function() { _rs.apply(history, arguments); setTimeout(captureAttribution, 0); };
  } catch (e) {}
})();
