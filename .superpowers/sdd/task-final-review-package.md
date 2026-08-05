# Review package Task final
BASE: 2ef0180
HEAD: bb495238e8aa623738d18ac6e760339e1aafe28c

## Commits
bb49523 docs: mark ruleta turno scope B acceptance criteria
5c5aa0f feat: wire turn screen flow for clan roulette and questions
4b5fadd feat: add roulette wheel UI with clan labels
f3f1b17 feat: add turn state machine reducer
f99cc18 feat: add question pool and round progression helpers
dd00896 feat: add clan fixtures and spin selection math
22306d8 chore: scaffold Vite React TypeScript with Vitest

## Stat
 app/.gitignore                                     |   24 +
 app/index.html                                     |   13 +
 app/package-lock.json                              | 2482 ++++++++++++++++++++
 app/package.json                                   |   30 +
 app/public/favicon.svg                             |    1 +
 app/public/icons.svg                               |   24 +
 app/src/App.css                                    |   78 +
 app/src/App.tsx                                    |    8 +
 app/src/assets/hero.png                            |  Bin 0 -> 13057 bytes
 app/src/assets/react.svg                           |    1 +
 app/src/assets/vite.svg                            |    1 +
 app/src/game/clans.ts                              |   18 +
 app/src/game/questions.test.ts                     |   15 +
 app/src/game/questions.ts                          |   79 +
 app/src/game/round.test.ts                         |   33 +
 app/src/game/round.ts                              |   32 +
 app/src/game/spin.test.ts                          |   34 +
 app/src/game/spin.ts                               |   30 +
 app/src/game/turnReducer.test.ts                   |   45 +
 app/src/game/turnReducer.ts                        |  138 ++
 app/src/game/types.ts                              |   28 +
 app/src/index.css                                  |  111 +
 app/src/main.tsx                                   |   10 +
 app/src/ui/RouletteWheel.css                       |   98 +
 app/src/ui/RouletteWheel.tsx                       |   52 +
 app/src/ui/TurnScreen.tsx                          |   71 +
 app/tsconfig.app.json                              |   26 +
 app/tsconfig.json                                  |    7 +
 app/tsconfig.node.json                             |   23 +
 app/vite.config.ts                                 |   10 +
 .../specs/2026-08-05-ruleta-turno-design.md        |   18 +-
 31 files changed, 3532 insertions(+), 8 deletions(-)

## Diff
```diff
diff --git a/app/.gitignore b/app/.gitignore
new file mode 100644
index 0000000..a547bf3
--- /dev/null
+++ b/app/.gitignore
@@ -0,0 +1,24 @@
+# Logs
+logs
+*.log
+npm-debug.log*
+yarn-debug.log*
+yarn-error.log*
+pnpm-debug.log*
+lerna-debug.log*
+
+node_modules
+dist
+dist-ssr
+*.local
+
+# Editor directories and files
+.vscode/*
+!.vscode/extensions.json
+.idea
+.DS_Store
+*.suo
+*.ntvs*
+*.njsproj
+*.sln
+*.sw?
diff --git a/app/index.html b/app/index.html
new file mode 100644
index 0000000..7604e76
--- /dev/null
+++ b/app/index.html
@@ -0,0 +1,13 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="UTF-8" />
+    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>app</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/main.tsx"></script>
+  </body>
+</html>
diff --git a/app/package-lock.json b/app/package-lock.json
new file mode 100644
index 0000000..b1d4cf7
--- /dev/null
+++ b/app/package-lock.json
@@ -0,0 +1,2482 @@
+{
+  "name": "app",
+  "version": "0.0.0",
+  "lockfileVersion": 3,
+  "requires": true,
+  "packages": {
+    "": {
+      "name": "app",
+      "version": "0.0.0",
+      "dependencies": {
+        "react": "^19.2.8",
+        "react-dom": "^19.2.8"
+      },
+      "devDependencies": {
+        "@testing-library/jest-dom": "^7.0.0",
+        "@testing-library/react": "^16.3.2",
+        "@types/node": "^24.13.3",
+        "@types/react": "^19.2.17",
+        "@types/react-dom": "^19.2.3",
+        "@vitejs/plugin-react": "^6.0.4",
+        "jsdom": "^29.1.1",
+        "oxlint": "^1.75.0",
+        "typescript": "~6.0.2",
+        "vite": "^8.2.0",
+        "vitest": "^4.1.10"
+      }
+    },
+    "node_modules/@adobe/css-tools": {
+      "version": "4.5.0",
+      "resolved": "https://registry.npmjs.org/@adobe/css-tools/-/css-tools-4.5.0.tgz",
+      "integrity": "sha512-6OzddxPio9UiWTCemp4N8cYLV2ZN1ncRnV1cVGtve7dhPOtRkleRyx32GQCYSwDYgaHU3USMm84tNsvKzRCa1Q==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@asamuzakjp/css-color": {
+      "version": "5.1.11",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/css-color/-/css-color-5.1.11.tgz",
+      "integrity": "sha512-KVw6qIiCTUQhByfTd78h2yD1/00waTmm9uy/R7Ck/ctUyAPj+AEDLkQIdJW0T8+qGgj3j5bpNKK7Q3G+LedJWg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@asamuzakjp/generational-cache": "^1.0.1",
+        "@csstools/css-calc": "^3.2.0",
+        "@csstools/css-color-parser": "^4.1.0",
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/@asamuzakjp/dom-selector": {
+      "version": "7.1.1",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/dom-selector/-/dom-selector-7.1.1.tgz",
+      "integrity": "sha512-67RZDnYRc8H/8MLDgQCDE//zoqVFwajkepHZgmXrbwybzXOEwOWGPYGmALYl9J2DOLfFPPs6kKCqmbzV895hTQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@asamuzakjp/generational-cache": "^1.0.1",
+        "@asamuzakjp/nwsapi": "^2.3.9",
+        "bidi-js": "^1.0.3",
+        "css-tree": "^3.2.1",
+        "is-potential-custom-element-name": "^1.0.1"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/@asamuzakjp/generational-cache": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/generational-cache/-/generational-cache-1.0.1.tgz",
+      "integrity": "sha512-wajfB8KqzMCN2KGNFdLkReeHncd0AslUSrvHVvvYWuU8ghncRJoA50kT3zP9MVL0+9g4/67H+cdvBskj9THPzg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/@asamuzakjp/nwsapi": {
+      "version": "2.3.9",
+      "resolved": "https://registry.npmjs.org/@asamuzakjp/nwsapi/-/nwsapi-2.3.9.tgz",
+      "integrity": "sha512-n8GuYSrI9bF7FFZ/SjhwevlHc8xaVlb/7HmHelnc/PZXBD2ZR49NnN9sMMuDdEGPeeRQ5d0hqlSlEpgCX3Wl0Q==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@babel/code-frame": {
+      "version": "7.29.7",
+      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
+      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "dependencies": {
+        "@babel/helper-validator-identifier": "^7.29.7",
+        "js-tokens": "^4.0.0",
+        "picocolors": "^1.1.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-validator-identifier": {
+      "version": "7.29.7",
+      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
+      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/runtime": {
+      "version": "7.29.7",
+      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.7.tgz",
+      "integrity": "sha512-Nq8OhGWiZIZGV6hLHoyAKLLcJihP/xFeBMGJoUrxTX2psI8dCifzLhZISFb+VWS3wFMRDmCGw5R+dOySCqPLhw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@bramus/specificity": {
+      "version": "2.4.2",
+      "resolved": "https://registry.npmjs.org/@bramus/specificity/-/specificity-2.4.2.tgz",
+      "integrity": "sha512-ctxtJ/eA+t+6q2++vj5j7FYX3nRu311q1wfYH3xjlLOsczhlhxAg2FWNUXhpGvAw3BWo1xBcvOV6/YLc2r5FJw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "css-tree": "^3.0.0"
+      },
+      "bin": {
+        "specificity": "bin/cli.js"
+      }
+    },
+    "node_modules/@csstools/color-helpers": {
+      "version": "6.1.0",
+      "resolved": "https://registry.npmjs.org/@csstools/color-helpers/-/color-helpers-6.1.0.tgz",
+      "integrity": "sha512-064IFJdjTfUqnjpCVpMOdbr8FLQBhinbZj6yRv2An2E41O/pLEXqfFRWqGq/SxlE5PEUYTlvWsG2r8MswAVvkg==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT-0",
+      "engines": {
+        "node": ">=20.19.0"
+      }
+    },
+    "node_modules/@csstools/css-calc": {
+      "version": "3.3.0",
+      "resolved": "https://registry.npmjs.org/@csstools/css-calc/-/css-calc-3.3.0.tgz",
+      "integrity": "sha512-c5ihYsPkdG6JCkU2zTMm4+k6r7RXuGxtWYhu5DHMIiF1FHzrfmHL5so11AoFpUv/tu61xfcmT4AmKoFfMPoqdQ==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-color-parser": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@csstools/css-color-parser/-/css-color-parser-4.1.10.tgz",
+      "integrity": "sha512-UZhQLIUyJaaMepqehrCODwCg2KW25vFvLWBmqYFaPclYvvxzj/sG8LBOhBFCp11i9uE7t1EyS+RAoV9tztPFyw==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "dependencies": {
+        "@csstools/color-helpers": "^6.1.0",
+        "@csstools/css-calc": "^3.3.0"
+      },
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-parser-algorithms": "^4.0.0",
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-parser-algorithms": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/@csstools/css-parser-algorithms/-/css-parser-algorithms-4.0.0.tgz",
+      "integrity": "sha512-+B87qS7fIG3L5h3qwJ/IFbjoVoOe/bpOdh9hAjXbvx0o8ImEmUsGXN0inFOnk2ChCFgqkkGFQ+TpM5rbhkKe4w==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "peerDependencies": {
+        "@csstools/css-tokenizer": "^4.0.0"
+      }
+    },
+    "node_modules/@csstools/css-syntax-patches-for-csstree": {
+      "version": "1.1.7",
+      "resolved": "https://registry.npmjs.org/@csstools/css-syntax-patches-for-csstree/-/css-syntax-patches-for-csstree-1.1.7.tgz",
+      "integrity": "sha512-fQ+05118eQS1cofO3aJpB5efgpBZMvIzwr/sbC8kDLVA5XLG8q1kJV5yzrUAI1f7lvhPnm8fgIjzFB8/O/5Dig==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT-0",
+      "peerDependencies": {
+        "css-tree": "^3.2.1"
+      },
+      "peerDependenciesMeta": {
+        "css-tree": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@csstools/css-tokenizer": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/@csstools/css-tokenizer/-/css-tokenizer-4.0.0.tgz",
+      "integrity": "sha512-QxULHAm7cNu72w97JUNCBFODFaXpbDg+dP8b/oWFAZ2MTRppA3U00Y2L1HqaS4J6yBqxwa/Y3nMBaxVKbB/NsA==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/csstools"
+        },
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/csstools"
+        }
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.19.0"
+      }
+    },
+    "node_modules/@exodus/bytes": {
+      "version": "1.15.1",
+      "resolved": "https://registry.npmjs.org/@exodus/bytes/-/bytes-1.15.1.tgz",
+      "integrity": "sha512-S6mL0yNB/Abt9Ei4tq8gDhcczc4S3+vQ4ra7vxnAf+YHC02srtqxKKZghx2Dq6p0e66THKwR6r8N6P95wEty7Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      },
+      "peerDependencies": {
+        "@noble/hashes": "^1.8.0 || ^2.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@noble/hashes": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@jridgewell/sourcemap-codec": {
+      "version": "1.5.5",
+      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
+      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@oxc-project/types": {
+      "version": "0.143.0",
+      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.143.0.tgz",
+      "integrity": "sha512-u6JZdLBTLotrNC9Vd6vPssINdzcCzleKAH6EJKImQb7GtYvX5keN2dxkoK44stCc4tffE6QQRtZTXVSzsLUlWA==",
+      "dev": true,
+      "license": "MIT",
+      "funding": {
+        "url": "https://github.com/sponsors/Boshen"
+      }
+    },
+    "node_modules/@oxlint/binding-android-arm-eabi": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-android-arm-eabi/-/binding-android-arm-eabi-1.77.0.tgz",
+      "integrity": "sha512-E06sKWS6PiI6HRxS1wyQg22HvApt01hI7fV+T3wUk3OSbaaP4a3hYGY/MIQDmASqCiRjBdpRQYkgMkqH82cWmQ==",
+      "cpu": [
+        "arm"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-android-arm64": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-android-arm64/-/binding-android-arm64-1.77.0.tgz",
+      "integrity": "sha512-NvsKz0KZxTp9cYWPLf+FXaSZwB3oO3peAjtukpOMBgse2vhQSoIIVqeO1yR0lEo/UcdZIDL18uq+kL0LzQ0ytA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-darwin-arm64": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-darwin-arm64/-/binding-darwin-arm64-1.77.0.tgz",
+      "integrity": "sha512-bgjTn6nW4bQCFBvSvuHCpDD+sONvmpo4lGI4PxzMt1quBA+xYxhczk6RiCn3GZ9gY8uhaBbwhj9MdKGfu6T9DA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-darwin-x64": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-darwin-x64/-/binding-darwin-x64-1.77.0.tgz",
+      "integrity": "sha512-aotaIttH1R6j1Rwhx0M0htgeZyGtVQqYNTVEYMN/UcgHPquGA6kmk9OyuDc3a2GKUQBC+3C3GVQCcrRPMYqAFA==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-freebsd-x64": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-freebsd-x64/-/binding-freebsd-x64-1.77.0.tgz",
+      "integrity": "sha512-nNx/wta7ksRAdYvq+l4AWjXkLxEXHALhENxjj2cYbQAIR4ybaA5L+hCbE63HOmft5czQ6ks+hb8vmEAnn7YGPg==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "freebsd"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-arm-gnueabihf": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.77.0.tgz",
+      "integrity": "sha512-tMLLjM7xXtzXisVCzkOTXNCy9bZVId2wteNwjohlFDR/jY6WagpEDA1c1wu4xRc20Hojaxj+V6DSR7gbKxijWA==",
+      "cpu": [
+        "arm"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-arm-musleabihf": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-arm-musleabihf/-/binding-linux-arm-musleabihf-1.77.0.tgz",
+      "integrity": "sha512-MiAFDFaqR0tmHTAyo0YDcZ5hyLREdYw/RQhc2R3cbT+8O3tB+zqPM2th9TTQ+Uo3jn/embS+DO+HyX9ztCPkOQ==",
+      "cpu": [
+        "arm"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-arm64-gnu": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.77.0.tgz",
+      "integrity": "sha512-/xqQ3B16i1T4cyt/9Mn+4CpzhUXoBXp7kVpIwzOXNFLj5JmK1bIjsbSnX296Gg8A/o7oDtKWikFgBx0SLwztkw==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-arm64-musl": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.77.0.tgz",
+      "integrity": "sha512-LSbwuRKiNCenPDcbARqAZ5RfBy7gmj7vOvfJRLeCDU3gFtSxWbhv/+VTlaUqzUhNj1gFLHB8h7ALnxa/Az6z6g==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-ppc64-gnu": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.77.0.tgz",
+      "integrity": "sha512-QWdcH31mXEUe5Nq1s0CfCpceaKjIo9uZtwDjAuL681g1axf+5x8xrg/eXWaw//4NCxYZ4V4e5Hu5tvdR+pTBlg==",
+      "cpu": [
+        "ppc64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-riscv64-gnu": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-riscv64-gnu/-/binding-linux-riscv64-gnu-1.77.0.tgz",
+      "integrity": "sha512-GnOfYgJxbcElOiPZaDFDl406ONddwvOWk2jvAAAEjwAl4GofNoHF+/HHUIBYa6bFCArlcGPi0XjC4cU1pkgF/Q==",
+      "cpu": [
+        "riscv64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-riscv64-musl": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-riscv64-musl/-/binding-linux-riscv64-musl-1.77.0.tgz",
+      "integrity": "sha512-AyEMTUCf0xY+hHF+IxqXFQIX0yQOIR8ykpY0lJNOw9xYqOzUX8dyZfRvlG0RfXwuQn2eonf/8NrMmDSZJjdqsA==",
+      "cpu": [
+        "riscv64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-s390x-gnu": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.77.0.tgz",
+      "integrity": "sha512-sPLzEcNvxd/oyVQ5oZo92CiHkFkpBeRop13E/P3TPY+hZfXHKCOWKI70TE2RYwMKFJDc20EMjH16L7NZICtKTw==",
+      "cpu": [
+        "s390x"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-x64-gnu": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.77.0.tgz",
+      "integrity": "sha512-1Oh2ssH2L7lwyvkdSqaMUfsGfwU2Wfvew+obBUYjRVqhpBcUpwnsPSEr1IzVi9XqkuY10geiLsNKecqaZC34Dw==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-linux-x64-musl": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-linux-x64-musl/-/binding-linux-x64-musl-1.77.0.tgz",
+      "integrity": "sha512-0j/2wRgNGO+Qj/M1uu/p57h/hFTTWWcfie0ufkbabeus2s5+/QqkCflnMOwLLN5m2GsNeWp4xdl4cPa4n7QCOQ==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-openharmony-arm64": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-openharmony-arm64/-/binding-openharmony-arm64-1.77.0.tgz",
+      "integrity": "sha512-BJ/j54qS0usEnyDkLYURMj2iiD9h5Cyy+ppzeMSXBGRXaGRNWnj1Mw14NqWMR5E/PzdgB30OOCCzLzbRoduafw==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "openharmony"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-win32-arm64-msvc": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.77.0.tgz",
+      "integrity": "sha512-Yh8w+g2Lpx7StrvtYkoz9JJvXjB9wxgFChFNb85nrXm/wj/XTwGWS1hve9+900HL7llrntYB3YP+y32E3tRqzA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-win32-ia32-msvc": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-win32-ia32-msvc/-/binding-win32-ia32-msvc-1.77.0.tgz",
+      "integrity": "sha512-zja5b7+6a7UsRFgAQSrnax5vrzliEyNPLCjfXONu/vTWswaIVZGFajJZptaeRvPE4LghtFdAzVFlexTm7MVTGA==",
+      "cpu": [
+        "ia32"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@oxlint/binding-win32-x64-msvc": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/@oxlint/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.77.0.tgz",
+      "integrity": "sha512-+teyvPDZ2RjUvo+SuCqS/UhaJl1QtdW5fWT5NJTV61V5MIuIS90Db9LixmtEGvXixyttiK62P96MSu3UlpviBw==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-android-arm64": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.3.tgz",
+      "integrity": "sha512-zrJtHDcaZJ1Fp7xf4hNl+7seH9Cn/N5TwLYkhgXREtBwAd/jaqW3uqeHxpDugJLVICWg4eW44kOQEGJ1r6jCGw==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "android"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-darwin-arm64": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.3.tgz",
+      "integrity": "sha512-ieIiibVCp0tX7TLu2cafoNPv8wJyYi01ekXpbf8q2j7F4rGAhhXb/eQh7ge9DRBY78GwmRQtvjZDux7EDbA8kA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-darwin-x64": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.3.tgz",
+      "integrity": "sha512-Zh9tCon19eDXJoihx0rqKhMUlMYqzwj3aPsSuHmI4RWZh62dWUL+DJN4C5YQya5TcQBJU/Fe8+rY0jhXTQITqA==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-freebsd-x64": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.3.tgz",
+      "integrity": "sha512-nGbJWewA1wrXXZiQhjAT5rhibGfns5ZNkDVqxsO6zJ3f3YvpoDNNmGMSbbhLuXKjNScaBJVOAboztAWVespQMg==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "freebsd"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.3.tgz",
+      "integrity": "sha512-QNniJr5Kml0kDEB98jiDOJjXNroxIIi0IXIbdYzY26Xt1pVbeP62+KnoIZLwirOymX/0jDk/2gI/bNUv7A7OIw==",
+      "cpu": [
+        "arm"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-arm64-gnu": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.3.tgz",
+      "integrity": "sha512-TkqEAcmmvH3I/q4114NB4RVt6241Dao48pF45uLcFGrwAaIn0iITgTAKP/dLjbN0R4buJjGb91+UHSoFmpgIWw==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-arm64-musl": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.3.tgz",
+      "integrity": "sha512-NHqjnxpsndf4MPymxteFAWHHfkTL8HjWh1KB7z23ofZ6QO2euONuxDXjat69dKZRALnGypg8k8SsK8vZJoXv1Q==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.3.tgz",
+      "integrity": "sha512-6tbrbwfz5GB9DQ4Jwo6hy9v+vR31xZlvzZ6n5Xut6Hhx5PvrA9q/HsK8KMaYQp063iqZGXwNvZtYNLD7EM/x0w==",
+      "cpu": [
+        "ppc64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-s390x-gnu": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.3.tgz",
+      "integrity": "sha512-oyuXxXmoZHjXC917IAPFAAv4wWAa0cM9afk8nx1+9/jNNOX1uPf8yDA6p7G0RypOfw/X0PQt5IfoquY1um+zSg==",
+      "cpu": [
+        "s390x"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-x64-gnu": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.3.tgz",
+      "integrity": "sha512-TytMwF2KVGqP2tgd0I1OY0PAv78dZRAYcF5ssDzjM34SUXCED3uXvSd5+lHoC0bTD6eEdFz7LdQNCO1y0oVk9w==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-linux-x64-musl": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.3.tgz",
+      "integrity": "sha512-/E9m3qstrJFVPoULV25mVQblSNExY2+kBsYe4sy0Tn0yOOgJ8wZbZt3KnRbF/XeU2Gl1STKUQnDNTqhIE5MD4A==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-openharmony-arm64": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.3.tgz",
+      "integrity": "sha512-Kr0OcsoQI816i6HOl3vFHpd1K0eZyh76zgfj4c1nTyaTsd5r2Mj1lwM4R90y/qaCfmTn9eHy0SKwi98eitRxug==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "openharmony"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-win32-arm64-msvc": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.3.tgz",
+      "integrity": "sha512-hOtMwTqnME+/gJcH/PCZ0wn0zPUjiWOgkHpxbSJpfGKMezHltx1S7/k1SitzVa7Ww2cqrDDaFbZEhcJZO8o+Jw==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/binding-win32-x64-msvc": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.3.tgz",
+      "integrity": "sha512-ekcqMMkI2PlhYnfzQnB/cEdYUVVJViWvoUyLrbzgDoi3Snfc1mVBwdnc306ufA5ejy8JSPjT2RlW1nQSjW7efg==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      }
+    },
+    "node_modules/@rolldown/pluginutils": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.1.tgz",
+      "integrity": "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@standard-schema/spec": {
+      "version": "1.1.0",
+      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
+      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@testing-library/dom": {
+      "version": "10.4.1",
+      "resolved": "https://registry.npmjs.org/@testing-library/dom/-/dom-10.4.1.tgz",
+      "integrity": "sha512-o4PXJQidqJl82ckFaXUeoAW+XysPLauYI43Abki5hABd853iMhitooc6znOnczgbTYmEP6U6/y1ZyKAIsvMKGg==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "dependencies": {
+        "@babel/code-frame": "^7.10.4",
+        "@babel/runtime": "^7.12.5",
+        "@types/aria-query": "^5.0.1",
+        "aria-query": "5.3.0",
+        "dom-accessibility-api": "^0.5.9",
+        "lz-string": "^1.5.0",
+        "picocolors": "1.1.1",
+        "pretty-format": "^27.0.2"
+      },
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@testing-library/jest-dom": {
+      "version": "7.0.0",
+      "resolved": "https://registry.npmjs.org/@testing-library/jest-dom/-/jest-dom-7.0.0.tgz",
+      "integrity": "sha512-HKAH9C6mBo5yBG6yRO5i43L2iisencAo5z+o5P/saHUoY+miC5ivXRxHBJcFyB5ypPNxHJdK3BoF/3O4DIptMg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@adobe/css-tools": "^4.4.0",
+        "aria-query": "^5.0.0",
+        "css.escape": "^1.5.1",
+        "dom-accessibility-api": "^0.6.3",
+        "picocolors": "^1.1.1",
+        "redent": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=22",
+        "npm": ">=6",
+        "yarn": ">=1"
+      },
+      "peerDependencies": {
+        "@testing-library/dom": ">=10 <11"
+      }
+    },
+    "node_modules/@testing-library/jest-dom/node_modules/dom-accessibility-api": {
+      "version": "0.6.3",
+      "resolved": "https://registry.npmjs.org/dom-accessibility-api/-/dom-accessibility-api-0.6.3.tgz",
+      "integrity": "sha512-7ZgogeTnjuHbo+ct10G9Ffp0mif17idi0IyWNVA/wcwcm7NPOD/WEHVP3n7n3MhXqxoIYm8d6MuZohYWIZ4T3w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@testing-library/react": {
+      "version": "16.3.2",
+      "resolved": "https://registry.npmjs.org/@testing-library/react/-/react-16.3.2.tgz",
+      "integrity": "sha512-XU5/SytQM+ykqMnAnvB2umaJNIOsLF3PVv//1Ew4CTcpz0/BRyy/af40qqrt7SjKpDdT1saBMc42CUok5gaw+g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/runtime": "^7.12.5"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "peerDependencies": {
+        "@testing-library/dom": "^10.0.0",
+        "@types/react": "^18.0.0 || ^19.0.0",
+        "@types/react-dom": "^18.0.0 || ^19.0.0",
+        "react": "^18.0.0 || ^19.0.0",
+        "react-dom": "^18.0.0 || ^19.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@types/react": {
+          "optional": true
+        },
+        "@types/react-dom": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@types/aria-query": {
+      "version": "5.0.4",
+      "resolved": "https://registry.npmjs.org/@types/aria-query/-/aria-query-5.0.4.tgz",
+      "integrity": "sha512-rfT93uj5s0PRL7EzccGMs3brplhcrghnDoV26NqKhCAS1hVo+WdNsPvE/yb6ilfr5hi2MEk6d5EWJTKdxg8jVw==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
+    "node_modules/@types/chai": {
+      "version": "5.2.3",
+      "resolved": "https://registry.npmjs.org/@types/chai/-/chai-5.2.3.tgz",
+      "integrity": "sha512-Mw558oeA9fFbv65/y4mHtXDs9bPnFMZAL/jxdPFUpOHHIXX91mcgEHbS5Lahr+pwZFR8A7GQleRWeI6cGFC2UA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/deep-eql": "*",
+        "assertion-error": "^2.0.1"
+      }
+    },
+    "node_modules/@types/deep-eql": {
+      "version": "4.0.2",
+      "resolved": "https://registry.npmjs.org/@types/deep-eql/-/deep-eql-4.0.2.tgz",
+      "integrity": "sha512-c9h9dVVMigMPc4bwTvC5dxqtqJZwQPePsWjPlpSOnojbor6pGqdk541lfA7AqFQr5pB1BRdq0juY9db81BwyFw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@types/estree": {
+      "version": "1.0.9",
+      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
+      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@types/node": {
+      "version": "24.13.3",
+      "resolved": "https://registry.npmjs.org/@types/node/-/node-24.13.3.tgz",
+      "integrity": "sha512-Dh8vAsV36ig5wa9OX4pXvMc9D3Veibfw2wix0CUwYODLD8nkj9UsLjASr49nPg+2eKzxhBV+v7L8pXvT4e639Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "undici-types": "~7.18.0"
+      }
+    },
+    "node_modules/@types/react": {
+      "version": "19.2.18",
+      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.18.tgz",
+      "integrity": "sha512-AnzbBERsrLKtk2XSfTbYRLjQPdy116Sty4q+T+Bp3IC4l6jNBvreVPAHmpq9qhXQM7CXZPjLVmGMw9sy+hxQ3w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "csstype": "^3.2.2"
+      }
+    },
+    "node_modules/@types/react-dom": {
+      "version": "19.2.4",
+      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.4.tgz",
+      "integrity": "sha512-Bsc+QHgp+P/F02XDzNCY9jnZNCUuLki36KT7VKrTXXLdHf+vHMNZnW1rVu5DNW/rCK+fya3DATySbLM4yhtKUw==",
+      "dev": true,
+      "license": "MIT",
+      "peerDependencies": {
+        "@types/react": "^19.2.0"
+      }
+    },
+    "node_modules/@vitejs/plugin-react": {
+      "version": "6.0.5",
+      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-6.0.5.tgz",
+      "integrity": "sha512-BOVzne/NL162sMdResB25mUv+vWMF5NoAjNf09TeGlE7ZpszZWSD3winycicLJw72yeVsoCn/2kOhEuCvEShMA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@rolldown/pluginutils": "^1.0.1"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "peerDependencies": {
+        "@rolldown/plugin-babel": "^0.1.7 || ^0.2.0",
+        "babel-plugin-react-compiler": "^1.0.0",
+        "vite": "^8.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@rolldown/plugin-babel": {
+          "optional": true
+        },
+        "babel-plugin-react-compiler": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@vitest/expect": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/expect/-/expect-4.1.10.tgz",
+      "integrity": "sha512-YsCn+qAk1GWjQOWFEsEcL2gNQ0zmVmQu3T03qP6UyjhtmdtwtbuI+DASn/7iQB3HGTXkdBwGddzxPlmiql5vlA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@standard-schema/spec": "^1.1.0",
+        "@types/chai": "^5.2.2",
+        "@vitest/spy": "4.1.10",
+        "@vitest/utils": "4.1.10",
+        "chai": "^6.2.2",
+        "tinyrainbow": "^3.1.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/mocker": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/mocker/-/mocker-4.1.10.tgz",
+      "integrity": "sha512-v0xaezt+DKEmKfaxg133ldzADrwLGd7Ze1MfQQTYfvs8OqZIwbxyxaYURivwV7sWy5fqn3rH5uOrSp07bp44Ow==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/spy": "4.1.10",
+        "estree-walker": "^3.0.3",
+        "magic-string": "^0.30.21"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      },
+      "peerDependencies": {
+        "msw": "^2.4.9",
+        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0"
+      },
+      "peerDependenciesMeta": {
+        "msw": {
+          "optional": true
+        },
+        "vite": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@vitest/pretty-format": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/pretty-format/-/pretty-format-4.1.10.tgz",
+      "integrity": "sha512-W1HsjSH4MXQ9YfmmhLAoIYf1HRfekQCGngeIgcei6MP5QQGWUe0gkopdZQaVCFO+JDJMrAJGwa5pRpNpvy4P8Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "tinyrainbow": "^3.1.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/runner": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/runner/-/runner-4.1.10.tgz",
+      "integrity": "sha512-IKI6kpIH+LmpROplyLwBBaCfMgOZOMsygVa6BARD6ahA04VRuJSa6OaVG7kRvSEMD870Vd91rSSw0eegtWyLGg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/utils": "4.1.10",
+        "pathe": "^2.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/snapshot": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/snapshot/-/snapshot-4.1.10.tgz",
+      "integrity": "sha512-xRkfOT1qpTAi/Ti4Y1LtfRc3kEuqxGw59eN2jN9pRWMtS/XDevekhcFSqvQqjUNGksfjMJu3Y+oJ+4Ypn2OaJw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/pretty-format": "4.1.10",
+        "@vitest/utils": "4.1.10",
+        "magic-string": "^0.30.21",
+        "pathe": "^2.0.3"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/spy": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/spy/-/spy-4.1.10.tgz",
+      "integrity": "sha512-PLf/Ugvoq5wO/b4rwYCR1h2PSIdXz7wnkQFMiUpLdtM7l6pqVFcQIBEHyT1+l+cj7mNwAfZHzqXqDyjvOuwbDw==",
+      "dev": true,
+      "license": "MIT",
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/@vitest/utils": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/@vitest/utils/-/utils-4.1.10.tgz",
+      "integrity": "sha512-fy9am/HWxbaGt/Sawrp90vt6Y6jQwf1RX77cz3uwoJwJVMli/e1IEwRPnMNJ7vKfPTwo0diXifkpPvwH9v7nGA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/pretty-format": "4.1.10",
+        "convert-source-map": "^2.0.0",
+        "tinyrainbow": "^3.1.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      }
+    },
+    "node_modules/ansi-regex": {
+      "version": "5.0.1",
+      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
+      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/ansi-styles": {
+      "version": "5.2.0",
+      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
+      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "engines": {
+        "node": ">=10"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
+      }
+    },
+    "node_modules/aria-query": {
+      "version": "5.3.0",
+      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.0.tgz",
+      "integrity": "sha512-b0P0sZPKtyu8HkeRAfCq0IfURZK+SuwMjY1UXGBU27wpAiTwQAIlq56IbIO+ytk/JjS1fMR14ee5WBBfKi5J6A==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "dequal": "^2.0.3"
+      }
+    },
+    "node_modules/assertion-error": {
+      "version": "2.0.1",
+      "resolved": "https://registry.npmjs.org/assertion-error/-/assertion-error-2.0.1.tgz",
+      "integrity": "sha512-Izi8RQcffqCeNVgFigKli1ssklIbpHnCYc6AknXGYoB6grJqyeby7jv12JUQgmTAnIDnbck1uxksT4dzN3PWBA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      }
+    },
+    "node_modules/bidi-js": {
+      "version": "1.0.3",
+      "resolved": "https://registry.npmjs.org/bidi-js/-/bidi-js-1.0.3.tgz",
+      "integrity": "sha512-RKshQI1R3YQ+n9YJz2QQ147P66ELpa1FQEg20Dk8oW9t2KgLbpDLLp9aGZ7y8WHSshDknG0bknqGw5/tyCs5tw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "require-from-string": "^2.0.2"
+      }
+    },
+    "node_modules/chai": {
+      "version": "6.2.2",
+      "resolved": "https://registry.npmjs.org/chai/-/chai-6.2.2.tgz",
+      "integrity": "sha512-NUPRluOfOiTKBKvWPtSD4PhFvWCqOi0BGStNWs57X9js7XGTprSmFoz5F0tWhR4WPjNeR9jXqdC7/UpSJTnlRg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/convert-source-map": {
+      "version": "2.0.0",
+      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
+      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/css-tree": {
+      "version": "3.2.1",
+      "resolved": "https://registry.npmjs.org/css-tree/-/css-tree-3.2.1.tgz",
+      "integrity": "sha512-X7sjQzceUhu1u7Y/ylrRZFU2FS6LRiFVp6rKLPg23y3x3c3DOKAwuXGDp+PAGjh6CSnCjYeAul8pcT8bAl+lSA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "mdn-data": "2.27.1",
+        "source-map-js": "^1.2.1"
+      },
+      "engines": {
+        "node": "^10 || ^12.20.0 || ^14.13.0 || >=15.0.0"
+      }
+    },
+    "node_modules/css.escape": {
+      "version": "1.5.1",
+      "resolved": "https://registry.npmjs.org/css.escape/-/css.escape-1.5.1.tgz",
+      "integrity": "sha512-YUifsXXuknHlUsmlgyY0PKzgPOr7/FjCePfHNt0jxm83wHZi44VDMQ7/fGNkjY3/jV1MC+1CmZbaHzugyeRtpg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/csstype": {
+      "version": "3.2.3",
+      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
+      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/data-urls": {
+      "version": "7.0.0",
+      "resolved": "https://registry.npmjs.org/data-urls/-/data-urls-7.0.0.tgz",
+      "integrity": "sha512-23XHcCF+coGYevirZceTVD7NdJOqVn+49IHyxgszm+JIiHLoB2TkmPtsYkNWT1pvRSGkc35L6NHs0yHkN2SumA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "whatwg-mimetype": "^5.0.0",
+        "whatwg-url": "^16.0.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/decimal.js": {
+      "version": "10.6.0",
+      "resolved": "https://registry.npmjs.org/decimal.js/-/decimal.js-10.6.0.tgz",
+      "integrity": "sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/dequal": {
+      "version": "2.0.3",
+      "resolved": "https://registry.npmjs.org/dequal/-/dequal-2.0.3.tgz",
+      "integrity": "sha512-0je+qPKHEMohvfRTCEo3CrPG6cAzAYgmzKyxRiYSSDkS6eGJdyVJm7WaYA5ECaAD9wLB2T4EEeymA5aFVcYXCA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6"
+      }
+    },
+    "node_modules/detect-libc": {
+      "version": "2.1.2",
+      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
+      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/dom-accessibility-api": {
+      "version": "0.5.16",
+      "resolved": "https://registry.npmjs.org/dom-accessibility-api/-/dom-accessibility-api-0.5.16.tgz",
+      "integrity": "sha512-X7BJ2yElsnOJ30pZF4uIIDfBEVgF4XEBxL9Bxhy6dnrm5hkzqmsWHGTiHqRiITNhMyFLyAiWndIJP7Z1NTteDg==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
+    "node_modules/entities": {
+      "version": "8.0.0",
+      "resolved": "https://registry.npmjs.org/entities/-/entities-8.0.0.tgz",
+      "integrity": "sha512-zwfzJecQ/Uej6tusMqwAqU/6KL2XaB2VZ2Jg54Je6ahNBGNH6Ek6g3jjNCF0fG9EWQKGZNddNjU5F1ZQn/sBnA==",
+      "dev": true,
+      "license": "BSD-2-Clause",
+      "engines": {
+        "node": ">=20.19.0"
+      },
+      "funding": {
+        "url": "https://github.com/fb55/entities?sponsor=1"
+      }
+    },
+    "node_modules/es-module-lexer": {
+      "version": "2.3.1",
+      "resolved": "https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-2.3.1.tgz",
+      "integrity": "sha512-shc1dbU90Yl/xq1QrC7QRtfcwURZuVRfPhZbDoldJ1cn1gzDvBaBWlv0eFolj5+0znnPJz5TXLxsN77X/12KTA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/estree-walker": {
+      "version": "3.0.3",
+      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz",
+      "integrity": "sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/estree": "^1.0.0"
+      }
+    },
+    "node_modules/expect-type": {
+      "version": "1.4.0",
+      "resolved": "https://registry.npmjs.org/expect-type/-/expect-type-1.4.0.tgz",
+      "integrity": "sha512-KfYbmpRm0VbLjEvVa9yGwCi9GI34xvi7A/HXYWQO65CSD2u3MczUJSuwXKFIxlGsgBQizV9q5J9NHj4VG0n+pA==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=12.0.0"
+      }
+    },
+    "node_modules/fdir": {
+      "version": "6.5.0",
+      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
+      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12.0.0"
+      },
+      "peerDependencies": {
+        "picomatch": "^3 || ^4"
+      },
+      "peerDependenciesMeta": {
+        "picomatch": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/fsevents": {
+      "version": "2.3.3",
+      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
+      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
+      "dev": true,
+      "hasInstallScript": true,
+      "license": "MIT",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
+      }
+    },
+    "node_modules/html-encoding-sniffer": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/html-encoding-sniffer/-/html-encoding-sniffer-6.0.0.tgz",
+      "integrity": "sha512-CV9TW3Y3f8/wT0BRFc1/KAVQ3TUHiXmaAb6VW9vtiMFf7SLoMd1PdAc4W3KFOFETBJUb90KatHqlsZMWV+R9Gg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@exodus/bytes": "^1.6.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/indent-string": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/indent-string/-/indent-string-4.0.0.tgz",
+      "integrity": "sha512-EdDDZu4A2OyIK7Lr/2zG+w5jmbuk1DVBnEwREQvBzspBJkCEbRa8GxU1lghYcaGJCnRWibjDXlq779X1/y5xwg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/is-potential-custom-element-name": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/is-potential-custom-element-name/-/is-potential-custom-element-name-1.0.1.tgz",
+      "integrity": "sha512-bCYeRA2rVibKZd+s2625gGnGF/t7DSqDs4dP7CrLA1m7jKWz6pps0LpYLJN8Q64HtmPKJ1hrN3nzPNKFEKOUiQ==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/js-tokens": {
+      "version": "4.0.0",
+      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
+      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
+    "node_modules/jsdom": {
+      "version": "29.1.1",
+      "resolved": "https://registry.npmjs.org/jsdom/-/jsdom-29.1.1.tgz",
+      "integrity": "sha512-ECi4Fi2f7BdJtUKTflYRTiaMxIB0O6zfR1fX0GXpUrf6flp8QIYn1UT20YQqdSOfk2dfkCwS8LAFoJDEppNK5Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@asamuzakjp/css-color": "^5.1.11",
+        "@asamuzakjp/dom-selector": "^7.1.1",
+        "@bramus/specificity": "^2.4.2",
+        "@csstools/css-syntax-patches-for-csstree": "^1.1.3",
+        "@exodus/bytes": "^1.15.0",
+        "css-tree": "^3.2.1",
+        "data-urls": "^7.0.0",
+        "decimal.js": "^10.6.0",
+        "html-encoding-sniffer": "^6.0.0",
+        "is-potential-custom-element-name": "^1.0.1",
+        "lru-cache": "^11.3.5",
+        "parse5": "^8.0.1",
+        "saxes": "^6.0.0",
+        "symbol-tree": "^3.2.4",
+        "tough-cookie": "^6.0.1",
+        "undici": "^7.25.0",
+        "w3c-xmlserializer": "^5.0.0",
+        "webidl-conversions": "^8.0.1",
+        "whatwg-mimetype": "^5.0.0",
+        "whatwg-url": "^16.0.1",
+        "xml-name-validator": "^5.0.0"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.13.0 || >=24.0.0"
+      },
+      "peerDependencies": {
+        "canvas": "^3.0.0"
+      },
+      "peerDependenciesMeta": {
+        "canvas": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/lightningcss": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
+      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
+      "dev": true,
+      "license": "MPL-2.0",
+      "dependencies": {
+        "detect-libc": "^2.0.3"
+      },
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      },
+      "optionalDependencies": {
+        "lightningcss-android-arm64": "1.33.0",
+        "lightningcss-darwin-arm64": "1.33.0",
+        "lightningcss-darwin-x64": "1.33.0",
+        "lightningcss-freebsd-x64": "1.33.0",
+        "lightningcss-linux-arm-gnueabihf": "1.33.0",
+        "lightningcss-linux-arm64-gnu": "1.33.0",
+        "lightningcss-linux-arm64-musl": "1.33.0",
+        "lightningcss-linux-x64-gnu": "1.33.0",
+        "lightningcss-linux-x64-musl": "1.33.0",
+        "lightningcss-win32-arm64-msvc": "1.33.0",
+        "lightningcss-win32-x64-msvc": "1.33.0"
+      }
+    },
+    "node_modules/lightningcss-android-arm64": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
+      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "android"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-darwin-arm64": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
+      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-darwin-x64": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
+      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "darwin"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-freebsd-x64": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
+      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "freebsd"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-linux-arm-gnueabihf": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
+      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
+      "cpu": [
+        "arm"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-linux-arm64-gnu": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
+      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-linux-arm64-musl": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
+      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-linux-x64-gnu": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
+      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-linux-x64-musl": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
+      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "linux"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-win32-arm64-msvc": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
+      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
+      "cpu": [
+        "arm64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lightningcss-win32-x64-msvc": {
+      "version": "1.33.0",
+      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
+      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
+      "cpu": [
+        "x64"
+      ],
+      "dev": true,
+      "license": "MPL-2.0",
+      "optional": true,
+      "os": [
+        "win32"
+      ],
+      "engines": {
+        "node": ">= 12.0.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/parcel"
+      }
+    },
+    "node_modules/lru-cache": {
+      "version": "11.5.2",
+      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
+      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
+      "dev": true,
+      "license": "BlueOak-1.0.0",
+      "engines": {
+        "node": "20 || >=22"
+      }
+    },
+    "node_modules/lz-string": {
+      "version": "1.5.0",
+      "resolved": "https://registry.npmjs.org/lz-string/-/lz-string-1.5.0.tgz",
+      "integrity": "sha512-h5bgJWpxJNswbU7qCrV0tIKQCaS3blPDrqKWx+QxzuzL1zGUzij9XCWLrSLsJPu5t+eWA/ycetzYAO5IOMcWAQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "bin": {
+        "lz-string": "bin/bin.js"
+      }
+    },
+    "node_modules/magic-string": {
+      "version": "0.30.21",
+      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
+      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/sourcemap-codec": "^1.5.5"
+      }
+    },
+    "node_modules/mdn-data": {
+      "version": "2.27.1",
+      "resolved": "https://registry.npmjs.org/mdn-data/-/mdn-data-2.27.1.tgz",
+      "integrity": "sha512-9Yubnt3e8A0OKwxYSXyhLymGW4sCufcLG6VdiDdUGVkPhpqLxlvP5vl1983gQjJl3tqbrM731mjaZaP68AgosQ==",
+      "dev": true,
+      "license": "CC0-1.0"
+    },
+    "node_modules/min-indent": {
+      "version": "1.0.1",
+      "resolved": "https://registry.npmjs.org/min-indent/-/min-indent-1.0.1.tgz",
+      "integrity": "sha512-I9jwMn07Sy/IwOj3zVkVik2JTvgpaykDZEigL6Rx6N9LbMywwUSMtxET+7lVoDLLd3O3IXwJwvuuns8UB/HeAg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=4"
+      }
+    },
+    "node_modules/nanoid": {
+      "version": "3.3.17",
+      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.17.tgz",
+      "integrity": "sha512-xQLf0A3HOMlgHq0n247/LRuAOYmB7dXJ/DvAxGvsSBij45XtBSmQycu+F8ODbHwns/XyFZagyL1+J0Offw1E0g==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/ai"
+        }
+      ],
+      "license": "MIT",
+      "bin": {
+        "nanoid": "bin/nanoid.cjs"
+      },
+      "engines": {
+        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
+      }
+    },
+    "node_modules/obug": {
+      "version": "2.1.4",
+      "resolved": "https://registry.npmjs.org/obug/-/obug-2.1.4.tgz",
+      "integrity": "sha512-4a+OsYv9UktOJKE+l1A4OufDgdRF9PifWj+tJnHURo/P+WOxpG4GzUFL9qCalmWauao6ogiG+QvnCovwPoyAWA==",
+      "dev": true,
+      "funding": [
+        "https://github.com/sponsors/sxzz",
+        "https://opencollective.com/debug"
+      ],
+      "license": "MIT",
+      "engines": {
+        "node": ">=12.20.0"
+      }
+    },
+    "node_modules/oxlint": {
+      "version": "1.77.0",
+      "resolved": "https://registry.npmjs.org/oxlint/-/oxlint-1.77.0.tgz",
+      "integrity": "sha512-qnGh8XJHaQ0dprrDXNQZgS0FgjI6v+V3+X8DwmaV++5Aamy6jGKfDdQ1TUvhUxtmKFAbEf4/WeO5QZX+5WSngg==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "oxlint": "bin/oxlint"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/Boshen"
+      },
+      "optionalDependencies": {
+        "@oxlint/binding-android-arm-eabi": "1.77.0",
+        "@oxlint/binding-android-arm64": "1.77.0",
+        "@oxlint/binding-darwin-arm64": "1.77.0",
+        "@oxlint/binding-darwin-x64": "1.77.0",
+        "@oxlint/binding-freebsd-x64": "1.77.0",
+        "@oxlint/binding-linux-arm-gnueabihf": "1.77.0",
+        "@oxlint/binding-linux-arm-musleabihf": "1.77.0",
+        "@oxlint/binding-linux-arm64-gnu": "1.77.0",
+        "@oxlint/binding-linux-arm64-musl": "1.77.0",
+        "@oxlint/binding-linux-ppc64-gnu": "1.77.0",
+        "@oxlint/binding-linux-riscv64-gnu": "1.77.0",
+        "@oxlint/binding-linux-riscv64-musl": "1.77.0",
+        "@oxlint/binding-linux-s390x-gnu": "1.77.0",
+        "@oxlint/binding-linux-x64-gnu": "1.77.0",
+        "@oxlint/binding-linux-x64-musl": "1.77.0",
+        "@oxlint/binding-openharmony-arm64": "1.77.0",
+        "@oxlint/binding-win32-arm64-msvc": "1.77.0",
+        "@oxlint/binding-win32-ia32-msvc": "1.77.0",
+        "@oxlint/binding-win32-x64-msvc": "1.77.0"
+      },
+      "peerDependencies": {
+        "oxlint-tsgolint": ">=7.0.2001",
+        "vite-plus": "*"
+      },
+      "peerDependenciesMeta": {
+        "oxlint-tsgolint": {
+          "optional": true
+        },
+        "vite-plus": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/parse5": {
+      "version": "8.0.1",
+      "resolved": "https://registry.npmjs.org/parse5/-/parse5-8.0.1.tgz",
+      "integrity": "sha512-z1e/HMG90obSGeidlli3hj7cbocou0/wa5HacvI3ASx34PecNjNQeaHNo5WIZpWofN9kgkqV1q5YvXe3F0FoPw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "entities": "^8.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/inikulin/parse5?sponsor=1"
+      }
+    },
+    "node_modules/pathe": {
+      "version": "2.0.3",
+      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
+      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/picocolors": {
+      "version": "1.1.1",
+      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
+      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
+      "dev": true,
+      "license": "ISC"
+    },
+    "node_modules/picomatch": {
+      "version": "4.0.5",
+      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.5.tgz",
+      "integrity": "sha512-RvwwcruNjI1ncT5xRakeyS9Lf8lcItv34KD+aif+VH9kduAyfYBipGh12274xtenIPZ119/R9BdTBa8gAwSh0A==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/jonschlinkert"
+      }
+    },
+    "node_modules/postcss": {
+      "version": "8.5.25",
+      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.25.tgz",
+      "integrity": "sha512-DTPx3RWSSnWyzLxQnlH0rJP+EW5ekl16ZU4/psbIhA0e53kJfdgaN5vKM+xP7yJtXVu+nfdVFmlgFDEKAe4Pyw==",
+      "dev": true,
+      "funding": [
+        {
+          "type": "opencollective",
+          "url": "https://opencollective.com/postcss/"
+        },
+        {
+          "type": "tidelift",
+          "url": "https://tidelift.com/funding/github/npm/postcss"
+        },
+        {
+          "type": "github",
+          "url": "https://github.com/sponsors/ai"
+        }
+      ],
+      "license": "MIT",
+      "dependencies": {
+        "nanoid": "^3.3.16",
+        "picocolors": "^1.1.1",
+        "source-map-js": "^1.2.1"
+      },
+      "engines": {
+        "node": "^10 || ^12 || >=14"
+      }
+    },
+    "node_modules/pretty-format": {
+      "version": "27.5.1",
+      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-27.5.1.tgz",
+      "integrity": "sha512-Qb1gy5OrP5+zDf2Bvnzdl3jsTf1qXVMazbvCoKhtKqVs4/YK4ozX4gKQJJVyNe+cajNPn0KoC0MC3FUmaHWEmQ==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true,
+      "dependencies": {
+        "ansi-regex": "^5.0.1",
+        "ansi-styles": "^5.0.0",
+        "react-is": "^17.0.1"
+      },
+      "engines": {
+        "node": "^10.13.0 || ^12.13.0 || ^14.15.0 || >=15.0.0"
+      }
+    },
+    "node_modules/punycode": {
+      "version": "2.3.1",
+      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
+      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6"
+      }
+    },
+    "node_modules/react": {
+      "version": "19.2.8",
+      "resolved": "https://registry.npmjs.org/react/-/react-19.2.8.tgz",
+      "integrity": "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw==",
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.10.0"
+      }
+    },
+    "node_modules/react-dom": {
+      "version": "19.2.8",
+      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.8.tgz",
+      "integrity": "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ==",
+      "license": "MIT",
+      "dependencies": {
+        "scheduler": "^0.27.0"
+      },
+      "peerDependencies": {
+        "react": "^19.2.8"
+      }
+    },
+    "node_modules/react-is": {
+      "version": "17.0.2",
+      "resolved": "https://registry.npmjs.org/react-is/-/react-is-17.0.2.tgz",
+      "integrity": "sha512-w2GsyukL62IJnlaff/nRegPQR94C/XXamvMWmSHRJ4y7Ts/4ocGRmTHvOs8PSE6pB3dWOrD/nueuU5sduBsQ4w==",
+      "dev": true,
+      "license": "MIT",
+      "peer": true
+    },
+    "node_modules/redent": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/redent/-/redent-3.0.0.tgz",
+      "integrity": "sha512-6tDA8g98We0zd0GvVeMT9arEOnTw9qM03L9cJXaCjrip1OO764RDBLBfrB4cwzNGDj5OA5ioymC9GkizgWJDUg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "indent-string": "^4.0.0",
+        "strip-indent": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/require-from-string": {
+      "version": "2.0.2",
+      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
+      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.10.0"
+      }
+    },
+    "node_modules/rolldown": {
+      "version": "1.2.3",
+      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.3.tgz",
+      "integrity": "sha512-rn9wpmxplLf7NLNyCk9FyWh3FM43DbY8jOzCdEPzH7uflhTftRbCEpqi6Ly2osgoU8OwObtmavMbWLaWy4LX7A==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@oxc-project/types": "=0.143.0",
+        "@rolldown/pluginutils": "^1.0.0"
+      },
+      "bin": {
+        "rolldown": "bin/cli.mjs"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "optionalDependencies": {
+        "@rolldown/binding-android-arm64": "1.2.3",
+        "@rolldown/binding-darwin-arm64": "1.2.3",
+        "@rolldown/binding-darwin-x64": "1.2.3",
+        "@rolldown/binding-freebsd-x64": "1.2.3",
+        "@rolldown/binding-linux-arm-gnueabihf": "1.2.3",
+        "@rolldown/binding-linux-arm64-gnu": "1.2.3",
+        "@rolldown/binding-linux-arm64-musl": "1.2.3",
+        "@rolldown/binding-linux-ppc64-gnu": "1.2.3",
+        "@rolldown/binding-linux-s390x-gnu": "1.2.3",
+        "@rolldown/binding-linux-x64-gnu": "1.2.3",
+        "@rolldown/binding-linux-x64-musl": "1.2.3",
+        "@rolldown/binding-openharmony-arm64": "1.2.3",
+        "@rolldown/binding-win32-arm64-msvc": "1.2.3",
+        "@rolldown/binding-win32-x64-msvc": "1.2.3"
+      }
+    },
+    "node_modules/saxes": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/saxes/-/saxes-6.0.0.tgz",
+      "integrity": "sha512-xAg7SOnEhrm5zI3puOOKyy1OMcMlIJZYNJY7xLBwSze0UjhPLnWfj2GF2EpT0jmzaJKIWKHLsaSSajf35bcYnA==",
+      "dev": true,
+      "license": "ISC",
+      "dependencies": {
+        "xmlchars": "^2.2.0"
+      },
+      "engines": {
+        "node": ">=v12.22.7"
+      }
+    },
+    "node_modules/scheduler": {
+      "version": "0.27.0",
+      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
+      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
+      "license": "MIT"
+    },
+    "node_modules/siginfo": {
+      "version": "2.0.0",
+      "resolved": "https://registry.npmjs.org/siginfo/-/siginfo-2.0.0.tgz",
+      "integrity": "sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==",
+      "dev": true,
+      "license": "ISC"
+    },
+    "node_modules/source-map-js": {
+      "version": "1.2.1",
+      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
+      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
+      "dev": true,
+      "license": "BSD-3-Clause",
+      "engines": {
+        "node": ">=0.10.0"
+      }
+    },
+    "node_modules/stackback": {
+      "version": "0.0.2",
+      "resolved": "https://registry.npmjs.org/stackback/-/stackback-0.0.2.tgz",
+      "integrity": "sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/std-env": {
+      "version": "4.2.0",
+      "resolved": "https://registry.npmjs.org/std-env/-/std-env-4.2.0.tgz",
+      "integrity": "sha512-oCUKSupKTHX53EyjDtuZQ64pjLJ6yYCtpmEw0goYxtjG9KpbRe8KAsl2tBUGU9DyMcJ0RwJ8GqJAFzMXcXW1Rw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/strip-indent": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/strip-indent/-/strip-indent-3.0.0.tgz",
+      "integrity": "sha512-laJTa3Jb+VQpaC6DseHhF7dXVqHTfJPCRDaEbid/drOhgitgYku/letMUqOXFoWV0zIIUbjpdH2t+tYj4bQMRQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "min-indent": "^1.0.0"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/symbol-tree": {
+      "version": "3.2.4",
+      "resolved": "https://registry.npmjs.org/symbol-tree/-/symbol-tree-3.2.4.tgz",
+      "integrity": "sha512-9QNk5KwDF+Bvz+PyObkmSYjI5ksVUYtjW7AU22r2NKcfLJcXp96hkDWU3+XndOsUb+AQ9QhfzfCT2O+CNWT5Tw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/tinybench": {
+      "version": "2.9.0",
+      "resolved": "https://registry.npmjs.org/tinybench/-/tinybench-2.9.0.tgz",
+      "integrity": "sha512-0+DUvqWMValLmha6lr4kD8iAMK1HzV0/aKnCtWb9v9641TnP/MFb7Pc2bxoxQjTXAErryXVgUOfv2YqNllqGeg==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/tinyexec": {
+      "version": "1.3.0",
+      "resolved": "https://registry.npmjs.org/tinyexec/-/tinyexec-1.3.0.tgz",
+      "integrity": "sha512-QKAl9m8gWWGHV8jZcPeym6j+XULi6tOf1mT83WYJ4Lk2ytW/uwAWkrP0uFsdoYMdueVJ0qs26wZ+23xeB4ibNQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/tinyglobby": {
+      "version": "0.2.17",
+      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
+      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "fdir": "^6.5.0",
+        "picomatch": "^4.0.4"
+      },
+      "engines": {
+        "node": ">=12.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/SuperchupuDev"
+      }
+    },
+    "node_modules/tinyrainbow": {
+      "version": "3.1.1",
+      "resolved": "https://registry.npmjs.org/tinyrainbow/-/tinyrainbow-3.1.1.tgz",
+      "integrity": "sha512-yau8yJdTt989Mm0Bd/236QnzEiPf2xLLTqUZRUJOo/3CB078LSwzei343DgtJVmfJKJE3TMINY1u42SQsP6mXw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=14.0.0"
+      }
+    },
+    "node_modules/tldts": {
+      "version": "7.4.10",
+      "resolved": "https://registry.npmjs.org/tldts/-/tldts-7.4.10.tgz",
+      "integrity": "sha512-GgouD1B+sWwvkaEq8vXC15DjQitxbvs12oIXELpconwm+Tg3zfcEv4jgzq3vtKverDXsg3VI8aRgNL2Nra0Iog==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "tldts-core": "^7.4.10"
+      },
+      "bin": {
+        "tldts": "bin/cli.js"
+      }
+    },
+    "node_modules/tldts-core": {
+      "version": "7.4.10",
+      "resolved": "https://registry.npmjs.org/tldts-core/-/tldts-core-7.4.10.tgz",
+      "integrity": "sha512-KnQjp53ZekKgm/r3l+u8kJGGzYgrWdP8+Mql7a4vijh2WE0IrZWspQj/TpTxDho/YxO+AnOZnIjQcCD+q6iJsw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/tough-cookie": {
+      "version": "6.0.2",
+      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-6.0.2.tgz",
+      "integrity": "sha512-exgYmnmL/sJpR3upZfXG5PoatXQii55xAiXGXzY+sROLZ/Y+SLcp9PgJNI9Vz37HpQ74WvDcLT8eqm+kV3FzrA==",
+      "dev": true,
+      "license": "BSD-3-Clause",
+      "dependencies": {
+        "tldts": "^7.0.5"
+      },
+      "engines": {
+        "node": ">=16"
+      }
+    },
+    "node_modules/tr46": {
+      "version": "6.0.0",
+      "resolved": "https://registry.npmjs.org/tr46/-/tr46-6.0.0.tgz",
+      "integrity": "sha512-bLVMLPtstlZ4iMQHpFHTR7GAGj2jxi8Dg0s2h2MafAE4uSWF98FC/3MomU51iQAMf8/qDUbKWf5GxuvvVcXEhw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "punycode": "^2.3.1"
+      },
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/typescript": {
+      "version": "6.0.3",
+      "resolved": "https://registry.npmjs.org/typescript/-/typescript-6.0.3.tgz",
+      "integrity": "sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "bin": {
+        "tsc": "bin/tsc",
+        "tsserver": "bin/tsserver"
+      },
+      "engines": {
+        "node": ">=14.17"
+      }
+    },
+    "node_modules/undici": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/undici/-/undici-7.29.0.tgz",
+      "integrity": "sha512-IDxfleLmmbSskfWSUATiN1nfn2rDuvnMOqb5CWR92iIfojA0Ud+ulOAAEQ57LPr9rWmsreUyf5lwyao+7GNNVw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=20.18.1"
+      }
+    },
+    "node_modules/undici-types": {
+      "version": "7.18.2",
+      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.18.2.tgz",
+      "integrity": "sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/vite": {
+      "version": "8.2.0",
+      "resolved": "https://registry.npmjs.org/vite/-/vite-8.2.0.tgz",
+      "integrity": "sha512-pn+CFpM0lwDeKwmOq1ZaBK/9sjorZcgqxki6MbY/jPEVd9vichIlmlD4HmQ5wdP5EgqQCFRaACBxMC7uEGc6lQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "lightningcss": "^1.33.0",
+        "picomatch": "^4.0.5",
+        "postcss": "^8.5.23",
+        "rolldown": "~1.2.0",
+        "tinyglobby": "^0.2.17"
+      },
+      "bin": {
+        "vite": "bin/vite.js"
+      },
+      "engines": {
+        "node": "^20.19.0 || >=22.12.0"
+      },
+      "funding": {
+        "url": "https://github.com/vitejs/vite?sponsor=1"
+      },
+      "optionalDependencies": {
+        "fsevents": "~2.3.3"
+      },
+      "peerDependencies": {
+        "@types/node": "^20.19.0 || >=22.12.0",
+        "@vitejs/devtools": "^0.4.0",
+        "esbuild": "^0.27.0 || ^0.28.0",
+        "jiti": ">=1.21.0",
+        "less": "^4.0.0",
+        "sass": "^1.70.0",
+        "sass-embedded": "^1.70.0",
+        "stylus": ">=0.54.8",
+        "sugarss": "^5.0.0",
+        "terser": "^5.16.0",
+        "tsx": "^4.8.1",
+        "yaml": "^2.4.2"
+      },
+      "peerDependenciesMeta": {
+        "@types/node": {
+          "optional": true
+        },
+        "@vitejs/devtools": {
+          "optional": true
+        },
+        "esbuild": {
+          "optional": true
+        },
+        "jiti": {
+          "optional": true
+        },
+        "less": {
+          "optional": true
+        },
+        "sass": {
+          "optional": true
+        },
+        "sass-embedded": {
+          "optional": true
+        },
+        "stylus": {
+          "optional": true
+        },
+        "sugarss": {
+          "optional": true
+        },
+        "terser": {
+          "optional": true
+        },
+        "tsx": {
+          "optional": true
+        },
+        "yaml": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/vitest": {
+      "version": "4.1.10",
+      "resolved": "https://registry.npmjs.org/vitest/-/vitest-4.1.10.tgz",
+      "integrity": "sha512-R9jUTe5S4Qb0HCd4TNqpC7oGcrMssMRGXLW80ubjWsW9VH5GF8y1Y0SFLY9AbqSk6nt0PnOx4H4WNJYZ13GUPw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@vitest/expect": "4.1.10",
+        "@vitest/mocker": "4.1.10",
+        "@vitest/pretty-format": "4.1.10",
+        "@vitest/runner": "4.1.10",
+        "@vitest/snapshot": "4.1.10",
+        "@vitest/spy": "4.1.10",
+        "@vitest/utils": "4.1.10",
+        "es-module-lexer": "^2.0.0",
+        "expect-type": "^1.3.0",
+        "magic-string": "^0.30.21",
+        "obug": "^2.1.1",
+        "pathe": "^2.0.3",
+        "picomatch": "^4.0.3",
+        "std-env": "^4.0.0-rc.1",
+        "tinybench": "^2.9.0",
+        "tinyexec": "^1.0.2",
+        "tinyglobby": "^0.2.15",
+        "tinyrainbow": "^3.1.0",
+        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0",
+        "why-is-node-running": "^2.3.0"
+      },
+      "bin": {
+        "vitest": "vitest.mjs"
+      },
+      "engines": {
+        "node": "^20.0.0 || ^22.0.0 || >=24.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/vitest"
+      },
+      "peerDependencies": {
+        "@edge-runtime/vm": "*",
+        "@opentelemetry/api": "^1.9.0",
+        "@types/node": "^20.0.0 || ^22.0.0 || >=24.0.0",
+        "@vitest/browser-playwright": "4.1.10",
+        "@vitest/browser-preview": "4.1.10",
+        "@vitest/browser-webdriverio": "4.1.10",
+        "@vitest/coverage-istanbul": "4.1.10",
+        "@vitest/coverage-v8": "4.1.10",
+        "@vitest/ui": "4.1.10",
+        "happy-dom": "*",
+        "jsdom": "*",
+        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0"
+      },
+      "peerDependenciesMeta": {
+        "@edge-runtime/vm": {
+          "optional": true
+        },
+        "@opentelemetry/api": {
+          "optional": true
+        },
+        "@types/node": {
+          "optional": true
+        },
+        "@vitest/browser-playwright": {
+          "optional": true
+        },
+        "@vitest/browser-preview": {
+          "optional": true
+        },
+        "@vitest/browser-webdriverio": {
+          "optional": true
+        },
+        "@vitest/coverage-istanbul": {
+          "optional": true
+        },
+        "@vitest/coverage-v8": {
+          "optional": true
+        },
+        "@vitest/ui": {
+          "optional": true
+        },
+        "happy-dom": {
+          "optional": true
+        },
+        "jsdom": {
+          "optional": true
+        },
+        "vite": {
+          "optional": false
+        }
+      }
+    },
+    "node_modules/w3c-xmlserializer": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/w3c-xmlserializer/-/w3c-xmlserializer-5.0.0.tgz",
+      "integrity": "sha512-o8qghlI8NZHU1lLPrpi2+Uq7abh4GGPpYANlalzWxyWteJOCsr/P+oPBA49TOLu5FTZO4d3F9MnWJfiMo4BkmA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "xml-name-validator": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/webidl-conversions": {
+      "version": "8.0.1",
+      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-8.0.1.tgz",
+      "integrity": "sha512-BMhLD/Sw+GbJC21C/UgyaZX41nPt8bUTg+jWyDeg7e7YN4xOM05YPSIXceACnXVtqyEw/LMClUQMtMZ+PGGpqQ==",
+      "dev": true,
+      "license": "BSD-2-Clause",
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/whatwg-mimetype": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/whatwg-mimetype/-/whatwg-mimetype-5.0.0.tgz",
+      "integrity": "sha512-sXcNcHOC51uPGF0P/D4NVtrkjSU2fNsm9iog4ZvZJsL3rjoDAzXZhkm2MWt1y+PUdggKAYVoMAIYcs78wJ51Cw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=20"
+      }
+    },
+    "node_modules/whatwg-url": {
+      "version": "16.0.1",
+      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-16.0.1.tgz",
+      "integrity": "sha512-1to4zXBxmXHV3IiSSEInrreIlu02vUOvrhxJJH5vcxYTBDAx51cqZiKdyTxlecdKNSjj8EcxGBxNf6Vg+945gw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@exodus/bytes": "^1.11.0",
+        "tr46": "^6.0.0",
+        "webidl-conversions": "^8.0.1"
+      },
+      "engines": {
+        "node": "^20.19.0 || ^22.12.0 || >=24.0.0"
+      }
+    },
+    "node_modules/why-is-node-running": {
+      "version": "2.3.0",
+      "resolved": "https://registry.npmjs.org/why-is-node-running/-/why-is-node-running-2.3.0.tgz",
+      "integrity": "sha512-hUrmaWBdVDcxvYqnyh09zunKzROWjbZTiNy8dBEjkS7ehEDQibXJ7XvlmtbwuTclUiIyN+CyXQD4Vmko8fNm8w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "siginfo": "^2.0.0",
+        "stackback": "0.0.2"
+      },
+      "bin": {
+        "why-is-node-running": "cli.js"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/xml-name-validator": {
+      "version": "5.0.0",
+      "resolved": "https://registry.npmjs.org/xml-name-validator/-/xml-name-validator-5.0.0.tgz",
+      "integrity": "sha512-EvGK8EJ3DhaHfbRlETOWAS5pO9MZITeauHKJyb8wyajUfQUenkIg2MvLDTZ4T/TgIcm3HU0TFBgWWboAZ30UHg==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/xmlchars": {
+      "version": "2.2.0",
+      "resolved": "https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz",
+      "integrity": "sha512-JZnDKK8B0RCDw84FNdDAIpZK+JuJw+s7Lz8nksI7SIuU3UXJJslUthsi+uWBUYOwPFwW7W7PRLRfUKpxjtjFCw==",
+      "dev": true,
+      "license": "MIT"
+    }
+  }
+}
diff --git a/app/package.json b/app/package.json
new file mode 100644
index 0000000..bfeb803
--- /dev/null
+++ b/app/package.json
@@ -0,0 +1,30 @@
+{
+  "name": "app",
+  "private": true,
+  "version": "0.0.0",
+  "type": "module",
+  "scripts": {
+    "dev": "vite",
+    "build": "tsc -b && vite build",
+    "preview": "vite preview",
+    "test": "vitest run --passWithNoTests",
+    "test:watch": "vitest"
+  },
+  "dependencies": {
+    "react": "^19.2.8",
+    "react-dom": "^19.2.8"
+  },
+  "devDependencies": {
+    "@testing-library/jest-dom": "^7.0.0",
+    "@testing-library/react": "^16.3.2",
+    "@types/node": "^24.13.3",
+    "@types/react": "^19.2.17",
+    "@types/react-dom": "^19.2.3",
+    "@vitejs/plugin-react": "^6.0.4",
+    "jsdom": "^29.1.1",
+    "oxlint": "^1.75.0",
+    "typescript": "~6.0.2",
+    "vite": "^8.2.0",
+    "vitest": "^4.1.10"
+  }
+}
diff --git a/app/public/favicon.svg b/app/public/favicon.svg
new file mode 100644
index 0000000..6893eb1
--- /dev/null
+++ b/app/public/favicon.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
\ No newline at end of file
diff --git a/app/public/icons.svg b/app/public/icons.svg
new file mode 100644
index 0000000..e952219
--- /dev/null
+++ b/app/public/icons.svg
@@ -0,0 +1,24 @@
+<svg xmlns="http://www.w3.org/2000/svg">
+  <symbol id="bluesky-icon" viewBox="0 0 16 17">
+    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
+    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
+  </symbol>
+  <symbol id="discord-icon" viewBox="0 0 20 19">
+    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
+  </symbol>
+  <symbol id="documentation-icon" viewBox="0 0 21 20">
+    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
+    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
+    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
+  </symbol>
+  <symbol id="github-icon" viewBox="0 0 19 19">
+    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
+  </symbol>
+  <symbol id="social-icon" viewBox="0 0 20 20">
+    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
+    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
+  </symbol>
+  <symbol id="x-icon" viewBox="0 0 19 19">
+    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
+  </symbol>
+</svg>
diff --git a/app/src/App.css b/app/src/App.css
new file mode 100644
index 0000000..07b15b9
--- /dev/null
+++ b/app/src/App.css
@@ -0,0 +1,78 @@
+.turn-screen {
+  display: flex;
+  flex-direction: column;
+  height: 100vh;
+  padding: 2rem;
+  box-sizing: border-box;
+  text-align: center;
+  font-family: system-ui, -apple-system, sans-serif;
+}
+
+.header {
+  margin-bottom: 2rem;
+}
+
+.header h1 {
+  font-size: 3rem;
+  margin: 0 0 0.5rem 0;
+  color: #2c3e50;
+}
+
+.header h2 {
+  font-size: 2rem;
+  margin: 0;
+  color: #7f8c8d;
+}
+
+.main-content {
+  flex: 1;
+  display: flex;
+  flex-direction: column;
+  align-items: center;
+  justify-content: center;
+  position: relative;
+}
+
+.question-card {
+  margin-top: 3rem;
+  padding: 2rem;
+  background: #fff;
+  border-radius: 12px;
+  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
+  max-width: 800px;
+  width: 100%;
+}
+
+.question-text {
+  font-size: 2.5rem;
+  line-height: 1.4;
+  color: #2c3e50;
+  margin: 0;
+}
+
+.host-controls {
+  margin-top: auto;
+  padding-top: 2rem;
+  display: flex;
+  gap: 1rem;
+  justify-content: center;
+}
+
+.host-controls button {
+  font-size: 1.5rem;
+  padding: 1rem 2rem;
+  border: none;
+  border-radius: 8px;
+  background: #3498db;
+  color: white;
+  cursor: pointer;
+  transition: background 0.2s, transform 0.1s;
+}
+
+.host-controls button:hover {
+  background: #2980b9;
+}
+
+.host-controls button:active {
+  transform: scale(0.98);
+}
diff --git a/app/src/App.tsx b/app/src/App.tsx
new file mode 100644
index 0000000..52b8415
--- /dev/null
+++ b/app/src/App.tsx
@@ -0,0 +1,8 @@
+import { TurnScreen } from './ui/TurnScreen'
+import './App.css'
+
+function App() {
+  return <TurnScreen />
+}
+
+export default App
diff --git a/app/src/assets/hero.png b/app/src/assets/hero.png
new file mode 100644
index 0000000..02251f4
Binary files /dev/null and b/app/src/assets/hero.png differ
diff --git a/app/src/assets/react.svg b/app/src/assets/react.svg
new file mode 100644
index 0000000..6c87de9
--- /dev/null
+++ b/app/src/assets/react.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
\ No newline at end of file
diff --git a/app/src/assets/vite.svg b/app/src/assets/vite.svg
new file mode 100644
index 0000000..5101b67
--- /dev/null
+++ b/app/src/assets/vite.svg
@@ -0,0 +1 @@
+<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
diff --git a/app/src/game/clans.ts b/app/src/game/clans.ts
new file mode 100644
index 0000000..860f93e
--- /dev/null
+++ b/app/src/game/clans.ts
@@ -0,0 +1,18 @@
+import type { Clan } from "./types";
+
+export const CLANS: Clan[] = [
+  { id: "guardia-dragones", nombre: "V Guardia de Dragones" },
+  { id: "humaita-ps15", nombre: "Humaita PS15" },
+  { id: "chaco-boreal", nombre: "Chaco Boreal" },
+  { id: "orden-san-jorge", nombre: "La Orden de San Jorge" },
+  { id: "kurusu-peregrino", nombre: "Kurusu Peregrino" },
+  { id: "humaita-cf1", nombre: "Humaita CF1" },
+  { id: "san-jorge-capadocia", nombre: "San Jorge de Capadocia" },
+  { id: "yvy-pyta", nombre: "Yvy Pytã" },
+];
+
+export function clanSectorIndex(clanId: string): number {
+  const index = CLANS.findIndex((c) => c.id === clanId);
+  if (index < 0) throw new Error(`Unknown clan: ${clanId}`);
+  return index;
+}
diff --git a/app/src/game/questions.test.ts b/app/src/game/questions.test.ts
new file mode 100644
index 0000000..7ae5210
--- /dev/null
+++ b/app/src/game/questions.test.ts
@@ -0,0 +1,15 @@
+import { describe, expect, it } from "vitest";
+import { QUESTIONS, pickRandomUnused } from "./questions";
+
+describe("pickRandomUnused", () => {
+  it("never returns a used id", () => {
+    const used = [QUESTIONS[0].id, QUESTIONS[1].id];
+    const q = pickRandomUnused(used, QUESTIONS, () => 0);
+    expect(used).not.toContain(q.id);
+  });
+
+  it("throws when none left", () => {
+    const used = QUESTIONS.map((q) => q.id);
+    expect(() => pickRandomUnused(used, QUESTIONS, () => 0)).toThrow();
+  });
+});
diff --git a/app/src/game/questions.ts b/app/src/game/questions.ts
new file mode 100644
index 0000000..0b38b6b
--- /dev/null
+++ b/app/src/game/questions.ts
@@ -0,0 +1,79 @@
+import type { Question, Rng } from "./types";
+
+export const QUESTIONS: Question[] = [
+  {
+    id: 1,
+    texto: "¿Cuál es el lema de los Rovers?",
+    respuestaCorrecta: "Servir.",
+  },
+  {
+    id: 2,
+    texto: "¿Cómo se denomina la unidad de la Rama Rover?",
+    respuestaCorrecta: "Clan de Rovers.",
+  },
+  {
+    id: 3,
+    texto: "¿Qué significa “Ich Dien”?",
+    respuestaCorrecta: "Yo sirvo.",
+  },
+  {
+    id: 4,
+    texto: "¿Quién escribió Roverismo hacia el éxito?",
+    respuestaCorrecta: "Robert Baden-Powell.",
+  },
+  {
+    id: 5,
+    texto: "¿Qué significa FEPE?",
+    respuestaCorrecta: "Federación Paraguaya de Escultismo.",
+  },
+  {
+    id: 6,
+    texto: "¿Cuál es la capital de Paraguay?",
+    respuestaCorrecta: "Asunción.",
+  },
+  {
+    id: 7,
+    texto: "¿Entre qué edades se aplica el método Rover según Roverismo Práctico?",
+    respuestaCorrecta: "Entre los 18 y los 22 años.",
+  },
+  {
+    id: 8,
+    texto: "¿Qué es el Consejo de Clan?",
+    respuestaCorrecta:
+      "Es el organismo de deliberación, participación y decisión del Clan.",
+  },
+  {
+    id: 9,
+    texto: "¿Quién fundó el Movimiento Scout?",
+    respuestaCorrecta: "Lord Robert Stephenson Smyth Baden-Powell.",
+  },
+  {
+    id: 10,
+    texto: "¿Qué color tiene el kepí de los Rovers según el manual?",
+    respuestaCorrecta: "Rojo, con la insignia oficial correspondiente.",
+  },
+  {
+    id: 11,
+    texto: "¿Dónde se realizó el primer Rover Moot Mundial?",
+    respuestaCorrecta: "En Kandersteg, Suiza.",
+  },
+  {
+    id: 12,
+    texto: "¿Cuáles son los dos idiomas oficiales de Paraguay?",
+    respuestaCorrecta: "Español y guaraní.",
+  },
+];
+
+export function pickRandomUnused(
+  usedIds: number[],
+  questions: Question[],
+  rng: Rng,
+): Question {
+  const available = questions.filter((q) => !usedIds.includes(q.id));
+  if (available.length === 0) throw new Error("No unused questions left");
+  const index = Math.min(
+    available.length - 1,
+    Math.floor(rng() * available.length),
+  );
+  return available[index];
+}
diff --git a/app/src/game/round.test.ts b/app/src/game/round.test.ts
new file mode 100644
index 0000000..8f59056
--- /dev/null
+++ b/app/src/game/round.test.ts
@@ -0,0 +1,33 @@
+import { describe, expect, it } from "vitest";
+import { CLANS } from "./clans";
+import {
+  advanceRoundIfComplete,
+  getPendingClans,
+  markClanPlayed,
+} from "./round";
+import type { RoundState } from "./types";
+
+const empty: RoundState = {
+  roundNumber: 1,
+  playedClanIds: [],
+  usedQuestionIds: [],
+};
+
+describe("round", () => {
+  it("lists pending excluding played", () => {
+    const state = markClanPlayed(empty, CLANS[0].id);
+    const pending = getPendingClans(CLANS, state.playedClanIds);
+    expect(pending).toHaveLength(7);
+    expect(pending.map((c) => c.id)).not.toContain(CLANS[0].id);
+  });
+
+  it("advances round after all clans played", () => {
+    let state = empty;
+    for (const clan of CLANS) {
+      state = markClanPlayed(state, clan.id);
+      state = advanceRoundIfComplete(state, CLANS.length);
+    }
+    expect(state.roundNumber).toBe(2);
+    expect(state.playedClanIds).toEqual([]);
+  });
+});
diff --git a/app/src/game/round.ts b/app/src/game/round.ts
new file mode 100644
index 0000000..c9ae4a7
--- /dev/null
+++ b/app/src/game/round.ts
@@ -0,0 +1,32 @@
+import type { Clan, RoundState } from "./types";
+
+export function getPendingClans(
+  clans: Clan[],
+  playedClanIds: string[],
+): Clan[] {
+  const played = new Set(playedClanIds);
+  return clans.filter((c) => !played.has(c.id));
+}
+
+export function markClanPlayed(
+  state: RoundState,
+  clanId: string,
+): RoundState {
+  if (state.playedClanIds.includes(clanId)) return state;
+  return {
+    ...state,
+    playedClanIds: [...state.playedClanIds, clanId],
+  };
+}
+
+export function advanceRoundIfComplete(
+  state: RoundState,
+  clanCount: number,
+): RoundState {
+  if (state.playedClanIds.length < clanCount) return state;
+  return {
+    ...state,
+    roundNumber: state.roundNumber + 1,
+    playedClanIds: [],
+  };
+}
diff --git a/app/src/game/spin.test.ts b/app/src/game/spin.test.ts
new file mode 100644
index 0000000..84d42a6
--- /dev/null
+++ b/app/src/game/spin.test.ts
@@ -0,0 +1,34 @@
+import { describe, expect, it } from "vitest";
+import { CLANS, clanSectorIndex } from "./clans";
+import { angleForClanIndex, pickClan } from "./spin";
+
+describe("pickClan", () => {
+  it("picks only from pending", () => {
+    const pending = CLANS.slice(0, 3);
+    const picked = pickClan(pending, () => 0.99);
+    expect(pending.map((c) => c.id)).toContain(picked.id);
+  });
+
+  it("uses rng to select index", () => {
+    const pending = CLANS.slice(0, 4);
+    // 0.5 * 4 = 2
+    expect(pickClan(pending, () => 0.5).id).toBe(pending[2].id);
+  });
+
+  it("throws when pending is empty", () => {
+    expect(() => pickClan([], () => 0)).toThrow();
+  });
+});
+
+describe("angleForClanIndex", () => {
+  it("uses 45° sectors", () => {
+    expect(angleForClanIndex(0)).toBe(0);
+    expect(angleForClanIndex(1)).toBe(45);
+    expect(angleForClanIndex(7)).toBe(315);
+  });
+
+  it("maps each clan to a distinct sector", () => {
+    const angles = CLANS.map((c) => angleForClanIndex(clanSectorIndex(c.id)));
+    expect(new Set(angles).size).toBe(8);
+  });
+});
diff --git a/app/src/game/spin.ts b/app/src/game/spin.ts
new file mode 100644
index 0000000..7ee8b2a
--- /dev/null
+++ b/app/src/game/spin.ts
@@ -0,0 +1,30 @@
+import type { Clan, Rng } from "./types";
+
+export const SPIN_EXTRA_TURNS = 5;
+export const SPIN_DURATION_MS = 3500;
+export const SECTOR_DEGREES = 45;
+
+export function pickClan(pending: Clan[], rng: Rng): Clan {
+  if (pending.length === 0) throw new Error("No pending clans");
+  const index = Math.min(pending.length - 1, Math.floor(rng() * pending.length));
+  return pending[index];
+}
+
+/** Degrees to rotate the wheel so sector `index` lands under the top pointer. */
+export function angleForClanIndex(
+  index: number,
+  sectorDegrees: number = SECTOR_DEGREES,
+): number {
+  return index * sectorDegrees;
+}
+
+export function targetWheelRotationDeg(clanIndex: number, extraTurns = SPIN_EXTRA_TURNS): number {
+  // Pointer at top: rotate so sector center is at 0° (calibrate later with OFFSET_DEG if needed)
+  const OFFSET_DEG = sectorCenterOffset(clanIndex);
+  return extraTurns * 360 + OFFSET_DEG;
+}
+
+function sectorCenterOffset(clanIndex: number): number {
+  // Center of sector under pointer: negative rotation brings sector to top
+  return -(angleForClanIndex(clanIndex) + SECTOR_DEGREES / 2);
+}
diff --git a/app/src/game/turnReducer.test.ts b/app/src/game/turnReducer.test.ts
new file mode 100644
index 0000000..890ed74
--- /dev/null
+++ b/app/src/game/turnReducer.test.ts
@@ -0,0 +1,45 @@
+import { describe, expect, it } from "vitest";
+import { CLANS } from "./clans";
+import { QUESTIONS } from "./questions";
+import { initialGameState, turnReducer } from "./turnReducer";
+
+const rng0 = () => 0;
+
+describe("turnReducer", () => {
+  it("SPIN selects a pending clan without marking played", () => {
+    const s1 = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
+    expect(s1.turn.phase).toBe("spinning");
+    expect(s1.turn.selectedClanId).toBe(CLANS[0].id);
+    expect(s1.round.playedClanIds).toEqual([]);
+  });
+
+  it("RESPIN does not consume clan or question", () => {
+    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
+    s = turnReducer(s, { type: "SPIN_FINISHED" });
+    const before = structuredClone(s.round);
+    s = turnReducer(s, { type: "RESPIN", rng: () => 0.9 });
+    expect(s.round).toEqual(before);
+    expect(s.turn.phase).toBe("spinning");
+  });
+
+  it("SHOW_QUESTION marks clan and uses a question", () => {
+    let s = turnReducer(initialGameState(), { type: "SPIN", rng: rng0 });
+    s = turnReducer(s, { type: "SPIN_FINISHED" });
+    s = turnReducer(s, { type: "SHOW_QUESTION", rng: rng0 });
+    expect(s.turn.phase).toBe("question");
+    expect(s.round.playedClanIds).toContain(CLANS[0].id);
+    expect(s.round.usedQuestionIds).toContain(QUESTIONS[0].id);
+  });
+
+  it("advances round after 8 SHOW_QUESTION cycles", () => {
+    let s = initialGameState();
+    for (let i = 0; i < 8; i++) {
+      s = turnReducer(s, { type: "SPIN", rng: () => 0 });
+      s = turnReducer(s, { type: "SPIN_FINISHED" });
+      s = turnReducer(s, { type: "SHOW_QUESTION", rng: () => 0 });
+      s = turnReducer(s, { type: "NEXT_TURN" });
+    }
+    expect(s.round.roundNumber).toBe(2);
+    expect(s.round.playedClanIds).toEqual([]);
+  });
+});
diff --git a/app/src/game/turnReducer.ts b/app/src/game/turnReducer.ts
new file mode 100644
index 0000000..b074090
--- /dev/null
+++ b/app/src/game/turnReducer.ts
@@ -0,0 +1,138 @@
+import { CLANS, clanSectorIndex } from "./clans";
+import { QUESTIONS, pickRandomUnused } from "./questions";
+import {
+  advanceRoundIfComplete,
+  getPendingClans,
+  markClanPlayed,
+} from "./round";
+import { pickClan, targetWheelRotationDeg } from "./spin";
+import type { Rng, RoundState, TurnState } from "./types";
+
+export type Action =
+  | { type: "SPIN"; rng?: Rng }
+  | { type: "SPIN_FINISHED" }
+  | { type: "RESPIN"; rng?: Rng }
+  | { type: "SHOW_QUESTION"; rng?: Rng }
+  | { type: "NEXT_TURN" };
+
+export type GameState = {
+  round: RoundState;
+  turn: TurnState;
+  rotationDeg: number;
+  error: string | null;
+};
+
+export function initialGameState(): GameState {
+  return {
+    round: {
+      roundNumber: 1,
+      playedClanIds: [],
+      usedQuestionIds: [],
+    },
+    turn: {
+      phase: "idle",
+      selectedClanId: null,
+      selectedQuestionId: null,
+    },
+    rotationDeg: 0,
+    error: null,
+  };
+}
+
+function spinToClan(
+  state: GameState,
+  rng: Rng,
+): GameState {
+  const pending = getPendingClans(CLANS, state.round.playedClanIds);
+  const clan = pickClan(pending, rng);
+  const rotationDeg = targetWheelRotationDeg(clanSectorIndex(clan.id));
+  return {
+    ...state,
+    turn: {
+      ...state.turn,
+      phase: "spinning",
+      selectedClanId: clan.id,
+    },
+    rotationDeg,
+    error: null,
+  };
+}
+
+function withError(state: GameState, message: string): GameState {
+  return { ...state, error: message };
+}
+
+export function turnReducer(state: GameState, action: Action): GameState {
+  const rng = action.type === "SPIN" || action.type === "RESPIN" || action.type === "SHOW_QUESTION"
+    ? (action.rng ?? Math.random)
+    : Math.random;
+
+  try {
+    switch (action.type) {
+      case "SPIN": {
+        if (state.turn.phase !== "idle") return state;
+        return spinToClan(state, rng);
+      }
+
+      case "SPIN_FINISHED": {
+        if (state.turn.phase !== "spinning") return state;
+        return {
+          ...state,
+          turn: { ...state.turn, phase: "clanRevealed" },
+          error: null,
+        };
+      }
+
+      case "RESPIN": {
+        if (state.turn.phase !== "clanRevealed") return state;
+        return spinToClan(state, rng);
+      }
+
+      case "SHOW_QUESTION": {
+        if (state.turn.phase !== "clanRevealed" || !state.turn.selectedClanId) {
+          return state;
+        }
+        const question = pickRandomUnused(
+          state.round.usedQuestionIds,
+          QUESTIONS,
+          rng,
+        );
+        let round = markClanPlayed(state.round, state.turn.selectedClanId);
+        round = {
+          ...round,
+          usedQuestionIds: [...round.usedQuestionIds, question.id],
+        };
+        round = advanceRoundIfComplete(round, CLANS.length);
+        return {
+          ...state,
+          round,
+          turn: {
+            ...state.turn,
+            phase: "question",
+            selectedQuestionId: question.id,
+          },
+          error: null,
+        };
+      }
+
+      case "NEXT_TURN": {
+        if (state.turn.phase !== "question") return state;
+        return {
+          ...state,
+          turn: {
+            phase: "idle",
+            selectedClanId: null,
+            selectedQuestionId: null,
+          },
+          error: null,
+        };
+      }
+
+      default:
+        return state;
+    }
+  } catch (err) {
+    const message = err instanceof Error ? err.message : String(err);
+    return withError(state, message);
+  }
+}
diff --git a/app/src/game/types.ts b/app/src/game/types.ts
new file mode 100644
index 0000000..afad763
--- /dev/null
+++ b/app/src/game/types.ts
@@ -0,0 +1,28 @@
+export type Clan = {
+  id: string;
+  nombre: string;
+  color?: string;
+  logoUrl?: string;
+};
+
+export type Question = {
+  id: number;
+  texto: string;
+  respuestaCorrecta: string;
+};
+
+export type TurnPhase = "idle" | "spinning" | "clanRevealed" | "question";
+
+export type RoundState = {
+  roundNumber: number;
+  playedClanIds: string[];
+  usedQuestionIds: number[];
+};
+
+export type TurnState = {
+  phase: TurnPhase;
+  selectedClanId: string | null;
+  selectedQuestionId: number | null;
+};
+
+export type Rng = () => number;
diff --git a/app/src/index.css b/app/src/index.css
new file mode 100644
index 0000000..5fb3313
--- /dev/null
+++ b/app/src/index.css
@@ -0,0 +1,111 @@
+:root {
+  --text: #6b6375;
+  --text-h: #08060d;
+  --bg: #fff;
+  --border: #e5e4e7;
+  --code-bg: #f4f3ec;
+  --accent: #aa3bff;
+  --accent-bg: rgba(170, 59, 255, 0.1);
+  --accent-border: rgba(170, 59, 255, 0.5);
+  --social-bg: rgba(244, 243, 236, 0.5);
+  --shadow:
+    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
+
+  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
+  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
+  --mono: ui-monospace, Consolas, monospace;
+
+  font: 18px/145% var(--sans);
+  letter-spacing: 0.18px;
+  color-scheme: light dark;
+  color: var(--text);
+  background: var(--bg);
+  font-synthesis: none;
+  text-rendering: optimizeLegibility;
+  -webkit-font-smoothing: antialiased;
+  -moz-osx-font-smoothing: grayscale;
+
+  @media (max-width: 1024px) {
+    font-size: 16px;
+  }
+}
+
+@media (prefers-color-scheme: dark) {
+  :root {
+    --text: #9ca3af;
+    --text-h: #f3f4f6;
+    --bg: #16171d;
+    --border: #2e303a;
+    --code-bg: #1f2028;
+    --accent: #c084fc;
+    --accent-bg: rgba(192, 132, 252, 0.15);
+    --accent-border: rgba(192, 132, 252, 0.5);
+    --social-bg: rgba(47, 48, 58, 0.5);
+    --shadow:
+      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
+  }
+
+  #social .button-icon {
+    filter: invert(1) brightness(2);
+  }
+}
+
+#root {
+  width: 1126px;
+  max-width: 100%;
+  margin: 0 auto;
+  text-align: center;
+  border-inline: 1px solid var(--border);
+  min-height: 100svh;
+  display: flex;
+  flex-direction: column;
+  box-sizing: border-box;
+}
+
+body {
+  margin: 0;
+}
+
+h1,
+h2 {
+  font-family: var(--heading);
+  font-weight: 500;
+  color: var(--text-h);
+}
+
+h1 {
+  font-size: 56px;
+  letter-spacing: -1.68px;
+  margin: 32px 0;
+  @media (max-width: 1024px) {
+    font-size: 36px;
+    margin: 20px 0;
+  }
+}
+h2 {
+  font-size: 24px;
+  line-height: 118%;
+  letter-spacing: -0.24px;
+  margin: 0 0 8px;
+  @media (max-width: 1024px) {
+    font-size: 20px;
+  }
+}
+p {
+  margin: 0;
+}
+
+code,
+.counter {
+  font-family: var(--mono);
+  display: inline-flex;
+  border-radius: 4px;
+  color: var(--text-h);
+}
+
+code {
+  font-size: 15px;
+  line-height: 135%;
+  padding: 4px 8px;
+  background: var(--code-bg);
+}
diff --git a/app/src/main.tsx b/app/src/main.tsx
new file mode 100644
index 0000000..bef5202
--- /dev/null
+++ b/app/src/main.tsx
@@ -0,0 +1,10 @@
+import { StrictMode } from 'react'
+import { createRoot } from 'react-dom/client'
+import './index.css'
+import App from './App.tsx'
+
+createRoot(document.getElementById('root')!).render(
+  <StrictMode>
+    <App />
+  </StrictMode>,
+)
diff --git a/app/src/ui/RouletteWheel.css b/app/src/ui/RouletteWheel.css
new file mode 100644
index 0000000..018ab84
--- /dev/null
+++ b/app/src/ui/RouletteWheel.css
@@ -0,0 +1,98 @@
+.roulette-container {
+  position: relative;
+  width: 320px;
+  height: 320px;
+  margin: 2rem auto;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+}
+
+.roulette-pointer {
+  position: absolute;
+  top: -20px;
+  left: 50%;
+  transform: translateX(-50%);
+  width: 0;
+  height: 0;
+  border-left: 15px solid transparent;
+  border-right: 15px solid transparent;
+  border-top: 30px solid #e74c3c;
+  z-index: 10;
+  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
+}
+
+.roulette-wheel {
+  position: relative;
+  width: 100%;
+  height: 100%;
+  border-radius: 50%;
+  background-color: #4a4a4a; /* Fallback for ruleta-fondo.png */
+  /* background-image: url('../assets/ruleta-fondo.png'); */
+  background-size: cover;
+  background-position: center;
+  border: 6px solid #2c3e50;
+  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0,0,0,0.5);
+  box-sizing: border-box;
+}
+
+/* Optional lines to divide the 8 sectors */
+.roulette-wheel::before {
+  content: '';
+  position: absolute;
+  top: 0;
+  left: 50%;
+  width: 2px;
+  height: 100%;
+  background: rgba(255, 255, 255, 0.1);
+  transform: translateX(-50%);
+}
+.roulette-wheel::after {
+  content: '';
+  position: absolute;
+  top: 50%;
+  left: 0;
+  width: 100%;
+  height: 2px;
+  background: rgba(255, 255, 255, 0.1);
+  transform: translateY(-50%);
+}
+
+.roulette-sector {
+  position: absolute;
+  top: 50%;
+  left: 50%;
+  width: 120px;
+  height: 60px;
+  margin-top: -30px;
+  margin-left: -60px;
+  display: flex;
+  align-items: center;
+  justify-content: center;
+  text-align: center;
+  transition: opacity 0.3s ease;
+  z-index: 2;
+}
+
+.roulette-sector.played {
+  opacity: 0.35;
+}
+
+.roulette-sector.selected .roulette-label {
+  border: 2px solid #f1c40f;
+  box-shadow: 0 0 12px #f1c40f;
+  border-radius: 6px;
+  background: rgba(0, 0, 0, 0.7);
+  color: #f1c40f;
+}
+
+.roulette-label {
+  color: #ffffff;
+  font-weight: 700;
+  font-size: 13px;
+  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
+  padding: 4px 8px;
+  border-radius: 4px;
+  background: rgba(0, 0, 0, 0.3);
+  line-height: 1.2;
+}
diff --git a/app/src/ui/RouletteWheel.tsx b/app/src/ui/RouletteWheel.tsx
new file mode 100644
index 0000000..9f80fb5
--- /dev/null
+++ b/app/src/ui/RouletteWheel.tsx
@@ -0,0 +1,52 @@
+import React from 'react';
+import { CLANS } from '../game/clans';
+import { SPIN_DURATION_MS } from '../game/spin';
+import './RouletteWheel.css';
+
+type RouletteWheelProps = {
+  playedClanIds: string[];
+  rotationDeg: number;
+  spinning: boolean;
+  selectedClanId: string | null;
+  durationMs?: number;
+};
+
+export const RouletteWheel: React.FC<RouletteWheelProps> = ({
+  playedClanIds,
+  rotationDeg,
+  spinning,
+  selectedClanId,
+  durationMs = SPIN_DURATION_MS,
+}) => {
+  return (
+    <div className="roulette-container">
+      <div className="roulette-pointer"></div>
+      <div
+        className="roulette-wheel"
+        style={{
+          transform: `rotate(${rotationDeg}deg)`,
+          transition: spinning ? `transform ${durationMs}ms cubic-bezier(0.12, 0.8, 0.2, 1)` : 'none'
+        }}
+      >
+        {CLANS.map((clan, i) => {
+          const isPlayed = playedClanIds.includes(clan.id);
+          const isSelected = clan.id === selectedClanId && !spinning;
+          
+          return (
+            <div
+              key={clan.id}
+              className={`roulette-sector ${isPlayed ? 'played' : ''} ${isSelected ? 'selected' : ''}`}
+              style={{
+                transform: `rotate(${i * 45}deg) translateY(-110px)`,
+              }}
+            >
+              <div className="roulette-label" style={{ transform: `rotate(${-i * 45}deg)` }}>
+                {clan.nombre}
+              </div>
+            </div>
+          );
+        })}
+      </div>
+    </div>
+  );
+};
diff --git a/app/src/ui/TurnScreen.tsx b/app/src/ui/TurnScreen.tsx
new file mode 100644
index 0000000..ed1b670
--- /dev/null
+++ b/app/src/ui/TurnScreen.tsx
@@ -0,0 +1,71 @@
+import { useEffect, useReducer } from "react";
+import { turnReducer, initialGameState } from "../game/turnReducer";
+import { CLANS } from "../game/clans";
+import { QUESTIONS } from "../game/questions";
+import { SPIN_DURATION_MS } from "../game/spin";
+import { getPendingClans } from "../game/round";
+import { RouletteWheel } from "./RouletteWheel";
+
+export function TurnScreen() {
+  const [state, dispatch] = useReducer(turnReducer, initialGameState());
+
+  useEffect(() => {
+    if (state.turn.phase !== "spinning") return;
+    const t = window.setTimeout(() => {
+      dispatch({ type: "SPIN_FINISHED" });
+    }, SPIN_DURATION_MS);
+    return () => clearTimeout(t);
+  }, [state.turn.phase, state.rotationDeg]);
+
+  const pendingCount = getPendingClans(CLANS, state.round.playedClanIds).length;
+  const selectedQuestion = QUESTIONS.find(
+    (q) => q.id === state.turn.selectedQuestionId,
+  );
+
+  return (
+    <div className="turn-screen">
+      <header className="header">
+        <h1>Encuentro Rover 2026 / Justas del Saber</h1>
+        <h2>
+          Ronda {state.round.roundNumber} &middot; {pendingCount} pendientes
+        </h2>
+      </header>
+
+      <main className="main-content">
+        <RouletteWheel
+          playedClanIds={state.round.playedClanIds}
+          rotationDeg={state.rotationDeg}
+          spinning={state.turn.phase === "spinning"}
+          selectedClanId={state.turn.selectedClanId}
+        />
+
+        {state.turn.phase === "question" && selectedQuestion && (
+          <div className="question-card">
+            <p className="question-text">{selectedQuestion.texto}</p>
+          </div>
+        )}
+      </main>
+
+      <footer className="host-controls">
+        {state.turn.phase === "idle" && (
+          <button onClick={() => dispatch({ type: "SPIN" })}>Girar</button>
+        )}
+        {state.turn.phase === "clanRevealed" && (
+          <>
+            <button onClick={() => dispatch({ type: "RESPIN" })}>
+              Volver a girar
+            </button>
+            <button onClick={() => dispatch({ type: "SHOW_QUESTION" })}>
+              Mostrar pregunta
+            </button>
+          </>
+        )}
+        {state.turn.phase === "question" && (
+          <button onClick={() => dispatch({ type: "NEXT_TURN" })}>
+            Siguiente turno
+          </button>
+        )}
+      </footer>
+    </div>
+  );
+}
diff --git a/app/tsconfig.app.json b/app/tsconfig.app.json
new file mode 100644
index 0000000..6830b6f
--- /dev/null
+++ b/app/tsconfig.app.json
@@ -0,0 +1,26 @@
+{
+  "compilerOptions": {
+    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
+    "target": "es2023",
+    "lib": ["ES2023", "DOM"],
+    "module": "esnext",
+    "types": ["vite/client"],
+    "allowArbitraryExtensions": true,
+    "skipLibCheck": true,
+
+    /* Bundler mode */
+    "moduleResolution": "bundler",
+    "allowImportingTsExtensions": true,
+    "verbatimModuleSyntax": true,
+    "moduleDetection": "force",
+    "noEmit": true,
+    "jsx": "react-jsx",
+
+    /* Linting */
+    "noUnusedLocals": true,
+    "noUnusedParameters": true,
+    "erasableSyntaxOnly": true,
+    "noFallthroughCasesInSwitch": true
+  },
+  "include": ["src"]
+}
diff --git a/app/tsconfig.json b/app/tsconfig.json
new file mode 100644
index 0000000..1ffef60
--- /dev/null
+++ b/app/tsconfig.json
@@ -0,0 +1,7 @@
+{
+  "files": [],
+  "references": [
+    { "path": "./tsconfig.app.json" },
+    { "path": "./tsconfig.node.json" }
+  ]
+}
diff --git a/app/tsconfig.node.json b/app/tsconfig.node.json
new file mode 100644
index 0000000..40775f2
--- /dev/null
+++ b/app/tsconfig.node.json
@@ -0,0 +1,23 @@
+{
+  "compilerOptions": {
+    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
+    "target": "es2023",
+    "lib": ["ES2023"],
+    "types": ["node", "vitest/config"],
+    "skipLibCheck": true,
+
+    /* Bundler mode */
+    "module": "nodenext",
+    "allowImportingTsExtensions": true,
+    "verbatimModuleSyntax": true,
+    "moduleDetection": "force",
+    "noEmit": true,
+
+    /* Linting */
+    "noUnusedLocals": true,
+    "noUnusedParameters": true,
+    "erasableSyntaxOnly": true,
+    "noFallthroughCasesInSwitch": true
+  },
+  "include": ["vite.config.ts"]
+}
diff --git a/app/vite.config.ts b/app/vite.config.ts
new file mode 100644
index 0000000..67a12e3
--- /dev/null
+++ b/app/vite.config.ts
@@ -0,0 +1,10 @@
+import { defineConfig } from "vite";
+import react from "@vitejs/plugin-react";
+
+export default defineConfig({
+  plugins: [react()],
+  test: {
+    environment: "node",
+    include: ["src/**/*.test.ts"],
+  },
+});
diff --git a/docs/superpowers/specs/2026-08-05-ruleta-turno-design.md b/docs/superpowers/specs/2026-08-05-ruleta-turno-design.md
index 1dfdfe3..1dbc909 100644
--- a/docs/superpowers/specs/2026-08-05-ruleta-turno-design.md
+++ b/docs/superpowers/specs/2026-08-05-ruleta-turno-design.md
@@ -1,15 +1,15 @@
 # Design: Ruleta de clanes + turno (alcance B)
 
 **Fecha:** 2026-08-05  
 **Proyecto:** Justas del Saber — Encuentro Rover 2026  
-**Estado:** Aprobado (2026-08-05)  
+**Estado:** Implementado — alcance B (2026-08-05)  
 **Stack:** React + Vite + TypeScript  
 
 ## 1. Objetivo
 
 Entregar el flujo de turno jugable en proyector:
 
 1. Ruleta con **nombres de clanes**
 2. Sorteo real del clan (sin repetir dentro de la ronda)
 3. Revelación del clan
 4. Aparición de una **pregunta al azar** (sin ruleta de preguntas)
@@ -81,20 +81,22 @@ type RoundState = {
 
 type TurnState = {
   phase: TurnPhase;
   selectedClanId: string | null;
   selectedQuestionId: number | null;
 };
 ```
 
 Fixtures iniciales: 8 clanes del cuestionario; subset o banco completo de preguntas (mínimo suficiente para demos; ideal parsear el PDF después).
 
+**Nota de implementación (2026-08-05):** El banco completo del PDF del cuestionario queda **diferido** a una tarea posterior de import. Alcance B usa **12 preguntas fixture** en `app/src/game/questions.ts`. El arte `ruleta-fondo.png` aún no está cableado; la ruleta usa disco sólido + labels (fallback del §6).
+
 ## 5. Módulos / responsabilidades
 
 | Módulo | Responsabilidad |
 |--------|-----------------|
 | `src/game/clans.ts` | Lista canónica de clanes + índice de sector (0..7) |
 | `src/game/questions.ts` | Banco + `pickRandomUnused(usedIds, questions, rng)` |
 | `src/game/round.ts` | `getPendingClans`, `markClanPlayed`, `advanceRoundIfComplete` |
 | `src/game/spin.ts` | `pickClan(pending, rng)`, `angleForClanIndex(index, sectorDeg)`, `buildSpinAnimation(...)` |
 | `src/ui/RouletteWheel.tsx` | Fondo + 8 labels + dimmed + rotación + pointer fijo |
 | `src/ui/TurnScreen.tsx` | Orquesta fases, botones, contador de ronda |
@@ -130,17 +132,17 @@ Funciones de sorteo y ángulos: **puras** (inyectar `rng` en tests).
 
 ## 9. Fuera de alcance (siguiente specs)
 
 - Timer 60 s, prórroga, confirmación correcto/incorrecto
 - Panel host con respuesta oculta
 - Sonidos definitivos, pausa, persistencia offline
 - CRUD clanes/logos, export, mata-mata, config de evento
 
 ## 10. Criterio de hecho (alcance B)
 
-- [ ] App Vite arranca en local
-- [ ] Se ven 8 clanes sobre el fondo del encuentro
-- [ ] Girar sortea solo pendientes; jugados quedan apagados
-- [ ] Re-giro no consume clan ni pregunta
-- [ ] Mostrar pregunta revela texto al azar no repetido
-- [ ] Al completar 8 turnos, empieza ronda nueva
-- [ ] Tests unitarios de sorteo/ronda en verde
+- [x] App Vite arranca en local
+- [x] Se ven 8 clanes sobre el fondo del encuentro (fallback disco sólido; PNG pendiente)
+- [x] Girar sortea solo pendientes; jugados quedan apagados
+- [x] Re-giro no consume clan ni pregunta
+- [x] Mostrar pregunta revela texto al azar no repetido
+- [x] Al completar 8 turnos, empieza ronda nueva
+- [x] Tests unitarios de sorteo/ronda en verde

```
