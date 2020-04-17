import Router from "next/router";
import { Component, Fragment } from "react";
import {
  DynamicTable,
  Header,
  Button,
  ContentWrapper,
  Ribbon,
} from "@itsrennyman/reactailwind";
import Layout from "../components/Layout";
import { dateLocalized, Gateway } from "../utils";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const response = await Gateway.get("/users").catch((e) => console.log(e));

    const rows = response.data.map((row) => {
      return {
        cells: [
          { content: row.username },
          { content: row.email },
          {
            content: (
              <Fragment>
                {row.credentials.map((credential, key) => (
                  <Ribbon key={key}>{credential.type}</Ribbon>
                ))}
              </Fragment>
            ),
          },
          { content: dateLocalized(row.createdAt) },
          {
            content: (
              <div style={{ textAlign: "right" }}>
                <Button
                  variant="blue"
                  onClick={() =>
                    Router.push("/users/[username]", `/users/${row.username}`)
                  }
                >
                  Visualizza
                </Button>
              </div>
            ),
          },
        ],
      };
    });

    this.setState({ rows, isLoading: false });
  }

  render() {
    const tableHead = {
      cells: [
        { content: "Username" },
        { content: "Email" },
        { content: "Credentials" },
        { content: "Created At" },
      ],
    };

    return (
      <Layout>
        <Header
          text="Users List"
          actions={
            <Button
              variant="blue"
              onClick={() => Router.push("/users/[username]", `/users/new`)}
            >
              Crea Nuovo
            </Button>
          }
        />
        <ContentWrapper>
          <DynamicTable head={tableHead} rows={this.state.rows} />
        </ContentWrapper>
      </Layout>
    );
  }
}

export default Users;
