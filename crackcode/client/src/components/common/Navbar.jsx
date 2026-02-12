import React from 'react'
import Navlinks from './Navlinks'

function Navbar() {
  return (
    <div className='gap-10 hidden md:flex justify-center items-center'>
      {/* ✅ Updated: Link now points directly to the test case */}
      <Navlinks linkURL="/solve/case-101" linkText="Learn" />
      
      <Navlinks linkURL="/caselog" linkText="Case Log" />
      <Navlinks linkURL="/careermaps-Main" linkText="Career Maps" />
      <Navlinks linkURL="/leaderboard" linkText="Leaderboard" />
      <Navlinks linkURL="/store" linkText="Store" />
    </div>
  )
}

export default Navbar