import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Link from "next/link";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns,
    }, // will be passed to the page component as props
  };
}

function CampaignIndex({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${encodeURIComponent(address)}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </a>
      </Link>
      {renderCampaigns()}
    </div>
  );
}

export default CampaignIndex;
