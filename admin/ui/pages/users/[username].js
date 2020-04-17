import Router from "next/router";
import React, { Component, Fragment } from "react";
import {
  Header,
  Button,
  ContentWrapper,
  Card,
  CardFooter,
  CardBody,
  TextField,
  SelectField,
  Toast,
  showToast,
} from "@itsrennyman/reactailwind";
import {
  Gateway,
  makeBasicAuthCredentials,
  makeJwtCredentials,
} from "../../utils";
import Layout from "../../components/Layout";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

export async function getServerSideProps(context) {
  return {
    props: {
      params: context.params,
    },
  };
}

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      scopes: [],
      isLoading: true,
    };
  }

  async componentDidMount() {
    if (!this.isNew()) {
      await this.getUser(this.props.params.username);
    }

    this.setState({ isLoading: false });
  }

  isNew() {
    return this.props.params.username === "new";
  }

  getUsername() {
    return this.isNew() ? "Crea Nuovo" : this.state.user.username;
  }

  getUser(id) {
    Gateway.get("/users/" + id)
      .then((response) =>
        this.setState({
          ...this.state,
          user: response.data,
        })
      )
      .catch((err) => console.log(err));
  }

  handleSubmit(data) {
    this.isNew() ? this.store(data) : this.update(data);
  }

  store(data, setSubmitting) {
    // Needs to create JWT and BasicAuth credentials:
    const jwtCredentials = makeJwtCredentials(data.scopes);
    const basicAuthCredentials = makeBasicAuthCredentials(data.password);

    // Store User Data
    Gateway.post("/users", data)
      .then(async (response) => {
        // Store Credentials
        await Gateway.post(
          "/users/" + response.data.username + "/credentials",
          basicAuthCredentials
        );
        await Gateway.post(
          "/users/" + response.data.username + "/credentials",
          jwtCredentials
        );

        await this.getUser(response.data.username);

        showToast({ variant: "green-600", text: "Utente Creato!" });
        Router.replace("/users/[username]", `/users/${response.data.username}`);
        setSubmitting(false);
      })
      .catch((e) => {
        console.log(e);
        showToast({ variant: "red-600", text: "Si è verificato un errore.." });
        setSubmitting(false);
      });
  }

  update(data, setSubmitting) {
    // Needs to update password or JWT Scopes
    const credentials = this.state.user.credentials;

    // Check password has changed.
    if (data.password !== "" && data.password !== null) {
      const basicAuthCredentialsIndex = credentials.findIndex(
        (x) => x.type === "basicAuth"
      );

      credentials[basicAuthCredentialsIndex].password = data.password;
    }

    // Update scopes for JWT credentials
    const jwtCredentialsIndex = credentials.findIndex((x) => x.type === "jwt");
    credentials[jwtCredentialsIndex].scopes = data.scopes;

    const payload = Object.assign({}, data, { credentials: credentials });

    Gateway.put("/users/" + this.props.params.username, payload)
      .then(async () => {
        for (let i = 0; i < credentials.length; i++) {
          await Gateway.put(
            `/users/${payload.username}/credentials/${credentials[i].id}`,
            credentials[i]
          );
        }
        Router.replace("/users/[username]", `/users/${payload.username}`);
        setSubmitting(false);
        showToast({ variant: "green-600", text: "Dati Aggiornati!" });
      })
      .catch(() => {
        setSubmitting(false);
        showToast({ variant: "red-600", text: "Si è verificato un errore" });
      });
  }

  render() {
    const initialValues = {
      firstname: this.state.user.firstname ? this.state.user.firstname : "",
      lastname: this.state.user.lastname ? this.state.user.lastname : "",
      username: this.state.user.username ? this.state.user.username : "",
      email: this.state.user.email ? this.state.user.email : "",
      password: "",
      scopes: this.state.user.credentials
        ? this.state.user.credentials.find((x) => x.type === "jwt").scopes
        : [],
    };

    const validationSchema = Yup.object().shape({
      firstname: Yup.string().required(),
      lastname: Yup.string().required(),
      username: Yup.string().required(),
      email: Yup.string().email().required(),
      password: this.isNew()
        ? Yup.string().min(8).required()
        : Yup.string().min(8),
    });

    return (
      <Layout>
        <Header text="User" />
        <ContentWrapper>
          <Card title="Informations">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                this.isNew()
                  ? this.store(values, setSubmitting)
                  : this.update(values, setSubmitting);
              }}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form>
                  <CardBody>
                    <Field name="firstname">
                      {({ field }) => (
                        <TextField
                          label="Firstname"
                          {...field}
                          error={
                            errors.firstname && touched.firstname
                              ? errors.firstname
                              : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="lastname">
                      {({ field, form }) => (
                        <TextField
                          label="Lastname"
                          {...field}
                          error={
                            errors.lastname && touched.lastname
                              ? errors.lastname
                              : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="username">
                      {({ field, form }) => (
                        <TextField
                          label="Username"
                          {...field}
                          error={
                            errors.username && touched.username
                              ? errors.username
                              : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }) => (
                        <TextField
                          label="Email"
                          {...field}
                          error={
                            errors.email && touched.email ? errors.email : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="password">
                      {({ field, form }) => (
                        <TextField
                          label="Password"
                          type="password"
                          {...field}
                          error={
                            errors.password && touched.password
                              ? errors.password
                              : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="scopes">
                      {({ field, form }) => (
                        <SelectField
                          label="Scopes"
                          field={field}
                          form={form}
                          isMulti
                          options={this.state.scopes}
                        />
                      )}
                    </Field>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="blue"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        </ContentWrapper>
        <Toast />
      </Layout>
    );
  }
}

export default User;
