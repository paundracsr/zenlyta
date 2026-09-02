/**
 * =========================================================
 * ZENLYTA — UNIVERSAL AD CONFIGURATION (PLUG AND PLAY)
 * =========================================================
 * 
 * Mode: "auto" (default) | "adsense" | "adsterra" | "dummy" | "none"
 * 
 * When set to "auto", the engine reads `ads.txt` from your domain root:
 * - When valid publisher credentials exist in `ads.txt`, ad slots
 *   automatically activate and adapt to the detected network.
 * - When `ads.txt` has no active providers (commented out / dummy IDs),
 *   ad slots and containers stay completely hidden (0px height / display: none),
 *   leaving the website clean and without dummy ad placeholders.
 * =========================================================
 */

window.ZENLYTA_AD_CONFIG = {

    /**
     * Provider Selection:
     * - "auto"     : Reads ads.txt automatically; activates provider if present, hides slots if none
     * - "adsense"  : Force Google AdSense
     * - "adsterra" : Force Adsterra
     * - "dummy"    : Force Dummy Ad placeholders (if needed for testing)
     * - "none"     : Completely disable ads and hide all ad slots
     */
    provider: "adsterra",

    /**
     * Google AdSense Settings (Optional overrides if not auto-detected from ads.txt)
     */
    adsense: {
        enabled: true,
        publisherId: "", // e.g., "ca-pub-1234567890123456" (leave empty to auto-read from ads.txt)
        
        // Optional slot IDs per placement (if left empty, AdSense auto-formats/responsive units are used)
        slots: {
            top: "",
            content: "",
            bottom: ""
        }
    },

    /**
     * Adsterra Settings (Optional overrides if not auto-detected from ads.txt)
     */
    adsterra: {
        enabled: true,

        // Direct invocation unit supplied by Adsterra. A single unit must only
        // render once per page because it uses a fixed container ID.
        directUnits: {
            top: {
                containerId: "container-00fa3271df732c9632dce0c46332ebcd",
                scriptUrl: "https://pl31139390.profitableratecpmnetwork.com/00fa3271df732c9632dce0c46332ebcd/invoke.js"
            }
        },

        // Optional iframe-format Adsterra zone IDs. Leave blank unless Adsterra
        // supplies separate codes for the content and bottom placements.
        domain: "",
        slots: {
            top: "",
            content: "",
            bottom: ""
        }
    },

    /**
     * Dummy Ad placeholder settings (Disabled by default)
     */
    dummy: {
        enabled: false,
        brand: "ZENLYTA",
        title: "Fast, Private & In-Browser Tools",
        description: "100% Client-side conversions and utilities. No files uploaded to servers.",
        buttonText: "Explore More Tools"
    },

    /**
     * General settings
     */
    showLabels: true,
    label: "Advertisement"

};
