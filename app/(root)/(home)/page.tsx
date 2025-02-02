// import React from 'react'

// const Home = () => {
//   return (
//     <div>
//       Home
//     </div>
//   )
// }

// export default Home

import { UserButton } from "@clerk/nextjs";


export default function Home() {
return (
  <div>
    <UserButton afterSignOutUrl="/"/>
  </div>
)
}