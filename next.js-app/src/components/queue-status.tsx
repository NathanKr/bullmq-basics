import { getQueueInfo } from "@/logic/queue-utils";
import { QueueInfo } from "@/types/types"; // Your QueueInfo interface

export default async function QueueStatus() {
  // Directly call getQueueInfo. If it throws, this component will stop rendering.
  const queueInfoData: QueueInfo = await getQueueInfo();

  // If the code reaches here, it means getQueueInfo successfully returned data.
  // There's no 'errorOccurred' state needed here because errors are thrown.
  return (
    <div>
      <h1>BullMQ Queue Status: {queueInfoData.queueName}</h1>

      {/* Since errors are thrown, queueInfoData is guaranteed to exist and be valid here */}
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
    </div>
  );
}

