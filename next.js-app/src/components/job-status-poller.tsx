"use client";

import { getJobStatusWithAction } from "@/actions/actions";
import {
  JOB_STATUS_POLL_SEC,
  REACT_QUERY_KEY_JOB_STATUS,
} from "@/logic/constants";
import { JobStatus } from "@/types/types"; // Make sure your JobStatus type is correctly defined here
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export default function JobStatusPoller({ jobId }: { jobId: string }) {
  // Define all states where polling should stop AND the "Polling for updates..." message should NOT be shown.
  // This includes 'not-found' and 'error' because those are handled explicitly above.
  const finalPollingStates = ["completed", "failed", "not-found", "error"];

  const { data, isLoading, isError, error } = useQuery<JobStatus, Error>({
    queryKey: [REACT_QUERY_KEY_JOB_STATUS, jobId],
    queryFn: async () => {
      const result = await getJobStatusWithAction(jobId);
      console.log(result);

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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body1">
          Checking job status for ID: {jobId}...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {/* Added vertical margin for spacing */}
        Error: {error?.message}
      </Alert>
    );
  }

  if (!data || data.status === "not-found") {
    return (
      <Typography variant="body1" sx={{ my: 2 }}>
        Job with ID {jobId} not found or not yet started.
      </Typography>
    );
  }

  // At this point in the code, `data` is guaranteed to exist and `data.status` is NOT "not-found".
  // It also won't be "isLoading" or "isError".

  return (
    <Box
      sx={{
        p: 2, // Added padding to the container for better spacing
        border: "1px solid",
        borderColor: "divider", // Uses theme's divider color for border
        borderRadius: 1, // Rounded corners
        bgcolor: "background.paper", // Uses theme's paper background color
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 1.5 }}>
        Job Status for ID: {data.jobId}
      </Typography>

      <Typography variant="body1" sx={{ mb: 0.5 }}>
        <Box component="span" sx={{ fontWeight: "bold" }}>
          Status:
        </Box>{" "}
        <Box
          component="span"
          sx={{ fontWeight: "bold", color: getStatusColor(data.status) }}
        >
          {data.status}
        </Box>
      </Typography>

      {data.progress !== undefined && (
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Progress:
          </Box>{" "}
          {data.progress}%
        </Typography>
      )}
      {data.status === "completed" && data.result && (
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Result:
          </Box>{" "}
          {JSON.stringify(data.result)}
        </Typography>
      )}
      {data.status === "failed" && data.failedReason && (
        <Typography variant="body1" sx={{ color: "error.main", mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            Failure Reason:
          </Box>{" "}
          {data.failedReason}
        </Typography>
      )}
      {!finalPollingStates.includes(data.status) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2">Polling for updates...</Typography>
        </Box>
      )}
    </Box>
  );
}

// Helper function to get a theme-aware color based on job status
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success.main"; // Uses the main color from the theme's success palette
    case "failed":
      return "error.main"; // Uses the main color from the theme's error palette
    case "active":
      return "info.main"; // Uses the main color from the theme's info palette (often a blue)
    case "waiting":
      return "warning.main"; // Uses the main color from the theme's warning palette (often an orange)
    default:
      return "text.primary"; // Default text color from the theme
  }
};
