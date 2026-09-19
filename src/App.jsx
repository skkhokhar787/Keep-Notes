import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AddNotes from "./pages/AddNotes";
import Notes from "./components/Notes";
import Drafts from "./components/Drafts";
import Trash from "./components/Deletes";

function App() {
  return (
    <Layout>
      <main className="pt-14 sm:ml-64 min-h-screen overflow-y-auto bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-notes" element={<AddNotes />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/drafts" element={<Drafts />} />
            <Route path="/trash" element={<Trash />} />
          </Routes>
        </div>
      </main>
    </Layout>
  );
}

export default App;
