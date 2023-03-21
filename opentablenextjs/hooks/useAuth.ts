import axios from "axios";
const URL = "http://localhost:3000";

interface SigninProps {
  email: string;
  password: string;
}

const useAuth = () => {
  const signin = async ({ email, password }: SigninProps) => {
    try {
      const response = await axios.post(`${URL}/api/auth/signin`, {
        email,
        password,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async () => {};

  return {
    signin,
    signup,
  };
};

export default useAuth;
