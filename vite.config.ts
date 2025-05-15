import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",
        registerType: "prompt",
        injectRegister: false,

        pwaAssets: {
            disabled: false,
            config: true
        },

        manifest: {
            name: "Botanic Code",
            short_name: "botanic-code",
            description: "A game where you have to program bots that maintain a farm.",
            theme_color: "#222222"
        },

        injectManifest: {
            globPatterns: [ "**/*.{js,css,html,svg,png,ico,ttf}" ],
            maximumFileSizeToCacheInBytes: 10 * 1000 * 1000
        },

        devOptions: {
            enabled: true,
            navigateFallback: "index.html",
            suppressWarnings: true,
            type: "module"
        }
    }), viteStaticCopy({
        targets: [
            {
                src: "src/bot/sdk",
                dest: "bot"
            }
        ]
    }) ],
    server: {
        port: 8000
    }
})
