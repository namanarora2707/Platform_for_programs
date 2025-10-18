import Header from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const samples = [
    {
        id: "s_python_ml",
        title: "Python Machine Learning Intro",
        tag: "PYTHON",
        color: "bg-blue-600",
        cells: [
            { id: crypto.randomUUID(), language: "python", code: "import numpy as np\nimport pandas as pd\nprint('Hello ML!')" },
        ],
    },
    {
        id: "s_pandas",
        title: "Data Analysis with Pandas",
        tag: "PYTHON",
        color: "bg-blue-600",
        cells: [
            { id: crypto.randomUUID(), language: "python", code: "import pandas as pd\ndf = pd.DataFrame({'a':[1,2,3]})\nprint(df.describe())" },
        ],
    },
    {
        id: "s_cpp_stats",
        title: "C++ Statistical Computing",
        tag: "CPP",
        color: "bg-purple-600",
        cells: [
            { id: crypto.randomUUID(), language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
int main(){ vector<int> v{1,2,3}; double avg=accumulate(v.begin(),v.end(),0.0)/v.size(); cout<<avg<<"\n"; return 0;}` },
        ],
    },
    {
        id: "s_js_data",
        title: "JavaScript Data Processing",
        tag: "JAVASCRIPT",
        color: "bg-amber-600",
        cells: [
            { id: crypto.randomUUID(), language: "javascript", code: "const arr=[1,2,3]; console.log(arr.map(x=>x*2).join(', '))" },
        ],
    },
];
const defaultNotebook = [
    { id: crypto.randomUUID(), language: "python", code: "print('Hello from Python!')" },
];
export default function Dashboard() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    useEffect(() => {
        if (!loading && !user)
            navigate("/auth");
    }, [loading, user, navigate]);
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return samples.filter((s) => s.title.toLowerCase().includes(q));
    }, [query]);
    function openNotebook(cells) {
        localStorage.setItem("notebook:default", JSON.stringify(cells));
        navigate("/");
    }
    async function onUpload(file) {
        try {
            const txt = await file.text();
            const data = JSON.parse(txt);
            if (Array.isArray(data)) {
                openNotebook(data);
            }
            else if (Array.isArray(data?.cells)) {
                openNotebook(data.cells);
            }
            else {
                throw new Error("Unsupported file format");
            }
        }
        catch (e) {
            alert(e?.message || String(e));
        }
    }
    if (loading || !user)
        return null;
    return (
      <div>
        <Header />
        <main className="container" style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 0' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 32, marginBottom: 8 }}>Welcome to Colaboratory</h1>
          <p style={{ fontSize: 17, color: '#444', marginBottom: 24, maxWidth: 700 }}>
            Colaboratory is a free notebook environment. Execute Python, C++, and JavaScript code with built-in libraries.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => openNotebook(defaultNotebook)} className="button button-primary">+ New notebook</button>
            <label className="button button-secondary" style={{ cursor: 'pointer', marginBottom: 0 }}>
              Upload
              <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                if (f) onUpload(f);
              }} />
            </label>
            <button onClick={() => openNotebook(samples[0].cells)} className="button button-secondary">Open sample notebook</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notebooks"
              className="form-input"
              style={{ width: 260, fontSize: 15 }}
            />
            <button className="button button-secondary">Filter</button>
            <button className="button button-secondary">☰</button>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '32px 0 16px 0' }}>Machine Learning Examples</h2>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', marginBottom: 40 }}>
            {filtered.map((s) => (
              <div key={s.id} style={{ border: '1px solid #e5e7eb', borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 4 }}>{s.tag}</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</div>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'inline-block', height: 10, width: 10, borderRadius: '50%', background: s.tag === 'PYTHON' ? '#2563eb' : s.tag === 'CPP' ? '#a78bfa' : '#f59e0b' }} />
                  <button onClick={() => openNotebook(s.cells)} className="button button-primary" style={{ fontSize: 15, padding: '6px 18px' }}>
                    Open Notebook
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Getting Started with ML</h3>
              <ul style={{ fontSize: 15, color: '#444', listStyle: 'disc inside', paddingLeft: 0 }}>
                <li style={{ fontWeight: 600 }}>Python ML</li>
                <li style={{ color: '#888', marginBottom: 8 }}>NumPy, Pandas, Matplotlib, Scikit-learn</li>
                <li style={{ fontWeight: 600, marginTop: 12 }}>C++ Performance</li>
                <li style={{ color: '#888', marginBottom: 8 }}>Algorithms, numerics, data structures</li>
                <li style={{ fontWeight: 600, marginTop: 12 }}>JavaScript Data</li>
                <li style={{ color: '#888' }}>Node.js data processing and visualization</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
}
