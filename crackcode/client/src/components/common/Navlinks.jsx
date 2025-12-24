import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navlinks(props) {
const location = useLocation();
const isActive = location.pathname === props.linkURL;

  return (
    <>
      <Link to={props.linkURL} className='relative text-md font-medium text-white hover:text-orange-500 transition-all duration-300 group'>
      {props.linkText}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 
      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}/>
      </Link>
    </>
  )
}

export default Navlinks
