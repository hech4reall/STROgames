import React from 'react';
import './Contact.css'; // Import the CSS file
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../redux/slices/authSlice"
import { useSelector, useDispatch } from "react-redux"

function Contact() {

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }
  return (
    
    <>

    
    <div className="cont">
      <h1>Contactez-nous</h1>
      <div className="contact-info">
        <p><strong>Email:</strong> sotregames@topnet.tn</p>
        <p><strong>Téléphone:</strong> 75270342</p>
        <p><strong>Adresse:</strong> 115 Av Mohamed Ali Gabès</p>
      </div>
    </div>
    </>
  );
}

export default Contact;