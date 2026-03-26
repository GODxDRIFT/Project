import { Suspense } from "react"
import Login from "../../Components/Login/Login"
const page = () => {
  return (<>
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  </>)
}
export default page