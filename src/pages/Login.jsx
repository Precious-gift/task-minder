import { useSelector } from "react-redux";
import FirebaseAuth from "../components/FirebaseAuth";
import { Navigate } from "react-router-dom";
import TaskMinderLogo from "../assets/TaskMinderLogo.svg";

const Login = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="flex h-dvh min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#EEF2FC]">
      <div className="flex w-full max-w-md flex-col space-y-8 p-6 shadow-xl rounded-3xl bg-white">
        <div className="">
          <img
            alt="Task Minder"
            src={TaskMinderLogo}
            className="mx-auto h-10 w-auto"
          />
          {/* <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2> */}
        </div>

        <div className="">
          <FirebaseAuth />
        </div>
      </div>
    </div>
  );
};
export default Login;
