import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";

export default function Login ()  ´
const navigate = useNavigate();
const BASE = import.meta.env.VITE_BACKENFD_URL || "http://127.0.0.1:3001";

const [Form, setForm] =useState ({ email: "", password: ""});
const [errors, setErrors] = useState({ email: "", password: ""});
const [loading, setLoading] = useState(false);

function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev =>({ ...prev, [name]: value}));
    setErrors(prev => ({...prev, [name]: ""}));
}
