import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className= "">
     <LeftSidebar/>
      <div>
      <Outlet></Outlet>
      </div>
    </div>
  )
}

export default MainLayout