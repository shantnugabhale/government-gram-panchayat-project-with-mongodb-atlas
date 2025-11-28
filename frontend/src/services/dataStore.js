import axios from "axios";

const rawBase =
  import.meta.env?.VITE_API_BASE_URL ||
  process.env?.VITE_API_BASE_URL ||
  "http://localhost:5000";

const normalizeBase = (value) => value.replace(/\/+$/, "");

const buildDataUrl = (value) => {
  const base = normalizeBase(value);
  if (base.endsWith("/api/data")) {
    return base;
  }
  if (base.endsWith("/api")) {
    return `${base}/data`;
  }
  return `${base}/api/data`;
};

const API_ROOT = buildDataUrl(rawBase);

const client = axios.create({
  baseURL: API_ROOT.replace(/([^:]\/)\/+/g, "$1"),
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const db = { __backend: "mongodb" };

const buildPath = (...parts) => {
  const flat = parts.flatMap((part) => {
    if (!part || part === db) return [];
    if (Array.isArray(part)) return part;
    if (typeof part === "string") return part;
    if (part?.path) return part.path;
    return [];
  });

  return flat
    .filter(Boolean)
    .join("/")
    .replace(/\/{2,}/g, "/");
};

const createDescriptor = (type, path) => ({
  type,
  path,
  filters: [],
  sorts: [],
  limitValue: undefined,
});

export const collection = (...args) => createDescriptor("collection", buildPath(...args));

export const doc = (...args) => ({
  type: "doc",
  path: buildPath(...args),
});

export const where = (field, op, value) => ({ type: "where", field, op, value });

export const orderBy = (field, direction = "asc") => ({
  type: "orderBy",
  field,
  direction,
});

export const limit = (value) => ({ type: "limit", value });

export const query = (target, ...constraints) => {
  const descriptor = {
    ...target,
    type: "query",
    filters: [],
    sorts: [],
    limitValue: undefined,
  };

  constraints.forEach((constraint) => {
    if (!constraint) return;
    switch (constraint.type) {
      case "where":
        descriptor.filters.push(constraint);
        break;
      case "orderBy":
        descriptor.sorts.push(constraint);
        break;
      case "limit":
        descriptor.limitValue = constraint.value;
        break;
      default:
        break;
    }
  });

  return descriptor;
};

const buildParamsFromDescriptor = (descriptor) => {
  const params = { path: descriptor.path };
  if (descriptor.filters?.length) {
    params.filters = JSON.stringify(descriptor.filters);
  }
  if (descriptor.sorts?.length) {
    params.sorts = JSON.stringify(descriptor.sorts);
  }
  if (descriptor.limitValue) {
    params.limit = descriptor.limitValue;
  }
  return params;
};

const normalizeDoc = (raw) => {
  const id = raw?._id?.toString() || raw?.id;
  return {
    id,
    data: () => ({ ...raw, id }),
  };
};

export const getDocs = async (descriptor) => {
  const target =
    descriptor.type === "collection" || descriptor.type === "query"
      ? descriptor
      : createDescriptor("collection", descriptor.path);

  const { data } = await client.get("/", {
    params: buildParamsFromDescriptor(target),
  });

  const docs = Array.isArray(data) ? data.map(normalizeDoc) : [];
  return { docs };
};

export const getDoc = async (docRef) => {
  try {
    const { data } = await client.get("/doc", {
      params: { path: docRef.path },
    });

    if (!data) {
      return {
        exists: () => false,
        data: () => undefined,
      };
    }

    const normalized = normalizeDoc(data);
    return {
      id: normalized.id,
      exists: () => true,
      data: normalized.data,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        exists: () => false,
        data: () => undefined,
      };
    }
    throw error;
  }
};

export const setDoc = async (docRef, data) => {
  await client.put("/", { path: docRef.path, data });
};

export const updateDoc = async (docRef, data) => {
  await client.patch("/", { path: docRef.path, data });
};

export const addDoc = async (collectionRef, data) => {
  const response = await client.post("/", {
    path: collectionRef.path,
    data,
  });
  return { id: response.data?.id };
};

export const deleteDoc = async (docRef) => {
  await client.delete("/", { data: { path: docRef.path } });
};

export const serverTimestamp = () => new Date().toISOString();

export const onSnapshot = (descriptor, callback, pollInterval = 15000) => {
  let stopped = false;

  const fetchAndEmit = async () => {
    try {
      const snapshot = await getDocs(descriptor);
      if (!stopped) {
        callback(snapshot);
      }
    } catch (error) {
      console.error("Realtime sync error:", error);
    }
  };

  fetchAndEmit();
  const timer = setInterval(fetchAndEmit, pollInterval);

  return () => {
    stopped = true;
    clearInterval(timer);
  };
};

