import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { address } = context.query;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map(async (element, index) => {
        const req = await campaign.methods.requests(index).call();
        return {
          description: req.description,
          value: req.value,
          recipient: req.recipient,
          complete: req.complete,
          approvalCount: req.approvalCount,
        };
      })
  );

  return {
    props: {
      address,
      requests,
      requestCount,
      approversCount,
    },
  };
}

function RequestIndex({ address, requests, requestCount, approversCount }) {
  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };

  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <div>
      <h3>Requests</h3>
      <Link href={`/campaigns/${encodeURIComponent(address)}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </div>
  );
}

export default RequestIndex;
