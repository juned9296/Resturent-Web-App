import api from "./api"

// 🔹 User Signup
export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/signup", { name, email, password })
    {
        withCredentials: true
    };
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// 🔹 User Login
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password })
    {
        withCredentials: true
    };
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// 🔹 User Logout
export const logoutUser = async () => {
  try {
    const response = await api.post("/logout",
        {
            withCredentials: true
        }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Logout failed" };
  }
};
