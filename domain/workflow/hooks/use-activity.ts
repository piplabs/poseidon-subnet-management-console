import { useQuery } from "@tanstack/react-query"
import type { ActivityDetailResponse } from "@/lib/api/types"
import {
  normalizeActivityStatus,
  formatDurationMs,
  formatTime,
  type ActivityStatus,
} from "@/lib/api/transforms"

export interface ActivityDetails {
  id: string
  type: string
  status: ActivityStatus
  workflowId: string
  stepIndex: number
  queueId: string
  worker: string
  attempt: number
  startTime: string
  endTime: string
  duration: string
  durationMs: number
  input: any
  output: any
  failureReason: string
}

async function fetchActivity(activityId: string): Promise<ActivityDetails> {
  // TODO: Replace with actual API call to GET /api/v1/activities/{activityId}
  // const response = await fetch(`/api/v1/activities/${activityId}`)
  // const apiResponse: ActivityDetailResponse = await response.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 750))

  // MOCK DATA - Replace with actual API response
  const apiResponse: ActivityDetailResponse = {
    activityId: activityId,
    type: "ValidatePayment",
    status: "Completed",
    workflowId: "0xwf001abc123def",
    stepIndex: 2,
    queueId: "chutes-default",
    worker: "0xworker001abc123",
    attempt: 1,
    startedAt: "2025-10-16T10:30:15Z",
    completedAt: "2025-10-16T10:31:38Z",
    durationMs: 83000,
    input: {
      paymentId: "pay-12345",
      amount: 150.0,
      currency: "USD",
      customerId: "cust-67890",
      validationRules: ["amount_check", "fraud_detection", "balance_verification"],
    },
    output: {
      validationStatus: "success",
      transactionId: "txn-98765",
      processedAt: "2025-10-16T10:31:38Z",
      checksCompleted: ["amount_check", "fraud_detection", "balance_verification"],
      riskScore: 0.12,
    },
    failureReason: "",
  }

  // Transform to FE format
  return {
    id: apiResponse.activityId,
    type: apiResponse.type,
    status: normalizeActivityStatus(apiResponse.status),
    workflowId: apiResponse.workflowId,
    stepIndex: apiResponse.stepIndex,
    queueId: apiResponse.queueId,
    worker: apiResponse.worker,
    attempt: apiResponse.attempt,
    startTime: formatTime(apiResponse.startedAt),
    endTime: apiResponse.completedAt ? formatTime(apiResponse.completedAt) : "-",
    duration: formatDurationMs(apiResponse.durationMs),
    durationMs: apiResponse.durationMs,
    input: apiResponse.input,
    output: apiResponse.output,
    failureReason: apiResponse.failureReason,
  }
}

export function useActivity(activityId: string) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
    enabled: !!activityId,
  })
}
