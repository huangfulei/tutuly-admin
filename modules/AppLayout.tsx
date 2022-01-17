import { Transition } from "@headlessui/react";
import { ReactNode } from "react";
import Navbar from "../app/components/nav/Navbar";
import useLoadingStateStore from "../app/context/loadingStateStore";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isLoading } = useLoadingStateStore();

  return (
    <>
      <Navbar />
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Transition
                show={isLoading}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute inset-0 z-50 bg-gray-200 opacity-50 ">
                  <div className="top-1/2 left-1/2 relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-purple-400 via-blue-500 to-red-400 ">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gray-200 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </Transition>
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
