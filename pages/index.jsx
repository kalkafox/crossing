import { Suspense } from "react";
import dynamic from "next/dynamic";

const MainComponent = dynamic(() => import("../components/Main"), {
  suspense: true,
});

const Index = () => {
  return (
    <>
      <Suspense fallback={<h1>hallo</h1>}>
        <MainComponent />
      </Suspense>
    </>
  );
};

export default Index;
