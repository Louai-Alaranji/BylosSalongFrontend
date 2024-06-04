import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./User/Login.jsx"
import AdminPage from "./Admin/components/AdminPage.jsx"
import {loader as getEmployeeDataLoader} from "../src/Admin/components/AdminPage.jsx"
import UserBookingPage from "../src/User/UserBookingPage.jsx"
import { loader as getEmployeesList } from "../src/User/UserBookingPage.jsx"
import {UserProgressContextProvider} from "./store/UserProgressContext.jsx"
import Form from "./User/Form.jsx"
import { UserDataContextProvider } from "./store/UserDataContext.jsx"
import Success from "./User/Success.jsx"
import PrivatePage from "./Admin/components/PrivatePage.jsx"
import Register from "./Admin/components/Register.jsx"
import AllEmployees from "./Admin/components/AllEmployees.jsx"
import { loader as AllEmployeesLoader } from "./Admin/components/AllEmployees.jsx"
import Bookings from "./Admin/components/Bookings.jsx"
import SetServices from "./Admin/components/SetServices.jsx"
import Home from "./Pages/Home.jsx"
import Footer from "./Components/Footer.jsx"
import SearchableBookings from "./Admin/components/SearchableBookings.jsx"
const router = createBrowserRouter([
  {
    path:"",
    element: <Home/>
  },
  {
  path: "Login",
  element: <Login/>
  },
  {path: "AdminPage",
    element: <AdminPage/>,
    loader: getEmployeeDataLoader
  },
  {
    path:"UserBookingPage",
    element: <UserBookingPage/>,
    loader: getEmployeesList
  },
  {
    path:"PrivatePage",
    element: <PrivatePage/>
  },
  {
    path:"Register",
    element: <Register/>
  },
  {
    path: "AllEmployees",
    element: <AllEmployees/>,
    loader: AllEmployeesLoader
  },
  {
    path: "Bookings",
    element:<Bookings/>,

  }
  ,{
    path:"Services",
    element: <SetServices/>
  },
  {
    path:"SearchableBookings",
    element: <SearchableBookings/>
  }
  
  

])

function App() {
  
  return (
    <div className="container">
     <UserDataContextProvider>
      <UserProgressContextProvider>
        <RouterProvider router={router}/>
        <Form></Form>
        <Success></Success>
        <Footer></Footer>
      </UserProgressContextProvider>
  </UserDataContextProvider>
  
  </div>  
   
    
    
  )
}

export default App
