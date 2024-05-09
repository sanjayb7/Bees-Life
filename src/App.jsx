import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Nature } from "./components/Nature";
import AirtableForm from "./components/Form";
import List from "./components/List";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/form" element={<AirtableForm />}/>
          <Route path="/list" element={<List />}/>
          <Route path="/" element={
            <Canvas>
              <color attach="background" args={["#ececec"]} />
              <ScrollControls pages={5} damping={0.3}>
                <Nature />
              </ScrollControls>
            </Canvas>}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
