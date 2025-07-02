import { describe, it, expect } from "vitest";

// Basic test to ensure the test suite runs
describe("Basic Test Suite", () => {
  it("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    expect("hello" + " world").toBe("hello world");
  });

  it("should handle array operations", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });
});

// Test that environment is properly set up
describe("Environment Tests", () => {
  it("should have Node.js environment", () => {
    expect(typeof process).toBe("object");
    expect(typeof process.env).toBe("object");
  });

  it("should support ES modules", () => {
    // Check that we can use import statements (this test file uses ES modules)
    expect(true).toBe(true);
  });
});
