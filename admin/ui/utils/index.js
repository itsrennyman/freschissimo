import axios from "axios";

export const dateLocalized = (date) =>
  new Date(Date.parse(date)).toLocaleString();

export const Gateway = axios.create({
  baseURL: "http://localhost:3000", // TODO: insert from next config
  /*
  headers: {
    Authorization: localStorage.getItem("at"),
  },
  */
  responseType: "json",
});

export const base64Encode = (string) => {
  return Buffer.from(string).toString("base64");
};

export const makeJwtCredentials = (scopes = []) => {
  return {
    type: "jwt",
    secret: base64Encode(uuidv4()),
    scopes: scopes,
  };
};

export const makeBasicAuthCredentials = (password = "") => {
  return {
    type: "basicAuth",
    password: password,
  };
};
