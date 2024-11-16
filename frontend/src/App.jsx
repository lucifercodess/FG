import React from 'react'
import { Button } from './components/ui/button'
import Signup from './components/Signup'
import Signin from './components/Signin'
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'


const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {path: "/",element: <Home/>},
      {path: "/", element: <Profile/>}
    ]
  },{
    path: "/signin",
    element: <Signin/>
  },{
    path: "/signup",
    element: <Signup/>
  }
])
const App = () => {
  return (
    <>
     <RouterProvider router={BrowserRouter}/>
    </>
  )
}

export default App