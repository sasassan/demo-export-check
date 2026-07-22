import { buildChecklistFromCase } from "@/lib/checklist/generator";
import { getDbClient } from "@/lib/db/client";
import {
  aiConsultations,
  analyticsEvents,
  analyticsSessions,
  cases,
  investigations,
  riskAssessments,
} from "@/lib/db/schema";
import { createId } from "@/lib/utils";
import { and, desc, eq, gte } from "drizzle-orm";
import type {
  AssessmentRecord,
  AnalyticsEventRecord,
  AnalyticsSessionRecord,
  AiConsultationRecord,
  CaseDetail,
  CaseRecord,
  ChecklistItem,
  CreateCaseInput,
  InvestigationRecord,
} from "@/lib/types";

type RepositoryState = {
  cases: CaseRecord[];
  investigations: InvestigationRecord[];
  assessments: AssessmentRecord[];
  consultations: AiConsultationRecord[];
  analyticsSessions: AnalyticsSessionRecord[];
  analyticsEvents: AnalyticsEventRecord[];
};

declare global {
  var __ernRepoState: RepositoryState | undefined;
}

function getState(): RepositoryState {
  if (!globalThis.__ernRepoState) {
    const now = new Date().toISOString();
    const sampleCaseId = createId("case");
    const sampleInvestigationId = createId("inv");

    globalThis.__ernRepoState = {
      cases: [
        {
          id: sampleCaseId,
          userEmail: "demo@example.com",
          productName: "高精度サーボモーター",
          modelNumber: "SRV-9800",
          destinationCountry: "ベトナム",
          customerCompanyName: "Saigon Precision Parts Ltd.",
          status: "completed",
          checklist: buildChecklistFromCase({
            destinationCountry: "ベトナム",
            customerCompanyName: "Saigon Precision Parts Ltd.",
          }),
          createdAt: now,
          updatedAt: now,
          productImageUrl:
            "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=80",
        },
      ],
      investigations: [
        {
          id: sampleInvestigationId,
          caseId: sampleCaseId,
          status: "completed",
          startedAt: now,
          completedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      ],
      assessments: [],
      consultations: [],
      analyticsSessions: [],
      analyticsEvents: [],
    };
  }

  return globalThis.__ernRepoState;
}

function getDb() {
  return getDbClient();
}

export async function listCasesByUser(userEmail: string) {
  const db = getDb();
  if (db) {
    const rows = await db
      .select()
      .from(cases)
      .where(eq(cases.userEmail, userEmail))
      .orderBy(desc(cases.createdAt));

    return rows.map((row) => ({
      id: row.id,
      userEmail: row.userEmail,
      productName: row.productName,
      modelNumber: row.modelNumber,
      destinationCountry: row.destinationCountry,
      customerCompanyName: row.customerCompanyName,
      productImageUrl: row.productImageUrl ?? undefined,
      status: row.status as CaseRecord["status"],
      checklist: (row.checklist as ChecklistItem[]) ?? [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  const state = getState();

  return state.cases
    .filter((item) => item.userEmail === userEmail)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createCaseRecord(
  userEmail: string,
  input: CreateCaseInput,
): Promise<CaseRecord> {
  const db = getDb();
  if (db) {
    const now = new Date();
    const record: CaseRecord = {
      id: createId("case"),
      userEmail,
      status: "investigating",
      checklist: buildChecklistFromCase(input),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      ...input,
    };

    await db.insert(cases).values({
      id: record.id,
      userEmail: record.userEmail,
      productName: record.productName,
      modelNumber: record.modelNumber,
      destinationCountry: record.destinationCountry,
      customerCompanyName: record.customerCompanyName,
      productImageUrl: record.productImageUrl,
      status: record.status,
      checklist: record.checklist,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(investigations).values({
      id: createId("inv"),
      caseId: record.id,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    });

    return record;
  }

  const state = getState();
  const now = new Date().toISOString();

  const record: CaseRecord = {
    id: createId("case"),
    userEmail,
    status: "investigating",
    checklist: buildChecklistFromCase(input),
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  state.cases.unshift(record);

  const investigation: InvestigationRecord = {
    id: createId("inv"),
    caseId: record.id,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };

  state.investigations.unshift(investigation);

  return record;
}

export async function getCaseDetail(caseId: string) {
  const db = getDb();
  if (db) {
    const caseRows = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
    const caseRow = caseRows[0];
    if (!caseRow) {
      return null;
    }

    const investigationRow = (
      await db.select().from(investigations).where(eq(investigations.caseId, caseId)).limit(1)
    )[0];
    const assessmentRow = (
      await db.select().from(riskAssessments).where(eq(riskAssessments.caseId, caseId)).limit(1)
    )[0];

    return {
      case: {
        id: caseRow.id,
        userEmail: caseRow.userEmail,
        productName: caseRow.productName,
        modelNumber: caseRow.modelNumber,
        destinationCountry: caseRow.destinationCountry,
        customerCompanyName: caseRow.customerCompanyName,
        productImageUrl: caseRow.productImageUrl ?? undefined,
        status: caseRow.status as CaseRecord["status"],
        checklist: (caseRow.checklist as ChecklistItem[]) ?? [],
        createdAt: caseRow.createdAt.toISOString(),
        updatedAt: caseRow.updatedAt.toISOString(),
      },
      investigation: investigationRow
        ? {
            id: investigationRow.id,
            caseId: investigationRow.caseId,
            status: investigationRow.status as InvestigationRecord["status"],
            startedAt: investigationRow.startedAt?.toISOString(),
            completedAt: investigationRow.completedAt?.toISOString(),
            errorMessage: investigationRow.errorMessage ?? undefined,
            createdAt: investigationRow.createdAt.toISOString(),
            updatedAt: investigationRow.updatedAt.toISOString(),
          }
        : undefined,
      assessment: assessmentRow
        ? {
            caseId: assessmentRow.caseId,
            summary: assessmentRow.summary as AssessmentRecord["summary"],
            dimensions: (assessmentRow.dimensions as AssessmentRecord["dimensions"]) ?? [],
            evidence: (assessmentRow.evidence as AssessmentRecord["evidence"]) ?? [],
            reportNarrative: assessmentRow.reportNarrative,
            modelResults: (assessmentRow.modelResults as AssessmentRecord["modelResults"]) ?? undefined,
            agreementRate: assessmentRow.agreementRate ?? undefined,
            reviewMeeting: (assessmentRow.reviewMeeting as AssessmentRecord["reviewMeeting"]) ?? undefined,
            improvementSteps:
              (assessmentRow.improvementSteps as AssessmentRecord["improvementSteps"]) ?? undefined,
            worstCaseScenarios:
              (assessmentRow.worstCaseScenarios as AssessmentRecord["worstCaseScenarios"]) ?? undefined,
            disagreementDimensions:
              (assessmentRow.disagreementDimensions as AssessmentRecord["disagreementDimensions"]) ??
              undefined,
            regulationUpdates:
              (assessmentRow.regulationUpdates as AssessmentRecord["regulationUpdates"]) ??
              undefined,
            createdAt: assessmentRow.createdAt.toISOString(),
            updatedAt: assessmentRow.updatedAt.toISOString(),
          }
        : undefined,
    } satisfies CaseDetail;
  }

  const state = getState();
  const caseRecord = state.cases.find((item) => item.id === caseId);

  if (!caseRecord) {
    return null;
  }

  const investigation = state.investigations.find((item) => item.caseId === caseId);
  const assessment = state.assessments.find((item) => item.caseId === caseId);

  return {
    case: caseRecord,
    investigation,
    assessment,
  } satisfies CaseDetail;
}

export async function updateInvestigationStatus(
  caseId: string,
  update: Partial<InvestigationRecord>,
) {
  const db = getDb();
  if (db) {
    const existing = (
      await db.select().from(investigations).where(eq(investigations.caseId, caseId)).limit(1)
    )[0];
    if (!existing) {
      return null;
    }

    await db
      .update(investigations)
      .set({
        status: update.status ?? existing.status,
        startedAt: update.startedAt ? new Date(update.startedAt) : existing.startedAt,
        completedAt: update.completedAt ? new Date(update.completedAt) : existing.completedAt,
        errorMessage: update.errorMessage ?? existing.errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(investigations.caseId, caseId));

    return {
      id: existing.id,
      caseId: existing.caseId,
      status: (update.status ?? existing.status) as InvestigationRecord["status"],
      startedAt: update.startedAt ?? existing.startedAt?.toISOString(),
      completedAt: update.completedAt ?? existing.completedAt?.toISOString(),
      errorMessage: update.errorMessage ?? existing.errorMessage ?? undefined,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const state = getState();
  const record = state.investigations.find((item) => item.caseId === caseId);

  if (!record) {
    return null;
  }

  Object.assign(record, update, {
    updatedAt: new Date().toISOString(),
  });

  return record;
}

export async function saveAssessment(assessment: AssessmentRecord) {
  const db = getDb();
  if (db) {
    const now = new Date();
    await db
      .insert(riskAssessments)
      .values({
        caseId: assessment.caseId,
        summary: assessment.summary,
        reportNarrative: assessment.reportNarrative,
        dimensions: assessment.dimensions,
        evidence: assessment.evidence,
        modelResults: assessment.modelResults ?? null,
        agreementRate: assessment.agreementRate ?? null,
        reviewMeeting: assessment.reviewMeeting ?? null,
        improvementSteps: assessment.improvementSteps ?? null,
        worstCaseScenarios: assessment.worstCaseScenarios ?? null,
        disagreementDimensions: assessment.disagreementDimensions ?? null,
        regulationUpdates: assessment.regulationUpdates ?? null,
        createdAt: new Date(assessment.createdAt),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: riskAssessments.caseId,
        set: {
          summary: assessment.summary,
          reportNarrative: assessment.reportNarrative,
          dimensions: assessment.dimensions,
          evidence: assessment.evidence,
          modelResults: assessment.modelResults ?? null,
          agreementRate: assessment.agreementRate ?? null,
          reviewMeeting: assessment.reviewMeeting ?? null,
          improvementSteps: assessment.improvementSteps ?? null,
          worstCaseScenarios: assessment.worstCaseScenarios ?? null,
          disagreementDimensions: assessment.disagreementDimensions ?? null,
          regulationUpdates: assessment.regulationUpdates ?? null,
          updatedAt: now,
        },
      });

    await db
      .update(cases)
      .set({
        status: "completed",
        updatedAt: now,
      })
      .where(eq(cases.id, assessment.caseId));

    return {
      ...assessment,
      updatedAt: now.toISOString(),
    };
  }

  const state = getState();
  const existingIndex = state.assessments.findIndex(
    (item) => item.caseId === assessment.caseId,
  );

  if (existingIndex >= 0) {
    state.assessments[existingIndex] = assessment;
  } else {
    state.assessments.unshift(assessment);
  }

  const caseRecord = state.cases.find((item) => item.id === assessment.caseId);

  if (caseRecord) {
    caseRecord.status = "completed";
    caseRecord.updatedAt = new Date().toISOString();
  }

  return assessment;
}

export async function assertCaseOwner(caseId: string, userEmail: string) {
  const detail = await getCaseDetail(caseId);

  if (!detail || detail.case.userEmail !== userEmail) {
    return null;
  }

  return detail;
}

export async function updateCaseChecklist(
  caseId: string,
  userEmail: string,
  checklist: ChecklistItem[],
) {
  const db = getDb();
  if (db) {
    const existing = (
      await db
        .select()
        .from(cases)
        .where(and(eq(cases.id, caseId), eq(cases.userEmail, userEmail)))
        .limit(1)
    )[0];

    if (!existing) {
      return null;
    }

    await db
      .update(cases)
      .set({
        checklist,
        updatedAt: new Date(),
      })
      .where(and(eq(cases.id, caseId), eq(cases.userEmail, userEmail)));

    return {
      ...existing,
      productImageUrl: existing.productImageUrl ?? undefined,
      status: existing.status as CaseRecord["status"],
      checklist,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const state = getState();
  const record = state.cases.find((item) => item.id === caseId && item.userEmail === userEmail);

  if (!record) {
    return null;
  }

  record.checklist = checklist;
  record.updatedAt = new Date().toISOString();

  return record;
}

export async function replaceCaseChecklist(caseId: string, checklist: ChecklistItem[]) {
  const db = getDb();
  if (db) {
    const existing = (await db.select().from(cases).where(eq(cases.id, caseId)).limit(1))[0];
    if (!existing) {
      return null;
    }

    await db
      .update(cases)
      .set({
        checklist,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, caseId));

    return {
      ...existing,
      productImageUrl: existing.productImageUrl ?? undefined,
      status: existing.status as CaseRecord["status"],
      checklist,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const state = getState();
  const record = state.cases.find((item) => item.id === caseId);

  if (!record) {
    return null;
  }

  record.checklist = checklist;
  record.updatedAt = new Date().toISOString();

  return record;
}
export async function saveAiConsultation(record: AiConsultationRecord) {
  const db = getDb();
  if (db) {
    await db.insert(aiConsultations).values({
      id: record.id,
      userEmail: record.userEmail,
      caseId: record.caseId ?? null,
      mode: record.mode,
      question: record.question,
      sourceUrl: record.sourceUrl ?? null,
      sourceText: record.sourceText ?? null,
      fetchedUrlText: record.fetchedUrlText ?? null,
      sourceFetchStatus: record.sourceFetchStatus ?? null,
      answerTitle: record.answerTitle,
      answer: record.answer,
      confidenceLabel: record.confidenceLabel ?? null,
      documentSummary: record.documentSummary ?? null,
      judgement: record.judgement ?? null,
      factHighlights: record.factHighlights ?? null,
      assumptionHighlights: record.assumptionHighlights ?? null,
      relatedClauses: record.relatedClauses ?? null,
      keywordHighlights: record.keywordHighlights ?? null,
      followUpQuestions: record.followUpQuestions ?? null,
      citations: record.citations ?? null,
      recommendedChecks: record.recommendedChecks ?? null,
      feedback: record.feedback ?? null,
      feedbackComment: record.feedbackComment ?? null,
      caseDraft: record.caseDraft ?? null,
      createdAt: new Date(record.createdAt),
    });
    return record;
  }

  const state = getState();
  state.consultations.unshift(record);
  return record;
}

export async function listAiConsultationsByUser(userEmail: string) {
  const db = getDb();
  if (db) {
    const rows = await db
      .select()
      .from(aiConsultations)
      .where(eq(aiConsultations.userEmail, userEmail))
      .orderBy(desc(aiConsultations.createdAt));

    return rows.map((row) => ({
      id: row.id,
      userEmail: row.userEmail,
      caseId: row.caseId ?? undefined,
      mode: row.mode,
      question: row.question,
      sourceUrl: row.sourceUrl ?? undefined,
      sourceText: row.sourceText ?? undefined,
      fetchedUrlText: row.fetchedUrlText ?? undefined,
      sourceFetchStatus:
        (row.sourceFetchStatus as AiConsultationRecord["sourceFetchStatus"]) ?? undefined,
      answerTitle: row.answerTitle,
      answer: row.answer,
      confidenceLabel: (row.confidenceLabel as AiConsultationRecord["confidenceLabel"]) ?? undefined,
      documentSummary: row.documentSummary ?? undefined,
      judgement: row.judgement ?? undefined,
      factHighlights: (row.factHighlights as string[]) ?? undefined,
      assumptionHighlights: (row.assumptionHighlights as string[]) ?? undefined,
      relatedClauses: (row.relatedClauses as string[]) ?? undefined,
      keywordHighlights: (row.keywordHighlights as string[]) ?? undefined,
      followUpQuestions: (row.followUpQuestions as string[]) ?? undefined,
      citations: (row.citations as AiConsultationRecord["citations"]) ?? undefined,
      recommendedChecks: (row.recommendedChecks as string[]) ?? undefined,
      feedback: (row.feedback as AiConsultationRecord["feedback"]) ?? undefined,
      feedbackComment: row.feedbackComment ?? undefined,
      caseDraft: (row.caseDraft as AiConsultationRecord["caseDraft"]) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  const state = getState();
  return state.consultations
    .filter((item) => item.userEmail === userEmail)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getLatestConsultationByCaseId(caseId: string, userEmail: string) {
  const db = getDb();
  if (db) {
    const row = (
      await db
        .select()
        .from(aiConsultations)
        .where(and(eq(aiConsultations.caseId, caseId), eq(aiConsultations.userEmail, userEmail)))
        .orderBy(desc(aiConsultations.createdAt))
        .limit(1)
    )[0];

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userEmail: row.userEmail,
      caseId: row.caseId ?? undefined,
      mode: row.mode,
      question: row.question,
      sourceUrl: row.sourceUrl ?? undefined,
      sourceText: row.sourceText ?? undefined,
      fetchedUrlText: row.fetchedUrlText ?? undefined,
      sourceFetchStatus:
        (row.sourceFetchStatus as AiConsultationRecord["sourceFetchStatus"]) ?? undefined,
      answerTitle: row.answerTitle,
      answer: row.answer,
      confidenceLabel: (row.confidenceLabel as AiConsultationRecord["confidenceLabel"]) ?? undefined,
      documentSummary: row.documentSummary ?? undefined,
      judgement: row.judgement ?? undefined,
      factHighlights: (row.factHighlights as string[]) ?? undefined,
      assumptionHighlights: (row.assumptionHighlights as string[]) ?? undefined,
      relatedClauses: (row.relatedClauses as string[]) ?? undefined,
      keywordHighlights: (row.keywordHighlights as string[]) ?? undefined,
      followUpQuestions: (row.followUpQuestions as string[]) ?? undefined,
      citations: (row.citations as AiConsultationRecord["citations"]) ?? undefined,
      recommendedChecks: (row.recommendedChecks as string[]) ?? undefined,
      feedback: (row.feedback as AiConsultationRecord["feedback"]) ?? undefined,
      feedbackComment: row.feedbackComment ?? undefined,
      caseDraft: (row.caseDraft as AiConsultationRecord["caseDraft"]) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    } satisfies AiConsultationRecord;
  }

  const state = getState();
  return (
    state.consultations
      .filter((item) => item.userEmail === userEmail && item.caseId === caseId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null
  );
}

export async function markConsultationAsCased(consultationId: string, caseId: string) {
  const db = getDb();
  if (db) {
    const existing = (
      await db.select().from(aiConsultations).where(eq(aiConsultations.id, consultationId)).limit(1)
    )[0];
    if (!existing) return null;
    await db
      .update(aiConsultations)
      .set({ caseId })
      .where(eq(aiConsultations.id, consultationId));
    return { ...existing, caseId };
  }

  const state = getState();
  const record = state.consultations.find((item) => item.id === consultationId);
  if (!record) return null;
  record.caseId = caseId;
  return record;
}

export async function updateConsultationFeedback(
  consultationId: string,
  userEmail: string,
  feedback: "helpful" | "needs-work",
  feedbackComment?: string,
) {
  const db = getDb();
  if (db) {
    const existing = (
      await db
        .select()
        .from(aiConsultations)
        .where(and(eq(aiConsultations.id, consultationId), eq(aiConsultations.userEmail, userEmail)))
        .limit(1)
    )[0];
    if (!existing) {
      return null;
    }

    await db
      .update(aiConsultations)
      .set({
        feedback,
        feedbackComment: feedbackComment ?? null,
      })
      .where(and(eq(aiConsultations.id, consultationId), eq(aiConsultations.userEmail, userEmail)));

    return {
      ...existing,
      feedback,
      feedbackComment,
    };
  }

  const state = getState();
  const record = state.consultations.find(
    (item) => item.id === consultationId && item.userEmail === userEmail,
  );
  if (!record) {
    return null;
  }

  record.feedback = feedback;
  record.feedbackComment = feedbackComment;
  return record;
}

export async function createAnalyticsSession(
  input: AnalyticsSessionRecord,
): Promise<AnalyticsSessionRecord> {
  const db = getDb();
  if (db) {
    await db.insert(analyticsSessions).values({
      id: input.id,
      visitorId: input.visitorId,
      userEmail: input.userEmail ?? null,
      entryPath: input.entryPath,
      exitPath: input.exitPath ?? null,
      referrer: input.referrer ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
      deviceType: input.deviceType,
      startedAt: new Date(input.startedAt),
      lastSeenAt: new Date(input.lastSeenAt),
    })
    .onConflictDoUpdate({
      target: analyticsSessions.id,
      set: {
        exitPath: input.exitPath ?? null,
        lastSeenAt: new Date(input.lastSeenAt),
        userEmail: input.userEmail ?? null,
      },
    });
    return input;
  }

  const state = getState();
  const existing = state.analyticsSessions.find((item) => item.id === input.id);
  if (existing) {
    Object.assign(existing, input);
  } else {
    state.analyticsSessions.unshift(input);
  }

  return input;
}

export async function saveAnalyticsEvent(
  input: AnalyticsEventRecord,
): Promise<AnalyticsEventRecord> {
  const db = getDb();
  if (db) {
    await db.insert(analyticsEvents).values({
      id: input.id,
      sessionId: input.sessionId,
      visitorId: input.visitorId,
      userEmail: input.userEmail ?? null,
      eventName: input.eventName,
      path: input.path,
      fromPath: input.fromPath ?? null,
      toPath: input.toPath ?? null,
      label: input.label ?? null,
      meta: input.meta ?? null,
      createdAt: new Date(input.createdAt),
    });
    return input;
  }

  const state = getState();
  state.analyticsEvents.unshift(input);

  return input;
}

export type AnalyticsSummary = {
  rangeDays: number;
  totalSessions: number;
  totalPageViews: number;
  totalCtaClicks: number;
  uniqueVisitors: number;
  deviceBreakdown: Array<{ deviceType: string; count: number }>;
  topPaths: Array<{ path: string; count: number }>;
  topCtas: Array<{ ctaId: string; label: string; count: number }>;
};

export async function getAnalyticsSummary(rangeDays = 30): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
  const db = getDb();

  let sessions: AnalyticsSessionRecord[];
  let events: AnalyticsEventRecord[];

  if (db) {
    const sessionRows = await db
      .select()
      .from(analyticsSessions)
      .where(gte(analyticsSessions.startedAt, since));
    const eventRows = await db
      .select()
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, since));

    sessions = sessionRows.map((row) => ({
      id: row.id,
      visitorId: row.visitorId,
      userEmail: row.userEmail ?? undefined,
      entryPath: row.entryPath,
      exitPath: row.exitPath ?? undefined,
      referrer: row.referrer ?? undefined,
      utmSource: row.utmSource ?? undefined,
      utmMedium: row.utmMedium ?? undefined,
      utmCampaign: row.utmCampaign ?? undefined,
      deviceType: row.deviceType as AnalyticsSessionRecord["deviceType"],
      startedAt: row.startedAt.toISOString(),
      lastSeenAt: row.lastSeenAt.toISOString(),
    }));

    events = eventRows.map((row) => ({
      id: row.id,
      sessionId: row.sessionId,
      visitorId: row.visitorId,
      userEmail: row.userEmail ?? undefined,
      eventName: row.eventName,
      path: row.path,
      fromPath: row.fromPath ?? undefined,
      toPath: row.toPath ?? undefined,
      label: row.label ?? undefined,
      meta: (row.meta as Record<string, unknown>) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  } else {
    const state = getState();
    sessions = state.analyticsSessions.filter(
      (item) => new Date(item.startedAt).getTime() >= since.getTime(),
    );
    events = state.analyticsEvents.filter(
      (item) => new Date(item.createdAt).getTime() >= since.getTime(),
    );
  }

  const pageViewEvents = events.filter((item) => item.eventName === "page_view");
  const ctaClickEvents = events.filter((item) => item.eventName === "cta_click");

  const deviceCounts = new Map<string, number>();
  for (const session of sessions) {
    deviceCounts.set(session.deviceType, (deviceCounts.get(session.deviceType) ?? 0) + 1);
  }

  const pathCounts = new Map<string, number>();
  for (const event of pageViewEvents) {
    pathCounts.set(event.path, (pathCounts.get(event.path) ?? 0) + 1);
  }

  const ctaCounts = new Map<string, { label: string; count: number }>();
  for (const event of ctaClickEvents) {
    const ctaId = (event.meta?.ctaId as string | undefined) ?? event.label ?? "unknown";
    const label = event.label ?? ctaId;
    const current = ctaCounts.get(ctaId);
    ctaCounts.set(ctaId, { label, count: (current?.count ?? 0) + 1 });
  }

  const uniqueVisitors = new Set(sessions.map((item) => item.visitorId)).size;

  return {
    rangeDays,
    totalSessions: sessions.length,
    totalPageViews: pageViewEvents.length,
    totalCtaClicks: ctaClickEvents.length,
    uniqueVisitors,
    deviceBreakdown: Array.from(deviceCounts.entries())
      .map(([deviceType, count]) => ({ deviceType, count }))
      .sort((a, b) => b.count - a.count),
    topPaths: Array.from(pathCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    topCtas: Array.from(ctaCounts.entries())
      .map(([ctaId, value]) => ({ ctaId, label: value.label, count: value.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
