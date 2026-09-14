const apiClient = {
  async get(url, config = {}) {
    const token = localStorage.getItem('routeresq_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers || {})
    };

    const res = await fetch(`/api${url}`, { method: 'GET', headers });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'API Request Failed');
      err.response = { data };
      throw err;
    }
    return { data };
  },

  async post(url, body = {}, config = {}) {
    const token = localStorage.getItem('routeresq_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers || {})
    };

    const res = await fetch(`/api${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'API Request Failed');
      err.response = { data };
      throw err;
    }
    return { data };
  },

  async patch(url, body = {}, config = {}) {
    const token = localStorage.getItem('routeresq_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers || {})
    };

    const res = await fetch(`/api${url}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'API Request Failed');
      err.response = { data };
      throw err;
    }
    return { data };
  }
};

export default apiClient;
