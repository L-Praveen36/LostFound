import { useState, useEffect } from 'react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ Control visibility
  const [error, setError] = useState('');

  useEffect(() => {
  const clearCredentials = () => {
    setUsername('');
    setPassword('');
  };

  clearCredentials(); // On mount

  const handlePageShow = (e) => {
    if (e.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
      clearCredentials(); // On back-forward navigation
    }
  };

  window.addEventListener("pageshow", handlePageShow);
  return () => {
    window.removeEventListener("pageshow", handlePageShow);
  };
}, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem('adminToken', data.token);
      window.location.href = '/admin'; // redirect
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">🔐 Admin Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          type="text"
          autoComplete="off"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <div className="relative mb-3">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    required
    className="w-full p-2 border rounded pr-10"
  />
  <img
    src={showPassword ? "/eyeopen.png" : "/eyeclosed.png"}
    alt="Toggle visibility"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
  />
</div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
