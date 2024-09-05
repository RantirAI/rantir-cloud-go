export const getWebflowSites = async (token: string) => {
  const endpoint = '/api/webflow_sites:list';
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getWebflowPages = async (token: string) => {
  const endpoint = '/api/webflow_pages:list';
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getCollectionNames = async (token: string) => {
  const endpoint = '/api/data:collectionNames';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  const { data } = await response.json();
  return data;
};

export const getCollection = async (collectionName: string, token: string) => {
  const endpoint = `/api/${collectionName}:list`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getCollectionFields = async (collectionName: string, token: string) => {
  const endpoint = `/api/collections/${collectionName}/fields?pageSize=100`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
