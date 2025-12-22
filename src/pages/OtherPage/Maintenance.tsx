import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Maintenance() {
  return (
    <>
      <PageMeta
        title="React.js 404 Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js 404 Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 bg-light-bg dark:bg-dark-bg">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-xl">
            EM MANUTENÇÃO
          </h1>

          <img src="/images/error/gears-light.png" alt="gears" className="dark:hidden" />
          <img
            src="/images/error/gears-dark.png"
            alt="gears"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            Estamos trabalhando para melhorar o site. Por favor, volte mais tarde.
          </p>
        </div>
      </div>
    </>
  );
}