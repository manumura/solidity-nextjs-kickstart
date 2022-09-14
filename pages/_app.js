import { Container } from "semantic-ui-react";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Container>
        <Header />
        <Component {...pageProps} />
      </Container>
    </div>
  );
}

export default MyApp;
