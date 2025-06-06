import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    // Provide the path to Next.js app to load next.config.ts and .env files in the test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    clearMocks: true,
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": [
            "babel-jest",
            { presets: ["next/babel", "@babel/preset-react", "@babel/preset-typescript"] },
        ],
    },
    // testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts", "<rootDir>/src/**/__tests__/**/*.test.tsx"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.d.ts",
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "/dist/",
        "/coverage/",
        "jest.config.ts",
        "next.config.ts",
        "src/app/api/auth/*",

    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
    coverageProvider: "babel",
    collectCoverage: true,
};

export default createJestConfig(config);
