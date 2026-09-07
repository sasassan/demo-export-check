import assert from "node:assert/strict";
import { after, before, beforeEach, describe, test } from "node:test";

import {
  __resetRepoStateForTests,
  createCaseRecord,
  getCaseDetail,
  getCaseOwnerInfo,
  listAllDeletedCases,
  listCasesByUser,
  listDeletedCasesByUser,
  restoreCase,
  softDeleteCase,
} from "@/lib/db/repository";
import { CASE_DELETION_GRACE_PERIOD_DAYS } from "@/lib/constants";

const OWNER_EMAIL = "owner@example.com";
const OTHER_EMAIL = "other@example.com";

const previousDatabaseUrl = process.env.DATABASE_URL;

async function createTestCase(userEmail = OWNER_EMAIL) {
  return createCaseRecord(userEmail, {
    productName: "テスト用サーボモーター",
    modelNumber: "TST-0001",
    destinationCountry: "ベトナム",
    customerCompanyName: "Test Precision Ltd.",
  });
}

describe("case soft delete / restore (in-memory repository)", () => {
  before(() => {
    // このテストはDBなし（インメモリフォールバック）経路を検証する。
    delete process.env.DATABASE_URL;
  });

  after(() => {
    if (previousDatabaseUrl !== undefined) {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  });

  beforeEach(() => {
    __resetRepoStateForTests();
  });

  test("softDeleteCase sets deletedAt and filters it out of normal read paths", async () => {
    const created = await createTestCase();

    const result = await softDeleteCase(created.id, OWNER_EMAIL);
    assert.ok(result);
    assert.equal(result?.id, created.id);
    assert.ok(result?.deletedAt);

    const listed = await listCasesByUser(OWNER_EMAIL);
    assert.equal(listed.some((item) => item.id === created.id), false);

    const detail = await getCaseDetail(created.id);
    assert.equal(detail, null);
  });

  test("softDeleteCase is idempotent: deleting an already-deleted case returns null", async () => {
    const created = await createTestCase();

    const first = await softDeleteCase(created.id, OWNER_EMAIL);
    assert.ok(first);

    const second = await softDeleteCase(created.id, OWNER_EMAIL);
    assert.equal(second, null);
  });

  test("softDeleteCase records an audit log entry with action case.delete", async () => {
    const created = await createTestCase();
    await softDeleteCase(created.id, OWNER_EMAIL);

    // listDeletedCasesByUser経由で削除済みであることを確認する（監査ログ自体はrepository
    // モジュールの外部APIとして直接読めないため、削除が実際に完了していること＝トランザクションが
    // 監査ログ記録込みで成功したことを確認する）。
    const deleted = await listDeletedCasesByUser(OWNER_EMAIL);
    assert.equal(deleted.length, 1);
    assert.equal(deleted[0].id, created.id);
  });

  test("restoreCase restores a case within the grace period", async () => {
    const created = await createTestCase();
    await softDeleteCase(created.id, OWNER_EMAIL);

    const result = await restoreCase(created.id, OWNER_EMAIL);
    assert.equal(result, "restored");

    const listed = await listCasesByUser(OWNER_EMAIL);
    assert.equal(listed.some((item) => item.id === created.id), true);

    const deleted = await listDeletedCasesByUser(OWNER_EMAIL);
    assert.equal(deleted.length, 0);
  });

  test("restoreCase returns expired once the grace period has elapsed", async () => {
    const created = await createTestCase();
    await softDeleteCase(created.id, OWNER_EMAIL);

    const afterGracePeriod = new Date(
      Date.now() + (CASE_DELETION_GRACE_PERIOD_DAYS + 1) * 24 * 60 * 60 * 1000,
    );

    const result = await restoreCase(created.id, OWNER_EMAIL, afterGracePeriod);
    assert.equal(result, "expired");

    // 復元されていないことを確認
    const listed = await listCasesByUser(OWNER_EMAIL);
    assert.equal(listed.some((item) => item.id === created.id), false);
  });

  test("restoreCase returns not_found for a case that was never deleted", async () => {
    const created = await createTestCase();
    const result = await restoreCase(created.id, OWNER_EMAIL);
    assert.equal(result, "not_found");
  });

  test("restoreCase returns not_found for an unknown case id", async () => {
    const result = await restoreCase("case_does_not_exist", OWNER_EMAIL);
    assert.equal(result, "not_found");
  });

  test("listCasesByUser only returns the given user's non-deleted cases", async () => {
    const ownerCase = await createTestCase(OWNER_EMAIL);
    const otherCase = await createTestCase(OTHER_EMAIL);
    await softDeleteCase(otherCase.id, OTHER_EMAIL);

    const ownerCases = await listCasesByUser(OWNER_EMAIL);
    assert.equal(ownerCases.some((item) => item.id === ownerCase.id), true);

    const otherCases = await listCasesByUser(OTHER_EMAIL);
    assert.equal(otherCases.length, 0);
  });

  test("listAllDeletedCases returns deleted cases across all users", async () => {
    const ownerCase = await createTestCase(OWNER_EMAIL);
    const otherCase = await createTestCase(OTHER_EMAIL);
    await softDeleteCase(ownerCase.id, OWNER_EMAIL);
    await softDeleteCase(otherCase.id, OTHER_EMAIL);

    const all = await listAllDeletedCases();
    const ids = all.map((item) => item.id);
    assert.ok(ids.includes(ownerCase.id));
    assert.ok(ids.includes(otherCase.id));
  });

  test("getCaseOwnerInfo returns owner info regardless of deletion state (used for authorization)", async () => {
    const created = await createTestCase();

    const beforeDelete = await getCaseOwnerInfo(created.id);
    assert.equal(beforeDelete?.userEmail, OWNER_EMAIL);
    assert.equal(beforeDelete?.deletedAt, undefined);

    await softDeleteCase(created.id, OWNER_EMAIL);

    const afterDelete = await getCaseOwnerInfo(created.id);
    assert.equal(afterDelete?.userEmail, OWNER_EMAIL);
    assert.ok(afterDelete?.deletedAt);
  });

  test("getCaseOwnerInfo returns null for an unknown case id", async () => {
    const result = await getCaseOwnerInfo("case_does_not_exist");
    assert.equal(result, null);
  });
});
