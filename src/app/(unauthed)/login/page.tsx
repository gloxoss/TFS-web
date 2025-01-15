import { login } from "@/lib/actions/auth";

export default async function Login() {
  return (
    <div className="max-w-md mx-auto">
      <form action={login} className="bg-base-100 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-base-content">Log in</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-base-content/80 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-base-content/80 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
