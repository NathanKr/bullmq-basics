import { getQueueInfo } from "@/logic/queue-utils";


export default async function QueueStatus() {
  const queueInfo = await getQueueInfo();

 
  const elemInfo = queueInfo.isQueueHealthy ? (
    <div>
      <p>
        <strong>Jobs Waiting:</strong> {queueInfo.waiting}
      </p>
      <p>
        <strong>Jobs Active:</strong> {queueInfo.active}
      </p>
      <p>
        <strong>Jobs Delayed:</strong> {queueInfo.delayed}
      </p>
      <p>
        <strong>Jobs Failed:</strong> {queueInfo.failed}
      </p>
      <p>
        <strong>Jobs Completed:</strong> {queueInfo.completed}
      </p>
      <p>
        <strong>Total Pending Jobs (Waiting + Active + Delayed):</strong>{" "}
        {queueInfo.totalQueueLength}
      </p>
    </div>
  ) : (
    <div style={{ color: "red" }}>
      <p>Error fetching queue status:</p>
      <p>{queueInfo.error}</p>
      <p>Please check your Redis connection and environment variables.</p>
    </div>
  );

  return (
    <div>
      <h1>BullMQ Queue Status: `{queueInfo.queueName}`</h1>
      {elemInfo}
    </div>
  );
}
