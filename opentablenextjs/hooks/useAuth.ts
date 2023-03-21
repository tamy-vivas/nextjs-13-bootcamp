import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "../app/context/AuthContext";
const URL = "http://localhost:3000";

interface SigninProps {
  email: string;
  password: string;
}

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(
    AuthenticationContext
  );
  const signin = async ({ email, password }: SigninProps) => {
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
    } catch (error: any) {
      console.log(error);
      setAuthState((state) => ({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      }));
    }
  };

  const signup = async () => {};

  return {
    signin,
    signup,
  };
};

export default useAuth;
