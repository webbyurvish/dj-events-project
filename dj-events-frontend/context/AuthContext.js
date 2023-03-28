import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { NEXT_URL } from "@/config/index";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  // console.log(user);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUserLoggedIn();
  }, [Cookies.get("token")]);

  // Register user
  const register = async ({ username, email, password }) => {
    const res = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      Cookies.set("jwt", data.jwt);
      setUser(data.user);
      router.push("/account/dashboard");
    } else {
      setError(data.message);
      setError(null);
    }
  };

  // Login user
  const login = async ({ email: identifier, password }) => {
    const res = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    const data = await res.json();
    console.log(data);

    console.log(res);

    if (res.ok) {
      console.log(data);
      Cookies.set("jwt", data.jwt);
      // , {
      //   httpOnly: true,
      //   secure: false,
      //   path: "/",
      //   domain: "localhost",
      // });
      // Cookies.set("token", data.jwt, {
      //   httpOnly: true,
      //   secure: true,
      //   expires: 7,
      //   path: "",
      //   // maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age
      //   // domain: "localhost",
      //   // httpOnly: true,
      //   // secure: process.env.NODE_ENV !== "development",
      //   // sameSite: "strict",
      //   // path: "/",
      // });
      console.log(Cookies.get("jwt"));
      setUser(data.user);
      router.push("/account/dashboard");
    } else {
      setError(data.error.message);
      // console.log(data.error.message);
      // setError(null);
    }
  };
  // console.log(user);

  // Logout user
  const logout = async () => {
    Cookies.set("jwt", "");
    setUser(null);
    router.push("/");
  };

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    const jwt = Cookies.get("jwt");
    console.log(jwt);
    const res = await fetch(`${API_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(jwt);
    const data = await res.json();

    if (res.ok) {
      setUser(data);
      router.push("/account/dashboard");
    } else {
      // setUser(null);
      router.push("/");
      // setError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, error, register, login, logout, checkUserLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
