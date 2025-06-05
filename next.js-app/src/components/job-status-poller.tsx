"use client";

import { getJobStatusWithAction } from "@/actions/actions";
import { JOB_STATUS_POLL_SEC, REACT_QUERY_KEY_JOB_STATUS } from "@/logic/constants";
import { JobStatus } from "@/types/types"; // Make sure your JobStatus type is correctly defined here
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function JobStatusPoller({ jobId }: { jobId: string }) {
  // Define all states where polling should stop AND the "Polling for updates..." message should NOT be shown.
  // This includes 'not-found' and 'error' because those are handled explicitly above.
  const finalPollingStates = ["completed", "failed", "not-found", "error"];

  const { data, isLoading, isError, error } = useQuery<JobStatus, Error>({
    queryKey: [REACT_QUERY_KEY_JOB_STATUS, jobId],
    queryFn: async () => {
      const result = await getJobStatusWithAction(jobId);

      if (
        result &&
        "error" in result &&
        typeof result.error === "string" &&
        result.error
      ) {
        throw new Error(result.error);
      }
      return result;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Use the helper array to check if polling should stop
      if (status && finalPollingStates.includes(status)) {
        return false; // Stop polling
      }
      return JOB_STATUS_POLL_SEC; // Continue polling
    },
    /*not required in my polling for status use case refetchOnWindowFocus: true,
    staleTime: 1000,*/
  });

  if (isLoading) return <div>Checking job status for ID: {jobId}...</div>;

  if (isError)
    return <div style={{ color: "red" }}>Error: {error?.message}</div>;

  // Handle the 'not-found' state. If we return here, the code below won't execute for this status.
  if (!data || data.status === "not-found")
    return <div>Job with ID {jobId} not found or not yet started.</div>;

  // At this point in the code, `data` is guaranteed to exist and `data.status` is NOT "not-found".
  // It also won't be "isLoading" or "isError".

  return (
    <div>
      <h2>Job Status for ID: {data.jobId}</h2> {/* No '?' needed on data.jobId here */}
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            fontWeight: "bold",
            color:
              data.status === "completed" // No '?' needed on data.status here
                ? "green"
                : data.status === "failed"
                ? "red"
                : data.status === "active"
                ? "blue"
                : "orange",
          }}
        >
          {data.status}
        </span>
      </p>
      {data.progress !== undefined && (
        <p>
          <strong>Progress:</strong> {data.progress}%
        </p>
      )}
      {data.status === "completed" && data.result && (
        <p>
          <strong>Result:</strong> {JSON.stringify(data.result)}
        </p>
      )}
      {data.status === "failed" && data.failedReason && (
        <p style={{ color: "red" }}>
          <strong>Failure Reason:</strong> {data.failedReason}
        </p>
      )}
      {/*
        Now, check if the current data.status is NOT one of the final polling states.
        This correctly shows the polling message for "active", "waiting", etc.
        And because of earlier `if` statements, we know it's not 'isLoading', 'isError', or 'not-found'.
      */}
      {!finalPollingStates.includes(data.status) && (
        <p>Polling for updates...</p>
      )}
    </div>
  );
}
