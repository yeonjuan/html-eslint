import Link from "next/link";

export default function Home() {
  return (
    <div className="py-[80px] text-center">
      <h1 className="text-5xl font-semibold pt-4 pb-2">HTML ESLint</h1>
      <div className="flex gap-1 py-4 justify-center">
        <img src="https://camo.githubusercontent.com/a4bcb12512b182b411c7ae9a961784493bd340b485a58c28422fead8d002547f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f4068746d6c2d65736c696e742f65736c696e742d706c7567696e3f636f6c6f723d73756363657373" />
        <img src="https://camo.githubusercontent.com/c903b0b9bdedad958852a201bd7a0310ee42f787f354fd38f950ef96ec498867/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f4068746d6c2d65736c696e742f65736c696e742d706c7567696e3f636f6c6f723d73756363657373" />
        <img src="https://camo.githubusercontent.com/13672c50f5977129dd69344c40c10a821c5d68ca0de66a45241428f241ce3e77/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f64772f4068746d6c2d65736c696e742f65736c696e742d706c7567696e" />
      </div>
      <p className="text-slate-600">
        This is an <Link href="https://eslint.org/">eslint</Link> plugin for
        linting html. It helps us to find problems in the HTML.
      </p>
      <div className="mt-6 flex justify-center space-x-6 text-sm py-4">
        <span>
          <Link
            href="/docs/getting-started"
            className="bg-slate-900  text-white rounded p-4 m-4 font-semibold"
          >
            Getting started
          </Link>
        </span>
      </div>
    </div>
  );
}
