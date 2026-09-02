/*
=========================================================
ZENLYTA — UNIVERSAL PNP AD ENGINE (ADSENSE & ADSTERRA)
=========================================================
- Plug-and-Play detection via /ads.txt or window.ZENLYTA_AD_CONFIG
- Supports Google AdSense (responsive & auto-ads)
- Supports Adsterra (banners, direct scripts, responsive wrappers)
- Clean No-Ad policy: When no active provider is detected in ads.txt,
  all ad containers are hidden completely without rendering dummy ads.
=========================================================
*/


/*


(function () {
    "use strict";

    const config = window.ZENLYTA_AD_CONFIG || {
        provider: "auto",
        showLabels: true,
        label: "Advertisement"
    };

    // State object holding parsed credentials
    const activeState = {
        provider: config.provider || "auto",
        adsense: {
            publisherId: (config.adsense && config.adsense.publisherId) || "",
            slots: (config.adsense && config.adsense.slots) || {}
        },
        adsterra: {
            domain: (config.adsterra && config.adsterra.domain) || "",
            slots: (config.adsterra && config.adsterra.slots) || {},
            directUnits: (config.adsterra && config.adsterra.directUnits) || {},
            keys: []
        }
    };

    /*

    
    -----------------------------------------------------
    01. CREATE AD LABEL
    -----------------------------------------------------
    */

    /*
    function createLabel() {
        if (config.showLabels === false) {
            return null;
        }

        const label = document.createElement("div");
        label.className = "ad-label";
        label.textContent = config.label || "Advertisement";
        return label;
    }

    /*
    -----------------------------------------------------
    02. DUMMY AD RENDERER (ONLY IF EXPLICITLY ENABLED)
    -----------------------------------------------------
    */

    /*
    function renderDummy(slot, position) {
        const dummy = config.dummy || {};
        if (dummy.enabled !== true) {
            renderDisabled(slot);
            return;
        }

        slot.innerHTML = "";
        unhideParentSection(slot);

        const label = createLabel();
        if (label) {
            slot.appendChild(label);
        }

        const ad = document.createElement("div");
        ad.className = "zenlyta-dummy-ad";

        const positionBadge = document.createElement("span");
        positionBadge.className = "dummy-ad-position";
        positionBadge.textContent = "ADVERTISEMENT • " + String(position).toUpperCase();

        const brand = document.createElement("div");
        brand.className = "dummy-ad-brand";
        brand.textContent = dummy.brand || "ZENLYTA";

        const title = document.createElement("div");
        title.className = "dummy-ad-title";
        title.textContent = dummy.title || "Fast, Private & In-Browser Tools";

        const description = document.createElement("div");
        description.className = "dummy-ad-description";
        description.textContent = dummy.description || "100% Client-side conversions and utilities.";

        const button = document.createElement("span");
        button.className = "dummy-ad-button";
        button.textContent = dummy.buttonText || "Explore Tools";

        ad.appendChild(positionBadge);
        ad.appendChild(brand);
        ad.appendChild(title);
        ad.appendChild(description);
        ad.appendChild(button);

        slot.appendChild(ad);
    }

    /*
    -----------------------------------------------------
    03. GOOGLE ADSENSE RENDERER
    -----------------------------------------------------
    */

    /*
    function renderAdSense(slot, position) {
        let pubId = activeState.adsense.publisherId;
        if (!pubId) {
            renderDisabled(slot);
            return;
        }

        // Normalize publisher ID format (ensure ca-pub- prefix)
        if (!pubId.startsWith("ca-pub-") && pubId.startsWith("pub-")) {
            pubId = "ca-" + pubId;
        } else if (!pubId.startsWith("ca-pub-") && /^\d+$/.test(pubId)) {
            pubId = "ca-pub-" + pubId;
        }

        slot.innerHTML = "";
        unhideParentSection(slot);

        const label = createLabel();
        if (label) {
            slot.appendChild(label);
        }

        const adSlotId = activeState.adsense.slots && activeState.adsense.slots[position];

        const ad = document.createElement("ins");
        ad.className = "adsbygoogle";
        ad.style.display = "block";
        ad.setAttribute("data-ad-client", pubId);
        
        if (adSlotId) {
            ad.setAttribute("data-ad-slot", adSlotId);
        }
        
        ad.setAttribute("data-ad-format", "auto");
        ad.setAttribute("data-full-width-responsive", "true");

        slot.appendChild(ad);

        // Load AdSense library script once
        if (!document.querySelector("script[data-zenlyta-adsense]")) {
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(pubId);
            script.crossOrigin = "anonymous";
            script.dataset.zenlytaAdsense = "true";
            document.head.appendChild(script);
        }

        // Request ad fill
        const pushAd = () => {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.warn("Zenlyta AdSense error:", error);
            }
        };

        if (window.adsbygoogle) {
            pushAd();
        } else {
            setTimeout(pushAd, 1000);
        }
    }

    /*
    -----------------------------------------------------
    04. ADSTERRA RENDERER
    -----------------------------------------------------
    */

    /*
    function renderAdsterra(slot, position) {
        const directUnit = activeState.adsterra.directUnits && activeState.adsterra.directUnits[position];

        if (directUnit && directUnit.containerId && directUnit.scriptUrl) {
            renderAdsterraDirectUnit(slot, directUnit);
            return;
        }

        const slotKey = (activeState.adsterra.slots && activeState.adsterra.slots[position]) ||
                        (activeState.adsterra.keys && activeState.adsterra.keys[0]) || "";

        if (!slotKey) {
            renderDisabled(slot);
            return;
        }

        slot.innerHTML = "";
        unhideParentSection(slot);

        const label = createLabel();
        if (label) {
            slot.appendChild(label);
        }

        const container = document.createElement("div");
        container.className = "ad-provider-container";
        container.dataset.provider = "adsterra";
        container.dataset.position = position;

        // Standard Adsterra invocation via iframe wrapper
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.scrolling = "no";

        // Default dimensions based on placement
        let width = 728;
        let height = 90;
        if (position === "content") {
            width = 300;
            height = 250;
        }

        iframe.style.maxWidth = width + "px";
        iframe.style.height = height + "px";

        const scriptDomain = activeState.adsterra.domain || "www.highperformanceformat.com";
        iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;overflow:hidden;}</style></head><body><script type="text/javascript">atOptions = {'key' : '${slotKey}','format' : 'iframe','height' : ${height},'width' : ${width},'params' : {}};</script><script type="text/javascript" src="//${scriptDomain}/${slotKey}/invoke.js"></script></body></html>`;

        container.appendChild(iframe);
        slot.appendChild(container);
    }

    function renderAdsterraDirectUnit(slot, unit) {
        slot.innerHTML = "";
        unhideParentSection(slot);

        const label = createLabel();
        if (label) {
            slot.appendChild(label);
        }

        const container = document.createElement("div");
        container.className = "ad-provider-container";
        container.dataset.provider = "adsterra";
        container.id = unit.containerId;
        slot.appendChild(container);

        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = unit.scriptUrl;
        script.dataset.zenlytaAdsterra = unit.containerId;
        slot.appendChild(script);
    }

    /*
     -----------------------------------------------------
     05. HIDE / DISABLED AD & CONTAINER
     -----------------------------------------------------
     */

     /*
    function renderDisabled(slot) {
        slot.innerHTML = "";
        slot.classList.add("ad-disabled");

        // Also cleanly hide the wrapper section to prevent leftover margins/empty spaces
        const parentSection = slot.closest(".ad-section");
        if (parentSection) {
            parentSection.classList.add("ad-disabled");
        }
    }

    function unhideParentSection(slot) {
        slot.classList.remove("ad-disabled");
        const parentSection = slot.closest(".ad-section");
        if (parentSection) {
            parentSection.classList.remove("ad-disabled");
        }
    }

    /*
    -----------------------------------------------------
    06. RENDER SLOT DISPATCHER
    -----------------------------------------------------
    */

    /*
    function renderSlot(slot) {
        const position = slot.dataset.adPosition || "content";

        const targetProvider = activeState.provider;

        switch (targetProvider) {
            case "adsense":
                renderAdSense(slot, position);
                break;

            case "adsterra":
                renderAdsterra(slot, position);
                break;

            case "dummy":
                renderDummy(slot, position);
                break;

            case "none":
            default:
                renderDisabled(slot);
                break;
        }
    }

    /*
    -----------------------------------------------------
    07. ADS.TXT PARSER (PNP AUTO-DETECTION)
    -----------------------------------------------------
    */

    /*
    function findAdsTxtUrl() {
        const scriptEl = document.querySelector('script[src*="ads/ads.js"]');
        if (scriptEl) {
            const src = scriptEl.getAttribute("src");
            const idx = src.indexOf("ads/ads.js");
            if (idx >= 0) {
                const prefix = src.substring(0, idx);
                return prefix + "ads.txt";
            }
        }
        return "/ads.txt";
    }

    function fetchAndParseAdsTxt() {
        return new Promise((resolve) => {
            // If provider is explicitly forced (not auto), skip ads.txt parsing
            if (config.provider && config.provider !== "auto") {
                activeState.provider = config.provider;
                resolve(activeState);
                return;
            }

            const primaryUrl = findAdsTxtUrl();
            const fallbackUrls = [primaryUrl, "/ads.txt", "ads.txt", "../ads.txt", "../../ads.txt", "../../../ads.txt"];
            
            // Remove duplicates
            const uniqueUrls = Array.from(new Set(fallbackUrls));

            function tryFetch(index) {
                if (index >= uniqueUrls.length) {
                    fallbackToConfig();
                    resolve(activeState);
                    return;
                }

                const url = uniqueUrls[index];
                fetch(url, { cache: "no-cache" })
                    .then((res) => {
                        if (res.ok) {
                            return res.text();
                        }
                        throw new Error("Fetch not ok: " + res.status);
                    })
                    .then((text) => {
                        if (text && typeof text === "string" && (text.includes("google.com") || text.includes("adsterra.com") || text.includes("DIRECT") || text.includes("RESELLER"))) {
                            parseAdsTxtContent(text);
                            resolve(activeState);
                        } else {
                            tryFetch(index + 1);
                        }
                    })
                    .catch(() => {
                        tryFetch(index + 1);
                    });
            }

            function parseAdsTxtContent(text) {
                const lines = text.split(/\r?\n/);
                let foundAdSense = "";
                let foundAdsterra = "";
                const adsterraKeys = [];

                for (let line of lines) {
                    line = line.trim();
                    // Ignore comment lines and empty lines
                    if (!line || line.startsWith("#")) {
                        continue;
                    }

                    const parts = line.split(",").map((p) => p.trim());
                    if (parts.length >= 2) {
                        const domain = parts[0].toLowerCase();
                        const pubId = parts[1];

                        // Check Google AdSense
                        if (domain === "google.com" && pubId && !pubId.includes("XXXX")) {
                            foundAdSense = pubId;
                        }

                        // Check Adsterra
                        if (domain.includes("adsterra") && pubId && !pubId.includes("XXXX")) {
                            foundAdsterra = pubId;
                            adsterraKeys.push(pubId);
                        }
                    }
                }

                if (foundAdSense) {
                    activeState.provider = "adsense";
                    activeState.adsense.publisherId = foundAdSense;
                } else if (foundAdsterra) {
                    activeState.provider = "adsterra";
                    activeState.adsterra.keys = adsterraKeys;
                } else {
                    fallbackToConfig();
                }
            }

            function fallbackToConfig() {
                if (config.adsense && config.adsense.enabled && config.adsense.publisherId && !config.adsense.publisherId.includes("XXXX")) {
                    activeState.provider = "adsense";
                } else if (config.adsterra && config.adsterra.enabled && (
                    (config.adsterra.directUnits && Object.keys(config.adsterra.directUnits).length > 0) ||
                    config.adsterra.slots.top || config.adsterra.slots.content || config.adsterra.slots.bottom
                )) {
                    activeState.provider = "adsterra";
                } else if (config.dummy && config.dummy.enabled === true) {
                    activeState.provider = "dummy";
                } else {
                    activeState.provider = "none";
                }
            }

            tryFetch(0);
        });
    }

    /*
    -----------------------------------------------------
    08. INITIALIZATION
    -----------------------------------------------------
    */

    /*
    function initializeAds() {
        const slots = document.querySelectorAll(".zenlyta-ad");
        if (!slots || slots.length === 0) {
            return;
        }

        fetchAndParseAdsTxt().then(() => {
            slots.forEach(renderSlot);
        });
    }

    /*
    -----------------------------------------------------
    09. PUBLIC API
    -----------------------------------------------------
    */

    /*
    window.ZenlytaAds = {
        init: initializeAds,
        refresh: initializeAds,
        getState: () => activeState
    };

    /*
    -----------------------------------------------------
    10. DOM READY
    -----------------------------------------------------
    */

    /*
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeAds);
    } else {
        initializeAds();
    }
})();
