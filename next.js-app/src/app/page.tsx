import QueueStatus from "@/components/queue-status";
import {IXXX} from '../../../common/src/types/types'

const xxx : IXXX = {
  num: 0
}

console.log(xxx)

export default function Home() {
  return (
    <>
      <h2>Home</h2>
      <QueueStatus />
    </>
  );
}
