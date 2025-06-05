import AddTask from "@/components/add-task";
import JobIdInput from "@/components/job-id-input";
import QueueStatus from "@/components/queue-status";

// --  explicitly opts this route segment out of all output caching, ensuring a fresh render every time.
export const dynamic = 'force-dynamic';


export default function Home() {
  return (
    <>
      <QueueStatus />
      <JobIdInput/>
      <AddTask/>
    </>
  );
}
