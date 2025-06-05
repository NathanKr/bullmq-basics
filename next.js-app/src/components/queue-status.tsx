import { getQueueInfo } from "@/logic/queue-utils";
import { QueueInfo } from "@/types/types";

export default async function QueueStatus() {
  let queueInfoData: QueueInfo | null = null;
  let errorOccurred: string | null = null;

  try {
    queueInfoData = await getQueueInfo();
  } catch (error: any) {
    console.error("Error fetching queue info in QueueStatus component:", error);
    errorOccurred = error.message || "Failed to connect to queue service.";
  }

  return (
    <div>
      <h1>BullMQ Queue Status: {queueInfoData?.queueName || "N/A"}</h1>

      {errorOccurred ? (
        <div style={{ color: "red" }}>
          <p>Error fetching queue status:</p>
          <p>{errorOccurred}</p>
          <p>Please check your Redis connection and environment variables.</p>
        </div>
      ) : (
        // Only render queue details if data was successfully retrieved
        queueInfoData && (
          <div>
            <p>
              <strong>Jobs Waiting:</strong> {queueInfoData.waiting}
            </p>
            <p>
              <strong>Jobs Active:</strong> {queueInfoData.active}
            </p>
            <p>
              <strong>Jobs Delayed:</strong> {queueInfoData.delayed}
            </p>
            <p>
              <strong>Jobs Failed:</strong> {queueInfoData.failed}
            </p>
            <p>
              <strong>Jobs Completed:</strong> {queueInfoData.completed}
            </p>
            <p>
              <strong>Total Pending Jobs (Waiting + Active + Delayed):</strong>{" "}
              {queueInfoData.totalQueueLength}
            </p>
          </div>
        )
      )}
    </div>
  );
}
