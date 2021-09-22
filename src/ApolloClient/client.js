import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, concat } from "@apollo/client";
import Cookies from 'universal-cookie';

const cookies = new Cookies();



const httpLink = new HttpLink({
  uri: "https://atm-graphql-server.herokuapp.com/graphql",
  //uri: "http://localhost:9001/graphql"
});

const authMiddleware = new ApolloLink((operation, forward) => {
  let jwtToken = `${cookies.get('tokenHead')}.${cookies.get('tokenSig')}`
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${jwtToken}` || null,
    }
  }));

  return forward(operation);
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});