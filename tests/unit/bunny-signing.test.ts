import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { signedDirectoryUrl, tusSignature } from "@/lib/video/bunny-signing";

/**
 * Pins the exact inputs of both Bunny signatures. If staging shows Bunny expects something
 * different, these tests make the change deliberate and visible (docs/17 §4).
 */
describe("tusSignature", () => {
  it("hashes library id, api key, expiry and video id in that order (hex)", () => {
    const expected = createHash("sha256").update("123key1700000000abc-video").digest("hex");
    expect(
      tusSignature({
        libraryId: "123",
        apiKey: "key",
        expiresAt: 1700000000,
        videoId: "abc-video",
      }),
    ).toBe(expected);
  });
});

describe("signedDirectoryUrl", () => {
  const url = signedDirectoryUrl({
    hostname: "vz-test.b-cdn.net",
    securityKey: "secret",
    directory: "/11111111-2222-3333-4444-555555555555/",
    file: "playlist.m3u8",
    expiresAt: 1700000000,
  });

  it("puts the token in the path so relative HLS segment URLs inherit it", () => {
    expect(url).toMatch(
      /^https:\/\/vz-test\.b-cdn\.net\/bcdn_token=[A-Za-z0-9_-]+&expires=1700000000&token_path=%2F11111111-2222-3333-4444-555555555555%2F\/11111111-2222-3333-4444-555555555555\/playlist\.m3u8$/,
    );
  });

  it("signs key + path + expiry + token_path param with url-safe base64 and no padding", () => {
    const path = "/11111111-2222-3333-4444-555555555555/";
    const expected = createHash("sha256")
      .update(`secret${path}1700000000token_path=${path}`)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(url).toContain(`bcdn_token=${expected}&`);
  });

  it("changes when the expiry changes", () => {
    const other = signedDirectoryUrl({
      hostname: "vz-test.b-cdn.net",
      securityKey: "secret",
      directory: "/11111111-2222-3333-4444-555555555555",
      file: "playlist.m3u8",
      expiresAt: 1700000001,
    });
    expect(other).not.toBe(url);
  });
});
