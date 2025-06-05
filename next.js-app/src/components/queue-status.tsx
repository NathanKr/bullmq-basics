import { getQueueInfo } from "@/logic/queue-utils";
import { QueueInfo } from "@/types/types"; // Your QueueInfo interface

export default async function QueueStatus() {
  const queueInfoData: QueueInfo = await getQueueInfo();

  return (
    <div>
      <h1>BullMQ Queue Status: {queueInfoData.queueName}</h1>

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

