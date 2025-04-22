import React, { createContext, useState, useEffect } from "react";

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage on initialization
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userType, setUserType] = useState(() => {
    // Retrieve userType from local storage on initialization
    const storedUserType = localStorage.getItem("userType");
    return storedUserType || null;
  });

  // Save user and userType to local storage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [userType]);

  const [searchTerm, setSearchTerm] = useState(""); // Add searchTerm state

  return (
    <UserContext.Provider value={{ user, setUser, userType, setUserType, searchTerm, setSearchTerm }}>
      {children}
    </UserContext.Provider>
  );
};