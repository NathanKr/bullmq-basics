import AddTask from "@/components/add-task";
import QueueStatus from "@/components/queue-status";

export default function Home() {
  return (
    <>
      <h2>Home</h2>
      <QueueStatus />
      <AddTask/>
    </>
  );
}
