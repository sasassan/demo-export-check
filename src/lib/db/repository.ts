import { buildChecklistFromCase } from "@/lib/checklist/generator";
import { createId } from "@/lib/utils";
import type {
  AssessmentRecord,
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
    };
  }

  return globalThis.__ernRepoState;
}

export async function listCasesByUser(userEmail: string) {
  const state = getState();

  return state.cases
    .filter((item) => item.userEmail === userEmail)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createCaseRecord(
  userEmail: string,
  input: CreateCaseInput,
): Promise<CaseRecord> {
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
  const state = getState();
  const record = state.cases.find((item) => item.id === caseId);

  if (!record) {
    return null;
  }

  record.checklist = checklist;
  record.updatedAt = new Date().toISOString();

  return record;
}