import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: "babel",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/components/(.*)$": "<rootDir>/src/components/$1",
        "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
        "^@/app/(.*)$": "<rootDir>/src/app/$1",
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    collectCoverage: true,
    maxWorkers: "50%",
    collectCoverageFrom: [
        "src/app/**/*.{js,jsx,ts,tsx}",
        "src/services/**/*.ts",
        "src/components/**/*.tsx",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.d.ts",
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
    },
    transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.(css|sass|scss)$"],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "/dist/",
        "/coverage/",
        "jest.config.ts",
        "next.config.ts",
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
