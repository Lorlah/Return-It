import { describe, it, expect } from "vitest";
import {
  DEFAULT_SIGNED_URL_TTL_SECONDS,
  LABEL_BUCKET,
  buildLabelStorageKey,
  createSignedLabelUrl,
  deleteLabel,
  uploadLabel,
  type LabelStorageBucket,
} from "@/lib/storage";
import { FALLBACK_EXTENSION, resolveExtension } from "@/lib/label-file";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

interface UploadCall {
  path: string;
  body: File | Buffer;
  contentType: string;
}

interface SignCall {
  path: string;
  expiresInSeconds: number;
}

/**
 * In-memory stand-in for the private bucket, following the same seam pattern
 * as `InMemoryIngestRepository`: the tests never touch Supabase or the network.
 */
class FakeLabelBucket implements LabelStorageBucket {
  readonly uploads: UploadCall[] = [];
  readonly signed: SignCall[] = [];
  readonly removed: string[] = [];

  async upload(path: string, body: File | Buffer, contentType: string): Promise<void> {
    this.uploads.push({ path, body, contentType });
  }

  async createSignedUrl(path: string, expiresInSeconds: number): Promise<string> {
    this.signed.push({ path, expiresInSeconds });
    return `https://signed.example/${path}?exp=${expiresInSeconds}`;
  }

  async remove(path: string): Promise<void> {
    this.removed.push(path);
  }
}

describe("buildLabelStorageKey", () => {
  it("prefixes the key with the owning user", () => {
    expect(buildLabelStorageKey("user-123", "pdf").startsWith("user-123/")).toBe(true);
  });

  it("preserves the extension", () => {
    expect(buildLabelStorageKey("user-123", "webp").endsWith(".webp")).toBe(true);
  });

  it("names the object with a uuid, not the uploaded file name", () => {
    const key = buildLabelStorageKey("user-123", "pdf");
    const name = key.slice("user-123/".length).replace(/\.pdf$/, "");
    expect(name).toMatch(UUID_PATTERN);
  });

  it("never repeats a key", () => {
    const keys = new Set(
      Array.from({ length: 50 }, () => buildLabelStorageKey("user-123", "pdf")),
    );
    expect(keys.size).toBe(50);
  });

  it("rejects a user id that could escape its prefix", () => {
    expect(() => buildLabelStorageKey("a/b", "pdf")).toThrow(/Invalid userId/);
    expect(() => buildLabelStorageKey("../other", "pdf")).toThrow(/Invalid userId/);
    expect(() => buildLabelStorageKey("   ", "pdf")).toThrow(/Invalid userId/);
  });
});

describe("resolveExtension", () => {
  it("prefers the file name's extension", () => {
    expect(resolveExtension("label.PDF", "image/png")).toBe("pdf");
  });

  it("falls back to the content type when the name has no extension", () => {
    expect(resolveExtension("label", "image/jpeg")).toBe("jpg");
    expect(resolveExtension(undefined, "image/webp")).toBe("webp");
  });

  it("refuses to echo an unaccepted extension into the key", () => {
    expect(resolveExtension("label.exe", undefined)).toBe(FALLBACK_EXTENSION);
    expect(resolveExtension("label.php", "application/pdf")).toBe("pdf");
    expect(resolveExtension(undefined, "application/x-unknown")).toBe(
      FALLBACK_EXTENSION,
    );
  });
});

describe("uploadLabel", () => {
  it("returns only the storage key — never a URL", async () => {
    const bucket = new FakeLabelBucket();
    const result = await uploadLabel(Buffer.from("label"), "user-123", {
      fileName: "return.pdf",
      contentType: "application/pdf",
      bucket,
    });

    expect(Object.keys(result)).toEqual(["storageKey"]);
    expect(result.storageKey).not.toContain("http");
  });

  it("uploads to the key it returns, with the declared content type", async () => {
    const bucket = new FakeLabelBucket();
    const body = Buffer.from("label");
    const { storageKey } = await uploadLabel(body, "user-123", {
      fileName: "return.pdf",
      contentType: "application/pdf",
      bucket,
    });

    expect(bucket.uploads).toHaveLength(1);
    expect(bucket.uploads[0]).toEqual({
      path: storageKey,
      body,
      contentType: "application/pdf",
    });
  });

  it("derives name and type from a File without being told", async () => {
    const bucket = new FakeLabelBucket();
    const file = new File(["label"], "my-return-label.png", { type: "image/png" });

    const { storageKey } = await uploadLabel(file, "user-123", { bucket });

    expect(storageKey.endsWith(".png")).toBe(true);
    expect(storageKey).not.toContain("my-return-label");
    expect(bucket.uploads[0]?.contentType).toBe("image/png");
  });

  it("stores a Buffer of unknown provenance under the fallback extension", async () => {
    const bucket = new FakeLabelBucket();
    const { storageKey } = await uploadLabel(Buffer.from("label"), "user-123", {
      bucket,
    });

    expect(storageKey.endsWith(`.${FALLBACK_EXTENSION}`)).toBe(true);
    expect(bucket.uploads[0]?.contentType).toBe("application/octet-stream");
  });

  it("does not upload when the user id is unusable", async () => {
    const bucket = new FakeLabelBucket();

    await expect(
      uploadLabel(Buffer.from("label"), "../escape", { bucket }),
    ).rejects.toThrow(/Invalid userId/);
    expect(bucket.uploads).toHaveLength(0);
  });
});

describe("createSignedLabelUrl", () => {
  it("defaults to a 300-second lifetime", async () => {
    const bucket = new FakeLabelBucket();
    await createSignedLabelUrl("user-123/abc.pdf", undefined, bucket);

    expect(DEFAULT_SIGNED_URL_TTL_SECONDS).toBe(300);
    expect(bucket.signed[0]?.expiresInSeconds).toBe(300);
  });

  it("honours an explicit lifetime", async () => {
    const bucket = new FakeLabelBucket();
    await createSignedLabelUrl("user-123/abc.pdf", 60, bucket);

    expect(bucket.signed[0]?.expiresInSeconds).toBe(60);
  });

  it("signs the key it was given and returns the URL", async () => {
    const bucket = new FakeLabelBucket();
    const url = await createSignedLabelUrl("user-123/abc.pdf", 60, bucket);

    expect(bucket.signed[0]?.path).toBe("user-123/abc.pdf");
    expect(url).toContain("user-123/abc.pdf");
  });

  it("refuses an empty key", async () => {
    const bucket = new FakeLabelBucket();

    await expect(createSignedLabelUrl("  ", undefined, bucket)).rejects.toThrow(
      /empty label storage key/,
    );
    expect(bucket.signed).toHaveLength(0);
  });
});

describe("deleteLabel", () => {
  it("removes the object, so erasure is possible", async () => {
    const bucket = new FakeLabelBucket();
    await deleteLabel("user-123/abc.pdf", bucket);

    expect(bucket.removed).toEqual(["user-123/abc.pdf"]);
  });

  it("refuses an empty key rather than deleting nothing quietly", async () => {
    const bucket = new FakeLabelBucket();

    await expect(deleteLabel("", bucket)).rejects.toThrow(/empty label storage key/);
    expect(bucket.removed).toHaveLength(0);
  });
});

describe("bucket configuration", () => {
  it("targets the private return-labels bucket", () => {
    expect(LABEL_BUCKET).toBe("return-labels");
  });
});
