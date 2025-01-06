import './App.css'
import {Suspense} from "react"
import { Route, Routes} from "react-router-dom";
import StartPAge from "./pages/startPage/startPage.tsx"
import PromptPage from "./pages/promptPage/PromptPage.tsx";
import ResultPage from "./pages/resultPage/ResultPage.tsx";
import {TestPage} from "./pages/testPage.tsx";

function App() {

  return (
      <Suspense fallback={<div>로딩중</div>}>
          <Routes>
            <Route element={<StartPAge/>} path={"/"} ></Route>
              <Route element={<PromptPage/>} path={"/promptPage"} ></Route>
              <Route element={<ResultPage/>} path={"/resultPage"} ></Route>
              <Route element={<TestPage/>} path={"/testPage"} ></Route>
          </Routes>
      </Suspense>
  )
}

export default App
