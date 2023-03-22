import axios from "axios";
import { getCookie } from "cookies-next";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
const URL = "http://localhost:3000";

interface SigninProps {
  email: string;
  password: string;
}

interface SignupProps extends SigninProps {
  firstName: string;
  lastName: string;
  city: string;
  phone: string;
}

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(
    AuthenticationContext
  );
  const signin = async (
    { email, password }: SigninProps,
    handleClose: () => void
  ) => {
    setAuthState((state) => ({ ...state, loading: true }));
    try {
      const response = await axios.post(`${URL}/api/auth/signin`, {
        email,
        password,
      });
      console.log(response);
      setAuthState((state) => ({
        data: response.data,
        error: null,
        loading: false,
      }));
      handleClose();
    } catch (error: any) {
      console.log(error);
      setAuthState((state) => ({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      }));
    }
  };

  const signup = async (
    { email, password, firstName, lastName, city, phone }: SignupProps,
    handleClose: () => void
  ) => {
    setAuthState((state) => ({ ...state, loading: true }));
    try {
      const values = {
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
      };
      const response = await axios.post(`${URL}/api/auth/signup`, {
        ...values,
      });

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
      });

      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  return {
    signin,
    signup,
    //fetchUser,
  };
};

export default useAuth;
